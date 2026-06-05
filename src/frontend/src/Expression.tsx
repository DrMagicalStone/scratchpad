import { BlockMath, InlineMath } from "react-katex";
import type { Expr } from "./App";
import "./Expression.css";
import "katex/dist/katex.min.css"
import { useEffect, useRef } from "react";

export default function Expression({
  expr,
  selected,
  onSelect,
  onMove,
  onBoundingChange
}: {
  expr: Expr;
  selected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onBoundingChange: (width: number, height: number) => void;
}) {
  let dragging = false;

  let ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0].borderBoxSize[0];

      onBoundingChange(entry.inlineSize, entry.blockSize);
    });
    if ((!expr.size) || (ref.current.offsetWidth != expr.size.width) || (ref.current.offsetHeight != expr.size.height)) {
      onBoundingChange(ref.current.offsetWidth, ref.current.offsetHeight);
    }
    observer.observe(ref.current);
  })

  return (
    <div
      ref={ref}
      className={`expr ${selected ? "selected" : ""}`}
      style={{ left: expr.pos.x, top: expr.pos.y }}
      onMouseDown={(e) => {
        dragging = true;
        const startX = e.clientX;
        const startY = e.clientY;

        const move = (ev: MouseEvent) => {
          if (!dragging) return;
          onMove(
            expr.pos.x + (ev.clientX - startX),
            expr.pos.y + (ev.clientY - startY)
          );
        };

        const up = () => {
          dragging = false;
          window.removeEventListener("mousemove", move);
          window.removeEventListener("mouseup", up);
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="method">{expr.definition_method}</div>
      <BlockMath math={expr.latex_expression} renderError={(e) => {
        return (
          <div>{String(e)}</div>
        )
      }}/>
    </div>
  );
}