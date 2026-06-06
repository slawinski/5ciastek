import { r as reactExports } from "../_libs/react.mjs";
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = reactExports.useState(value);
  reactExports.useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay]
    // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}
export {
  useDebounce as u
};
