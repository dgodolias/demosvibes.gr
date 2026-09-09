import Seo from '../components/Seo';
import Crumb from '../components/Crumb';
import PageFooter from '../components/PageFooter';
import { site } from '../data/site';

/** GDPR privacy policy — linked from the email-gate consent notice. */
export default function PrivacyPage() {
  return (
    <>
      <Seo
        title="Πολιτική Απορρήτου · demosvibes"
        description="Πώς το demosvibes.gr συλλέγει και χρησιμοποιεί το email σου για το newsletter με AI εργαλεία, και τα δικαιώματά σου (GDPR)."
        path="/privacy"
        ogType="website"
      />
      <main id="main-content" className="wrap">
        <section className="subhead">
          <Crumb label="videos" to="/" />
          <h1>Πολιτική Απορρήτου</h1>
          <p>
            Σεβόμαστε το απόρρητό σου. Εδώ σου λέμε με απλά λόγια τι δεδομένα κρατάμε, γιατί, και τι
            δικαιώματα έχεις με βάση τον GDPR.
          </p>
        </section>

        <section className="steps">
          <h2>Ποιοι είμαστε</h2>
          <p>
            Το <strong>demosvibes.gr</strong> είναι προσωπικό project του dgodolias με συνοδευτικό
            υλικό (prompts, οδηγοί, εργαλεία) για τα short-form βίντεό του. Υπεύθυνος επεξεργασίας
            δεδομένων είναι ο dgodolias. Επικοινωνία:{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </section>

        <section className="steps">
          <h2>Τι δεδομένα συλλέγουμε</h2>
          <p>
            Τη <strong>διεύθυνση email</strong> που μας δίνεις στη φόρμα εισόδου, μαζί με την ένδειξη
            συγκατάθεσης, την ημερομηνία αποθήκευσης, την προέλευση της εγγραφής και τη σελίδα από την
            οποία υπέβαλες τη φόρμα. Η προέλευση ξεχωρίζει τις νέες εγγραφές από τη μεταφορά υπαρχουσών
            εγγραφών. Η σελίδα καταγράφεται χωρίς τις παραμέτρους αναζήτησης της διεύθυνσης.
            Όνομα ή τηλέφωνο δεν ζητάμε. Το email δεν είναι υποχρεωτικό. Μπορείς να μπεις και χωρίς αυτό.
          </p>
        </section>

        <section className="steps">
          <h2>Γιατί τα συλλέγουμε</h2>
          <p>
            Για να μπορούμε να σε ενημερώνουμε με νέα prompts, οδηγούς και AI εργαλεία. Νομική βάση
            είναι η <strong>συγκατάθεσή σου</strong> (άρθρο 6 παρ. 1α GDPR), την οποία δίνεις βάζοντας
            το email σου και υποβάλλοντας τη φόρμα εισόδου. Δεν χρησιμοποιούμε το email σου για κανέναν άλλο σκοπό.
          </p>
        </section>

        <section className="steps">
          <h2>Πού αποθηκεύονται</h2>
          <p>
            Το site φιλοξενείται στη <strong>Vercel</strong>, η οποία εκτελεί και το αίτημα εγγραφής.
            Τα στοιχεία των εγγραφών αποθηκεύονται σε βάση δεδομένων <strong>Neon</strong>.
            Δεν πουλάμε και δεν δίνουμε τα δεδομένα σου σε τρίτους για διαφημίσεις.
          </p>
          <p>
            Στον browser σου αποθηκεύουμε επίσης την επιλογή ότι μπήκες στο site, ώστε να μη σου
            εμφανίζεται ξανά η φόρμα στον ίδιο browser. Αυτή η τοπική ρύθμιση δεν περιέχει το email σου.
            Αν διαγράψεις τα δεδομένα του browser ή χρησιμοποιήσεις άλλον browser ή συσκευή, η φόρμα
            μπορεί να εμφανιστεί ξανά. Η διαγραφή αυτής της ρύθμισης δεν διαγράφει την εγγραφή σου.
          </p>
        </section>

        <section className="steps">
          <h2>Τα δικαιώματά σου</h2>
          <ol>
            <li>
              Να ζητήσεις <strong>διαγραφή της εγγραφής σου</strong> όποτε θέλεις, στέλνοντάς μας μήνυμα.
            </li>
            <li>
              Να <strong>ανακαλέσεις τη συγκατάθεσή σου</strong> ανά πάσα στιγμή, χωρίς συνέπειες.
            </li>
            <li>
              Να ζητήσεις <strong>πρόσβαση, διόρθωση ή οριστική διαγραφή</strong> των δεδομένων σου.
            </li>
          </ol>
          <p>
            Για οποιοδήποτε από τα παραπάνω, γράψε μας στο{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </section>

        <PageFooter crumb={{ label: 'videos', to: '/' }} />
      </main>
    </>
  );
}
