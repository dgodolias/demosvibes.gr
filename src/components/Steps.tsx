/** Numbered "Οδηγίες" list. Items may contain inline HTML (<strong>, <code>). */
export default function Steps({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="steps">
      <h2>{title}</h2>
      <ol>
        {items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ol>
    </section>
  );
}
