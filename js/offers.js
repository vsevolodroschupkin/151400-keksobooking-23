import { getSimilarAds } from './data.js';

const TEST_OFFER_ID = 0;

const cardTemplate  = document.querySelector('#card').content.querySelector('.popup');
const mapCanvas = document.querySelector('#map-canvas');

const offers = getSimilarAds();

const createOfferElement = (offer) => {
  const offerElement = cardTemplate.cloneNode(true);
  const offerAvatar = offerElement.querySelector('.popup__avatar');
  const offerTitle = offerElement.querySelector('.popup__title');
  const offerAddress = offerElement.querySelector('.popup__text--address');
  const offerPrice = offerElement.querySelector('.popup__text--price');
  const offerType = offerElement.querySelector('.popup__type');
  const offerCapacity = offerElement.querySelector('.popup__text--capacity');
  const offerTime = offerElement.querySelector('.popup__text--time');
  const offerFeatures = offerElement.querySelector('.popup__features');
  const offerDescription = offerElement.querySelector('.popup__description');
  const offerPhotos = offerElement.querySelector('.popup__photos');

  offerAvatar.src = offer.author.avatar ? offer.author.avatar : offerElement.removeChild(offerAvatar);
  offerTitle.textContent = offer.offer.title ? offer.offer.title : offerElement.removeChild(offerTitle);
  offerAddress.textContent = offer.offer.address;
  offerPrice.textContent = `${offer.offer.price} ₽/ночь`;

  switch(offer.offer.type) {
    case 'flat' :
      offerType.textContent = 'Квартира';
      break;
    case 'bungalow' :
      offerType.textContent = 'Бунгало';
      break;
    case 'house' :
      offerType.textContent = 'Дом';
      break;
    case 'palace' :
      offerType.textContent = 'Дворец';
      break;
    case 'hotel' :
      offerType.textContent = 'Отель';
      break;
    default: offerElement.removeChild(offerType);
  }

  offerCapacity.textContent = `${offer.offer.rooms} комнаты для ${offer.offer.guests} гостей`;
  offerTime.textContent = `${offer.offer.cheсkin}, выезд до ${offer.offer.cheсkout}`;
  offerFeatures.textContent = `${offer.offer.features.join(', ')}`;
  offerDescription.textContent = offer.offer.description;

  if(offer.offer.photos) {
    const photoTemplate = offerPhotos.querySelector('.popup__photo').cloneNode();
    offerPhotos.removeChild(offerPhotos.querySelector('.popup__photo'));

    offer.offer.photos.forEach((photoUrl) => {
      const newPhoto = photoTemplate.cloneNode();
      newPhoto.src = photoUrl;
      offerPhotos.appendChild(newPhoto);
    });
  } else {
    offerElement.removeChild(offerPhotos);
  }

  return offerElement;
};

export {createOfferElement};
