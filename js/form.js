import { setMapStartPosition, setMapFiltersStartPosition, mainMarker } from './map.js';
import { isEscEvent } from './utils.js';
import { sendData } from './api.js';

const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const MAX_PRICE_VALUE = 1000000;
const LOCATION_PRECISENESS = 5;
const CUSTOM_VALIDITY_SHADOW = '0 0 2px 0 #ff2a00';

const TYPES = {
  bungalow: {
    name: 'Бунгало',
    value: 'bungalow',
    minPrice: 0,
  },
  flat: {
    name: 'Квартира',
    value: 'flat',
    minPrice: 1000,
  },
  hotel: {
    name: 'Отель',
    value: 'hotel',
    minPrice: 3000,
  },
  house: {
    name: 'Дом',
    value: 'house',
    minPrice: 5000,
  },
  palace: {
    name: 'Дворец',
    value: 'palace',
    minPrice: 10000,
  },
};

const ROOM_CAPACITIES = {
  1: ['1'],
  2: ['1', '2'],
  3: ['1', '2', '3'],
  100: ['0'],
};

const form = document.querySelector('.ad-form');
const offerTitle = form.querySelector('#title');
const offerAddress = form.querySelector('#address');
const offerType = form.querySelector('#type');
const offerPrice = form.querySelector('#price');
const offerRoomNumber = form.querySelector('#room_number');
const capacity = form.querySelector('#capacity');
const formReset = form.querySelector('.ad-form__reset');
const timein = form.querySelector('#timein');
const timeout = form.querySelector('#timeout');

const mainMarkerStartCoordinates = mainMarker.getLatLng();
offerAddress.value = `${mainMarkerStartCoordinates.lat} и ${mainMarkerStartCoordinates.lng}`;
offerAddress.setAttribute('placeholder', `${mainMarkerStartCoordinates.lat.toFixed(LOCATION_PRECISENESS)} и ${mainMarkerStartCoordinates.lng.toFixed(LOCATION_PRECISENESS)}`);

const renderSuccessWindow = () => {
  const successTemplate = document.querySelector('#success').content.querySelector('.success');
  const successWindow = successTemplate.cloneNode(true);
  document.body.appendChild(successWindow);
};
const renderErrorWindow = () => {
  const errorTemplate = document.querySelector('#error').content.querySelector('.error');
  const errorWindow = errorTemplate.cloneNode(true);
  document.body.appendChild(errorWindow);
};

const validateCapacity = (evt) => {
  const selectedRoomCapacities = ROOM_CAPACITIES[offerRoomNumber.value];
  const capacityValue = capacity.value;
  if (!selectedRoomCapacities.includes(capacityValue)) {
    capacity.setCustomValidity('Количество комнат не соответсвует количеству гостей.');
    capacity.style.boxShadow = CUSTOM_VALIDITY_SHADOW;
    evt.preventDefault();
  } else {
    capacity.setCustomValidity('');
  }
  capacity.reportValidity();
};
const validatePrice = () => {
  offerPrice.setAttribute('min', TYPES[`${ offerType.value }`]['minPrice']);
  offerPrice.setAttribute('placeholder', TYPES[`${ offerType.value }`]['minPrice']);

  const value = offerPrice.value;
  if (value > MAX_PRICE_VALUE) {
    offerPrice.setCustomValidity(`Уменьшите цену на ${ value - MAX_PRICE_VALUE }`);
    offerPrice.style.boxShadow = CUSTOM_VALIDITY_SHADOW;
  } else {
    offerPrice.setCustomValidity('');
  }

  offerPrice.reportValidity();
};
const onTitleInput = () => {
  const valueLength = offerTitle.value.length;

  if (valueLength < MIN_TITLE_LENGTH) {
    offerTitle.setCustomValidity(`Ещё ${  MIN_TITLE_LENGTH - valueLength } симв.`);
    offerTitle.style.boxShadow = CUSTOM_VALIDITY_SHADOW;
  } else if (valueLength > MAX_TITLE_LENGTH) {
    offerTitle.setCustomValidity(`Удалите лишние ${ valueLength - MAX_TITLE_LENGTH } симв.`);
    offerTitle.style.boxShadow = CUSTOM_VALIDITY_SHADOW;
  } else {
    offerTitle.setCustomValidity('');
  }

  offerTitle.reportValidity();
};
const onTypeChange = () => {
  validatePrice();
};
const onPriceInput = () => {
  validatePrice();
};
const onCapacityChange = (evt) => {
  validateCapacity(evt);
};
const onRoomsChange = (evt) => {
  validateCapacity(evt);
};

const onErrorWindowEscKeydown = (evt) => {
  if (isEscEvent(evt)) {
    evt.preventDefault();
    // eslint-disable-next-line no-use-before-define
    closeErrorWindow();
  }
};
const onErrorWindowClick = (evt) => {
  evt.preventDefault();
  // eslint-disable-next-line no-use-before-define
  closeErrorWindow();
};
const onSuccessWindowEscKeydown = (evt) => {
  if (isEscEvent(evt)) {
    evt.preventDefault();
    // eslint-disable-next-line no-use-before-define
    closeSuccessWindow();
  }
};
const onSuccessWindowClick = (evt) => {
  evt.preventDefault();
  // eslint-disable-next-line no-use-before-define
  closeSuccessWindow();
};

function closeErrorWindow () {
  const errorWindow = document.querySelector('.error');
  errorWindow.remove();

  document.removeEventListener('keydown', onErrorWindowEscKeydown);
  document.removeEventListener('click', onErrorWindowClick);
}

function closeSuccessWindow () {
  const successWindow = document.querySelector('.success');
  successWindow.remove();

  document.removeEventListener('keydown', onSuccessWindowEscKeydown);
  document.removeEventListener('click', onSuccessWindowClick);
}

const onErrorButtonSubmit = (evt) => {
  evt.preventDefault();
  closeErrorWindow();
};

const onError = () => {
  renderErrorWindow();

  const errorButton = document.querySelector('.error').querySelector('.error__button');

  errorButton.addEventListener('submit', onErrorButtonSubmit);
  document.addEventListener('click', onErrorWindowClick);
  document.addEventListener('keydown', onErrorWindowEscKeydown);
};

const onSuccess = () => {

  renderSuccessWindow();
  form.reset();
  setMapStartPosition();
  setMapFiltersStartPosition();

  document.addEventListener('click', onSuccessWindowClick);
  document.addEventListener('keydown', onSuccessWindowEscKeydown);
};

const onFormSubmit = (evt) => {
  validateCapacity(evt);
  validatePrice();
  evt.preventDefault();

  if(capacity.validity.valid && offerPrice.validity.valid) {
    const formData = new FormData(evt.target);

    sendData(formData)
      .then(() => onSuccess())
      .catch(() => onError());
  }
};

const onFormReset = () => {
  setMapStartPosition();
  setMapFiltersStartPosition();
};

const validateTime = (evt) => {
  const timeinValue = timein.value;
  const timeoutValue = timeout.value;

  if(timeinValue !== timeoutValue) {
    timein.setCustomValidity('Время заезда должно соответствовать времения выезда');
    timeout.setCustomValidity('Время выезда должно соответствовать времения заезда');
    timein.style.boxShadow = CUSTOM_VALIDITY_SHADOW;
    timeout.style.boxShadow = CUSTOM_VALIDITY_SHADOW;
    evt.preventDefault();
  } else {
    timein.setCustomValidity('');
    timeout.setCustomValidity('');
  }

  timeout.reportValidity();
};


const onMainMarkerMoveend = (evt) => {
  const coordinates = evt.target.getLatLng();
  offerAddress.value = `${coordinates.lat.toFixed(LOCATION_PRECISENESS)} и ${coordinates.lng.toFixed(LOCATION_PRECISENESS)}`;
};

offerTitle.addEventListener('input', onTitleInput);
offerPrice.addEventListener('input', onPriceInput);
offerType.addEventListener('change', onTypeChange);
capacity.addEventListener('change', onCapacityChange);
offerRoomNumber.addEventListener('change', onRoomsChange);
timein.addEventListener('change', validateTime);
timeout.addEventListener('change', validateTime);
formReset.addEventListener('click', onFormReset);
form.addEventListener('submit', onFormSubmit);
mainMarker.on('moveend', onMainMarkerMoveend);
