const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const avatarChooser = document.querySelector('#avatar');
const avatarPreview = document.querySelector('.ad-form-header__preview').querySelector('img');
const imagesChooser = document.querySelector('#images');
const adFormPhoto = document.querySelector('.ad-form__photo');

avatarChooser.addEventListener('change', () => {
  const file = avatarChooser.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((element) => fileName.endsWith(element));

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      avatarPreview.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
});


imagesChooser.addEventListener('change', () => {
  const file = imagesChooser.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((element) => fileName.endsWith(element));

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      adFormPhoto.style.display = 'flex';
      adFormPhoto.style.alignItems = 'center';
      adFormPhoto.style.padding = '0 15px';
      const image = document.createElement('img');
      image.setAttribute('width', '40px');
      image.setAttribute('height', '40px');
      image.src = reader.result;
      adFormPhoto.appendChild(image);
    });

    reader.readAsDataURL(file);
  }
});
