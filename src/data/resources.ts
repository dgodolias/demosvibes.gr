import type { Resource } from './types';

/**
 * SINGLE SOURCE OF TRUTH for every page on the site.
 *
 * To add a new video page: append one Resource object below. The route, the
 * landing-grid card, the search index, the sitemap, and the JSON-LD all derive
 * from this array — no HTML boilerplate, no manual route wiring.
 *
 * `card` is present for pages shown in the landing grid (top-level). Nested
 * children (estate-ai-furnishing/*) omit `card`.
 */

const FOUNDERS_SOURCE = 'https://www.claude.com/blog/the-founders-playbook';
const officialThumb = {
  type: 'solo' as const,
  src: '/thumbs/founders-playbook_official_thumb.jpg',
  alt: 'Επίσημο cover του Claude Founders Playbook',
  official: true,
};

export const resources: Resource[] = [
  {
    slug: 'false-sense-security',
    pageKind: 'prompt',
    date: '2026-07-15',
    card: {
      title: 'Κάνε το ChatGPT να σου λέει την αλήθεια',
      desc: 'Οι κουβέντες με το ChatGPT δίνουν ψεύτικη αίσθηση προόδου, και τις περισσότερες φορές συμφωνεί μαζί σου. Μια οδηγία στη μνήμη του κόβει την κολακεία και κλείνει κάθε απάντηση με ένα βήμα για σήμερα.',
      metaLine: '15 Ιουλ 2026 · Prompt',
      cardTags: ['ChatGPT', 'Ειλικρίνεια', 'Prompt'],
      searchTags: [
        'chatgpt',
        'prompt',
        'ai',
        'κολακεια',
        'ειλικρινεια',
        'sycophancy',
        'glaze',
        'memory',
        'custom instructions',
        'μνημη',
        'false sense of security',
        'ψευτικη αισθηση',
        'παραγωγικοτητα',
        'συνηθειες',
        'selfimprovement',
      ],
      filters: ['prompt', 'guide'],
      status: 'active',
      thumb: {
        type: 'solo',
        src: '/thumbs/false-sense-security_thumb.jpg',
        alt: 'Στιγμιότυπο από το βίντεο: ο δημιουργός δίπλα στο viral Reddit post «διέγραψε το ChatGPT»',
      },
    },
    seoTitle: 'Κάνε το ChatGPT να σου λέει την αλήθεια (anti-glaze οδηγία)',
    seoDescription:
      'Οι κουβέντες με το ChatGPT μπορεί να δίνουν ψεύτικη αίσθηση προόδου και το ChatGPT τείνει να συμφωνεί μαζί σου. Βάλε αυτή την οδηγία στη μνήμη του για να σου λέει την αλήθεια και να κλείνει κάθε απάντηση με ένα βήμα για σήμερα.',
    crumb: { label: 'videos', to: '/' },
    heading: 'Κάνε το ChatGPT να σου λέει την αλήθεια',
    introHtml:
      'Ρωτάς κάθε μέρα το ChatGPT και νιώθεις ότι προχωράς, αλλά συχνά απλώς μιλάς για το πρόβλημα χωρίς να το λύνεις. Και επειδή τις περισσότερες φορές θα συμφωνήσει μαζί σου, η αίσθηση προόδου μεγαλώνει χωρίς λόγο. Δεν χρειάζεται να το διαγράψεις. Βάλε μία μόνιμη οδηγία στη μνήμη του ώστε να σταματήσει τα χάδια, να σου λέει την αλήθεια, και να κλείνει κάθε απάντηση με ένα συγκεκριμένο βήμα για σήμερα.',
    citation: 'https://chatgpt.com',
    blocks: [
      {
        kind: 'prompt',
        label: 'anti-glaze.txt',
        text: `Μη μου λες αυτό που θέλω να ακούσω. Να είσαι τελείως ειλικρινής μαζί μου. Αν κάτι στο σχέδιο ή στη σκέψη μου έχει πρόβλημα, ξεκίνα από αυτό, χωρίς κολακείες. Κάθε φορά που σου ζητάω συμβουλή, κλείσε την απάντηση με ένα συγκεκριμένο βήμα που μπορώ να κάνω σήμερα. Αν σου ξαναζητήσω συμβουλή χωρίς να έχω κάνει το προηγούμενο βήμα, ρώτα με πρώτα τι έγινε με εκείνο.`,
      },
      {
        kind: 'steps',
        title: 'Πού το βάζεις (βήμα-βήμα)',
        items: [
          'Στο ChatGPT κάνε κλικ στο όνομά σου κάτω αριστερά και άνοιξε το Settings.',
          'Από το μενού αριστερά διάλεξε το Εξατομίκευση (Personalization).',
          'Κατέβα κάτω στις «Προσαρμοσμένες οδηγίες» (Custom Instructions) και κάνε paste την οδηγία από πάνω.',
          'Αποθήκευσε. Τώρα ισχύει σε κάθε νέα συνομιλία, χωρίς να την ξαναγράφεις.',
        ],
      },
      {
        kind: 'html',
        html:
          '<div style="display:flex;flex-direction:column;gap:22px;align-items:center;margin-top:2px">' +
          '<figure style="margin:0;text-align:center;max-width:230px"><img src="/guide/false-sense-security/cgpt1_open_settings.png" alt="Άνοιξε το Settings από το προφίλ σου" loading="lazy" style="width:100%;border-radius:12px;border:1px solid rgba(255,255,255,0.12);display:block"><figcaption style="font-size:0.86rem;opacity:0.72;margin-top:8px">1. Κλικ στο προφίλ σου (κάτω αριστερά) και άνοιξε το Settings</figcaption></figure>' +
          '<figure style="margin:0;text-align:center;max-width:540px;width:100%"><img src="/guide/false-sense-security/cgpt2_personalization.png" alt="Διάλεξε το Εξατομίκευση" loading="lazy" style="width:100%;border-radius:12px;border:1px solid rgba(255,255,255,0.12);display:block"><figcaption style="font-size:0.86rem;opacity:0.72;margin-top:8px">2. Διάλεξε το Εξατομίκευση</figcaption></figure>' +
          '<figure style="margin:0;text-align:center;max-width:540px;width:100%"><img src="/guide/false-sense-security/cgpt3_custom_instructions.png" alt="Κάνε paste στις Προσαρμοσμένες οδηγίες" loading="lazy" style="width:100%;border-radius:12px;border:1px solid rgba(255,255,255,0.12);display:block"><figcaption style="font-size:0.86rem;opacity:0.72;margin-top:8px">3. Κάνε paste στις «Προσαρμοσμένες οδηγίες»</figcaption></figure>' +
          '</div>',
      },
      {
        kind: 'prose',
        title: 'Γιατί δουλεύει',
        html: '<p>Όταν συζητάς ένα πρόβλημα, ο εγκέφαλος νιώθει σαν να έκανες κάτι, ακόμα κι αν απλώς μίλησες γι\' αυτό. Αυτό είναι το false sense of security. Και τα περισσότερα AI το ενισχύουν, γιατί τείνουν να συμφωνούν μαζί σου. Η οδηγία κόβει την κολακεία και σε γυρνάει σε πράξη, με ένα βήμα κάθε φορά.</p>',
      },
      {
        kind: 'prose',
        title: 'Πηγή',
        html: '<p>Αφορμή ήταν ένα post στο r/selfimprovement (4.1k upvotes) όπου κάποιος διέγραψε το ChatGPT γιατί του έδινε ψεύτικη αίσθηση προόδου. Η οδηγία δουλεύει σε ChatGPT, Gemini και Claude.</p>',
      },
    ],
  },
  {
    slug: 'pic-a-pet-name',
    pageKind: 'guide',
    date: '2026-07-13',
    card: {
      title: 'Βγάλε όνομα στο ζώο σου από μια φώτο',
      desc: 'Ανεβάζεις τη φώτο του κατοικιδίου στο PicAPetName και σου προτείνει όνομα με βάση το πώς δείχνει, με λόγο από πίσω. Σου φτιάχνει και πιστοποιητικό, δωρεάν.',
      metaLine: '13 Ιουλ 2026 · Εργαλείο',
      cardTags: ['PicAPetName', 'Κατοικίδια', 'Δωρεάν'],
      searchTags: [
        'picapetname',
        'pet',
        'κατοικιδιο',
        'γατα',
        'σκυλος',
        'ονομα',
        'name',
        'αδεσποτα',
        'ai',
        'δωρεαν',
        'free',
        'avatar',
        'πιστοποιητικο',
      ],
      filters: ['tool', 'guide'],
      status: 'inactive',
      thumb: {
        type: 'solo',
        src: '/thumbs/pic-a-pet-name_thumb.jpg',
        alt: 'Πορτοκαλί με άσπρο γάτα σε δρόμο, η φώτο που ανέβηκε στο PicAPetName',
      },
    },
    seoTitle: 'Βγάλε όνομα στο κατοικίδιό σου από μια φώτο με το PicAPetName',
    seoDescription:
      'Ανεβάζεις τη φώτο του ζώου στο PicAPetName και σου προτείνει όνομα με βάση την εμφάνισή του, με εξήγηση. Έχει και πιστοποιητικό ονόματος, δωρεάν.',
    crumb: { label: 'videos', to: '/' },
    heading: 'Βγάλε όνομα στο ζώο σου από μια φώτο',
    introHtml:
      'Κόλλησες στο όνομα ενός ζώου; Ανεβάζεις μόνο τη φώτο του στο PicAPetName και σου βγάζει προτάσεις με βάση το πώς δείχνει, μαζί με έναν λόγο για την κάθε μία. Καλό για αδέσποτα της γειτονιάς ή για νέο κατοικίδιο. Δεν είναι κάτι σοβαρό, είναι ένα ωραίο μικρό παιχνίδι.',
    citation: 'https://picapetname.com',
    blocks: [
      {
        kind: 'steps',
        title: 'Οδηγίες',
        items: [
          'Μπες στο picapetname.com, δεν χρειάζεται λογαριασμός για να ξεκινήσεις.',
          'Ανέβασε μια καθαρή φώτο του ζώου, σκύλο, γάτα και άλλα.',
          'Πάτησε Name it και θα σου βγάλει όνομα με μια σύντομη εξήγηση.',
          'Αν δεν σου κάτσει, ξαναπάτα το δυο-τρεις φορές μέχρι να κολλήσει ένα.',
        ],
      },
      {
        kind: 'prose',
        title: 'Τι κάνει και τι να προσέχεις',
        html: '<p>Διαβάζει την εμφάνιση από τη φώτο, χρώμα και φάτσα, και προτείνει όνομα με λόγο. Έχει και δημιουργία avatar και πιστοποιητικό ονόματος. Ανεβάζεις φώτο του ζώου, όχι δικιά σου. Καμιά φορά βγάζει γενικά ονόματα, οπότε μια-δυο προσπάθειες βοηθάνε.</p>',
      },
      {
        kind: 'prose',
        title: 'Πηγή',
        html: '<p>Επίσημο site: <a href="https://picapetname.com" target="_blank" rel="noopener">picapetname.com</a>.</p>',
      },
    ],
  },

  {
    slug: 'optimized-prompts',
    pageKind: 'guide',
    date: '2026-07-12',
    card: {
      title: '18 prompts που αλλάζουν το ChatGPT',
      desc: 'Η ίδια ερώτηση, λίγο πιο συγκεκριμένη, βγάζει τελείως άλλη απάντηση. 18 μικρές αλλαγές στη διατύπωση για να παίρνεις κάτι που πραγματικά χρησιμοποιείς.',
      metaLine: '12 Ιουλ 2026 · Prompts',
      cardTags: ['ChatGPT', 'Prompts', 'Δωρεάν'],
      searchTags: [
        'prompt',
        'prompts',
        'chatgpt',
        'ai',
        'optimized',
        'βελτιωμένα',
        'διατύπωση',
        'productivity',
        'claude',
        'gemini',
        'περιεχόμενο',
        'δωρεάν',
        'free',
      ],
      filters: ['prompt', 'guide'],
      status: 'active',
      thumb: {
        type: 'solo',
        src: '/thumbs/optimized-prompts_thumb.jpg',
        alt: 'Λίστα με πρόχειρα prompts δίπλα στις βελτιωμένες εκδοχές τους για το ChatGPT',
      },
    },
    seoTitle: '18 optimized prompts για το ChatGPT',
    seoDescription:
      'Η ίδια ερώτηση, πιο συγκεκριμένη, αλλάζει τελείως το αποτέλεσμα. 18 μικρές αλλαγές στη διατύπωση των prompts για να βγάζει το ChatGPT κάτι που πραγματικά χρησιμοποιείς.',
    crumb: { label: 'videos', to: '/' },
    heading: '18 prompts που αλλάζουν το ChatGPT',
    introHtml:
      'Οι περισσότεροι δεν παίρνουν χάλια απαντήσεις από το AI επειδή είναι χαζό, αλλά επειδή του ζητάνε χαλαρά. Η ίδια ερώτηση, λίγο πιο συγκεκριμένη, βγάζει τελείως άλλο αποτέλεσμα. Παρακάτω είναι 18 μικρές αλλαγές στη διατύπωση: στα αριστερά αυτό που λέμε συνήθως, στα δεξιά αυτό που δουλεύει καλύτερα. Δουλεύουν σε ChatGPT, Claude και Gemini.',
    blocks: [
      {
        kind: 'html',
        html: `<style>
.opt-swaps table.ptable { min-width: 0; }
.opt-swaps table.ptable td, .opt-swaps table.ptable th { padding: 11px 12px; }
.opt-swaps table.ptable td:first-child, .opt-swaps table.ptable th:first-child { width: 42%; }
.opt-swaps table.ptable td:first-child { color: var(--muted); font-weight: 500; white-space: normal; }
.opt-swaps table.ptable td:last-child { color: var(--ink); }
.opt-swaps .bad { color: var(--accent-2); font-weight: 700; }
.opt-swaps .good { color: var(--accent); font-weight: 700; }
.opt-swaps h3 { margin: 22px 0 10px; font-family: var(--font-display); font-size: 15px; }
.opt-swaps h3:first-child { margin-top: 0; }
</style>
<div class="opt-swaps">
  <h3>Γενικά, για κάθε μέρα</h3>
  <table class="ptable">
    <thead>
      <tr><th><span class="bad">✕</span> Αντί να λες</th><th><span class="good">✓</span> Πες καλύτερα</th></tr>
    </thead>
    <tbody>
      <tr><td>Κάνε σύνοψη</td><td>Κάνε σύνοψη σε 3 bullets που μπορώ να εφαρμόσω σήμερα</td></tr>
      <tr><td>Εξήγησέ μου το Χ</td><td>Εξήγησέ μου το Χ, θεωρώντας ότι ξέρω ήδη τα βασικά</td></tr>
      <tr><td>Δώσε μου ιδέες</td><td>Δώσε μου 5 οπτικές, από την πιο προφανή στην πιο απρόσμενη</td></tr>
      <tr><td>Κάν' το καλύτερο</td><td>Βελτίωσε τη σαφήνεια και τη ροή, κράτα το ύφος μου</td></tr>
      <tr><td>Τι είναι αυτό;</td><td>Σπάσ' το μου σαν να μου το μαθαίνεις από την αρχή</td></tr>
      <tr><td>Δώσε μου tips για το Χ</td><td>Δώσε μου μόνο τα 3 που πραγματικά κάνουν τη διαφορά</td></tr>
      <tr><td>Κάν' το πιο σύντομο</td><td>Κόψε 30% χωρίς να χαθεί το βασικό νόημα</td></tr>
      <tr><td>Τι να κάνω;</td><td>Δώσε μου 3 επιλογές με το trade-off της καθεμιάς</td></tr>
      <tr><td>Διόρθωσέ το</td><td>Διόρθωσε μόνο γραμματική και ρυθμό, μην αγγίξεις τη δομή μου</td></tr>
    </tbody>
  </table>

  <h3>Για περιεχόμενο και δουλειά</h3>
  <table class="ptable">
    <thead>
      <tr><th><span class="bad">✕</span> Αντί να λες</th><th><span class="good">✓</span> Πες καλύτερα</th></tr>
    </thead>
    <tbody>
      <tr><td>Γράψε ένα post για το Χ</td><td>Γράψε ένα post για το Χ, για [κοινό], μία ιδέα μόνο</td></tr>
      <tr><td>Κάν' το πιο επαγγελματικό</td><td>Κάνε ώστε ένας βιαστικός πελάτης να το πιάνει σε 5 δευτερόλεπτα</td></tr>
      <tr><td>Θέλω ιδέες για περιεχόμενο</td><td>Δώσε μου 5 hooks που μπορώ να γυρίσω σήμερα</td></tr>
      <tr><td>Κάν' το πιο πειστικό</td><td>Κάν' το πειστικό απέναντι σε αυτή την πραγματική αντίρρηση: [Χ]</td></tr>
      <tr><td>Κάν' το να ακούγεται φυσικό</td><td>Γράψ' το όπως θα το έλεγα με το στόμα μου, χωρίς ορολογία</td></tr>
      <tr><td>Γράψε μου μια λεζάντα</td><td>Δώσε μου 3 λεζάντες και πες μου ποια θα διάλεγες</td></tr>
      <tr><td>Βελτίωσέ το</td><td>Βελτίωσέ το σε σαφήνεια, ρυθμό και στο CTA</td></tr>
      <tr><td>Κάν' το πιο σύντομο</td><td>Πες το σε 3 προτάσεις χωρίς να χαθεί το νόημα</td></tr>
      <tr><td>Διόρθωσέ το</td><td>Διόρθωσε ορθογραφία και ροή, κράτα το στυλ μου</td></tr>
    </tbody>
  </table>
</div>`,
      },
      {
        kind: 'prose',
        title: 'Το μοτίβο πίσω από όλα',
        html: '<p>Δες τι έχουν κοινό τα δεξιά: λένε <strong>για ποιον</strong> είναι, <strong>πόσο</strong> θες, <strong>τι να κρατήσει</strong> και <strong>τι να μην αγγίξει</strong>. Δεν χρειάζεται να τα μάθεις απέξω. Κάθε φορά που γράφεις ένα χαλαρό prompt, πρόσθεσε ένα από αυτά: έναν αριθμό, ένα κοινό, ή ένα όριο. Μόνο αυτό ανεβάζει κατακόρυφα την απάντηση.</p>',
      },
      {
        kind: 'prose',
        title: 'Πηγή',
        html: '<p>Οι διατυπώσεις είναι βασισμένες σε λίστα prompt-patterns που κυκλοφορεί από το <a href="https://www.instagram.com/evolving.ai" target="_blank" rel="noopener">EVOLVING AI</a>, προσαρμοσμένες στα ελληνικά. Δουλεύουν σε ChatGPT, Claude ή Gemini.</p>',
      },
    ],
  },

  {
    slug: 'suno-ai',
    pageKind: 'guide',
    date: '2026-07-03',
    card: {
      title: 'Φτιάξε τραγούδι με μία πρόταση',
      desc: 'Το Suno γράφει ολόκληρο τραγούδι, στίχους, φωνή και μουσική, από μία πρόταση. Σε οποιοδήποτε genre, ακόμη και στα ελληνικά, με δωρεάν πλάνο για να ξεκινήσεις.',
      metaLine: '3 Ιουλ 2026 · Εργαλείο',
      cardTags: ['Suno', 'AI μουσική', 'Δωρεάν'],
      searchTags: [
        'suno',
        'ai',
        'μουσική',
        'music',
        'τραγούδι',
        'song',
        'rock',
        'pop',
        'ρεμπέτικα',
        'genre',
        'δωρεάν',
        'free',
        'ελληνικά',
      ],
      filters: ['tool', 'guide'],
      status: 'active',
      thumb: {
        type: 'solo',
        src: '/thumbs/suno-ai_thumb.jpg',
        alt: 'Η αρχική σελίδα του Suno με το πεδίο "Chat to make music" και το κουμπί Create',
      },
    },
    seoTitle: 'Φτιάξε τραγούδι με μία πρόταση με το Suno AI',
    seoDescription:
      'Το Suno φτιάχνει ολόκληρο τραγούδι, στίχους, φωνή και μουσική, από μία πρόταση. Δουλεύει σε κάθε genre, βγάζει και ελληνικά, και έχει δωρεάν πλάνο για να ξεκινήσεις.',
    crumb: { label: 'videos', to: '/' },
    heading: 'Φτιάξε τραγούδι με μία πρόταση',
    introHtml:
      'Δεν χρειάζεται να ξέρεις νότα ούτε να παίζεις όργανο. Γράφεις σε μια κουβέντα τι τραγούδι θες και το Suno σου το βγάζει ολόκληρο, με στίχους, φωνή και μουσική. Δεν αντικαθιστά τους μουσικούς, αλλά είναι ένα ωραίο πείραμα για να φτιάξεις τη δική σου μουσική.',
    citation: 'https://suno.com',
    blocks: [
      {
        kind: 'steps',
        title: 'Οδηγίες',
        items: [
          'Μπες στο suno.com και φτιάξε δωρεάν λογαριασμό, δεν χρειάζεται κάρτα.',
          'Στο πεδίο "Chat to make music" γράψε τι θες, π.χ. το genre, το θέμα και τη γλώσσα των στίχων.',
          'Πάτησε Create και περίμενε λίγο να βγει το τραγούδι με στίχους, φωνή και μουσική.',
          'Αν δεν σου κάτσει με την πρώτη, άλλαξε λίγο την πρόταση και ξαναδοκίμασε δυο-τρεις φορές.',
        ],
      },
      {
        kind: 'prose',
        title: 'Τι κάνει και τι να προσέχεις',
        html: '<p>Φτιάχνει τραγούδια σε οποιοδήποτε genre, από rock και pop μέχρι ρεμπέτικα, και βγάζει στίχους ακόμη και στα ελληνικά. Τα ελληνικά καμιά φορά τα λέει με προφορά, οπότε μερικές προσπάθειες βοηθάνε. Το δωρεάν πλάνο είναι για προσωπική, μη εμπορική χρήση.</p>',
      },
      {
        kind: 'prose',
        title: 'Δωρεάν και συνδρομές',
        html: '<p>Ξεκινάς δωρεάν με ημερήσια όρια και πληρώνεις μόνο αν θες παραπάνω usage. Το δωρεάν πλάνο είναι στα 0 €, το Pro γύρω στα 7,20 € τον μήνα και το Premier στα 22 € τον μήνα. Επιβεβαίωσε τις τρέχουσες τιμές και τους όρους στο suno.com/pricing.</p>',
      },
      {
        kind: 'prose',
        title: 'Πηγή',
        html: '<p>Επίσημο site: <a href="https://suno.com" target="_blank" rel="noopener">suno.com</a>. Τιμές και όροι: <a href="https://suno.com/pricing" target="_blank" rel="noopener">suno.com/pricing</a>.</p>',
      },
    ],
  },

  {
    slug: 'ai-koskino',
    pageKind: 'toolList',
    date: '2026-06-27',
    card: {
      title: 'Δωρεάν open source AI μοντέλα',
      desc: 'Όσο η Αμερική κλειδώνει τα κορυφαία AI, η Κίνα τα βγάζει open source. DeepSeek, Qwen, Kimi και GLM, δωρεάν να τα τρέξεις σήμερα.',
      metaLine: '27 Ιουν 2026 · Οδηγός',
      cardTags: ['Open source', 'DeepSeek', 'Δωρεάν AI'],
      searchTags: [
        'open source',
        'opensource',
        'deepseek',
        'qwen',
        'kimi',
        'glm',
        'δωρεάν',
        'free',
        'ai',
        'μοντέλα',
        'china',
        'κίνα',
        'chatgpt',
      ],
      filters: ['guide', 'tool'],
      status: 'inactive',
      thumb: {
        type: 'solo',
        src: '/thumbs/ai-koskino_thumb.jpg',
        alt: 'Headline που δείχνει ότι η αμερικανική κυβέρνηση περιόρισε το GPT-5.6 της OpenAI',
      },
    },
    seoTitle: 'Δωρεάν open source AI μοντέλα να τρέξεις σήμερα',
    seoDescription:
      'Όσο η Αμερική κλειδώνει τα κορυφαία AI, η Κίνα τα βγάζει open source. DeepSeek, Qwen, Kimi και GLM, δωρεάν να τα δοκιμάσεις ή να τα τρέξεις τοπικά.',
    crumb: { label: 'videos', to: '/' },
    heading: 'Δωρεάν open source AI μοντέλα',
    introHtml:
      'Το πιο δυνατό μοντέλο της OpenAI βγήκε αλλά η αμερικανική κυβέρνηση το κλείδωσε σε λίγες εγκεκριμένες εταιρείες, όπως και το Mythos της Anthropic. Όσο η Δύση κλειδώνει τα κορυφαία, η Κίνα τα βγάζει open source. Εδώ είναι τα δωρεάν μοντέλα που μπορείς να χρησιμοποιήσεις σήμερα.',
    citation:
      'https://techcrunch.com/2026/06/26/openai-limits-gpt-5-6-rollout-after-government-request-says-restrictions-shouldnt-be-the-norm/',
    blocks: [
      {
        kind: 'cardLinks',
        items: [
          {
            icon: 'chat',
            title: 'DeepSeek',
            sub: 'Δωρεάν chat, open weights (MIT)',
            to: 'https://chat.deepseek.com',
          },
          {
            icon: 'chat',
            title: 'Qwen (Alibaba)',
            sub: 'Δωρεάν chat με τα open μοντέλα Qwen',
            to: 'https://chat.qwen.ai',
          },
          {
            icon: 'chat',
            title: 'Kimi (Moonshot)',
            sub: 'Δωρεάν chat, open weights',
            to: 'https://www.kimi.com',
          },
          {
            icon: 'chat',
            title: 'GLM (Z.ai)',
            sub: 'Δωρεάν chat με τα μοντέλα GLM',
            to: 'https://chat.z.ai',
          },
        ],
      },
      {
        kind: 'steps',
        title: 'Πού να τα τρέξεις δωρεάν',
        items: [
          'Πιο εύκολο: μπες στα επίσημα chat sites από πάνω και δοκίμασέ τα δωρεάν, χωρίς εγκατάσταση.',
          'Για προγραμματιστές: στο OpenRouter βρίσκεις πολλά open μοντέλα μαζεμένα, αρκετά και με δωρεάν tier.',
          'Τοπικά στον υπολογιστή σου: κατέβασε Ollama ή LM Studio και τρέξε τα open weights offline.',
        ],
      },
      {
        kind: 'prose',
        title: 'Πηγή',
        html: '<p>Το GPT-5.6 της OpenAI και το Claude Mythos της Anthropic βγήκαν αλλά η αμερικανική κυβέρνηση τα περιόρισε σε λίγες εγκεκριμένες εταιρείες, λόγω κινδύνου σε κυβερνοεπιθέσεις. Τα μοντέλα παραπάνω είναι open source και τα τρέχεις δωρεάν.</p>',
      },
    ],
  },

  {
    slug: 'say-my-name',
    pageKind: 'prompt',
    date: '2026-06-25',
    card: {
      title: 'Δώσε όνομα στο ChatGPT',
      desc: 'Ένα απλό context-rot test για μεγάλα ChatGPT chats, και το prompt για να συνεχίσεις σε νέο chat χωρίς να χάσεις τη συνέχεια.',
      metaLine: '25 Ιουν 2026 · Prompt',
      cardTags: ['ChatGPT', 'Context rot', 'Prompt'],
      searchTags: [
        'prompt',
        'chatgpt',
        'context',
        'context rot',
        'summary',
        'σύνοψη',
        'ai',
        'productivity',
      ],
      filters: ['prompt', 'guide'],
      status: 'scheduled',
      visibleAfter: '2026-06-28T21:30:00+03:00',
      thumb: {
        type: 'solo',
        src: '/thumbs/say-my-name_thumb.jpg',
        alt: 'Screenshot από ChatGPT prompt για σύνοψη συνομιλίας πριν από νέο chat',
      },
    },
    seoTitle: 'Δώσε όνομα στο ChatGPT',
    seoDescription:
      'Το prompt για να κάνεις σύνοψη μιας μεγάλης συνομιλίας και να συνεχίσεις σε νέο ChatGPT chat χωρίς να χάσεις context.',
    crumb: { label: 'videos', to: '/' },
    heading: 'Δώσε όνομα στο ChatGPT',
    introHtml:
      'Αν ένα μεγάλο ChatGPT chat αρχίσει να ξεχνάει βασικές οδηγίες, μην προσπαθείς να το σώσεις με άλλα πέντε prompts. Πέρνα καθαρή σύνοψη σε νέο chat και συνέχισε από εκεί.',
    citation: 'https://chatgpt.com',
    blocks: [
      {
        kind: 'prompt',
        label: 'conversation-summary.txt',
        text: `Summarize this conversation so I can continue it in a new chat without losing context.

Keep the summary in the same language as the conversation. If the conversation uses more than one language, use the main language of the conversation and keep important terms in their original language.

Make the summary useful for any kind of conversation, including projects, ideas, studying, work, research, personal planning, technical problems, creative tasks, or ongoing decisions.

Include only what is relevant:
- the main goal of the conversation
- what has already been discussed or decided
- important facts, files, links, examples, constraints, or assumptions
- preferences, tone, style, rules, or instructions that should carry over
- what has been tried and what happened
- open questions or unresolved issues
- the next best steps
- what the new chat should avoid assuming or forgetting

Write it as a clean copy-paste prompt for the new chat.
If something is unclear, write “unknown” instead of guessing.`,
      },
      {
        kind: 'steps',
        title: 'Οδηγίες',
        items: [
          'Άνοιξε το παλιό μεγάλο chat που έχει αρχίσει να μπερδεύεται.',
          'Κάνε paste το prompt από πάνω και ζήτησε τη σύνοψη.',
          'Άνοιξε νέο chat και κάνε paste τη σύνοψη ως πρώτο μήνυμα.',
          'Συνέχισε εκεί, με καθαρό context και χωρίς να κουβαλάς όλο το παλιό θόρυβο.',
        ],
      },
      {
        kind: 'prose',
        title: 'Πότε το χρησιμοποιείς',
        html: '<p>Όταν η συζήτηση έχει μεγαλώσει πολύ, όταν παλιές οδηγίες θάβονται, ή όταν το AI σταματάει να ακολουθεί βασικά πράγματα που είχατε συμφωνήσει στην αρχή.</p>',
      },
      {
        kind: 'prose',
        title: 'Πηγή',
        html: '<p>Companion prompt από το video. Δουλεύει σε ChatGPT, Claude, Gemini ή οποιοδήποτε chat model που μπορεί να συνοψίσει τη συζήτηση στην ίδια γλώσσα.</p>',
      },
    ],
  },

  // ───────────────────────────── Founders Playbook ─────────────────────────
  {
    slug: 'founders-scale',
    pageKind: 'prompt',
    date: '2026-06-18',
    card: {
      title: 'Founders Playbook: το scale',
      desc: 'Στο scale περνάς από builder σε αφεντικό. Το τεστ της βδομάδας δείχνει τι δεν έχει σύστημα, και το πραγματικό moat δεν είναι ο κώδικας.',
      metaLine: '18 Ιουν 2026 · Prompt',
      cardTags: ['Founders', 'Scale', 'Claude'],
      searchTags: ['founders', 'prompt', 'scale', 'systems', 'lock-in', 'moat', 'startup', 'claude'],
      filters: ['founders', 'prompt'],
      thumb: officialThumb,
    },
    seoTitle: 'Founders Playbook: το scale',
    seoDescription:
      'Στο scale περνάς από builder σε αφεντικό. Κάνε το τεστ της βδομάδας με το Claude για να δεις τι δεν έχει σύστημα, και χτίσε το πραγματικό lock-in — από το δωρεάν Founders Playbook της Anthropic.',
    crumb: { label: 'videos', to: '/' },
    heading: 'Founders Playbook: το scale',
    introHtml:
      'Στο scale σταματάς να φτιάχνεις και γίνεσαι το πρόσωπο της εταιρείας. Κάνε το τεστ της βδομάδας, φτιάξε ό,τι σταματάει χωρίς εσένα, και χτίσε το lock-in — με το Claude.',
    citation: FOUNDERS_SOURCE,
    blocks: [
      {
        kind: 'prompt',
        label: 'scale-systems.txt',
        text: `Με βοηθάς να περάσω από builder σε αφεντικό καθώς η startup μου μπαίνει σε scale.

Τι ισχύει τώρα:
[γράψε εδώ, χύμα, τι κάνεις μέσα στη βδομάδα, ποιες αποφάσεις περνάνε
από εσένα, ποιοι αυτοματισμοί/εργαλεία υπάρχουν, και τι κάνουν οι πελάτες σου]

Κάνε τα εξής:

1. ΤΟ ΤΕΣΤ ΤΗΣ ΒΔΟΜΑΔΑΣ
   - Υπόθεσε ότι λείπω μία ολόκληρη βδομάδα, χωρίς καμία πρόσβαση.
   - Πες μου τι ακριβώς θα σταματούσε να δουλεύει χωρίς εμένα.
   - Για καθένα, εξήγησε γιατί κρέμεται από εμένα και ποιο σύστημα λείπει.

2. ΦΤΙΑΞΕ ΤΑ ΣΥΣΤΗΜΑΤΑ ΠΟΥ ΛΕΙΠΟΥΝ
   - Για κάθε σημείο που σταματάει χωρίς εμένα, γράψε μου το μικρό
     σύστημα / SOP / checklist ώστε να τρέχει χωρίς εμένα.
   - Βάλε προτεραιότητα: τι πρέπει να φύγει πρώτο από τα χέρια μου.

3. LOCK-IN (γιατί δύσκολα σε αφήνουν)
   - Με βάση το τι κάνουν οι πελάτες μου, πες μου πού μπορώ να τους
     αφήσω να χτίσουν τη δουλειά τους πάνω στο προϊόν (αυτοματισμοί,
     integrations, δεδομένα) ώστε η αλλαγή να τους κοστίζει ολόκληρο project.
   - Πρότεινε 3 συγκεκριμένες κινήσεις που δυναμώνουν αυτό το lock-in
     χωρίς να γίνομαι εχθρικός προς τον πελάτη.

Στόχος: να μη σταματάει τίποτα χωρίς εμένα, και να γίνομαι δύσκολο να με αντιγράψουν.`,
      },
      {
        kind: 'steps',
        title: 'Οδηγίες',
        items: [
          'Άνοιξε το <strong>Claude</strong> (claude.ai) και κάνε paste τη λίστα με ό,τι κάνεις και τι κάνουν οι πελάτες σου.',
          'Τρέξε <strong>το τεστ της βδομάδας</strong>: τι σταματάει αν λείψεις 7 μέρες.',
          'Για κάθε σημείο που κρέμεται από εσένα, φτιάξε το <strong>σύστημα / SOP</strong> που το τρέχει χωρίς εσένα.',
          'Δούλεψε το <strong>lock-in</strong>: άσε τους πελάτες να χτίσουν τη ροή τους πάνω στο προϊόν σου.',
        ],
      },
      {
        kind: 'prose',
        title: 'Πηγή',
        html: `<p>Δωρεάν οδηγός: <a href="${FOUNDERS_SOURCE}" target="_blank" rel="noopener">The Founders Playbook — Anthropic</a></p>`,
      },
    ],
  },
  {
    slug: 'founders-launch',
    pageKind: 'prompt',
    date: '2026-06-16',
    card: {
      title: 'Founders Playbook: το launch',
      desc: 'Στο launch γίνεσαι εσύ το φρένο. Λύσε το tech debt και χώρισε ό,τι κάνεις σε αυτοματοποίηση / delegate / μόνο εσύ.',
      metaLine: '16 Ιουν 2026 · Prompt',
      cardTags: ['Founders', 'Systems', 'Claude'],
      searchTags: ['founders', 'prompt', 'launch', 'systems', 'delegation', 'startup', 'claude'],
      filters: ['founders', 'prompt'],
      thumb: officialThumb,
    },
    seoTitle: 'Founders Playbook: το launch',
    seoDescription:
      'Στο launch ο ιδρυτής γίνεται το φρένο. Έλεγξε το tech debt με Claude Code και χώρισε ό,τι κάνεις σε αυτοματοποίηση / delegation / μόνο εσύ — από το δωρεάν Founders Playbook της Anthropic.',
    crumb: { label: 'videos', to: '/' },
    heading: 'Founders Playbook: το launch',
    introHtml:
      'Στην αρχή το να είσαι σε κάθε απόφαση είναι ατού. Στο launch γίνεται φρένο. Λύσε το tech debt και χώρισε ό,τι κάνεις σε τρία — με το Claude.',
    citation: FOUNDERS_SOURCE,
    blocks: [
      {
        kind: 'prompt',
        label: 'launch-systems.txt',
        text: `Με βοηθάς να σταματήσω να είμαι το φρένο της startup μου μετά το launch.

Τι κάνω τώρα (όλα όσα περνάνε από εμένα):
[γράψε εδώ, χύμα, ό,τι κάνεις μόνος σου μέσα στη βδομάδα — αποφάσεις,
tasks, μηνύματα, support, κώδικας, ό,τι θυμάσαι]

Κάνε τα εξής:

1. TECH DEBT (τρέξε με Claude Code στο repo)
   - Δες το codebase και πες μου πού είναι πιο πιθανό να σπάσει καθώς
     μεγαλώνει (ο κώδικας που γράφτηκε βιαστικά στο MVP).
   - Πρότεινε συγκεκριμένο πλάνο για να το οργανώσω/καθαρίσω, με σειρά
     προτεραιότητας.

2. ΧΩΡΙΣΕ ΤΑ ΣΕ 3 ΜΕΡΗ
   Πάρε τη λίστα από πάνω και βάλε κάθε task σε ΜΙΑ κατηγορία:
   - ⚙️ ΑΥΤΟΜΑΤΟΠΟΙΕΙΤΑΙ — τι μπορεί να γίνει με script/tool/agent.
   - 🤝 DELEGATE — τι μπορεί να το κάνει άλλος (με σαφές handoff).
   - 🙋 ΜΟΝΟ ΕΣΥ — τι χρειάζεται 100% εσένα (και γιατί).

3. ΦΤΙΑΞΕ ΤΟ ΣΥΣΤΗΜΑ
   - Για κάθε «αυτοματοποιείται» και «delegate», γράψε μου το μικρό σύστημα
     / SOP / checklist ώστε να μη χρειάζεται να το ξανασκεφτώ.

Στόχος: να σταματήσω να κάνω τα πάντα εγώ και να φτιάξω το σύστημα που τα κάνει.`,
      },
      {
        kind: 'steps',
        title: 'Οδηγίες',
        items: [
          'Για το tech debt: τρέξε <strong>Claude Code</strong> μέσα στο repo σου.',
          'Για το split: άνοιξε το <strong>Claude</strong> (claude.ai) και κάνε paste τη λίστα σου.',
          'Χώρισε ό,τι κάνεις σε <strong>αυτοματοποίηση / delegate / μόνο εσύ</strong>.',
          'Φτιάξε το σύστημα — σταμάτα να είσαι εσύ το bottleneck.',
        ],
      },
      {
        kind: 'prose',
        title: 'Πηγή',
        html: `<p>Δωρεάν οδηγός: <a href="${FOUNDERS_SOURCE}" target="_blank" rel="noopener">The Founders Playbook — Anthropic</a></p>`,
      },
    ],
  },
  {
    slug: 'founders-mvp',
    pageKind: 'prompt',
    date: '2026-06-15',
    card: {
      title: 'Founders Playbook: το MVP',
      desc: 'Ορισμός μετρήσεων, vanity metrics και 40% test πριν πιστέψεις ότι το MVP “έπιασε”.',
      metaLine: '15 Ιουν 2026 · Prompt',
      cardTags: ['Founders', 'PMF', 'Claude'],
      searchTags: ['founders', 'prompt', 'pmf', 'startup', 'mvp', 'claude'],
      filters: ['founders', 'prompt'],
      thumb: officialThumb,
    },
    seoTitle: 'Founders Playbook: το MVP',
    seoDescription:
      'Πώς να καταλάβεις αν το MVP σου έχει αληθινό product-market fit — define metrics με Claude + το 40% test, από το δωρεάν Founders Playbook της Anthropic.',
    crumb: { label: 'videos', to: '/' },
    heading: 'Founders Playbook: το MVP',
    introHtml:
      'Τα πρώτα likes δεν είναι product-market fit. Όρισε τι θα μετράς με το Claude και κάνε το 40% test πριν πιστέψεις ότι «το ’πιασες».',
    citation: FOUNDERS_SOURCE,
    blocks: [
      {
        kind: 'prompt',
        label: 'mvp-validation.txt',
        text: `Είσαι σύμβουλος product-market fit. Με βοηθάς να μη μπερδέψω τα πρώτα likes
με αληθινή ζήτηση.

Το προϊόν μου (MVP):
[περίγραψε σε 2-3 γραμμές τι κάνει και ποιον βοηθάει]

Κάνε τα εξής:

1. ΟΡΙΣΕ ΤΙ ΘΑ ΜΕΤΡΑΩ
   - Δώσε μου 3-5 ΑΛΗΘΙΝΑ σήματα αξίας που πρέπει να μετράω
     (π.χ. επανάληψη χρήσης, ολοκλήρωση βασικής ενέργειας, οργανικά referrals).
   - Πες μου ΞΕΚΑΘΑΡΑ ποια είναι νούμερα-βιτρίνα (likes, views, downloads)
     που ΔΕΝ αποδεικνύουν ζήτηση, και γιατί.

2. ΤΟ 40% TEST (Sean Ellis)
   - Φτιάξε μου ένα σύντομο ερωτηματολόγιο 4-5 ερωτήσεων για να το στείλω
     σε ανθρώπους που ΗΔΗ το χρησιμοποιούν.
   - Η βασική ερώτηση: «Πόσο θα σε ένοιαζε αν δεν μπορούσες πια να το χρησιμοποιείς;»
     (Πολύ απογοητευμένος / Λίγο / Καθόλου).
   - Εξήγησέ μου πώς να διαβάσω το αποτέλεσμα: αν ≥40% πουν «Πολύ
     απογοητευμένος», υπάρχει σήμα PMF.

3. PULL vs PUSH
   - Δώσε μου 3 σημάδια ότι ο κόσμος έρχεται ΜΟΝΟΣ ΤΟΥ (pull) αντί να τον
     κυνηγάω εγώ (push), και πώς να τα παρακολουθώ.

Κράτα το πρακτικό και χωρίς buzzwords.`,
      },
      {
        kind: 'steps',
        title: 'Οδηγίες',
        items: [
          'Άνοιξε το <strong>Claude</strong> (claude.ai) — δωρεάν αρκεί.',
          'Copy το prompt και γράψε τι κάνει το MVP σου στο <code>[...]</code>.',
          'Όρισε τα σωστά metrics ΠΡΙΝ το ανεβάσεις — όχι νούμερα-βιτρίνα.',
          'Στείλε το 40% test σε όσους το χρησιμοποιούν. ≥40% «Πολύ» = κρατάς κάτι αληθινό.',
        ],
      },
      {
        kind: 'prose',
        title: 'Πηγή',
        html: `<p>Δωρεάν οδηγός: <a href="${FOUNDERS_SOURCE}" target="_blank" rel="noopener">The Founders Playbook — Anthropic</a></p>`,
      },
    ],
  },
  {
    slug: 'founders-idea',
    pageKind: 'prompt',
    date: '2026-06-15',
    card: {
      title: 'Founders Playbook: η ιδέα',
      desc: 'Πριν χτίσεις, έλεγξε αν υπάρχει πραγματικό πρόβλημα και ποιος το νιώθει αρκετά έντονα.',
      metaLine: '15 Ιουν 2026 · Prompt',
      cardTags: ['Founders', 'Validation', 'Claude'],
      searchTags: ['founders', 'prompt', 'validation', 'startup', 'idea', 'claude'],
      filters: ['founders', 'prompt'],
      thumb: officialThumb,
    },
    seoTitle: 'Founders Playbook: η ιδέα',
    seoDescription:
      "Πώς να validάρεις μια ιδέα πριν τη χτίσεις, με το Claude ως devil's advocate — από το δωρεάν Founders Playbook της Anthropic.",
    crumb: { label: 'videos', to: '/' },
    heading: 'Founders Playbook: η ιδέα',
    introHtml:
      "Το 42% των startups πεθαίνουν επειδή έχτισαν κάτι που δεν το ήθελε κανείς. Validάρεις την ιδέα πρώτα — με το Claude ως devil's advocate.",
    citation: FOUNDERS_SOURCE,
    blocks: [
      {
        kind: 'prompt',
        label: 'idea-validation.txt',
        text: `Είσαι ένας αυστηρός σύμβουλος startup που λειτουργεί ως devil's advocate.
Στόχος: να ΜΗΝ με αφήσεις να χτίσω κάτι που δεν θέλει κανείς.

Η ιδέα μου:
[γράψε εδώ την ιδέα σου σε 2-3 γραμμές]

Κάνε τα εξής, με αυτή τη σειρά:

1. ΚΑΝΕ ΤΟ ΠΡΟΒΛΗΜΑ ΣΥΓΚΕΚΡΙΜΕΝΟ
   - Ξαναγράψε το πρόβλημα ΜΟΝΟ με νούμερα και γεγονότα.
   - Όχι «κάτι δεν δουλεύει καλά», αλλά π.χ. «ο χρήστης χάνει 4 ώρες/βδομάδα σε X».
   - Αν δεν μπορείς να βάλεις νούμερο, πες μου τι πρέπει να μετρήσω για να το βρω.

2. DEVIL'S ADVOCATE (το πιο σημαντικό)
   - Δώσε μου τους 5 πιο δυνατούς λόγους γιατί η ιδέα μου είναι ΛΑΘΟΣ.
   - Σκέψου: το ανέχονται οι χρήστες; υπάρχει δωρεάν λύση; θα πλήρωνε κανείς;
   - Μη με κολακεύεις. Θέλω να πέσει η ιδέα τώρα, όχι σε 6 μήνες.

3. ΑΝΤΑΓΩΝΙΣΜΟΣ
   - Βρες 3-5 υπάρχουσες λύσεις (και δωρεάν) και πώς λύνουν ήδη το πρόβλημα.

4. ΤΕΣΤ ΜΕ 5 ΑΝΘΡΩΠΟΥΣ
   - Φτιάξε μου 5 ερωτήσεις customer discovery (όχι «θα το χρησιμοποιούσες;»),
     που να αποκαλύπτουν αν το πρόβλημα είναι αληθινό και πόσο πονάει.

Στο τέλος δώσε ετυμηγορία: αξίζει να φτιάξω prototype ή όχι, και γιατί.`,
      },
      {
        kind: 'steps',
        title: 'Οδηγίες',
        items: [
          'Άνοιξε το <strong>Claude</strong> (claude.ai) — δωρεάν αρκεί.',
          'Copy το prompt από πάνω και γράψε την ιδέα σου στο <code>[...]</code>.',
          'Διάβασε γιατί η ιδέα σου είναι λάθος. Αν επιβιώσει, κράτα τις 5 ερωτήσεις.',
          'Δώσε το prototype + τις ερωτήσεις σε <strong>5 πραγματικούς ανθρώπους</strong> και άκουσε.',
        ],
      },
      {
        kind: 'prose',
        title: 'Πηγή',
        html: `<p>Δωρεάν οδηγός: <a href="${FOUNDERS_SOURCE}" target="_blank" rel="noopener">The Founders Playbook — Anthropic</a></p>`,
      },
    ],
  },

  // ───────────────────────────── grill-me (guide) ──────────────────────────
  {
    slug: 'grill-me',
    pageKind: 'guide',
    date: '2026-06-09',
    card: {
      title: 'grill-me',
      desc: 'Skill που κάνει το AI να σε ρωτάει μία-μία τις σωστές ερωτήσεις πριν αρχίσει να φτιάχνει.',
      metaLine: '9 Ιουν 2026 · Guide',
      cardTags: ['Agent', 'Skill', 'Prompting'],
      searchTags: ['prompt', 'guide', 'agent', 'skill', 'grill', 'me', 'chatgpt', 'claude'],
      filters: ['guide', 'prompt'],
      thumb: {
        type: 'pair',
        before: { src: '/thumbs/grill-me_before.jpg', alt: 'Πριν: AI που ξεκινά χωρίς αρκετό context' },
        after: { src: '/thumbs/grill-me_after.jpg', alt: 'Μετά: grill-me skill με ερωτήσεις πριν την υλοποίηση' },
      },
    },
    seoTitle: 'grill-me — οδηγός βήμα βήμα',
    seoDescription:
      'Πλήρης οδηγός: βάλε το grill-me στον AI agent σου ή στο ChatGPT, ώστε να σε ρωτάει μία-μία πριν ξεκινήσει να φτιάχνει.',
    crumb: { label: 'videos', to: '/' },
    heading: 'grill-me — οδηγός βήμα βήμα',
    introHtml:
      'Το AI βγάζει μέτρια αποτελέσματα όταν αρχίζει να φτιάχνει πριν καταλάβει τι θες. Το grill-me το γυρίζει ανάποδα: σε ρωτάει μία-μία (με προτεινόμενη απάντηση) μέχρι να ξεκαθαρίσει το ζητούμενο. Δωρεάν. Ακολούθησε τα βήματα — πράσινο = προχώρα, πορτοκαλί = κάνε ό,τι λέει.',
    blocks: [
      {
        kind: 'html',
        html: `<div class="guide">
  <div class="step">
    <div class="step-head"><span class="step-num">1</span><h2>Πώς θα το χρησιμοποιήσεις;</h2></div>
    <p class="lead">Δύο τρόποι — διάλεξε τον δικό σου.</p>
    <div class="branch yes">
      <span class="tag yes">Έχω AI agent (Claude Code / Codex / Cursor)</span>
      <p>Θα το εγκαταστήσεις σαν μόνιμο skill. <span class="goto">Πήγαινε στο Βήμα 2.</span></p>
    </div>
    <div class="branch no">
      <span class="tag no">Μόνο ChatGPT ή Claude στον browser</span>
      <p>Δεν χρειάζεσαι εγκατάσταση. <span class="goto">Πήγαινε στο Βήμα 4.</span></p>
    </div>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">2</span><h2>Εγκατέστησε το skill στον agent σου</h2></div>
    <p class="lead">Άνοιξε ένα terminal (<span class="winlabel">Windows:</span> πάτα <code class="k">Windows</code>, γράψε <code class="k">cmd</code> · <span class="maclabel">Mac:</span> <code class="k">Cmd + Space</code>, γράψε <code class="k">Terminal</code>) και τρέξε:</p>
    <span class="cmd">npx skills@latest add mattpocock/skills</span>
    <p class="hint">Χρειάζεται <code class="k">Node.js</code>. Αν σου πει ότι το <code class="k">npx</code> δεν βρέθηκε, κατέβασέ το από το <code class="k">nodejs.org</code> (κουμπί LTS), κλείσε–ξανάνοιξε το terminal και ξαναγράψε την εντολή.</p>
    <div class="branch yes">
      <span class="tag yes">Στο setup, διάλεξε</span>
      <p><code class="k">/setup-matt-pocock-skills</code> και τελείωσε το interactive setup. <span class="goto">Πήγαινε στο Βήμα 3.</span></p>
    </div>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">3</span><h2>Χρησιμοποίησέ το μέσα στον agent</h2></div>
    <p class="lead">Μία φορά, για να ρυθμιστούν τα skills:</p>
    <span class="cmd">/setup-matt-pocock-skills</span>
    <p>Μετά, <strong>πριν</strong> ζητήσεις από το AI να φτιάξει κάτι, γράψε:</p>
    <span class="cmd">/grill-me        <span class="c"># ή απλά πες: "grill me"</span></span>
    <p>Από κει και πέρα σε ρωτάει <strong>μία ερώτηση τη φορά</strong>, με προτεινόμενη απάντηση στην καθεμία, μέχρι να καταλάβει ακριβώς τι θες — και μόνο τότε ξεκινάει.</p>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">4</span><h2>Χωρίς agent — μόνο με copy-paste</h2></div>
    <p class="lead">Το skill είναι ένα μικρό κείμενο. Δουλεύει με οποιοδήποτε μοντέλο.</p>
    <ol>
      <li>Άνοιξε το <code class="k">SKILL.md</code> του grill-me (link πιο κάτω) και αντίγραψε το κείμενο.</li>
      <li>Κάνε paste στο ChatGPT (ή στο Claude) και γράψε από πάνω:</li>
    </ol>
    <span class="cmd">Ακολούθησε αυτές τις οδηγίες. Πριν φτιάξεις
οτιδήποτε, κάνε μου ερωτήσεις μία-μία μέχρι
να καταλάβεις ακριβώς τι θέλω.</span>
    <p>Έτοιμο — τώρα σε ανακρίνει αυτό πριν ξεκινήσει.</p>
  </div>
  <div class="done">
    <h2>Τέλος.</h2>
    <p>Είτε σαν skill στον agent, είτε με copy-paste, το AI σταματάει να μαντεύει. Τέρμα τα τεράστια prompts και οι συνεχείς επαναλήψεις — σε ρωτάει πρώτα, φτιάχνει μετά.</p>
  </div>
</div>`,
      },
      {
        kind: 'prose',
        title: 'Πηγή',
        html: `<p>Επίσημο repo (δωρεάν / open-source, από τον Matt Pocock): <a href="https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me" target="_blank" rel="noopener">github.com/mattpocock/skills · grill-me</a></p>`,
      },
    ],
  },

  // ───────────────────────────── Thea (guide) ──────────────────────────────
  {
    slug: 'thea-learning',
    pageKind: 'guide',
    date: '2026-06-04',
    card: {
      title: 'Thea',
      desc: 'Το υλικό σου γίνεται οδηγός, παιχνίδι και διαγώνισμα στα ελληνικά.',
      metaLine: '4 Ιουν 2026 · Tool',
      cardTags: ['Learning', 'AI tool', 'Greek'],
      searchTags: ['tool', 'guide', 'learning', 'education', 'ai', 'greek', 'thea'],
      filters: ['tool', 'guide'],
      thumb: {
        type: 'pair',
        before: { src: '/thumbs/thea-learning_before.jpg', alt: 'Πριν: ακατέργαστο εκπαιδευτικό υλικό' },
        after: { src: '/thumbs/thea-learning_after.jpg', alt: 'Μετά: οδηγός, ερωτήσεις, παιχνίδι και τεστ' },
      },
    },
    seoTitle: 'Thea — οδηγός βήμα βήμα',
    seoDescription:
      'Δώσε το υλικό σου (σημειώσεις, PDF ή διάλεξη YouTube) και το Thea σου φτιάχνει οδηγό μελέτης, ερωτήσεις, παιχνίδια και διαγώνισμα με χρόνο. Δωρεάν, στα ελληνικά.',
    crumb: { label: 'videos', to: '/' },
    heading: 'Thea — οδηγός βήμα βήμα',
    introHtml:
      'Δίνεις το υλικό σου (σημειώσεις, PDF ή μια διάλεξη από YouTube) και το Thea σου φτιάχνει μόνο του οδηγό μελέτης, ερωτήσεις εξάσκησης, παιχνίδια απομνημόνευσης και κανονικό διαγώνισμα με χρόνο. Στα ελληνικά — σαν το Duolingo, αλλά για τη δική σου ύλη. Υπάρχει σε <strong>ιστοσελίδα, Google Play και App Store</strong>.',
    headerExtraHtml: `<div class="avail">
  <a class="web" href="https://www.theastudy.com" target="_blank" rel="noopener"><span class="lbl"><small>Στον browser</small>Ιστοσελίδα</span></a>
  <a href="https://play.google.com/store/apps/details?id=study.thea.www.twa" target="_blank" rel="noopener"><span class="lbl"><small>Android</small>Google Play</span></a>
  <a href="https://apps.apple.com/app/apple-store/id6742800289" target="_blank" rel="noopener"><span class="lbl"><small>iPhone / iPad</small>App Store</span></a>
</div>`,
    blocks: [
      {
        kind: 'html',
        html: `<div class="guide g-blue">
  <div class="step">
    <div class="step-head"><span class="step-num">1</span><h2>Άνοιξε το Thea</h2></div>
    <p class="lead">Σε τρία σημεία — όπου σε βολεύει.</p>
    <p>Στην <strong>ιστοσελίδα</strong> <code class="k">theastudy.com</code> (στον browser, χωρίς εγκατάσταση), ή κατέβασέ το από το <strong>Google Play</strong> (Android) και το <strong>App Store</strong> (iPhone/iPad). Φτιάχνεις έναν δωρεάν λογαριασμό και σε όλα συγχρονίζεται το ίδιο υλικό.</p>
    <p class="hint">Τώρα είναι δωρεάν, χωρίς πιστωτική κάρτα και χωρίς διαφημίσεις.</p>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">2</span><h2>Δώσε το υλικό σου</h2></div>
    <p class="lead">Τρεις τρόποι — όποιος σε βολεύει.</p>
    <p><strong>Ανέβασε</strong> αρχεία (PDF, σημειώσεις, φωτογραφίες), <strong>επικόλλησε</strong> τις σημειώσεις/την ύλη σου, ή ρίξε έναν <strong>σύνδεσμο από YouTube</strong> (διάλεξη με υπότιτλους).</p>
    <p class="hint">Αν δεν έχεις υλικό πρόχειρο, μπορείς απλώς να του περιγράψεις το μάθημα και να το χτίσει από εκεί.</p>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">3</span><h2>Πάρε τον οδηγό μελέτης</h2></div>
    <p class="lead">Όλη η ύλη, οργανωμένη.</p>
    <p>Σου φτιάχνει έναν δομημένο οδηγό με ορισμούς, βασικές έννοιες και ενότητες — όχι ρηχή περίληψη δύο γραμμών.</p>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">4</span><h2>Εξασκήσου με έξυπνες ερωτήσεις</h2></div>
    <p class="lead">Ενεργή εξάσκηση, όχι παθητικό διάβασμα.</p>
    <p>Σε εξετάζει με ερωτήσεις που <strong>δυσκολεύουν όσο μαθαίνεις</strong>, ώστε να εστιάζεις εκεί που χωλαίνεις.</p>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">5</span><h2>Παίξε για να το θυμάσαι <span class="pill">κάρτες μάθησης</span></h2></div>
    <p class="lead">Σαν Duolingo, αλλά με τη δική σου ύλη.</p>
    <p>Παιχνίδια και κάρτες απομνημόνευσης (π.χ. το «Στοιβάκτης») κάνουν τις έννοιες να κολλήσουν χωρίς να βαρεθείς.</p>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">6</span><h2>Κάνε διαγώνισμα με χρόνο</h2></div>
    <p class="lead">Πρόβα εξεταστικής.</p>
    <p>Στήνει κανονικό τεστ με χρονόμετρο, σαν να δίνεις αληθινές εξετάσεις — για να φτάσεις προετοιμασμένος.</p>
  </div>
  <div class="done">
    <h2>Τέλος.</h2>
    <p>Αν είσαι μέσα στην εξεταστική και διαβάζεις τελευταία στιγμή, το έχεις πλέον έτοιμο: από τις δικές σου σημειώσεις σε οδηγό, εξάσκηση, παιχνίδι και διαγώνισμα — δωρεάν, στα ελληνικά.</p>
    <a class="cta" href="https://www.theastudy.com" target="_blank" rel="noopener">Δοκίμασέ το δωρεάν →</a>
  </div>
</div>`,
      },
      {
        kind: 'prose',
        title: 'Πηγή',
        html: `<p>Διαθέσιμο σε <a href="https://www.theastudy.com" target="_blank" rel="noopener">ιστοσελίδα (theastudy.com)</a>, <a href="https://play.google.com/store/apps/details?id=study.thea.www.twa" target="_blank" rel="noopener">Google Play</a> και <a href="https://apps.apple.com/app/apple-store/id6742800289" target="_blank" rel="noopener">App Store</a> · δωρεάν για ξεκίνημα (χωρίς κάρτα), σε 80+ γλώσσες — ελληνικά κι αγγλικά.</p>`,
      },
    ],
  },

  // ───────────────────────────── FindAnomaly (guide) ───────────────────────
  {
    slug: 'anomaly-ai',
    pageKind: 'guide',
    date: '2026-06-03',
    card: {
      title: 'FindAnomaly',
      desc: 'Ανεβάζεις data και παίρνεις dashboard, anomalies και παρουσίαση σε PPT, Word ή PDF.',
      metaLine: '3 Ιουν 2026 · Tool',
      cardTags: ['Data', 'Dashboard', 'AI tool'],
      searchTags: ['tool', 'guide', 'data', 'dashboard', 'ai', 'anomaly', 'excel', 'csv'],
      filters: ['tool', 'guide'],
      thumb: {
        type: 'pair',
        before: { src: '/thumbs/anomaly-ai_before.jpg', alt: 'Πριν: raw data σε Excel ή CSV' },
        after: { src: '/thumbs/anomaly-ai_after.jpg', alt: 'Μετά: dashboard και έτοιμη παρουσίαση' },
      },
    },
    seoTitle: 'FindAnomaly — οδηγός βήμα βήμα',
    seoDescription:
      'Ανέβασε τα δεδομένα σου και πάρε dashboard + έτοιμη παρουσίαση PowerPoint/Word/PDF με AI. Δωρεάν για να ξεκινήσεις.',
    crumb: { label: 'videos', to: '/' },
    heading: 'FindAnomaly — οδηγός βήμα βήμα',
    introHtml:
      'Ανεβάζεις ακατέργαστα δεδομένα (Excel/CSV) και ένα chatbot σου φτιάχνει διαδραστικό dashboard, βρίσκει τι δεν κολλάει, και σου βγάζει έτοιμη παρουσίαση. Δεν χρειάζεσαι προγραμματισμό — όλα γίνονται στον browser.',
    blocks: [
      {
        kind: 'html',
        html: `<div class="guide g-green">
  <div class="step">
    <div class="step-head"><span class="step-num">1</span><h2>Άνοιξε το FindAnomaly</h2></div>
    <p class="lead">Δεν εγκαθιστάς τίποτα — είναι web app.</p>
    <p>Πήγαινε στο <code class="k">app.findanomaly.ai</code> και κάνε έναν δωρεάν λογαριασμό.</p>
    <p class="hint">Το δωρεάν πλάνο δίνει 60 credits τον μήνα — αρκετά για να το δοκιμάσεις σε πραγματικά αρχεία.</p>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">2</span><h2>Ανέβασε το αρχείο σου</h2></div>
    <p class="lead">Excel ή CSV — τα ακατέργαστα δεδομένα όπως τα έχεις.</p>
    <p>Το AI τα διαβάζει, αναγνωρίζει μόνο του τους τύπους των στηλών και τα προετοιμάζει για ανάλυση.</p>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">3</span><h2>Πες στο chatbot τι θες</h2></div>
    <p class="lead">Του μιλάς με κανονικά λόγια, σαν να ρωτάς συνάδελφο.</p>
    <p>Π.χ. «κάνε μου ένα dashboard με τις πωλήσεις ανά μήνα» ή «δείξε μου τα insights». Σου βγάζει γραφήματα, KPIs και πίνακες από τα δεδομένα σου.</p>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">4</span><h2>Δες τι δεν κολλάει <span class="pill">find anomaly</span></h2></div>
    <p class="lead">Από εδώ βγαίνει και το όνομα.</p>
    <p>Εντοπίζει μόνο του προβλήματα ποιότητας στα δεδομένα: διπλοεγγραφές, κενά, παράξενες τιμές (outliers). Έτσι δεν παρουσιάζεις λάθος νούμερα.</p>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">5</span><h2>Κατέβασε έτοιμη παρουσίαση</h2></div>
    <p class="lead">Το killer feature.</p>
    <p>Με ένα κλικ το βγάζεις σε <strong>PowerPoint, Word ή PDF</strong> — έτοιμη παρουσίαση να τη στείλεις, χωρίς να φτιάξεις εσύ διαφάνειες.</p>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">6</span><h2>(Προαιρετικά) Βάλ' το να δουλεύει μόνο του</h2></div>
    <p class="lead">Το στήνεις μία φορά.</p>
    <p>Συνδέεις τα δεδομένα να ανανεώνονται μόνα τους (Sync) και ζητάς να σου στέλνει report κάθε μήνα (scheduled reports).</p>
  </div>
  <div class="done">
    <h2>Τέλος.</h2>
    <p>Αν παλεύεις με Excel — λογιστικά, πωλήσεις, πτυχιακή — το έχεις πλέον έτοιμο: από ακατέργαστα δεδομένα σε dashboard και παρουσίαση, χωρίς χειρωνακτική δουλειά.</p>
    <a class="cta" href="https://app.findanomaly.ai" target="_blank" rel="noopener">Δοκίμασέ το δωρεάν →</a>
  </div>
</div>`,
      },
      {
        kind: 'prose',
        title: 'Πηγή',
        html: `<p>Επίσημο site με όλες τις λειτουργίες και τα πλάνα: <a href="https://findanomaly.ai" target="_blank" rel="noopener">findanomaly.ai</a> · δωρεάν για ξεκίνημα (60 credits/μήνα), με αναβάθμιση αν θες περισσότερη χρήση.</p>`,
      },
    ],
  },

  // ───────────────────────────── graphify (guide) ──────────────────────────
  {
    slug: 'graphify',
    pageKind: 'guide',
    date: '2026-06-02',
    card: {
      title: 'graphify',
      desc: 'Κάνε το codebase σου knowledge graph για να το καταλαβαίνει καλύτερα το AI σου.',
      metaLine: '2 Ιουν 2026 · Open source',
      cardTags: ['Code', 'Graph', 'Open source'],
      searchTags: ['tool', 'guide', 'code', 'graph', 'knowledge', 'graph', 'open', 'source', 'graphify'],
      filters: ['tool', 'guide'],
      thumb: { type: 'solo', src: '/thumbs/graphify_after.jpg', alt: 'Knowledge graph από codebase' },
    },
    seoTitle: 'graphify — οδηγός βήμα βήμα',
    seoDescription: 'Πλήρης οδηγός: εγκατάσταση graphify από το μηδέν, ακόμη κι αν δεν έχεις Python.',
    crumb: { label: 'videos', to: '/' },
    heading: 'graphify — οδηγός βήμα βήμα',
    introHtml:
      'Ακολούθησε τα βήματα με τη σειρά. Σε κάθε βήμα, αν ισχύει το πράσινο πήγαινε παρακάτω, αλλιώς κάνε ό,τι λέει το πορτοκαλί. Δεν χρειάζεσαι προγραμματισμό για να το στήσεις.',
    blocks: [
      {
        kind: 'html',
        html: `<div class="guide">
  <div class="step">
    <div class="step-head"><span class="step-num">1</span><h2>Άνοιξε ένα terminal</h2></div>
    <p class="lead">Όλες οι εντολές γράφονται εκεί.</p>
    <div class="os">
      <h4 class="winlabel">Windows</h4>
      <p>Πάτα το πλήκτρο <code class="k">Windows</code>, γράψε <code class="k">cmd</code> και πάτα Enter.</p>
    </div>
    <div class="os">
      <h4 class="maclabel">Mac</h4>
      <p>Πάτα <code class="k">Cmd + Space</code>, γράψε <code class="k">Terminal</code> και πάτα Enter.</p>
    </div>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">2</span><h2>Έχεις Python; (το χρειάζεται το graphify)</h2></div>
    <p class="lead">Γράψε στο terminal και πάτα Enter:</p>
    <span class="cmd">python --version          <span class="c"># σε Mac δοκίμασε: python3 --version</span></span>
    <div class="branch yes">
      <span class="tag yes">ΝΑΙ — βλέπω 3.10 ή πιο πάνω</span>
      <p>Π.χ. <code class="k">Python 3.12.4</code>. Τέλεια. <span class="goto">Πήγαινε στο Βήμα 3.</span></p>
    </div>
    <div class="branch no">
      <span class="tag no">ΟΧΙ — λέει "not found" ή έκδοση κάτω από 3.10</span>
      <p>Εγκατέστησε Python και μετά γύρνα σε αυτό το βήμα να το ξαναελέγξεις:</p>
      <div class="os">
        <h4 class="winlabel">Windows</h4>
        <ol>
          <li>Άνοιξε το <code class="k">python.org/downloads</code> και κατέβασε την τελευταία έκδοση.</li>
          <li>Τρέξε το αρχείο που κατέβηκε.</li>
          <li><span class="warn">ΣΗΜΑΝΤΙΚΟ:</span> τσέκαρε κάτω το κουτάκι <code class="k">Add python.exe to PATH</code>, μετά πάτα <code class="k">Install Now</code>.</li>
          <li>Κλείσε και ξανάνοιξε το terminal, και ξαναγράψε <code class="k">python --version</code>.</li>
        </ol>
      </div>
      <div class="os">
        <h4 class="maclabel">Mac</h4>
        <ol>
          <li>Αν έχεις Homebrew, απλά γράψε <code class="k">brew install python</code>.</li>
          <li>Αλλιώς, άνοιξε το <code class="k">python.org/downloads</code>, κατέβασε το <code class="k">.pkg</code> και τρέξε το.</li>
          <li>Έλεγξε με <code class="k">python3 --version</code>.</li>
        </ol>
      </div>
    </div>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">3</span><h2>Έχεις Claude Code;</h2></div>
    <p class="lead">Το graphify δουλεύει μέσα στο Claude Code (το AI coding assistant της Anthropic).</p>
    <div class="branch yes">
      <span class="tag yes">ΝΑΙ</span>
      <p><span class="goto">Πήγαινε στο Βήμα 4.</span></p>
    </div>
    <div class="branch no">
      <span class="tag no">ΟΧΙ</span>
      <p>Κατέβασέ το από το <code class="k">claude.com/product/claude-code</code> και κάνε login με τον λογαριασμό σου. Μετά γύρνα εδώ.</p>
    </div>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">4</span><h2>Εγκατέστησε το graphify</h2></div>
    <p class="lead">Στο terminal, γράψε (μία φορά):</p>
    <span class="cmd">pip install graphifyy && graphify install</span>
    <p class="hint">Το package λέγεται <code class="k">graphifyy</code> (με δύο y), η εντολή μένει <code class="k">graphify</code>.</p>
    <div class="branch yes">
      <span class="tag yes">Δούλεψε χωρίς error</span>
      <p><span class="goto">Πήγαινε στο Βήμα 5.</span></p>
    </div>
    <div class="branch no">
      <span class="tag no">Βγάζει error;</span>
      <div class="os">
        <h4>Λέει ότι το <code class="k">pip</code> δεν βρέθηκε</h4>
        <span class="cmd">python -m pip install graphifyy && graphify install   <span class="c"># Mac: python3 -m pip ...</span></span>
      </div>
      <div class="os">
        <h4 class="winlabel">Windows: λέει ότι το <code class="k">graphify</code> δεν αναγνωρίζεται</h4>
        <span class="cmd">pip install pipx
pipx install graphifyy
graphify install</span>
      </div>
      <div class="os">
        <h4 class="maclabel">Mac: λέει "externally-managed-environment"</h4>
        <span class="cmd">pipx install graphifyy && graphify install</span>
      </div>
    </div>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">5</span><h2>Φτιάξε τον χάρτη</h2></div>
    <p class="lead">Άνοιξε το <strong>Claude Code</strong> μέσα στον φάκελο ή το project που θες να καταλάβεις, και γράψε:</p>
    <span class="cmd">/graphify .</span>
    <p>Σου φτιάχνει έναν φάκελο <code class="k">graphify-out/</code> με ένα διαδραστικό <code class="k">graph.html</code> που μπορείς να ανοίξεις και στον browser.</p>
  </div>
  <div class="step">
    <div class="step-head"><span class="step-num">6</span><h2>Ρώτα το</h2></div>
    <p class="lead">Πάντα μέσα στο Claude Code:</p>
    <span class="cmd">/graphify query "πώς συνδέεται το Χ με το Υ;"</span>
    <p>Το AI απαντάει κοιτάζοντας τον χάρτη, με παραπομπή στο ακριβές αρχείο, αντί να ξαναδιαβάζει τα πάντα. Άλλες εντολές:</p>
    <span class="cmd">/graphify path "Α" "Β"      <span class="c"># η διαδρομή ανάμεσα σε δύο πράγματα</span>
/graphify explain "Χ"        <span class="c"># εξήγηση ενός κόμβου</span>
/graphify . --update         <span class="c"># όταν αλλάξεις αρχεία</span></span>
  </div>
  <div class="done">
    <h2>Τέλος.</h2>
    <p>Από δω και πέρα, κάθε φορά που θες να καταλάβεις ή να ρωτήσεις για ένα project, έχεις τον χάρτη έτοιμο και γλιτώνεις tokens.</p>
  </div>
</div>`,
      },
      {
        kind: 'prose',
        title: 'Πηγή',
        html: `<p>Επίσημο repo με όλες τις οδηγίες και τον κώδικα: <a href="https://github.com/safishamsi/graphify" target="_blank" rel="noopener">github.com/safishamsi/graphify</a></p>`,
      },
    ],
  },

  // ───────────────────────────── CV tailoring (prompt) ─────────────────────
  {
    slug: 'cv-tailor',
    pageKind: 'prompt',
    date: '2026-05-28',
    card: {
      title: 'CV tailoring',
      desc: 'ATS-aware prompt για ChatGPT και Claude Projects χωρίς να αλλοιώνει το προφίλ σου.',
      metaLine: '28 Μαΐ 2026 · Prompt',
      cardTags: ['Career', 'ATS', 'Prompt'],
      searchTags: ['prompt', 'cv', 'career', 'ats', 'chatgpt', 'claude', 'job'],
      filters: ['prompt'],
      thumb: { type: 'solo', src: '/thumbs/cv_before.jpg', alt: 'Βιογραφικό πριν το ATS-aware tailoring' },
    },
    seoTitle: 'CV tailoring prompt',
    seoDescription: 'ATS-aware CV tailoring prompt για ChatGPT και Claude Projects.',
    crumb: { label: 'videos', to: '/' },
    heading: 'CV tailoring prompt',
    introHtml:
      'Βάλε το CV.docx ως source σε ChatGPT ή Claude Project. Paste το prompt με το job description.',
    blocks: [
      {
        kind: 'prompt',
        label: 'prompt.txt',
        text: `You are an expert ATS-aware CV tailoring assistant.

Your job is to tailor an EXISTING CV to a JOB DESCRIPTION while STRICTLY preserving the original formatting and structure.

NON-NEGOTIABLE RULES:

1. NEVER change formatting.

* Do NOT change fonts
* Do NOT change font sizes
* Do NOT change spacing
* Do NOT change margins
* Do NOT change alignment
* Do NOT change bullet style
* Do NOT change section order
* Do NOT rewrite the structure
* Do NOT add visual elements
* Do NOT reformat dates
* Do NOT convert paragraphs into bullets or vice versa
* Do NOT use bold/italic unless already present
* Keep the exact same visual layout

2. ONLY modify text content where needed.
   You may:

* reword sentences
* reorder technologies inside existing lists
* emphasize relevant experience
* inject ATS keywords naturally
* make projects sound more aligned with the role

But:

* NEVER invent fake experience
* NEVER add technologies the user does not know
* NEVER exaggerate beyond believable scope
* NEVER turn the candidate into a perfect match

3. IMPORTANT PROFILE MATCHING RULE:
   If:

* 10 = user's authentic profile
* 0 = exact ideal profile of the company

Then target:

* 5

Meaning:

* move the CV PARTIALLY toward the company
* keep strong elements of the user's original identity
* preserve authenticity
* avoid overfitting to the job description
* maintain believable consistency across all sections

The CV should still feel like the SAME PERSON after tailoring.

4. BEFORE making ANY edits:
   First output ONLY:

* the sections you plan to change
* exactly what you will change
* why you will change it

Be concise and direct.
NO fluff.
NO motivational language.
NO explanations beyond the edits.

Then ask:
"Proceed?"

DO NOT modify the CV before user confirmation.

5. WHEN EDITING:

* prioritize ATS relevance
* optimize for recruiter scanning
* preserve readability
* keep wording concise
* avoid corporate buzzword spam
* avoid overusing keywords unnaturally

6. IMPORTANT:
   If a sentence is already strong and relevant:
   DO NOT touch it.

Minimal high-quality edits are preferred over aggressive rewriting.

7. OUTPUT REQUIREMENTS:

* Return the FULL updated CV
* Preserve exact formatting
* Preserve line breaks as closely as possible
* Preserve all untouched content exactly

INPUTS YOU WILL RECEIVE:

1. Existing CV
2. Job Description

Your task:
Tailor the CV according to all rules above.`,
      },
      {
        kind: 'steps',
        title: 'Οδηγίες',
        items: [
          'Φτιάξε ένα <strong>Project</strong> σε ChatGPT ή Claude.',
          'Ανέβασε το CV σου (<code>CV.docx</code>) ως source στο project.',
          'Copy το prompt από πάνω, paste μαζί με το job description.',
          'Διάβασε τι αλλάζει, γράψε <code>Proceed</code>, παίρνεις το tailored CV.',
        ],
      },
    ],
  },

  // ───────────────────────────── AI staging (tool list) ────────────────────
  {
    slug: 'estate-ai-furnishing',
    pageKind: 'toolList',
    date: '2026-05-31',
    card: {
      title: 'AI staging ακινήτων',
      desc: 'Chatbots και εργαλεία για να δείξεις άδειους χώρους επιπλωμένους με AI.',
      metaLine: '31 Μαΐ 2026 · Tool list',
      cardTags: ['Real estate', 'Staging', 'AI tools'],
      searchTags: ['tool', 'guide', 'real', 'estate', 'staging', 'furnishing', 'ai', 'property'],
      filters: ['tool', 'guide'],
      thumb: {
        type: 'pair',
        before: { src: '/thumbs/estate_before.jpg', alt: 'Πριν: άδειο δωμάτιο' },
        after: { src: '/thumbs/estate_after.jpg', alt: 'Μετά: επιπλωμένο δωμάτιο με AI staging' },
      },
    },
    seoTitle: 'AI staging ακινήτων',
    seoDescription: 'Επίπλωσε άδειο ακίνητο με AI: chatbots (master prompt) και ειδικά εργαλεία.',
    crumb: { label: 'videos', to: '/' },
    heading: 'AI staging ακινήτων',
    introHtml: 'Δύο δωρεάν τρόποι να επιπλώσεις ένα άδειο σπίτι με AI. Διάλεξε από πού θες να ξεκινήσεις.',
    blocks: [
      {
        kind: 'cardLinks',
        items: [
          {
            icon: 'chat',
            title: 'Chatbots + master prompt',
            sub: 'ChatGPT & Gemini · το prompt έτοιμο για copy',
            to: '/estate-ai-furnishing/chatbots',
          },
          {
            icon: 'tool',
            title: 'Ειδικά εργαλεία',
            sub: 'Εργαλεία φτιαγμένα για staging · κρατάνε σωστά τον χώρο',
            to: '/estate-ai-furnishing/tools',
          },
        ],
      },
    ],
  },
  {
    slug: 'estate-ai-furnishing/chatbots',
    pageKind: 'prompt',
    date: '2026-05-31',
    seoTitle: 'Chatbots — AI staging',
    seoDescription: 'Master prompt για AI staging με ChatGPT ή Gemini, πληροφορίες και συνδρομές.',
    crumb: { label: 'AI staging', to: '/estate-ai-furnishing' },
    heading: 'Chatbots + master prompt',
    introHtml: 'Ανέβασε τη φωτό του χώρου, βάλε το prompt, διάλεξε στυλ. Δουλεύει σε ChatGPT ή Gemini.',
    blocks: [
      {
        kind: 'prompt',
        label: 'master_prompt.txt',
        text: `ROLE: You are a virtual staging engine. Edit the uploaded photo IN PLACE. Treat it
as a LOCKED base layer — this is photo compositing, NOT image generation.

DO ONLY TWO THINGS:
1) Add realistic furniture and decor for a [STYLE] [ROOM TYPE].
2) Improve the lighting naturally — balanced, bright, realistic daylight with soft
   shadows and subtle floor reflections.

KEEP 100% UNCHANGED (copy pixel-for-pixel from the source):
- Camera angle, position, focal length, perspective, framing and crop.
- Every wall: exact position, shape and color.
- The window(s): exact size, position, frame, mullions and the view outside.
- Any open doorway and the adjoining room visible through it.
- The floor (plank direction, tone) and the ceiling (incl. tray/recess).
- Outlets, vents, switches, thermostat and all fixtures.
- Room dimensions, proportions and how much space is visible on EVERY side.

FURNITURE RULES:
- Sits flat on the existing floor, correct scale to the real room, realistic depth
  and contact shadows. Never covers or alters windows, doorways or architectural lines.

HARD CONSTRAINTS:
- Do NOT move, resize, add or remove any wall, window, door, opening, ceiling or floor.
- Do NOT change the camera angle or how much of the room is visible.
- Do NOT re-render or reimagine the room. If unsure about anything structural,
  leave it IDENTICAL to the source.

OUTPUT: one photorealistic image, identical framing to the source — furniture and
improved lighting only, if needed.`,
      },
      {
        kind: 'steps',
        title: 'Πώς το χρησιμοποιείς',
        items: [
          'Ανέβασε τη φωτό του άδειου χώρου στο <strong>ChatGPT</strong> ή <strong>Gemini</strong>.',
          'Copy το prompt, άλλαξε το <code>[STYLE]</code> (π.χ. modern minimal) και το <code>[ROOM TYPE]</code> (π.χ. living room).',
          'Για σωστά τετραγωνικά, ανέβασε <strong>και την κάτοψη</strong> με τα μέτρα.',
          'Κάθε νέα φωτό → <strong>νέο chat</strong>, για να μην μπερδεύει τις προηγούμενες.',
        ],
      },
      {
        kind: 'html',
        html: `<div class="block">
  <h2>Τα δύο chatbots</h2>
  <div class="info-grid">
    <div class="info">
      <h3><span class="dot" style="background:#10a37f"></span>ChatGPT</h3>
      <p>Καλό όταν θες να κρατήσει ίδια τη γωνία — γράψ' του ρητά «κράτα ίδια γωνία» και διόρθωσε με κουβέντα. Tip: άνοιξε νέο chat για κάθε νέα φωτό.</p>
      <div class="links"><a href="https://chatgpt.com" target="_blank" rel="noopener">chatgpt.com →</a></div>
    </div>
    <div class="info">
      <h3><span class="dot" style="background:#7c5cc4"></span>Gemini</h3>
      <p>Δωρεάν και πολύ καλό styling. Δώσε του και την κάτοψη με τα τετραγωνικά για ρεαλιστικό αποτέλεσμα. Προσοχή: καμιά φορά αλλάζει τη γωνία — το master prompt το κρατάει σταθερό.</p>
      <div class="links"><a href="https://gemini.google.com" target="_blank" rel="noopener">gemini.google.com →</a></div>
    </div>
  </div>
</div>
<div class="block">
  <h2>Συνδρομές<span class="tag">τι παίρνεις</span></h2>
  <div class="tbl-wrap">
    <table class="ptable">
      <thead>
        <tr><th>Πλάνο</th><th>Τιμή/μήνα</th><th>Για staging</th></tr>
      </thead>
      <tbody>
        <tr><td>ChatGPT Free</td><td class="free">$0</td><td class="muted">~3 εικόνες/μέρα</td></tr>
        <tr><td>ChatGPT Plus</td><td class="price">$20</td><td class="muted">πολύ υψηλότερα όρια εικόνων</td></tr>
        <tr><td>ChatGPT Pro</td><td class="price">$200</td><td class="muted">τα μέγιστα όρια</td></tr>
        <tr><td>Gemini Free</td><td class="free">$0</td><td class="muted">~100 εικόνες/μέρα (Nano Banana)</td></tr>
        <tr><td>Gemini AI Pro</td><td class="price">$19.99</td><td class="muted">πολύ υψηλότερα όρια + Nano Banana Pro</td></tr>
        <tr><td>Gemini AI Ultra</td><td class="price">$99.99</td><td class="muted">τα μέγιστα όρια</td></tr>
      </tbody>
    </table>
  </div>
  <p class="note"><strong>Σημείωση:</strong> τα ακριβή ημερήσια όρια εικόνων αλλάζουν συχνά — OpenAI &amp; Google δεν τα δημοσιεύουν επίσημα, οπότε τα νούμερα είναι ενδεικτικά. Για <strong>δωρεάν</strong> staging, το Gemini δίνει πολύ περισσότερες εικόνες/μέρα. Τιμές σε USD· στην Ελλάδα μπορεί να εμφανίζονται σε € (π.χ. Gemini Pro ≈ €22,99).</p>
  <p class="srcline">Πηγές: <a href="https://chatgpt.com/pricing/" target="_blank" rel="noopener">chatgpt.com/pricing</a> · <a href="https://gemini.google/subscriptions/" target="_blank" rel="noopener">gemini.google/subscriptions</a> · έλεγχος 31 Μαΐ 2026</p>
</div>`,
      },
    ],
  },
  {
    slug: 'estate-ai-furnishing/tools',
    pageKind: 'toolList',
    date: '2026-05-31',
    seoTitle: 'Ειδικά εργαλεία — AI staging',
    seoDescription: 'Εργαλεία φτιαγμένα για virtual staging που κρατάνε σωστά τον χώρο, με συνδρομές.',
    crumb: { label: 'AI staging', to: '/estate-ai-furnishing' },
    heading: 'Ειδικά εργαλεία',
    introHtml:
      'Φτιαγμένα μόνο για staging: ανιχνεύουν τον χώρο, κλειδώνουν τοίχους &amp; παράθυρα και βάζουν μόνο έπιπλα — οπότε κρατάνε σωστή τη γωνία και τα τετραγωνικά.',
    blocks: [
      {
        kind: 'html',
        html: `<div class="block">
  <h2>Τα εργαλεία</h2>
  <div class="info-grid">
    <div class="info">
      <h3>AI HomeDesign</h3>
      <p>Αυτόματο κλείδωμα δομής: κρατάει τοίχους/παράθυρα και ζωγραφίζει μόνο έπιπλα. Πολλά στυλ &amp; τύποι χώρου. Δωρεάν με watermark.</p>
      <div class="links"><a href="https://aihomedesign.com/virtual-staging" target="_blank" rel="noopener">aihomedesign.com →</a></div>
    </div>
    <div class="info">
      <h3>Virtual Staging Art</h3>
      <p>Κρατάει ρητά τοίχους, παράθυρα και γωνία· περιλαμβάνει δωρεάν decluttering. Πληρωμή ανά φωτό, χωρίς συνδρομή.</p>
      <div class="links"><a href="https://www.virtualstaging.art/" target="_blank" rel="noopener">virtualstaging.art →</a></div>
    </div>
    <div class="info">
      <h3>Virtual Stage Design</h3>
      <p>Γρήγορο staging από φωτό με έμφαση στο να μένει σταθερή η αρχιτεκτονική του χώρου. Συνδρομές με full-res, χωρίς watermark.</p>
      <div class="links"><a href="https://virtualstagedesign.com/" target="_blank" rel="noopener">virtualstagedesign.com →</a></div>
    </div>
    <div class="info">
      <h3>Edensign</h3>
      <p>Φτιαγμένο από αρχιτέκτονα: «καταλαβαίνει» τον χώρο σε 3D, κρατάει σταθερά τοίχους/παράθυρα και δουλεύει και από κάτοψη. 2 δωμάτια δωρεάν.</p>
      <div class="links"><a href="https://edensign.io/multi-view-virtual-staging" target="_blank" rel="noopener">edensign.io →</a></div>
    </div>
    <div class="info">
      <h3>Coohom</h3>
      <p>Πλήρες 3D suite: φτιάχνεις τον χώρο από κάτοψη με πραγματικές διαστάσεις, οπότε τα τετραγωνικά μένουν ακριβή. Δωρεάν πλάνο (με watermark).</p>
      <div class="links"><a href="https://www.coohom.com/" target="_blank" rel="noopener">coohom.com →</a></div>
    </div>
  </div>
</div>
<div class="block">
  <h2>Συνδρομές<span class="tag">δωρεάν vs επί πληρωμή</span></h2>
  <div class="tbl-wrap">
    <table class="ptable">
      <thead>
        <tr><th>Εργαλείο</th><th>Δωρεάν</th><th>Φθηνότερο επί πληρωμή</th></tr>
      </thead>
      <tbody>
        <tr><td>AI HomeDesign</td><td class="free">3 φωτό (watermark)</td><td class="muted">από $0.24/φωτό · Pro $35/μήνα (30 φωτό)</td></tr>
        <tr><td>Virtual Staging Art</td><td class="free">δωρεάν δοκιμή</td><td class="muted">από $0.50/φωτό (χωρίς συνδρομή)</td></tr>
        <tr><td>Virtual Stage Design</td><td class="muted">δες στο signup</td><td class="muted">Starter $29.99/μήνα (30 φωτό)</td></tr>
        <tr><td>Edensign</td><td class="free">2 δωμάτια δωρεάν</td><td class="muted">Starter $20/μήνα</td></tr>
        <tr><td>Coohom</td><td class="free">δωρεάν (watermark)</td><td class="muted">Pro ~$25–29/μήνα</td></tr>
      </tbody>
    </table>
  </div>
  <p class="note"><strong>Σημείωση:</strong> οι περισσότερες «δωρεάν» εκδόσεις δίνουν λίγα credits ή watermark — καλές για δοκιμή. Τιμές σε USD, ενδέχεται να αλλάξουν ή να εμφανίζονται σε €. Το Virtual Stage Design δεν διαφημίζει δωρεάν πλάνο — τσέκαρέ το στο signup.</p>
  <p class="srcline">Πηγές: <a href="https://aihomedesign.com/pricing" target="_blank" rel="noopener">aihomedesign</a> · <a href="https://www.virtualstaging.art/" target="_blank" rel="noopener">virtualstaging.art</a> · <a href="https://virtualstagedesign.com/pricing" target="_blank" rel="noopener">virtualstagedesign</a> · <a href="https://edensign.io/pricing" target="_blank" rel="noopener">edensign</a> · <a href="https://www.coohom.com/" target="_blank" rel="noopener">coohom</a> · έλεγχος 31 Μαΐ 2026</p>
</div>`,
      },
    ],
  },
];

/** Resources shown in the landing grid (top-level pages with a card), newest first. */
export const gridResources = resources
  .filter((r) => r.card)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const bySlug = (slug: string) => resources.find((r) => r.slug === slug);
