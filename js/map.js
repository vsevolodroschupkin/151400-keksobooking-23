// import '../leaflet/leaflet.js';
import { getSimilarAds } from './data.js';

const TOKYO_LAT = '35.6895000';
const TOKYO_LNG = '139.6917100';

const similarAds = getSimilarAds(10);

const map = L.map('map-canvas')
  .setView({
    lat: TOKYO_LAT,
    lng: TOKYO_LNG,
  }, 10);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>',
  },
).addTo(map);

const createMarker = (point) => {
  const {lat, lng} = point;

  const icon = L.icon({
    iconUrl: 'img/main-pin.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const marker = L.marker(
    {
      lat,
      lng,
    },
    {
      icon,
    },
  );
  marker
    .addTo(markerGroup);
};


