import moment from 'moment-timezone';

export const getMessageTime = timeStampWithTimeZone => {
  if (!timeStampWithTimeZone) return null;
  const time = timeStampWithTimeZone.substring(
    0,
    timeStampWithTimeZone.lastIndexOf(' '),
  );
  const zone = timeStampWithTimeZone.substring(
    timeStampWithTimeZone.lastIndexOf(' ') + 1,
    timeStampWithTimeZone.length,
  );
  const timestamp = moment.tz(time, zone).format();

  const msgTime = new Date(timestamp);
  const msgMonth = msgTime.getMonth();
  const msgDate = msgTime.getDate();
  const curTime = new Date();

  if (
    msgTime.getFullYear() === curTime.getFullYear() &&
    msgMonth === curTime.getMonth() &&
    msgDate === curTime.getDate()
  ) {
    let hours = msgTime.getHours();
    const meridiem = hours >= 12 ? 'pm' : 'am';
    if (hours > 12) hours -= 12;

    let minutes = msgTime.getMinutes();
    if (minutes < 10) minutes = `0${minutes}`;

    return `${hours}:${minutes} ${meridiem}`;
  }

  return `${msgMonth + 1}월 ${msgDate}일`;
};

export const extraFunction = () => {};
