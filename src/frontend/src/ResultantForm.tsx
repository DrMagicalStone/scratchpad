import { useState } from "react";
import "./Form.css";

export default function ResultantForm({
  onClose,
  onSubmit
}: {
  onClose: () => void;
  onSubmit: (v: string) => void;
}) {
  const [v, setV] = useState("");

  return (
    <div className="modal">
      <div className="form">
        <h3>Input gen(The velue to be eliminated)</h3>
        <input value={v} onChange={e => setV(e.target.value)} />
        <button onClick={() => onSubmit(v)}>OK</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}