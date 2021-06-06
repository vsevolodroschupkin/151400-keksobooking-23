function getRandomInteger (min = 0, max) {
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
const PHOTOS = ['https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg', 'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg', 'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg'];


const createAd = () => {

  const locationLng = getRandomFloat(LNG_MIN, LNG_MAX, LOCATION_PRECISENESS);
  const locationLat = getRandomFloat(LAT_MIN, LAT_MAX, LOCATION_PRECISENESS);

  return  {
    author: {
      avatar: `img/avatars/user${  getRandomInteger(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER).toString().padStart(2, 0)  }.png`,
    },
    offer: {
      title: `Объявление по координатам: ${ locationLat} ,${ locationLng }`,
      address: `${ locationLat }${ locationLng }`,
      price: getRandomInteger('', PRICE_MAX),
      type: getRandomArrayElement(APARTMENT_TYPES),
      rooms: getRandomInteger('', ROOMS_MAX),
      guests: getRandomInteger('', GUESTS_MAX),
      chekin: getRandomArrayElement(CHEKIN_TIME),
      chekout: getRandomArrayElement(CHEKOUT_TIME),
      features: Array.from(new Set(getRandomArrayFromArray(FEATURES))),
      description: `Описание объявления с координатами: ${ locationLat }, ${ locationLng }`,
      photos: getRandomArrayFromArray(PHOTOS),
    },
    location: {
      lat: locationLat,
      lng: locationLng,
    },
  };
};

const similarAds =  new Array(AD_QUANTITY).fill(null).map(() => createAd());
// eslint-disable-next-line no-console
console.log(similarAds);
