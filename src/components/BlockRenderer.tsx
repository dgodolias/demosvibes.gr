import type { Block } from '../data/types';
import PromptCard from './PromptCard';
import Steps from './Steps';
import CardLinks from './CardLinks';

/** Renders an ordered list of content blocks for a resource page. */
export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'prompt':
            return <PromptCard key={i} label={block.label} text={block.text} />;
          case 'steps':
            return <Steps key={i} title={block.title} items={block.items} />;
          case 'prose':
            return (
              <section className="steps" key={i}>
                {block.title && <h2>{block.title}</h2>}
                <div dangerouslySetInnerHTML={{ __html: block.html }} />
              </section>
            );
          case 'cardLinks':
            return <CardLinks key={i} items={block.items} />;
          case 'html':
            return <div key={i} dangerouslySetInnerHTML={{ __html: block.html }} />;
          default:
            return null;
        }
      })}
    </>
  );
}
