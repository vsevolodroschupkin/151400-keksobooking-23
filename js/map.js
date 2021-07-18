import * as utils from './utils.js';
import { createOfferElement } from './offers.js';
import { getData } from './api.js';

const TOKYO_LAT = '35.6895000';
const TOKYO_LNG = '139.6917100';
const INITIAL_SCALE = 12;
const MAIN_PIN_POINT = {
  location:
  {
    lat: TOKYO_LAT,
    lng: TOKYO_LNG,
  },
};
const MAIN_MARKER_WIDTH = 52;
const MAIN_MARKER_HEIGHT = 52;
const MAIN_MARKER_URL = 'img/main-pin.svg';
const MAIN_MARKER_ANCHOR_X = MAIN_MARKER_WIDTH / 2;
const SIMPLE_MARKER_WIDTH = 40;
const SIMPLE_MARKER_HEIGHT = 40;
const SIMPLE_MARKER_URL = 'img/pin.svg';
const SIMPLE_MARKER_ANCHOR_X = SIMPLE_MARKER_WIDTH / 2;
const POINTS_QUANTITY = 10;

const form = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');
const formControls = form.querySelectorAll('fieldset');
const mapFiltersControls = mapFilters.children;

const setPageInactive = () => {
  form.classList.add('ad-form--disabled');
  mapFilters.classList.add('ad-form--disabled');
  utils.setElementsDisabled(formControls);
  utils.setElementsDisabled(mapFiltersControls);
};

const setPageActive = () => {
  form.classList.remove('ad-form--disabled');
  utils.setElementsEnabled(formControls);
};

const setMapFiltersActive = () => {
  mapFilters.classList.remove('ad-form--disabled');
  utils.setElementsEnabled(mapFiltersControls);
};

setPageInactive();

const map = L.map('map-canvas');
const simpleMarkerGroup = L.layerGroup();

const createCustomPopup = (point) => {
  const popupElement = createOfferElement(point);
  return popupElement;
};
const createMarker = (point, isMain = false) => {
  const lat = point.location.lat;
  const lng = point.location.lng;

  const icon = L.icon({
    iconUrl: isMain ? MAIN_MARKER_URL : SIMPLE_MARKER_URL,
    iconSize: isMain ? [MAIN_MARKER_WIDTH, MAIN_MARKER_HEIGHT] : [SIMPLE_MARKER_WIDTH, SIMPLE_MARKER_HEIGHT],
    iconAnchor: isMain ? [MAIN_MARKER_ANCHOR_X, MAIN_MARKER_HEIGHT] : [SIMPLE_MARKER_ANCHOR_X, SIMPLE_MARKER_HEIGHT],
  });

  const marker = L.marker(
    {
      lat,
      lng,
    },
    {
      icon,
      draggable: !!isMain,
    },
  );
  marker.addTo(isMain ? map : simpleMarkerGroup);
  if (!isMain) {
    marker.bindPopup( createCustomPopup(point),
      {
        keepinview: true,
      },
    );
  }
  return marker;
};
const setFilters = (cb) => mapFilters.addEventListener('change', cb);
const filterType = (point) => {
  const typeValue = document.querySelector('#housing-type').value;
  return typeValue === 'any' ? point.offer.type : typeValue === point.offer.type;
};
const filterPrice = (point) => {
  const priceValue = document.querySelector('#housing-price').value;
  let offerPrice;
  switch (true) {
    case point.offer.price < 10000 :
      offerPrice = 'low';
      break;
    case point.offer.price >= 10000 && point.offer.price < 50000 :
      offerPrice = 'middle';
      break;
    case point.offer.price >= 50000 :
      offerPrice = 'high';
      break;
    default:
      offerPrice = 'any';
  }
  return priceValue === 'any' ? point.offer.price : priceValue === offerPrice;
};
const filterRooms = (point) => {
  const roomsValue = document.querySelector('#housing-rooms').value;
  return roomsValue === 'any' ? point.offer.rooms : roomsValue === point.offer.rooms.toString();
};
const filterGuests = (point) => {
  const typeValue = document.querySelector('#housing-guests').value;
  return typeValue === 'any' ? point.offer.guests : typeValue === point.offer.guests.toString();
};
const getOfferRank = (offer) => {
  const wifiInput = document.querySelector('#filter-wifi');
  const dishwasherInput = document.querySelector('#filter-dishwasher');
  const parkingInput = document.querySelector('#filter-parking');
  const washerInput = document.querySelector('#filter-washer');
  const elevatorInput = document.querySelector('#filter-elevator');
  const conditionerInput = document.querySelector('#filter-conditioner');

  const features = offer.offer.features;
  let rank = 0;

  if(features && wifiInput.checked ) {
    features.some((element) => element === wifiInput.value ) ? rank+=1 : rank;
  }
  if(features && dishwasherInput.checked ) {
    features.some((element) => element === dishwasherInput.value ) ? rank+=1 : rank;
  }
  if(features && parkingInput.checked ) {
    features.some((element) => element === parkingInput.value ) ? rank+=1 : rank;
  }
  if(features && washerInput.checked ) {
    features.some((element) => element === washerInput.value ) ? rank+=1 : rank;
  }
  if(features && elevatorInput.checked ) {
    features.some((element) => element === elevatorInput.value ) ? rank+=1 : rank;
  }
  if(features && conditionerInput.checked ) {
    features.some((element) => element === conditionerInput.value ) ? rank+=1 : rank;
  }

  return rank;
};
const compareOffers = (offerA, offerB) => {
  const rankA = getOfferRank(offerA);
  const rankB = getOfferRank(offerB);

  return rankB - rankA;
};
const deleteUnrelevantOffers = (element) => {
  const getMaxRank = () => {
    let rank = 0;
    const featureInputs = mapFilters.querySelector('#housing-features').querySelectorAll('input');
    featureInputs.forEach((input) => input.checked ? rank +=1 : rank);
    return rank;
  };
  const maxRank = getMaxRank();
  const elementRank = getOfferRank(element);

  return maxRank === elementRank;

};

const renderPoints = (points) => {
  simpleMarkerGroup.clearLayers();

  points
    .filter((point) =>
      filterPrice(point) && filterType(point) && filterRooms(point) && filterGuests(point) && deleteUnrelevantOffers(point))
    .sort(compareOffers)
    .slice(0, POINTS_QUANTITY)
    .forEach((point) => createMarker(point, false));
  simpleMarkerGroup.addTo(map);
};

const onMapLoad = () => {
  setPageActive();
  getData()
    .then((points) => {
      setMapFiltersActive();
      renderPoints(points);
      setFilters(() => renderPoints(points));
    })
    .catch(() => utils.renderAlert('Не удалось загрузить похожие объявления. Попробуйте перезагрузить страницу'));
};


map.on('load', onMapLoad)
  .setView({
    lat: TOKYO_LAT,
    lng: TOKYO_LNG,
  }, INITIAL_SCALE);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>',
  },
).addTo(map);

const mainMarker = createMarker(MAIN_PIN_POINT, true);


const setMapStartPosition = () => {
  mainMarker.setLatLng({
    lat: TOKYO_LAT,
    lng: TOKYO_LNG,
  });

  map.setView({
    lat: TOKYO_LAT,
    lng: TOKYO_LNG,
  }, INITIAL_SCALE);
};

const setMapFiltersStartPosition = () => {
  mapFilters.reset();
  onMapLoad();
};

export { setMapStartPosition, setMapFiltersStartPosition, mainMarker };

