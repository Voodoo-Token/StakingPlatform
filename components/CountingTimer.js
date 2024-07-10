import React, { useEffect, useState } from 'react';

const CountingTimer = ({ startDate }) => {
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    const updateElapsedTime = () => {
      const now = new Date();
      const start = new Date(startDate);
      const diff = now - start;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);

      setElapsedTime(`Active Since: ${days} days, ${hours} hours, ${mins} mins`);
    };

    // Update the elapsed time every minute
    const intervalId = setInterval(updateElapsedTime, 60000);

    // Set initial elapsed time immediately
    updateElapsedTime();

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [startDate]);

  return (
    <div className="text-center mt-12">
      <h1 className="text-4xl mb-8 text-white">{elapsedTime}</h1>
    </div>
  );
};

export default CountingTimer;