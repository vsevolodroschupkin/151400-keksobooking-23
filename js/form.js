import { setMapStartPosition, mainMarker } from './map.js';

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
const timein = form.querySelector('#timein');
const timeout = form.querySelector('#timeout');

const mainMarkerStartCoordinates = mainMarker.getLatLng();
offerAddress.value = `${mainMarkerStartCoordinates.lat} и ${mainMarkerStartCoordinates.lng}`;
offerAddress.setAttribute('placeholder', `${mainMarkerStartCoordinates.lat.toFixed(LOCATION_PRECISENESS)} и ${mainMarkerStartCoordinates.lng.toFixed(LOCATION_PRECISENESS)}`);


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
const onFormSubmit = (evt) => {
  validateCapacity(evt);
};

const onFormReset = (evt) => {
  evt.preventDefault();
  setMapStartPosition();
};

const validateTime = (evt) => {
  const timeinValue = timein.value;
  const timeoutValue = timeout.value;

  if(timeinValue !== timeoutValue) {
    timein.setCustomValidity('Время заезда должно соответствовать времения выезда');
    timeout.setCustomValidity('Время выезда должно соответствовать времения заезда');
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
