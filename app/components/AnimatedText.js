import React, { useEffect, useState } from 'react';

/**
 * Takes an input label and animates a 3 dot suffix, updating each second.
 *
 * Example:
 *
 * Loading
 *
 * Loading.
 *
 * Loading..
 *
 * Loading...
 *
 * Loading
 *
 * Loading.
 * @param {string} label
 * @param {number} interval
 */
export const AnimatedText = ({ value, interval }) => {
  const [text, setText] = useState(value);

  useEffect(() => {
    const labelInterval = setInterval(() => {
      if (text.slice(-3) === '...') {
        setText(value);
      } else {
        setText(text + '.');
      }
    }, interval);

    return () => clearInterval(labelInterval);
  }, [interval, setText, text, value]);

  return <>{text}</>;
};
