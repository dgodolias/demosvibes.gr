export type SearchScope = 'videos' | 'tools' | 'about';

export interface SearchDocument {
  id: string;
  title: string;
  description: string;
  href: string;
  scope: SearchScope;
  keywords: string[];
  content: string;
}

export interface SearchResult {
  document: SearchDocument;
  score: number;
}

/** Keep Greek accents and final sigma from changing the meaning of a search. */
export function normalizeSearch(value: string): string {
  return value.toLocaleLowerCase('el-GR').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/ς/g, 'σ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}

const GREEK_LETTERS: Record<string, string> = {
  α: 'a', β: 'v', γ: 'g', δ: 'd', ε: 'e', ζ: 'z', η: 'i', θ: 'th',
  ι: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'ks', ο: 'o', π: 'p',
  ρ: 'r', σ: 's', τ: 't', υ: 'i', φ: 'f', χ: 'ch', ψ: 'ps', ω: 'o',
};

/** A common phonetic form lets Greek and everyday Greeklish meet. */
function phonetic(value: string): string {
  return normalizeSearch(value).split(' ').map((word) => word === 'ai' ? word : word
    .replace(/ου/g, 'ou').replace(/αι/g, 'e').replace(/ει|οι|υι/g, 'i')
    .replace(/[α-ω]/g, (letter) => GREEK_LETTERS[letter] ?? letter)
    .replace(/w/g, 'o').replace(/y/g, 'i').replace(/x/g, 'ks')
    .replace(/ai/g, 'e').replace(/ei|oi|yi/g, 'i')).join(' ');
}

const STOP_WORDS = new Set(phonetic(
  'ο η το οι τα τον την τη τους τις του της των ενα μια ένα ένανε ένας μία στο στη στην στον στα με και ή για από απο σε να θα ' +
  'μου σου μας σας εγώ εσύ εμείς εσείς είναι ειμαι έχει έχω θέλω θελω θέλεις μπορώ μπορω μπορείς πως πώς που πού τι ποιο ποια ποιες ' +
  'βρες βρω δείξε δειξε δείξετε ψάχνω ψαχνω κάνω κανω κάνεις φτιάξω φτιαξω φτιάξε φτιαξε ' +
  'the a an to for of and or i want how can my me find show make create',
).split(' '));

const SYNONYMS = [
  ['βιογραφικό', 'βιογραφικο', 'cv', 'resume', 'résumé'],
  ['δωρεάν', 'δωρεαν', 'free', 'δωρεαν μαθήματα'],
  ['πιστοποιητικό', 'πιστοποίηση', 'certificate', 'certification'],
  ['μάθημα', 'μαθήματα', 'μάθω', 'εκπαίδευση', 'course', 'learn', 'learning'],
  ['απόρρητο', 'απορρήτου', 'ιδιωτικότητα', 'προσωπικά', 'privacy'],
  ['διαφήμιση', 'διαφημίσεις', 'διαφημίσεων', 'ads', 'adblock', 'blocking'],
  ['επέκταση', 'extension', 'πρόσθετο', 'plugin'],
  ['βίντεο', 'video', 'videos'],
  ['εργαλείο', 'εργαλεία', 'tool', 'tools'],
  ['μουσική', 'τραγούδι', 'τραγούδια', 'τραγουδιών', 'music', 'song'],
  ['σπίτι', 'σπιτιού', 'ακίνητο', 'ακινήτων', 'δωμάτιο', 'επίπλωση', 'staging'],
  ['μενού', 'μετάφραση', 'μεταφραση', 'εστιατόριο', 'menu', 'translate'],
  ['γνωριμία', 'επικοινωνία', 'δημοσθένης', 'δημοσθένη', 'δήμος', 'portfolio', 'contact'],
  ['χρώμα', 'χρώματα', 'χρωμάτων', 'color', 'colour', 'colors'],
  ['λογότυπο', 'logo'],
  ['prompt', 'prompts', 'προμπτ', 'εντολή'],
].map((group) => [...new Set(group.map(phonetic))]);

const EXPANSIONS = new Map<string, string[]>();
for (const group of SYNONYMS) {
  for (const word of group) EXPANSIONS.set(word, group.filter((entry) => entry !== word));
}

interface SearchField {
  text: string;
  words: string[];
  weight: number;
}

const preparedDocuments = new WeakMap<SearchDocument, SearchField[]>();

function prepareDocument(document: SearchDocument): SearchField[] {
  const cached = preparedDocuments.get(document);
  if (cached) return cached;
  const fields = [
    { text: document.title, weight: 18 },
    { text: document.keywords.join(' '), weight: 13 },
    { text: document.description, weight: 8 },
    { text: document.content, weight: 3 },
  ].map(({ text, weight }) => {
    const normalized = phonetic(text);
    return { text: normalized, words: [...new Set(normalized.split(' ').filter(Boolean))], weight };
  });
  preparedDocuments.set(document, fields);
  return fields;
}

/** Bounded Damerau–Levenshtein: includes adjacent keyboard transpositions. */
function withinEditDistance(left: string, right: string, limit: number): boolean {
  if (Math.abs(left.length - right.length) > limit) return false;
  let previousPrevious: number[] = [];
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      current[column] = Math.min(
        previous[column] + 1,
        current[column - 1] + 1,
        previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1),
      );
      if (row > 1 && column > 1 && left[row - 1] === right[column - 2] && left[row - 2] === right[column - 1]) {
        current[column] = Math.min(current[column], previousPrevious[column - 2] + 1);
      }
    }
    if (Math.min(...current) > limit) return false;
    previousPrevious = previous;
    previous = current;
  }
  return previous[right.length] <= limit;
}

function wordMatch(query: string, candidate: string, allowTypo: boolean): number {
  if (query === candidate) return 1;
  if (query.length >= 3 && candidate.startsWith(query)) return 0.8;
  if (allowTypo && query.length >= 4 && withinEditDistance(query, candidate, query.length >= 8 ? 2 : 1)) return 0.58;
  return 0;
}

function tokenScore(fields: SearchField[], token: string): number {
  const alternatives = EXPANSIONS.get(token) ?? [];
  let best = 0;
  let supportingEvidence = 0;
  for (const field of fields) {
    let fieldBest = 0;
    for (const word of field.words) {
      fieldBest = Math.max(fieldBest, field.weight * wordMatch(token, word, true));
      if (fieldBest >= field.weight) break;
      for (const alternative of alternatives) {
        fieldBest = Math.max(fieldBest, field.weight * 0.7 * wordMatch(alternative, word, false));
      }
    }
    best = Math.max(best, fieldBest);
    supportingEvidence += fieldBest * 0.15;
  }
  return best + supportingEvidence;
}

/** Ranked local/global search. Empty input preserves the source order. */
export function searchDocuments(documents: SearchDocument[], query: string, scope?: SearchScope): SearchResult[] {
  const candidates = scope ? documents.filter((document) => document.scope === scope) : documents;
  const normalized = phonetic(query.slice(0, 180));
  if (!normalized) return candidates.map((document) => ({ document, score: 0 }));
  const tokens = [...new Set(normalized.split(' '))].filter((token) => !STOP_WORDS.has(token)).slice(0, 12);
  if (!tokens.length) return [];

  const results: SearchResult[] = [];
  for (const document of candidates) {
    const fields = prepareDocument(document);
    const scores = tokens.map((token) => tokenScore(fields, token));
    const matchedCount = scores.filter((score) => score > 0).length;
    // Partial natural-language matches work, but a lone generic word cannot flood results.
    const minimumMatches = tokens.length <= 2 ? tokens.length : Math.ceil(tokens.length * 0.6);
    if (matchedCount < minimumMatches) continue;
    const coverage = matchedCount / tokens.length;
    const phraseBonus = fields.reduce((best, field) => (
      field.text.includes(normalized) ? Math.max(best, field.weight * 3) : best
    ), 0);
    const titleBonus = tokens.length === 1 ? wordMatch(tokens[0], fields[0].text, true) * 24 : 0;
    const score = (scores.reduce((sum, value) => sum + value, 0) + phraseBonus + titleBonus) * coverage;
    results.push({ document, score });
  }
  return results.sort((left, right) => right.score - left.score);
}
