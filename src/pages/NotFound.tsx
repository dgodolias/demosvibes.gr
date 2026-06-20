import Seo from '../components/Seo';
import Crumb from '../components/Crumb';
import PageFooter from '../components/PageFooter';

export default function NotFound() {
  return (
    <>
      <Seo title="Δεν βρέθηκε · demosvibes" description="Η σελίδα δεν βρέθηκε." path="/404" ogType="website" />
      <main className="wrap">
        <section className="subhead">
          <Crumb label="videos" to="/" />
          <h1>Δεν βρέθηκε</h1>
          <p>Η σελίδα που έψαξες δεν υπάρχει (πια). Γύρνα στην αρχική και ψάξε από εκεί.</p>
        </section>
        <PageFooter crumb={{ label: 'videos', to: '/' }} />
      </main>
    </>
  );
}
