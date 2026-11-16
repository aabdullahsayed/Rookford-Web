import { hat } from "./hat";
import { jacket } from "./jacket";
import { jeans } from "./jeans";
import { shirt } from "./shirt";
import { DEFAULT_COLOR } from "../helpers";

export function garment(type, color, extra) {
  const c = color && color.b ? color : DEFAULT_COLOR;
  if (type === "jeans") return jeans(c, extra);
  if (type === "jacket") return jacket(c);
  if (type === "shirt") return shirt(c);
  if (type === "hat") return hat(c);
  return jeans(c, extra);
}
