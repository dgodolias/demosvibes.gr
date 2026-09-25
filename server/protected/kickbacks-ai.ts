import type { ContentBlock } from '../../src/data/types.js';

const link = (href: string, text: string) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
const figure = (src: string, alt: string, caption: string, width: number, height: number) =>
  `<figure class="article-figure"><a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${alt}" width="${width}" height="${height}" loading="lazy"></a><figcaption>${caption} Πάτα την εικόνα για πλήρες μέγεθος.</figcaption></figure>`;

/**
 * Server-only article body for /kickbacks-ai/. Never import this from src/:
 * it must reach the browser only through /api/disclaimer after acceptance.
 */
export const kickbacksAiGuide: ContentBlock[] = [
  {
    kind: 'prose',
    title: 'Υπενθύμιση πριν ξεκινήσεις',
    html: `<p><strong>Δεν έχω καμία σχέση με το Kickbacks.ai</strong> και δεν πληρώνομαι για αυτό το άρθρο. Σου δείχνω πώς το χρησιμοποιώ εγώ. Πριν εγκαταστήσεις οτιδήποτε, κάνε τη δική σου έρευνα: διάβασε τους ${link('https://kickbacks.ai/terms', 'όρους χρήσης')}, την ${link('https://kickbacks.ai/privacy', 'πολιτική απορρήτου')} τους και την ενότητα «Κίνδυνοι» πιο κάτω.</p>`,
  },
  {
    kind: 'prose',
    title: 'Τι είναι το Kickbacks.ai, με απλά λόγια',
    html: `<p>Όσο το Claude Code ή το Codex δουλεύει πάνω σε αυτό που του ζήτησες, στο panel του εμφανίζεται μια λέξη που αναβοσβήνει, π.χ. «Thinking…». Το Kickbacks.ai βάζει στη θέση της μια <strong>διαφήμιση μίας γραμμής</strong>. Οι διαφημιστές πληρώνουν το Kickbacks.ai και εκείνο σου πιστώνει περίπου το <strong>50% των καθαρών εσόδων</strong> από τις διαφημίσεις που εμφανίστηκαν στη δική σου οθόνη.</p>
<ul>
<li><strong>Δεν πατάς τίποτα.</strong> Δουλεύεις κανονικά. Μια διαφήμιση μετράει όταν μένει ορατή περίπου 10 δευτερόλεπτα συνεχόμενα.</li>
<li><strong>Πληρώνεσαι μέσω Stripe</strong> στον τραπεζικό σου λογαριασμό, όταν το υπόλοιπο ξεπεράσει τα 10 δολάρια.</li>
<li><strong>Δεν είναι μισθός.</strong> Είναι μικρά ποσά που καλύπτουν ένα κομμάτι της συνδρομής σου στο AI. Μην πληρώσεις συνδρομή μόνο για αυτό.</li>
</ul>`,
  },
  {
    kind: 'prose',
    title: 'Τι θα χρειαστείς',
    html: `<ul>
<li><strong>Υπολογιστή με Windows, Mac ή Linux.</strong> Σε κινητό δεν γίνεται.</li>
<li><strong>Συνδρομή Claude Pro ή Max</strong> για το Claude Code, <strong>ή λογαριασμό ChatGPT με πλάνο που περιλαμβάνει το Codex</strong>. Το Kickbacks.ai δεν σου δίνει AI: «πατάει» πάνω σε αυτό που ήδη χρησιμοποιείς.</li>
<li><strong>Λογαριασμό Google</strong>, για να συνδεθείς στο Kickbacks.ai.</li>
<li><strong>Να είσαι τουλάχιστον 18 ετών.</strong> Το απαιτούν οι όροι του.</li>
<li>Για την πληρωμή: τον <strong>IBAN</strong> σου, τα φορολογικά σου στοιχεία και πιθανόν <strong>ταυτότητα ή διαβατήριο</strong>, που θα σου ζητήσει το Stripe.</li>
<li>Περίπου <strong>30 λεπτά</strong> για όλη τη διαδικασία.</li>
</ul>`,
  },
  {
    kind: 'steps',
    title: 'Βήμα 1: Κατέβασε και εγκατέστησε το VS Code',
    items: [
      `Πήγαινε στο ${link('https://code.visualstudio.com/download', 'code.visualstudio.com/download')} και πάτησε το κουμπί για το σύστημά σου: <strong>Windows</strong> (User Installer, 64 bit), <strong>Mac</strong> (Apple Silicon για νέα Mac, Intel για παλιότερα) ή <strong>Linux</strong> (.deb ή .rpm).`,
      'Windows: άνοιξε από τα <strong>Downloads</strong> το αρχείο που κατέβηκε, πάτησε <strong>I accept the agreement</strong> και μετά <strong>Next</strong>. Στην οθόνη «Select Additional Tasks» τσέκαρε <strong>Add to PATH</strong> και <strong>Add "Open with Code" action</strong>. Πάτησε <strong>Install</strong> και στο τέλος <strong>Finish</strong>.',
      'Mac: άνοιξε το .zip, σύρε το <strong>Visual Studio Code</strong> στον φάκελο <strong>Applications</strong> και άνοιξέ το από εκεί. Αν σε ρωτήσει αν είσαι σίγουρος, πάτησε <strong>Open</strong>.',
      'Άνοιξε το VS Code. Στην αριστερή στήλη υπάρχουν εικονίδια. Αυτό με τα <strong>τέσσερα τετραγωνάκια</strong> είναι τα <strong>Extensions</strong> (ή <code>Ctrl+Shift+X</code>, σε Mac <code>Cmd+Shift+X</code>). Από εκεί θα εγκαταστήσεις όλα τα υπόλοιπα.',
    ],
  },
  {
    kind: 'steps',
    title: 'Βήμα 2: Εγκατέστησε το Claude Code (ή το Codex) και συνδέσου',
    items: [
      'Άνοιξε τα <strong>Extensions</strong> (<code>Ctrl+Shift+X</code>).',
      `Για <strong>Claude</strong>: γράψε <strong>Claude Code</strong> στην αναζήτηση και εγκατέστησε το ${link('https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code', 'Claude Code for VS Code')} από την <strong>Anthropic</strong> (με το μπλε σήμα επαληθευμένου εκδότη). Πάτησε το πορτοκαλί εικονίδιο του Claude, πάνω δεξιά στον editor ή στην αριστερή στήλη, και συνδέσου. Θα ανοίξει ο browser: μπες με τον λογαριασμό σου στο Claude, πάτησε <strong>Authorize</strong> και γύρνα στο VS Code.`,
      `Για <strong>ChatGPT</strong>: γράψε <strong>Codex</strong> και εγκατέστησε το ${link('https://marketplace.visualstudio.com/items?itemName=openai.chatgpt', 'Codex – OpenAI’s coding agent')} από την <strong>OpenAI</strong>. Πάτησε το εικονίδιό του και <strong>Sign in with ChatGPT</strong>.`,
      'Κάνε μια δοκιμή: <strong>File → Open Folder</strong>, διάλεξε έναν φάκελο (ή φτιάξε έναν κενό, π.χ. <code>dokimi</code>) και πάτησε <strong>Yes, I trust the authors</strong> αν σε ρωτήσει. Γράψε στο chat κάτι απλό, όπως «Φτιάξε ένα αρχείο hello.txt που λέει γεια». Όσο δουλεύει, θα δεις μια λέξη που αναβοσβήνει, π.χ. «Thinking…». <strong>Εκεί ακριβώς θα εμφανίζονται οι διαφημίσεις.</strong>',
      '<strong>Σημαντικό:</strong> εγκατέστησε και συνδέσου στο Claude Code ή στο Codex <strong>πριν</strong> από το Kickbacks.ai. Το Kickbacks.ai πρέπει να βρει το extension τους για να δουλέψει.',
    ],
  },
  {
    kind: 'prose',
    title: 'Πριν από το Βήμα 3: γιατί δεν πατάς απλώς Install στην αναζήτηση',
    html: `<p>Αν γράψεις «kickbacks» στην αναζήτηση των Extensions <strong>πριν</strong> το κατεβάσεις, το Kickbacks.ai <strong>δεν θα βγει</strong>: σήμερα δεν διανέμεται μέσα από το Marketplace του VS Code. Θα δεις όμως άλλα extensions με παρόμοιο όνομα και την ίδια υπόσχεση, όπως το <strong>«Kickbacks.dev»</strong> και το <strong>«AIBC Ads»</strong>, με μπλε κουμπί <strong>Install</strong>. Είναι <strong>ξεχωριστές υπηρεσίες</strong> με δικό τους λογαριασμό και δικές τους πληρωμές, και αυτός ο οδηγός δεν τις καλύπτει.</p>
<p>Γι' αυτό η σειρά είναι: <strong>πρώτα κατεβάζεις</strong> το αρχείο από την επίσημη σελίδα ${link('https://kickbacks.ai/install', 'kickbacks.ai/install')}, το εγκαθιστάς από το Extensions, και <strong>μετά το ψάχνεις στο Marketplace</strong>. Τότε το Kickbacks.ai εμφανίζεται πρώτο στα αποτελέσματα, όπως στο video.</p>`,
  },
  {
    kind: 'steps',
    title: 'Βήμα 3: Κατέβασε το Kickbacks.ai και εγκατέστησέ το από το Extensions',
    items: [
      `Άνοιξε στον browser το ${link('https://kickbacks.ai/install', 'kickbacks.ai/install')}. Κατέβα στο <strong>Other installation methods</strong> → <strong>Install without Node.js</strong> και πάτησε <strong>Download the signed VSIX</strong>. Θα κατέβει στα <strong>Downloads</strong> ένα αρχείο με όνομα σαν <code>kickbacks-v2.vsix</code>. Αυτό είναι το extension σε ένα αρχείο.`,
      'Στο VS Code άνοιξε τα <strong>Extensions</strong> (<code>Ctrl+Shift+X</code>). Πάνω στη στήλη, δίπλα στον τίτλο <strong>EXTENSIONS: MARKETPLACE</strong>, πάτησε τις τρεις τελείες <strong>⋯</strong> (Views and More Actions).',
      'Διάλεξε <strong>Install from VSIX…</strong>, πήγαινε στα <strong>Downloads</strong>, επίλεξε το <code>kickbacks-v2.vsix</code> και πάτησε <strong>Install</strong>. Αν το VS Code σε προειδοποιήσει ότι το extension δεν έρχεται από το Marketplace ή ότι δεν μπορεί να ελέγξει την υπογραφή του, αυτό ακριβώς συμβαίνει: εγκαθιστάς αρχείο εκτός Marketplace. Συνέχισε μόνο αν έχεις κάνει την έρευνά σου.',
      '<strong>Τώρα ψάξ’ το στο Marketplace:</strong> στο πεδίο αναζήτησης των Extensions γράψε <code>kickbacks</code>. Πρώτο θα βγει το <strong>Kickbacks.ai</strong> με εκδότη <strong>Kickbacksai</strong> και πράσινο εικονίδιο <strong>K$</strong>. Στη θέση του Install θα έχει τα κουμπιά <strong>Disable</strong> και <strong>Uninstall</strong>, επειδή είναι ήδη εγκατεστημένο. Αν το πατήσεις, στα δεξιά στο <strong>Installation</strong> θα γράφει <strong>Source: VSIX</strong>. Τα αποτελέσματα από κάτω με το μπλε Install (π.χ. Kickbacks.dev, AIBC Ads) <strong>δεν</strong> είναι αυτό· μην τα πατήσεις.',
      'Θα ανοίξει μια καρτέλα <strong>Welcome to Kickbacks</strong>. Διάβασε τι λέει, τσέκαρε το κουτάκι ότι είσαι 18 ετών και αποδέχεσαι τους <strong>Terms &amp; Conditions</strong> και την <strong>Privacy Policy</strong>, και πάτησε <strong>Agree &amp; Reload</strong>. Αν η καρτέλα δεν ανοίξει, κάνε επανεκκίνηση: <code>Ctrl+Shift+P</code>, γράψε <strong>Reload Window</strong> και πάτησε Enter.',
      'Εναλλακτικά, αν έχεις ήδη <strong>Node.js 18 ή νεότερο</strong>: <strong>Terminal → New Terminal</strong> και γράψε <code>npx -y @kickbacksai/install</code>. Κατεβάζει και ελέγχει το ίδιο αρχείο και το εγκαθιστά σε όλους τους editors που βρίσκει (VS Code, Cursor). Μετά κάνε <strong>Reload Window</strong>.',
    ],
  },
  {
    kind: 'steps',
    title: 'Βήμα 4: Συνδέσου (Sign in)',
    items: [
      'Κάτω κάτω στο παράθυρο του VS Code, στη γραμμή κατάστασης, θα δεις με κόκκινο <strong>Kickbacks.ai: Sign in</strong> ή <strong>Kickbacks.ai: Preview - sign in to earn</strong>. Πάτησέ το. Εναλλακτικά: <code>Ctrl+Shift+P</code> (Mac: <code>Cmd+Shift+P</code>), γράψε <strong>kickbacks</strong> και διάλεξε <strong>Kickbacks.ai: Sign in</strong>.',
      'Θα ανοίξει ο browser με τη σελίδα σύνδεσης. Πάτησε <strong>Continue with Google</strong> και διάλεξε τον λογαριασμό σου. Από το extension η σύνδεση γίνεται με Google.',
      'Όταν δεις <strong>You’re in!</strong> και <strong>Signed in · you can close this tab</strong>, η σύνδεση πέτυχε. Κλείσε την καρτέλα και γύρνα στο VS Code.',
      'Αν η γραμμή κατάστασης γράφει <strong>Signed in — RELOAD to start earning money</strong>, πάτησέ το (ή κάνε <strong>Reload Window</strong>). Μέχρι να γίνει reload το παράθυρο δεν κερδίζει.',
      'Αν στα Windows δεν άνοιξε ο browser: κάτω δεξιά εμφανίζεται ειδοποίηση του Kickbacks.ai με σύνδεσμο. Αντέγραψέ τον και άνοιξέ τον μόνος σου στον browser.',
    ],
  },
  {
    kind: 'html',
    html: figure('/guide/kickbacks-ai/signed-in.jpg', 'Η σελίδα «You’re in!» του Kickbacks.ai με την ένδειξη Signed in · you can close this tab', 'Αυτό βλέπεις όταν η σύνδεση πετύχει. Μπορείς να κλείσεις την καρτέλα.', 788, 630),
  },
  {
    kind: 'steps',
    title: 'Βήμα 5: Διάλεξε Private Mode',
    items: [
      'Πάτησε το <strong>Kickbacks.ai</strong> στη γραμμή κατάστασης για να ανοίξει το panel του. Εκεί υπάρχουν δύο κάρτες τρόπων κέρδους (earning modes). Η επιλογή ενεργοποιείται με ένα κλικ στην κάρτα· αν δεις κουμπί <strong>Save</strong>, πάτησέ το.',
      '<strong>Private Mode:</strong> οι ερωτήσεις σου, ο κώδικας και οι απαντήσεις του AI μένουν στον υπολογιστή σου. Στέλνονται μόνο στοιχεία για τις διαφημίσεις: ποια εμφανίστηκε, πόση ώρα φάνηκε, κλικ, ψευδώνυμο αναγνωριστικό, κρυπτογραφημένο (hashed) email, περικομμένη IP, βασικά στοιχεία συσκευής και κατά προσέγγιση τοποθεσία. Είναι η προεπιλογή.',
      '<strong>Boosted Mode:</strong> υπόσχεται περισσότερα κέρδη, αλλά στέλνει στους servers τους και τις πρόσφατες ερωτήσεις σου, τις απαντήσεις του AI, ονόματα repository και τα θέματα της δουλειάς σου. Σύμφωνα με τους όρους του (ενότητα 3.3), <strong>στην Ελλάδα και σε όλη την ΕΕ/ΕΟΧ</strong>, στο Ηνωμένο Βασίλειο και στην Ελβετία είναι διαθέσιμο <strong>μόνο το Private Mode</strong>.',
      'Κράτα το <strong>Private Mode</strong>. Με <code>Ctrl+Shift+P</code> → <strong>Kickbacks.ai: Show status</strong> βλέπεις ανά πάσα στιγμή αν είσαι συνδεδεμένος και αν κερδίζεις.',
    ],
  },
  {
    kind: 'steps',
    title: 'Βήμα 6: Δούλεψε κανονικά. Έτσι μαζεύονται τα χρήματα',
    items: [
      'Χρησιμοποίησε το Claude Code ή το Codex όπως πάντα. Όταν υπάρχει διαθέσιμη διαφήμιση, στη θέση του «Thinking…» θα δεις μια σύντομη γραμμή χορηγού. Στη γραμμή κατάστασης το Kickbacks.ai δείχνει τα κέρδη της ημέρας.',
      'Μια εμφάνιση πληρώνεται όταν η διαφήμιση μένει <strong>ορατή περίπου 10 δευτερόλεπτα συνεχόμενα</strong>. Αν αλλάξεις παράθυρο ή κρύψεις το panel, το χρονόμετρο ξεκινά από την αρχή. Άφηνε λοιπόν το panel του Claude ή του Codex ορατό όσο δουλεύει.',
      'Δεν χρειάζεται να πατάς τις διαφημίσεις. <strong>Μην κάνεις κλικ για να ανεβάσεις τα κέρδη</strong> και μη βάζεις scripts ή bots να στέλνουν prompts. Οι κανόνες του το απαγορεύουν και μπορεί να χάσεις ό,τι έχεις μαζέψει.',
      'Δεν κερδίζεις όταν το VS Code είναι κλειστό, ούτε από sub-agents που δουλεύουν στο παρασκήνιο. Μετράει μόνο η δική σου, πραγματική δουλειά.',
      `Τα κέρδη τα βλέπεις στο ${link('https://kickbacks.ai/me', 'kickbacks.ai/me')} (User Login, με τον ίδιο λογαριασμό Google): σήμερα, αυτόν τον μήνα, συνολικά και τα όρια κερδών. Ο αριθμός ανεβαίνει «σκαλοπατάκια» και με καθυστέρηση λίγων λεπτών.`,
      'Υπάρχουν <strong>ωριαία και ημερήσια όρια</strong>. Όταν τα φτάσεις, οι διαφημίσεις συνεχίζουν αλλά δεν πληρώνονται μέχρι να ανανεωθεί το όριο.',
      'Αν δεν βλέπεις διαφημίσεις: <code>Ctrl+Shift+P</code> → <strong>Kickbacks.ai: Diagnose</strong>. Σου λέει αν είσαι συνδεδεμένος και αν βρέθηκε το Claude Code ή το Codex.',
    ],
  },
  {
    kind: 'steps',
    title: 'Βήμα 7: Σύνδεσε το Stripe για να πληρωθείς',
    items: [
      `Άνοιξε το ${link('https://kickbacks.ai/me', 'kickbacks.ai/me')} και συνδέσου με τον ίδιο λογαριασμό Google.`,
      'Βεβαιώσου ότι η χώρα πληρωμής (payout country) είναι η <strong>Ελλάδα</strong> και, στην κάρτα <strong>Payouts</strong>, πάτησε <strong>Set up payouts</strong>. Θα μεταφερθείς στο <strong>Stripe</strong> για να φτιάξεις λογαριασμό <strong>Stripe Express</strong>. Το Stripe είναι η εταιρεία που στέλνει τα χρήματα στην τράπεζά σου.',
      '<strong>Στο πρώτο βήμα του Stripe διάλεξε σωστή χώρα.</strong> Η χώρα δεν αλλάζει αργότερα. Αν σου ζητά <strong>routing number</strong> αντί για <strong>IBAN</strong>, διάλεξες λάθος χώρα: γύρνα στο dashboard, πάτησε <strong>Reset</strong> στην κάρτα πληρωμών και ξεκίνα από την αρχή.',
      'Συμπλήρωσε email και κινητό (θα έρθει κωδικός με SMS), ονοματεπώνυμο, ημερομηνία γέννησης, διεύθυνση και τον <strong>IBAN</strong> σου. Μπορεί να σου ζητηθεί και φωτογραφία ταυτότητας ή διαβατηρίου.',
      'Στα φορολογικά, επειδή δεν είσαι φορολογικός κάτοικος ΗΠΑ, θα συμπληρώσεις μέσα από το Stripe τη φόρμα <strong>W-8BEN</strong>.',
      'Η πληρωμή γίνεται όταν το υπόλοιπο ξεπεράσει τα <strong>10 δολάρια</strong>, σε δόσεις <strong>περίπου κάθε δύο εβδομάδες</strong>, αφού περάσει έλεγχο για απάτη. Τα χρήματα φτάνουν στην τράπεζά σου. Στο Stripe θα βλέπεις την ένδειξη <strong>On the way to your bank</strong>.',
      'Τα έσοδα αυτά είναι δική σου φορολογική υποχρέωση. Ρώτα έναν λογιστή πώς δηλώνονται.',
    ],
  },
  {
    kind: 'html',
    html: figure('/guide/kickbacks-ai/stripe-earnings.jpg', 'Το dashboard του Stripe Express με τα έσοδα από το Kickbacks.ai: 36,93 € τον τελευταίο χρόνο και πληρωμή 10,97 € καθ’ οδόν προς την τράπεζα', 'Το δικό μου Stripe Express, 22 Σεπτεμβρίου 2026: έσοδα ανά μήνα και μια πληρωμή που είναι καθ’ οδόν προς την τράπεζα.', 1901, 646),
  },
  {
    kind: 'prose',
    title: 'Πόσα βγάζεις στην πράξη',
    html: `<p>Το Kickbacks.ai δεν δημοσιεύει σταθερή τιμή. Το ποσό εξαρτάται από το πόσο πληρώνουν οι διαφημιστές, πόση ώρα δουλεύει πραγματικά το AI σου και τα όρια του λογαριασμού σου.</p>
<p>Για μέτρο σύγκρισης: στο δικό μου Stripe (στιγμιότυπο παραπάνω), τα έσοδα από τον Ιούνιο μέχρι τον Σεπτέμβριο του 2026 είναι συνολικά <strong>36,93 €</strong>. Δεν είναι αντιπροσωπευτικά για κανέναν άλλον. Είναι χαρτζιλίκι που καλύπτει ένα μέρος της συνδρομής, όχι εισόδημα.</p>`,
  },
  {
    kind: 'prose',
    title: 'Κίνδυνοι: διάβασέ τους πριν το εγκαταστήσεις',
    html: `<ul>
<li><strong>Αλλάζει τα αρχεία άλλων extensions.</strong> Για να δείξει τη διαφήμιση, το Kickbacks.ai κάνει «patch» στο Claude Code και στο Codex. Το γράφει το ίδιο στους όρους του (ενότητα 11.1). Μια ενημέρωση του Claude Code μπορεί να το σταματήσει προσωρινά.</li>
<li><strong>Υπάρχουν αρνητικές κριτικές ασφάλειας και απορρήτου.</strong> Η ${link('https://go-to-agency.com/en/blog/kickbacks-ai-ads-claude-code-spinner', 'Go To Agency')} (Ιούνιος 2026) διάβασε τον κώδικα και περιέγραψε ότι χαλάρωνε ρυθμίσεις ασφαλείας του Claude Code και ότι ενημερωνόταν μόνο του χωρίς έλεγχο υπογραφής. Το ${link('https://adguard.com/en/blog/ai-coding-ads-kickbacks-vscode.html', 'AdGuard')} (Ιούλιος 2026) εστιάζει στα δεδομένα που συλλέγονται. Δεν ξέρω αν όλα ισχύουν για την τρέχουσα έκδοση. Διάβασέ τα και κρίνε μόνος σου.</li>
<li><strong>Οι όροι του Claude και του ChatGPT είναι δική σου ευθύνη.</strong> Το Kickbacks.ai γράφει ότι εσύ φροντίζεις να μην παραβιάζεις τους όρους της Anthropic, της OpenAI ή της Microsoft (ενότητα 11.2), και δηλώνει ότι δεν έχει σχέση με την Anthropic ή την OpenAI.</li>
<li><strong>Όχι σε υπολογιστή δουλειάς</strong> χωρίς γραπτή άδεια του εργοδότη σου.</li>
<li><strong>Οι πληρωμές δεν είναι εγγυημένες.</strong> Το υπόλοιπο είναι εκτίμηση μέχρι να ελεγχθεί. Μπορούν να αλλάξουν ποσοστό και όρια, να κρατήσουν ή να αναστρέψουν πληρωμές, και η ευθύνη τους απέναντί σου περιορίζεται στα 100 δολάρια (ενότητα 15.2).</li>
<li><strong>Ένας λογαριασμός ανά άτομο.</strong> Πολλοί λογαριασμοί, bots, κλικ για κέρδος ή μοίρασμα συσκευών οδηγούν σε μπλοκάρισμα και απώλεια κερδών.</li>
<li><strong>Δεδομένα:</strong> ακόμα και στο Private Mode στέλνονται στοιχεία όπως περικομμένη IP και κατά προσέγγιση τοποθεσία. Δες την ${link('https://kickbacks.ai/privacy', 'πολιτική απορρήτου')} τους.</li>
</ul>`,
  },
  {
    kind: 'steps',
    title: 'Πώς το σταματάς ή το αφαιρείς',
    items: [
      '<strong>Παύση:</strong> πάτησε το Kickbacks.ai στη γραμμή κατάστασης και διάλεξε <strong>Disable Kickbacks.ai</strong>. Το spinner γυρνά στο κανονικό και η γραμμή γράφει <strong>Kickbacks.ai: Off</strong>. Με ένα κλικ το ξανανοίγεις.',
      '<strong>Πλήρης επαναφορά:</strong> <code>Ctrl+Shift+P</code> → <strong>Kickbacks.ai: Restore Claude Code</strong>. Αναιρεί τις αλλαγές που έκανε στο Claude Code.',
      '<strong>Απεγκατάσταση:</strong> Extensions → Kickbacks.ai → <strong>Uninstall</strong>. Το Kickbacks.ai λέει ότι στην απεγκατάσταση αναιρεί μόνο του τις αλλαγές. Για σιγουριά, κάνε πρώτα το Restore Claude Code.',
      `<strong>Διαγραφή λογαριασμού και δεδομένων:</strong> φόρμα στο ${link('https://kickbacks.ai/privacy-choices', 'kickbacks.ai/privacy-choices')} ή email στο <code>support@kickbacks.ai</code> από το email του λογαριασμού σου.`,
    ],
  },
  {
    kind: 'prose',
    title: 'Συχνά προβλήματα',
    html: `<ul>
<li><strong>Δεν εμφανίζονται διαφημίσεις.</strong> Έλεγξε με τη σειρά: είναι εγκατεστημένο το Claude Code ή το Codex; Είσαι συνδεδεμένος (Kickbacks.ai: Show status); Δουλεύει πραγματικά το AI; Αν απαντήσει αμέσως, δεν υπάρχει spinner. Μήπως η γραμμή κατάστασης γράφει <strong>Kickbacks.ai: Off</strong>; Κάνε Reload Window και τρέξε Kickbacks.ai: Diagnose.</li>
<li><strong>Γράφει «incompatible (unknown)».</strong> Συνήθως λείπει το Claude Code ή ενημερώθηκε πρόσφατα. Κατέβασε ξανά το τελευταίο αρχείο από το kickbacks.ai/install, εγκατέστησέ το, κλείσε και άνοιξε το VS Code και τρέξε Diagnose.</li>
<li><strong>Τα κέρδη δεν ανεβαίνουν.</strong> Το dashboard καθυστερεί λίγα λεπτά και τα κέρδη πιστώνονται ανά 10 δευτερόλεπτα ορατής διαφήμισης. Κάνε ανανέωση στη σελίδα.</li>
<li><strong>Με αποσυνδέει συνέχεια.</strong> Τρέξε ξανά Kickbacks.ai: Sign in.</li>
<li><strong>Το Stripe ζητά αμερικανικό λογαριασμό (routing number).</strong> Διάλεξες λάθος χώρα. Πάτησε Reset στην κάρτα πληρωμών και ξεκίνα ξανά με Ελλάδα.</li>
<li><strong>Έχω δύο παράθυρα VS Code.</strong> Υποστηρίζεται, αλλά το Kickbacks.ai προτείνει ένα ενεργό παράθυρο, για να μη χάνονται εμφανίσεις.</li>
</ul>`,
  },
  {
    kind: 'prose',
    title: 'Επίσημες πηγές και κριτικές',
    html: `<p>Έλεγχος: <strong>25 Σεπτεμβρίου 2026</strong>, με την έκδοση 3.1.5 του extension. Ό,τι αφορά αμοιβές, όρια, δεδομένα και πληρωμές προέρχεται από τις επίσημες σελίδες του Kickbacks.ai (Όροι Χρήσης, έκδοση 1.4 της 24ης Ιουλίου 2026).</p>
<ul>
<li>${link('https://kickbacks.ai/install', 'Kickbacks.ai: εγκατάσταση (VSIX και npx)')}</li>
<li>${link('https://kickbacks.ai/faq', 'Kickbacks.ai: FAQ και κανόνες')}</li>
<li>${link('https://kickbacks.ai/terms', 'Kickbacks.ai: Όροι Χρήσης')}</li>
<li>${link('https://kickbacks.ai/privacy', 'Kickbacks.ai: Πολιτική Απορρήτου')}</li>
<li>${link('https://code.visualstudio.com/download', 'VS Code: λήψη')}</li>
<li>${link('https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code', 'Claude Code for VS Code (Anthropic)')}</li>
<li>${link('https://marketplace.visualstudio.com/items?itemName=openai.chatgpt', 'Codex extension για VS Code (OpenAI)')}</li>
<li>${link('https://adguard.com/en/blog/ai-coding-ads-kickbacks-vscode.html', 'AdGuard: το κόστος απορρήτου του Kickbacks.ai')}</li>
<li>${link('https://go-to-agency.com/en/blog/kickbacks-ai-ads-claude-code-spinner', 'Go To Agency: ανάλυση του κώδικα του extension')}</li>
</ul>`,
  },
];
