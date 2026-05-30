import katex from "katex";
import "katex/dist/katex.min.css";
import { useEffect, useRef } from "react";

type Props = {
  latex: string;
};

export default function Latex({ latex }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(latex, ref.current, {
          throwOnError: false,
        });
      } catch (e) {
        ref.current.innerText = "渲染错误";
      }
    }
  }, [latex]);

  return <div ref={ref} />;
}