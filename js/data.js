import * as utils from './utils.js';

const AD_QUANTITY = 10;
const MIN_AVATAR_NUMBER = 1;
const MAX_AVATAR_NUMBER = 8;
const APARTMENT_TYPES = ['palace', 'flat', 'house', 'bungalow', 'hotel'];
const CHEKIN_TIME = ['12:00', '13:00', '14:00'];
const CHEKOUT_TIME = ['12:00', '13:00', '14:00'];
const FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
const LAT_MIN = 35.65000;
const LAT_MAX = 35.70000;
const LNG_MIN = 139.70000;
const LNG_MAX = 139.80000;
const LOCATION_PRECISENESS = 5;
const PRICE_MAX = 999999999999;
const GUESTS_MAX = 20;
const ROOMS_MAX = 10;
const INTEGER_MIN = 0;
const PHOTOS = ['https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg', 'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg', 'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg'];


const createAd = () => {

  const locationLng = utils.getRandomFloat(LNG_MIN, LNG_MAX, LOCATION_PRECISENESS);
  const locationLat = utils.getRandomFloat(LAT_MIN, LAT_MAX, LOCATION_PRECISENESS);

  return  {
    author: {
      avatar: `img/avatars/user${  utils.getRandomInteger(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER).toString().padStart(2, 0)  }.png`,
    },
    offer: {
      title: `Объявление по координатам: ${ locationLat} ,${ locationLng }`,
      address: `${ locationLat }, ${ locationLng }`,
      price: utils.getRandomInteger(INTEGER_MIN, PRICE_MAX),
      type: utils.getRandomArrayElement(APARTMENT_TYPES),
      rooms: utils.getRandomInteger(INTEGER_MIN, ROOMS_MAX),
      guests: utils.getRandomInteger(INTEGER_MIN, GUESTS_MAX),
      cheсkin: utils.getRandomArrayElement(CHEKIN_TIME),
      cheсkout: utils.getRandomArrayElement(CHEKOUT_TIME),
      features: Array.from(new Set(utils.getRandomArrayFromArray(FEATURES))),
      description: `Описание объявления с координатами: ${ locationLat }, ${ locationLng }`,
      photos: utils.getRandomArrayFromArray(PHOTOS),
    },
    location: {
      lat: locationLat,
      lng: locationLng,
    },
  };
};

const getSimilarAds = (adsCount = AD_QUANTITY) => (
  new Array(adsCount).fill(null).map(() => createAd()));

export {getSimilarAds};
