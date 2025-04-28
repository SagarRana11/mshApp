import React, { useState, useEffect, useRef } from 'react';
import { Text } from 'react-native';

const AlarmRaiseTimer = props => {
  const timerRef = useRef({});
  let timer;
  const [timerState, setTimerState] = useState({
    day: '00',
    hours_counter: '00',
    minutes_Counter: '00',
    seconds_Counter: '00',
  });

  const { AlarmRaisedTime, showTimer, AlarmUpdatedOn, index, style } = props;

  useEffect(() => {
    calculateTime();

    return () => {
      if (timerRef.current.hasOwnProperty(index) && timerRef.current[index] === timer) {
        clearInterval(timerRef.current[index]);
        delete timerRef.current[index];
      }
    };
  }, [index]);

  const calculateTime = () => {
    let duration = showTimer
      ? new Date() - new Date(AlarmRaisedTime)
      : new Date(AlarmUpdatedOn) - new Date(AlarmRaisedTime);

    if (duration < 0) duration = 0;

    let seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60),
      hours = parseInt((duration / (1000 * 60 * 60)) % 24),
      days = parseInt(duration / (1000 * 60 * 60 * 24));

    const day = days < 10 ? '0' + days : String(days);
    const hr = hours < 10 ? '0' + hours : String(hours);
    const min = minutes < 10 ? '0' + minutes : String(minutes);
    const sec = seconds < 10 ? '0' + seconds : String(seconds);

    setTimerState({
      day,
      hours_counter: hr,
      minutes_Counter: min,
      seconds_Counter: sec,
    });

    if (showTimer) startTimer();
  };

  const startTimer = () => {
    timer = setInterval(() => {
      let duration = new Date() - new Date(AlarmRaisedTime);
      if (duration < 0) duration = 0;

      let seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24),
        days = parseInt(duration / (1000 * 60 * 60 * 24));

      const day = days < 10 ? '0' + days : String(days);
      const hr = hours < 10 ? '0' + hours : String(hours);
      const min = minutes < 10 ? '0' + minutes : String(minutes);
      const sec = seconds < 10 ? '0' + seconds : String(seconds);

      setTimerState({
        day,
        hours_counter: hr,
        minutes_Counter: min,
        seconds_Counter: sec,
      });
    }, 1000);

    if (!timerRef.current.hasOwnProperty(index)) {
      timerRef.current[index] = timer;
    }
  };

  const { hours_counter, minutes_Counter, seconds_Counter, day } = timerState;
  return (
    <Text style={style}>
      {day}:{hours_counter}:{minutes_Counter}:{seconds_Counter}
    </Text>
  );
};

export default AlarmRaiseTimer;
