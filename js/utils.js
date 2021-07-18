const ALERT_SHOW_TIME = 10000;

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

function getRandomArrayElement (elements) {
  return elements[getRandomInteger(0, elements.length-1)];
}

function getRandomArrayFromArray (elements) {
  return new Array(getRandomInteger('',elements.length)).fill('').map(() => getRandomArrayElement(elements));
}

function setElementsDisabled (elements) {
  Array.from(elements).forEach((element) => element.setAttribute('disabled', 'disabled'));
}

function setElementsEnabled (elemets) {
  Array.from(elemets).forEach((element) => element.removeAttribute('disabled'));
}

function isEscEvent (evt) {
  return evt.key === 'Escape' || evt.key === 'Esc';
}

function renderAlert (error) {
  const alertWindow = document.createElement('div');
  alertWindow.style.zIndex = '1000';
  alertWindow.style.position = 'absolute';
  alertWindow.style.left = '50px';
  alertWindow.style.top = '50px';
  alertWindow.style.minWidth = '50px';
  alertWindow.style.padding = '6px 16px';
  alertWindow.style.borderRadius = '4px';
  alertWindow.style.backgroundColor = '#333';
  alertWindow.style.color = '#fff';
  alertWindow.style.fontSize = '16px';
  alertWindow.style.boxShadow = '0px 3px 5px 0px rgb(0 0 0 / 20%)';

  alertWindow.textContent = error;

  document.body.appendChild(alertWindow);

  setTimeout(() => {
    alertWindow.remove();
  }, ALERT_SHOW_TIME);
}

export {getRandomArrayElement, getRandomArrayFromArray, getRandomFloat, getRandomInteger, setElementsEnabled, setElementsDisabled, isEscEvent, renderAlert};
