import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  mistype?: string;
  mistypeKeepLength?: number;
  suffix?: string;
  className?: string;
  speed?: number;
  backspaceSpeed?: number;
  startDelay?: number;
  pauseBeforeBackspace?: number;
  pauseBeforeRetype?: number;
  pauseBeforeSuffix?: number;
  pauseBeforeSuffixBackspace?: number;
  animate?: boolean;
}

export default function TypewriterText({
  text,
  mistype,
  mistypeKeepLength = 0,
  suffix,
  className,
  speed = 90,
  backspaceSpeed = 45,
  startDelay = 400,
  pauseBeforeBackspace = 500,
  pauseBeforeRetype = 250,
  pauseBeforeSuffix = 600,
  pauseBeforeSuffixBackspace = 500,
  animate = true,
}: TypewriterTextProps) {
  const [display, setDisplay] = useState(animate ? "" : text);

  useEffect(() => {
    if (!animate) {
      setDisplay(text);
      return;
    }
    setDisplay("");
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const after = (ms: number, fn: () => void) => {
      timeouts.push(setTimeout(() => !cancelled && fn(), ms));
    };

    const typeOut = (str: string, charSpeed: number, onDone: () => void, fromIndex = 0) => {
      let i = fromIndex;
      const step = () => {
        i += 1;
        setDisplay(str.slice(0, i));
        if (i < str.length) after(charSpeed, step);
        else onDone();
      };
      after(charSpeed, step);
    };

    const backspaceTo = (fromLength: number, toLength: number, charSpeed: number, onDone: () => void) => {
      let i = fromLength;
      const step = () => {
        i -= 1;
        setDisplay(str => str.slice(0, i));
        if (i > toLength) after(charSpeed, step);
        else onDone();
      };
      after(charSpeed, step);
    };

    const playSuffix = () => {
      if (!suffix) return;
      after(pauseBeforeSuffix, () => {
        typeOut(text + suffix, speed, () => {
          after(pauseBeforeSuffixBackspace, () => {
            backspaceTo(text.length + suffix.length, text.length, backspaceSpeed, () => {});
          });
        }, text.length);
      });
    };

    after(startDelay, () => {
      if (mistype) {
        typeOut(mistype, speed, () => {
          after(pauseBeforeBackspace, () => {
            backspaceTo(mistype.length, mistypeKeepLength, backspaceSpeed, () => {
              after(pauseBeforeRetype, () => {
                typeOut(text, speed, playSuffix, mistypeKeepLength);
              });
            });
          });
        });
      } else {
        typeOut(text, speed, playSuffix);
      }
    });

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [
    text,
    mistype,
    mistypeKeepLength,
    suffix,
    speed,
    backspaceSpeed,
    startDelay,
    pauseBeforeBackspace,
    pauseBeforeRetype,
    pauseBeforeSuffix,
    pauseBeforeSuffixBackspace,
    animate,
  ]);

  return (
    <span className={className}>
      {display}
      <span className="cursor-blink" aria-hidden>
        |
      </span>
    </span>
  );
}
