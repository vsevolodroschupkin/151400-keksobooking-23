const GET_DATA_URL = 'https://23.javascript.pages.academy/keksobooking/data';
const SEND_DATA_URL = 'https://23.javascript.pages.academy/keksobooking';

function getData () {
  return fetch(GET_DATA_URL)
    .then ((response) => {
      if(!response.ok){
        throw new Error ('Ошибка загрузки данных с сервера.');
      }
      return response.json();
    });
}

function sendData (body) {
  return fetch(
    SEND_DATA_URL,
    {
      method:'POST',
      body,
    },
  )
    .then((response) => {
      if(response.ok) {
        return response;
      }
      throw new Error ('Ошибка отправки данных формы.');
    });
}

export {getData, sendData};
