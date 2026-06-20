import CopyButton from './CopyButton';

/** Dark code card with a labelled toolbar + Copy button and the prompt <pre>. */
export default function PromptCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="prompt-card">
      <div className="toolbar">
        <span className="label">{label}</span>
        <CopyButton text={text} />
      </div>
      <pre>{text}</pre>
    </div>
  );
}
