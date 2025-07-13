import { useEffect, useState } from "react";

export const  CountdownTimer= ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  function getTimeRemaining() {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    return diff > 0 ? diff : 0;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="countdownTimer">
      Tiempo restante: {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}
