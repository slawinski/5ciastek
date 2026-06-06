import { j as jsxRuntimeExports } from "../_libs/react.mjs";
const container = "_container_1696c_1";
const label = "_label_1696c_8";
const input = "_input_1696c_15";
const styles = {
  container,
  label,
  "input-wrapper": "_input-wrapper_1696c_15",
  input
};
const InputField = ({
  label: label2,
  id,
  name,
  className,
  ref,
  ...props
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.container, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: id, className: styles.label, children: label2 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles["input-wrapper"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        name,
        id,
        className: `${styles.input} ${className || ""}`.trim(),
        ref,
        ...props
      }
    ) })
  ] });
};
export {
  InputField as I
};
