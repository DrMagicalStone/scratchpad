import type { Expr } from "./App";
import "./Toolbar.css";

export default function Toolbar({
  selectedCount,
  onManual,
  onResultant,
  onSolve,
  onRemove,
  onCalculus,
  addExpr,
  getExpr,
  selectedIds
}: {
  selectedCount: number;
  onManual: () => void;
  onResultant: (e_0: string, e_1: string) => void;
  onSolve: () => void;
  onRemove: () => void;
  onCalculus: (method: "differentiate" | "integrate") => void;
  addExpr: (...expr: Expr[]) => void;
  getExpr: (r: Response) => Promise<Expr>;
  selectedIds: string[];
}) {
  const one = selectedCount === 1;
  const two = selectedCount === 2;

  const onClick = (method: string) => {
    fetch("/api/expressions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ method, data: selectedIds[0] })
    }).then(getExpr).then(addExpr);
  };

  return (
    <div className="toolbar">
      <button onClick={onManual}>Manual Input</button>

      <button disabled={!one} onClick={() => onClick("factor")}>Factor</button>
      <button disabled={!one} onClick={() => onClick("expand")}>Expand</button>
      <button disabled={!one} onClick={() => onClick("cancel")}>Cancel</button>
      <button disabled={!one} onClick={() => onClick("together")}>Together</button>
      <button disabled={!one} onClick={() => onClick("apart")}>Apart</button>
      <button disabled={!one} onClick={onSolve}>Solve</button>

      <button disabled={!one} onClick={() => onCalculus("differentiate")}>Differentiate</button>
      <button disabled={!one} onClick={() => onCalculus("integrate")}>Integrate</button>

      <button disabled={!two} onClick={() => onResultant(selectedIds[0], selectedIds[1])}>
        Resultant
      </button>
      <div className="divider" />
      <button disabled={!one} onClick={onRemove}>Remove</button>
    </div>
  );
}
