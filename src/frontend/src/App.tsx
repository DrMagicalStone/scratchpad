import { useEffect, useState } from "react";
import Expression from "./Expression";
import Toolbar from "./Toolbar";
import ManualInputForm, { type ManualInputType } from "./ManualInputForm";
import ResultantForm from "./ResultantForm";
import SolveForm from "./SolveForm";
import RemoveForm from "./RemoveForm";
import VariableTransformForm from "./VariableTransformForm";
import "./App.css";
import "./Form.css";

export type Expr = {
  id: string;
  definition_method: string;
  latex_expression: string;
  base_ids: string[];
  pos: {
    x: number;
    y: number;
  };
};

type ResultantState = [boolean, string | null, string | null];
type CalculusMethod = "differentiate" | "integrate";

export default function App() {
  const [exprs, setExprs] = useState<Expr[]>([]);
  const [sizes, setSizes] = useState<Map<string, [number, number]>>(new Map());
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [showManual, setShowManual] = useState(false);
  const [showResultant, setShowResultant] = useState<ResultantState>([false, null, null]);
  const [showSolve, setShowSolve] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showCalculus, setShowCalculus] = useState<CalculusMethod | null>(null);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const addExpr = (...newExprs: Expr[]) => {
    setExprs(current => [...current, ...newExprs]);
  };

  const getExpr: (r: Response) => Promise<Expr> = async (r: Response) => {
    const body = await r.json().catch(() => null);

    if (!r.ok) {
      const message = body?.detail ?? `Request failed with status ${r.status}`;
      alert(message);
      throw new Error(message);
    }

    const exp = body as Expr;
    const baseIds: string[] = exp.base_ids ?? [];

    const bases = baseIds
      .map((id) => exprs.find(existing => existing.id === id))
      .filter((existing): existing is Expr => existing !== undefined);

    let x = 100;
    let y = 100;

    if (bases.length > 0) {
      const sum = bases.reduce<[number, number]>((acc, existing) => {
        return [acc[0] + existing.pos.x, acc[1] + existing.pos.y];
      }, [0, 0]);

      x = sum[0] / bases.length;
      y = sum[1] / bases.length + 100;
    }

    exp.pos = { x, y };
    return exp;
  };

  useEffect(() => {
    fetch("/api/expressions_id")
      .then(res => res.json())
      .then((data: string[]) => {
        Promise.all(data.map((id: string) => {
          return fetch(`/api/expression/${id}`).then(getExpr);
        })).then((loadedExprs) => addExpr(...loadedExprs));
      });
  }, []);

  function getEdgePoint(expFrom: Expr, expTo: Expr) {
    const fromSize = sizes.get(expFrom.id);
    const toSize = sizes.get(expTo.id);

    if (!fromSize || !toSize) {
      return;
    }

    const from = new DOMRectReadOnly(expFrom.pos.x, expFrom.pos.y, fromSize[0], fromSize[1]);
    const to = new DOMRectReadOnly(expTo.pos.x, expTo.pos.y, toSize[0], toSize[1]);

    const dx = to.x - from.x;
    const dy = to.y - from.y;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    let x = to.x + to.width / 2;
    let y = to.y + to.height / 2;

    if (absDx / to.width > absDy / to.height) {
      x += dx > 0 ? -to.width / 2 : to.width / 2;
      y += absDx === 0 ? 0 : (-dy / absDx) * (to.width / 2);
    } else {
      y += dy > 0 ? -to.height / 2 : to.height / 2;
      x += absDy === 0 ? 0 : (-dx / absDy) * (to.height / 2);
    }

    return { x, y };
  }

  const selectedIds = [...selected];

  return (
    <div className="app">
      <Toolbar
        selectedCount={selected.size}
        onManual={() => setShowManual(true)}
        onResultant={(e0, e1) => setShowResultant([true, e0, e1])}
        onSolve={() => setShowSolve(true)}
        onRemove={() => setShowRemove(true)}
        onCalculus={(method) => setShowCalculus(method)}
        addExpr={addExpr}
        getExpr={getExpr}
        selectedIds={selectedIds}
      />

      <div className="canvas">
        <svg className="edges">
          <defs>
            <marker
              id="arrow"
              markerWidth="10"
              markerHeight="10"
              refX="10"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L10,5 L0,10 Z" fill="#333" />
            </marker>
          </defs>
          {exprs.map(to =>
            to.base_ids.map(dep => {
              const from = exprs.find(x => x.id === dep);
              if (!from) return null;

              const posFrom = getEdgePoint(to, from);
              const posTo = getEdgePoint(from, to);

              if (!posFrom || !posTo) {
                return null;
              }

              return (
                <line
                  key={dep + to.id}
                  x1={posFrom.x}
                  y1={posFrom.y}
                  x2={posTo.x}
                  y2={posTo.y}
                  stroke="black"
                  strokeWidth={2}
                  markerEnd="url(#arrow)"
                />
              );
            })
          )}
        </svg>

        {exprs.map(expr => (
          <Expression
            key={expr.id}
            expr={expr}
            selected={selected.has(expr.id)}
            onSelect={() => toggleSelect(expr.id)}
            onMove={(x, y) => {
              setExprs(current => current.map(e =>
                e.id === expr.id ? { ...e, pos: { x, y } } : e
              ));
            }}
            onBoundingChange={(w, h) => {
              const newSizes = new Map(sizes);
              newSizes.set(expr.id, [w, h]);
              setSizes(newSizes);
            }}
          />
        ))}
      </div>

      {showManual && (
        <ManualInputForm
          onClose={() => setShowManual(false)}
          onSubmit={(content: string, inputType: ManualInputType) => {
            fetch("/api/expressions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ method: "manual input", data: { content, input_type: inputType } })
            }).then(getExpr).then(addExpr);
            setShowManual(false);
          }}
        />
      )}

      {showResultant[0] && (
        <ResultantForm
          onClose={() => setShowResultant([false, null, null])}
          onSubmit={(gen) => {
            fetch("/api/expressions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                method: "resultant",
                data: { id_expression_0: showResultant[1], id_expression_1: showResultant[2], gen }
              })
            }).then(getExpr).then(addExpr);
            setShowResultant([false, null, null]);
          }}
        />
      )}

      {showSolve && (
        <SolveForm
          onClose={() => setShowSolve(false)}
          onSubmit={(symbols) => {
            fetch("/api/expressions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ method: "solve", data: { id_expression: selectedIds[0], symbols: symbols.split(" ").filter(Boolean) } })
            }).then(getExpr).then(addExpr);
            setShowSolve(false);
          }}
        />
      )}

      {showCalculus && (
        <VariableTransformForm
          title={showCalculus === "differentiate" ? "Differentiate with respect to:" : "Integrate with respect to:"}
          onClose={() => setShowCalculus(null)}
          onSubmit={(gen) => {
            fetch("/api/expressions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ method: showCalculus, data: { id_expression_from: selectedIds[0], gen } })
            }).then(getExpr).then(addExpr);
            setShowCalculus(null);
          }}
        />
      )}

      {showRemove && (
        <RemoveForm
          exprs={exprs}
          selectedIds={selectedIds}
          onClose={() => setShowRemove(false)}
          onSubmit={(affectedIds) => {
            const selectedId = selectedIds[0];
            fetch(`/api/expression/${selectedId}`, {
              method: "DELETE",
              headers: {}
            }).then((r) => {
              if (!r.ok) {
                alert(`Remove failed with status ${r.status}`);
                return;
              }

              setExprs(current => current.filter(e => !affectedIds.has(e.id) && e.id !== selectedId));
              setSelected(new Set());
            });
            setShowRemove(false);
          }}
        />
      )}
    </div>
  );
}
