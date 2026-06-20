import type { Resource } from '../data/types';
import Seo from '../components/Seo';
import Crumb from '../components/Crumb';
import BlockRenderer from '../components/BlockRenderer';
import PageFooter from '../components/PageFooter';
import { articleLd, ogImageFor } from '../lib/seo';

/**
 * Generic renderer for ANY content page (prompt / guide / tool-list). The page
 * shape is identical — only the data differs — so all sub-pages share this one
 * component, driven entirely by the Resource object.
 */
export default function ResourcePage({ resource }: { resource: Resource }) {
  return (
    <>
      <Seo
        title={resource.seoTitle}
        description={resource.seoDescription}
        path={'/' + resource.slug}
        ogType={resource.pageKind === 'toolList' ? 'website' : 'article'}
        image={ogImageFor(resource)}
        jsonLd={articleLd(resource)}
      />
      <main className="wrap">
        <section className="subhead">
          <Crumb label={resource.crumb.label} to={resource.crumb.to} />
          <h1>{resource.heading}</h1>
          <p dangerouslySetInnerHTML={{ __html: resource.introHtml }} />
          {resource.headerExtraHtml && (
            <div dangerouslySetInnerHTML={{ __html: resource.headerExtraHtml }} />
          )}
        </section>

        <BlockRenderer blocks={resource.blocks} />

        <PageFooter crumb={resource.crumb} />
      </main>
    </>
  );
}
