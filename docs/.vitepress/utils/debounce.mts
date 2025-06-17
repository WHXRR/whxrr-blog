export default function debounce(fn, delay, immediate = false) {
  let timer;
  return function (...args) {
    const context = this;
    if (timer) clearTimeout(timer);
    
    if (immediate && !timer) {
      fn.apply(context, args);
    }
    
    timer = setTimeout(() => {
      if (!immediate) fn.apply(context, args);
      timer = null;
    }, delay);
  };
};