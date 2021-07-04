const cardTemplate  = document.querySelector('#card').content.querySelector('.popup');

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
  offerAddress.textContent = offer.offer.address ? offer.offer.address : offerElement.removeChild(offerAddress);
  offerPrice.textContent = offer.offer.price ? `${offer.offer.price} ₽/ночь` : offerElement.removeChild(offerPrice);

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

  offerCapacity.textContent = offer.offer.rooms && offer.offer.guests ? `${offer.offer.rooms} комнаты для ${offer.offer.guests} гостей` : offerElement.removeChild(offerCapacity);
  offerTime.textContent = offer.offer.cheсkin && offer.offer.cheсkout ? `${offer.offer.cheсkin}, выезд до ${offer.offer.cheсkout}`: offerElement.removeChild(offerTime);
  offerFeatures.textContent = offer.offer.features ? `${offer.offer.features.join(', ')}` : offerElement.removeChild(offerFeatures);
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
