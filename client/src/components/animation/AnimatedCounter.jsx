import { useEffect, useState } from "react";

const AnimatedCounter = ({
  end = 0,
  duration = 2000,
  prefix = "",
  suffix = "",
  className = "",
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const endValue = Number(end) || 0;

    if (endValue === 0) {
      setCount(0);
      return;
    }

    const increment = endValue / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= endValue) {
        start = endValue;
        clearInterval(timer);
      }

      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;