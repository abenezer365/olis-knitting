import { useEffect } from "react";

export const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const listener = (event) => {
      // Ignore clicks inside the referenced element
      if (!ref.current || ref.current.contains(event.target)) return;
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
