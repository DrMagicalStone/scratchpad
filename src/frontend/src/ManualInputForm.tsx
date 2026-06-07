import { useState } from "react";
import "./Form.css";

export type ManualInputType = "ordinary" | "calculus";

export default function ManualInputForm({
  onClose,
  onSubmit
}: {
  onClose: () => void;
  onSubmit: (content: string, inputType: ManualInputType) => void;
}) {
  const [text, setText] = useState("");
  const [inputType, setInputType] = useState<ManualInputType>("ordinary");

  return (
    <div className="modal">
      <div className="form">
        <h3>Input new expression:</h3>

        <label className="option-row">
          <input
            type="radio"
            name="input-type"
            checked={inputType === "ordinary"}
            onChange={() => setInputType("ordinary")}
          />
          <span>Ordinary / equation input, e.g. x**2 + 2*x = 0</span>
        </label>

        <label className="option-row">
          <input
            type="radio"
            name="input-type"
            checked={inputType === "calculus"}
            onChange={() => setInputType("calculus")}
          />
          <span>Calculus expression input, e.g. x**2 + 2*x</span>
        </label>

        <input value={text} onChange={e => setText(e.target.value)} />
        <button onClick={() => onSubmit(text, inputType)}>OK</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
