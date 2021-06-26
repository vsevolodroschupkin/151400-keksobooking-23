const form = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');
const formControls = form.querySelectorAll('fieldset');
const mapFiltersControls = mapFilters.querySelectorAll('[class^=map]');

const setElementsDisabled = (elements) => {
  elements.forEach((element) => element.setAttribute('disabled', 'disabled'));
};

const setElementsEnabled = (elemets) => {
  elemets.forEach((element) => element.removeAttribute('disabled'));
};

const setPageInactive = () => {
  form.classList.add('ad-form--disabled');
  mapFilters.classList.add('ad-form--disabled');
  setElementsDisabled(formControls);
  setElementsDisabled(mapFiltersControls);
};

const setPageActive = () => {
  form.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('ad-form--disabled');
  setElementsEnabled(formControls);
  setElementsEnabled(mapFiltersControls);
};

setPageInactive();
setPageActive();
