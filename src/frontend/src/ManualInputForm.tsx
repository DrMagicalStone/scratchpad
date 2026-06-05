import { useState } from "react";
import "./Form.css";

export default function ManualInputForm({
  onClose,
  onSubmit
}: {
  onClose: () => void;
  onSubmit: (content: string) => void;
}) {
  const [text, setText] = useState("");

  return (
    <div className="modal">
      <div className="form">
        <h3>Manual Input</h3>
        <input value={text} onChange={e => setText(e.target.value)} />
        <button onClick={() => onSubmit(text)}>OK</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}