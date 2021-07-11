const GET_DATA_URL = 'https://23.javascript.pages.academy/keksobooking/data';
const SEND_DATA_URL = 'https://23.javascript.pages.academy/keksobooking';

const getData = (onSuccess, onError) => {
  fetch(GET_DATA_URL)
    .then((response) => {
      if (response.ok){
        return response.json();
      }
      onError('Не удалось получить похожие объявления. Попробуйте перезагрузить страницу.');
    })
    .then((ads) => onSuccess(ads))
    .catch(() => onError('Не удалось получить похожие объявления. Попробуйте перезагрузить страницу.'));
};

const sendData = (onSuccess, onError, body) => {
  fetch(
    SEND_DATA_URL,
    {
      method:'POST',
      body,
    },
  )
    .then((response) => {
      if(response.ok) {
        onSuccess();
      }
    })
    .catch(() => onError());
};


export {getData, sendData};
