import React from "react";

const LazyDuck = React.lazy(() => import("./DuckIcon"));
const LazyPig = React.lazy(() => import("./PigIcon"));
const LazySquirrel = React.lazy(() => import("./SquirrelIcon"));

export default function TiereIcon({ size = "24px", color = "#000" }) {
  const num = Math.floor(Math.random() * 3);
  return (
    <>
      {num === 0 && <LazyDuck size={size} color={color} />}
      {num === 1 && <LazyPig size={size} color={color} />}
      {num === 2 && <LazySquirrel size={size} color={color} />}
    </>
  );
}
