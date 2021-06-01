function getRandomInteger (min, max) {
  if (max === min) {
    return 'Начало и конец диапазона равны. Вызовите функцию с другими аргументами.';
  }
  if (max < 0 || min < 0) {
    return 'Диапазон может быть только положительным';
  }
  if (min > max) {
    const count = max;
    max = min;
    min = count;
  }
  const number = Math.floor(min + Math.random() * (max + 1 - min));
  return number;
}

function getRandomFloat (min, max, digits) {
  if (max === min) {
    return 'Начало и конец диапазона равны. Вызовите функцию с другими аргументами.';
  }
  if (max < 0 || min < 0) {
    return 'Диапазон может быть только положительным';
  }
  if (min > max) {
    const count = max;
    max = min;
    min = count;
  }
  // eslint-disable-next-line prefer-template
  const number = Math.min(min + (Math.random() * (max - min + parseFloat('1e-' + ((Math.random() + '').length - 1)))), max);
  return parseFloat(number.toFixed(digits));
}

getRandomInteger(0,1);
getRandomFloat(0,2,4);
