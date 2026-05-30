import { useState } from "react";

type Expr = {
  id: number;
  latex: string;
  visible: boolean;
};

export default function App() {
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [dragging, setDragging] = useState(false);

  const [exprs, setExprs] = useState<Expr[]>([
    { id: 1, latex: "\\frac{a}{b}", visible: true },
    { id: 2, latex: "x^2 + y^2 = z^2", visible: true },
  ]);

  // 拖拽改变宽度
  const onMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setSidebarWidth(Math.max(150, e.clientX));
    }
  };

  const onMouseUp = () => setDragging(false);

  // 挂全局监听
  if (typeof window !== "undefined") {
    window.onmousemove = onMouseMove;
    window.onmouseup = onMouseUp;
  }

  // 添加表达式
  const addExpr = () => {
    const id = Date.now();
    setExprs([...exprs, { id, latex: "a+b", visible: true }]);
  };

  // 删除表达式
  const removeExpr = (id: number) => {
    setExprs(exprs.filter(e => e.id !== id));
  };

  // 切换显示
  const toggleVisible = (id: number) => {
    setExprs(
      exprs.map(e =>
        e.id === id ? { ...e, visible: !e.visible } : e
      )
    );
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* 顶部工具栏 */}
      <div
        style={{
          height: 50,
          background: "#222",
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <button style={{ marginRight: 10 }}>功能1</button>
        <button style={{ marginRight: 10 }}>功能2</button>
        <button>功能3</button>
      </div>

      <div style={{ flex: 1, display: "flex" }}>
        
        {/* 左侧导航栏 */}
        <div
          style={{
            width: sidebarWidth,
            background: "#f4f4f4",
            borderRight: "1px solid #ccc",
            padding: 10,
            overflow: "auto",
          }}
        >
          <h3>表达式列表</h3>

          <button onClick={addExpr}>+ 添加</button>

          {exprs.map(expr => (
            <div
              key={expr.id}
              style={{
                border: "1px solid #ddd",
                marginTop: 10,
                padding: 5,
                background: "white",
              }}
            >
              <div style={{ fontFamily: "monospace" }}>
                {expr.latex}
              </div>

              <div style={{ marginTop: 5 }}>
                <button onClick={() => toggleVisible(expr.id)}>
                  {expr.visible ? "隐藏" : "显示"}
                </button>

                <button
                  onClick={() => removeExpr(expr.id)}
                  style={{ marginLeft: 5 }}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 拖拽条 */}
        <div
          onMouseDown={() => setDragging(true)}
          style={{
            width: 5,
            cursor: "col-resize",
            background: "#ccc",
          }}
        />

        {/* 主区域 */}
        <div style={{ flex: 1, padding: 20 }}>
          <h1>主内容区域</h1>
          <p>这里之后可以渲染数学表达式、图形等。</p>
        </div>
      </div>
    </div>
  );
}