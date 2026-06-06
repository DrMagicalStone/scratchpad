import katex from "katex";
import type { Expr } from "./App";
import "./Expression.css";
import "katex/dist/katex.min.css"
import { useEffect, useRef } from "react";

export default function Expression({
  expr,
  selected,
  onSelect,
  onMove,
  onBoundingChange,
  fixed = false
}: {
  expr: Expr;
  selected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onBoundingChange: (width: number, height: number) => void;
  fixed?: boolean
}) {
  let dragging = false;

  let ref = useRef<HTMLDivElement | null>(null);

  let ref_of_latex = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0].borderBoxSize[0];

      onBoundingChange(entry.inlineSize, entry.blockSize);
    });
    onBoundingChange(ref.current.offsetWidth, ref.current.offsetHeight);
    observer.observe(ref.current);

    if (!ref_of_latex.current) {
      return;
    }
    try {
        katex.render(expr.latex_expression, ref_of_latex.current, {
          throwOnError: false,
        });
      } catch (e) {
        ref.current.innerText = String(e);
      }
  }, [expr])

  return (
    <div
      ref={ref}
      className={`expr ${selected ? "selected" : ""} ${fixed ? "item" : ""}`}
      style={{ left: expr.pos.x, top: expr.pos.y }}
      onMouseDown={(e) => {
        if (fixed) {
          return;
        }
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
        if (fixed) {
          return;
        }
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="method">{expr.definition_method}</div>
      <div ref={ref_of_latex}></div>
    </div>
  );
}