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
      <main className="wrap">
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
            Μόνο τη <strong>διεύθυνση email</strong> που μας δίνεις μόνος σου στη φόρμα εισόδου, μαζί
            με την ένδειξη ότι είπες ναι στο newsletter. Όνομα, τηλέφωνο ή άλλα προσωπικά στοιχεία δεν
            ζητάμε. Το email δεν είναι υποχρεωτικό. Μπορείς να μπεις και χωρίς αυτό.
          </p>
        </section>

        <section className="steps">
          <h2>Γιατί τα συλλέγουμε</h2>
          <p>
            Για να σου στέλνουμε ένα newsletter με νέα prompts, οδηγούς και AI εργαλεία. Νομική βάση
            είναι η <strong>συγκατάθεσή σου</strong> (άρθρο 6 παρ. 1α GDPR), την οποία δίνεις βάζοντας
            το email σου στη φόρμα εισόδου. Δεν χρησιμοποιούμε το email σου για κανέναν άλλο σκοπό.
          </p>
        </section>

        <section className="steps">
          <h2>Πού αποθηκεύονται</h2>
          <p>
            Τα emails τα μαζεύει η υπηρεσία <strong>Netlify Forms</strong> (Netlify, Inc.) και μένουν
            με ασφάλεια στους servers της. Δεν πουλάμε και δεν δίνουμε τα δεδομένα σου σε τρίτους για
            διαφημίσεις.
          </p>
        </section>

        <section className="steps">
          <h2>Τα δικαιώματά σου</h2>
          <ol>
            <li>
              Να <strong>διαγραφείς</strong> από το newsletter όποτε θέλεις — με ένα κλικ στον σύνδεσμο
              διαγραφής κάθε email, ή στέλνοντάς μας μήνυμα.
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
