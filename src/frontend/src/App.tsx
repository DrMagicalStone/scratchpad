import { useEffect, useState } from "react";
import Expression from "./Expression";
import Toolbar from "./Toolbar";
import ManualInputForm from "./ManualInputForm";
import ResultantForm from "./ResultantForm";
import "./App.css";

export type Expr = {
  id: string;
  definition_method: string;
  latex_expression: string;
  base_ids: string[];
  pos: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  }
};

export default function App() {
  const [exprs, setExprs] = useState<Expr[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [showManual, setShowManual] = useState(false);
  const [showResultant, setShowResultant] = useState<[Boolean, String | null, String | null]>([false, null, null]);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const addExpr = (...expr: Expr[]) => {
    setExprs([...exprs, ...expr]);
  };

  const getExpr: (r: Response) => Promise<Expr> = async (r: Response) => {
    let exp = await r.json();
    exp.pos = {
      x: 100,
      y: 100
    };

    return exp;
  }

  useEffect(() => {
    fetch("/api/expressions_id")
      .then(res => res.json())
      .then((data: [string]) => {
        Promise.all(data.map((id: string) => {
          return fetch(`/api/expression/${id}`)
            .then(getExpr);
        })).then((exprs) => addExpr(...exprs));
      });
  }, []);

  function getEdgePoint(exp_from: Expr, exp_to: Expr) {

    let from = new DOMRectReadOnly(exp_from.pos.x, exp_from.pos.y, exp_from.size.width, exp_from.size.height);
    let to = new DOMRectReadOnly(exp_to.pos.x, exp_to.pos.y, exp_to.size.width, exp_to.size.height);
    
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    let x = to.x + to.width / 2;
    let y = to.y + to.height / 2;

    if (absDx / to.width > absDy / to.height) {
      // 左右边
      x += dx > 0 ? -to.width / 2 : to.width / 2;
      y += (-dy / absDx) * (to.width / 2);
    } else {
      // 上下边
      y += dy > 0 ? -to.height / 2 : to.height / 2;
      x += (-dx / absDy) * (to.height / 2);
    }

    return { x, y };
  }

  return (
    <div className="app">
      <Toolbar
        selectedCount={selected.size}
        onManual={() => setShowManual(true)}
        onResultant={(e_0, e_1) => setShowResultant([true, e_0, e_1])}
        addExpr={addExpr}
        getExpr={getExpr}
        selectedIds={[...selected]}
      />

      <div className="canvas">
        {/* 画箭头 */}
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
              if ((!from) || (!from.size) || (!to.size)) return null;
              
              let pos_from = getEdgePoint(to, from);
              let pos_to = getEdgePoint(from, to);

              return (
                <line
                  key={dep + to.id}
                  x1={pos_from.x}
                  y1={pos_from.y}
                  x2={pos_to.x}
                  y2={pos_to.y}
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
              setExprs(exprs.map(e =>
                e.id === expr.id ? { ...e, pos: { x, y } } : e
              ));
            }}
            onBoundingChange={(w, h) => {
              setExprs(exprs.map(e =>
                e.id === expr.id ? { ...e, size: { width: Math.round(w), height: Math.round(h) } } : e
              ));
            }}
          />
        ))}
      </div>

      {showManual && (
        <ManualInputForm
          onClose={() => setShowManual(false)}
          onSubmit={async (content) => {
            fetch("/api/expressions", {
              method: "POST", headers: {
                "Content-Type": "application/json",
              }, body: JSON.stringify({ method: "manual input", data: content })
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
              method: "POST", headers: {
                "Content-Type": "application/json",
              }, body: JSON.stringify({ method: "resultant", data: { id_expression_0: showResultant[1], id_expression_1: showResultant[2], gen } })
            }).then(getExpr).then(addExpr);
            setShowResultant([false, null, null]);
          }}
        />
      )}
    </div>
  );
}