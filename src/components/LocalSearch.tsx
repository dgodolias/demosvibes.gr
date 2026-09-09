import { useId, useRef } from 'react';

import '../search.css';

interface LocalSearchProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  id?: string;
}

export default function LocalSearch({ value, onChange, label, placeholder = 'Τίτλος, εργαλείο ή θέμα…', id }: LocalSearchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="local-search">
      <label htmlFor={inputId}>{label}</label>
      <div className="local-search-field">
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
        <input ref={inputRef} id={inputId} type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete="off" maxLength={180} />
        {value && <button className="local-search-clear" type="button" onClick={() => { onChange(''); inputRef.current?.focus(); }} aria-label={`Καθαρισμός: ${label}`}>×</button>}
      </div>
    </div>
  );
}
