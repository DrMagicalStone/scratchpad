import { useState } from "react";
import "./Form.css";

export default function VariableTransformForm({
  title,
  onClose,
  onSubmit
}: {
  title: string;
  onClose: () => void;
  onSubmit: (gen: string) => void;
}) {
  const [gen, setGen] = useState("x");

  return (
    <div className="modal">
      <div className="form">
        <h3>{title}</h3>
        <p>Input the variable, for example x:</p>
        <input value={gen} onChange={e => setGen(e.target.value)} />
        <button onClick={() => onSubmit(gen)}>OK</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
