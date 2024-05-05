import React from "react";

const LazyCafe = React.lazy(() => import("./CafeIcon"));
const LazyRestaurant = React.lazy(() => import("./RestaurantIcon"));

export default function RestaurantIcon({ size = "24px", color = "#000" }) {
  const num = Math.floor(Math.random() * 2);
  return (
    <>
      {num === 0 && <LazyCafe size={size} color={color} />}
      {num === 1 && <LazyRestaurant size={size} color={color} />}
    </>
  );
}
