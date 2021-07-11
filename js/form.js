import { setMapStartPosition, mainMarker } from './map.js';
import { isEscEvent } from './utils.js';
import { sendData } from './api.js';

const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const MAX_PRICE_VALUE = 1000000;
const LOCATION_PRECISENESS = 5;


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
    evt.preventDefault();
  } else {
    capacity.setCustomValidity('');
  }
  capacity.reportValidity();
};
const onTitleInput = () => {
  const valueLength = offerTitle.value.length;

  if (valueLength < MIN_TITLE_LENGTH) {
    offerTitle.setCustomValidity(`Ещё ${  MIN_TITLE_LENGTH - valueLength } симв.`);
  } else if (valueLength > MAX_TITLE_LENGTH) {
    offerTitle.setCustomValidity(`Удалите лишние ${ valueLength - MAX_TITLE_LENGTH } симв.`);
  } else {
    offerTitle.setCustomValidity('');
  }

  offerTitle.reportValidity();
};
const onTypeChange = (evt) => {
  offerPrice.setAttribute('min', TYPES[`${ evt.target.value }`]['minPrice']);
  offerPrice.setAttribute('placeholder', TYPES[`${ evt.target.value }`]['minPrice']);
};
const onPriceInput = () => {
  const value = offerPrice.value;
  if (value > MAX_PRICE_VALUE) {
    offerPrice.setCustomValidity(`Уменьшите цену на ${ value - MAX_PRICE_VALUE }`);
  } else {
    offerPrice.setCustomValidity('');
  }

  offerPrice.reportValidity();
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

  document.addEventListener('click', onSuccessWindowClick);
  document.addEventListener('keydown', onSuccessWindowEscKeydown);
};

const onFormSubmit = (evt) => {
  validateCapacity(evt);
  evt.preventDefault();

  const formData = new FormData(evt.target);

  sendData(onSuccess, onError, formData);
};

const onFormReset = () => {
  setMapStartPosition();
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
formReset.addEventListener('click', onFormReset);
form.addEventListener('submit', onFormSubmit);
mainMarker.on('moveend', onMainMarkerMoveend);
