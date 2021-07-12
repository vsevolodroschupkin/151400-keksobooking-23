import * as utils from './utils.js';
import { createOfferElement } from './offers.js';
import { getData } from './api.js';

const TOKYO_LAT = '35.6895000';
const TOKYO_LNG = '139.6917100';
const INITIAL_SCALE = 15;
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
const POINTS_QUANTITY =10;

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
  mapFilters.classList.remove('ad-form--disabled');
  utils.setElementsEnabled(formControls);
  utils.setElementsEnabled(mapFiltersControls);
};

setPageInactive();

const createCustomPopup = (point) => {
  const popupElement = createOfferElement(point);
  return popupElement;
};
const createMarker = (point, isMain = false, target) => {
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
  marker.addTo(target);
  if (!isMain) {
    marker.bindPopup( createCustomPopup(point),
      {
        keepinview: true,
      },
    );
  }
  return marker;
};
const simpleMarkerGroup = L.layerGroup();
const renderPoints = (points) => {
  points
    .forEach((point) => createMarker(point, false, simpleMarkerGroup));
};

const onMapLoad = () => {
  setPageActive();
  getData((points) => renderPoints(points.slice(0, POINTS_QUANTITY)), () => utils.renderAlert('Не удалось загрузить похожие объявления. Попробуйте перезагрузить страницу'));
};

const map = L.map('map-canvas')
  .on('load', onMapLoad)
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

const mainMarker = createMarker(MAIN_PIN_POINT, true, map);
simpleMarkerGroup.addTo(map);

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

export { map, setMapStartPosition, mainMarker };

