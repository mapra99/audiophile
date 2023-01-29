import { useEffect, useState } from 'react';
import timeDiff from '~/utils/time-diff';
import now from '~/utils/now';
import addSeconds from '~/utils/add-seconds';

import type { UseCountdownArgs } from './types'

const useCountdown = ({ target, diffSeconds = 0 }: UseCountdownArgs) => {
  const targetDate = target ? new Date(target) : addSeconds(new Date(), diffSeconds)

  const initialTimeDiff = timeDiff(now(), targetDate)
  const [countdown, setCountdown] = useState(initialTimeDiff)

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeDiff = timeDiff(now(), targetDate)

      if (newTimeDiff >= 0) {
        setCountdown(newTimeDiff);
      } else {
        clearInterval(interval)
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return getReturnValues(countdown);
};

const getReturnValues = (countdown: number) => {
  const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countdown % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

export default useCountdown;
