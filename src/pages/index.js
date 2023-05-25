import './index.css'
import Card from '../scripts/components/Card.js';
import FormValidator from '../scripts/components/FormValidator.js';
import PopupWithImage from '../scripts/components/PopupWithImage.js';
import Section from '../scripts/components/Section.js';
import UserInfo from '../scripts/components/UserInfo.js';
import PopupWithForm from '../scripts/components/PopupWithForm.js';
import PopupWithDeleteForm from '../scripts/components/PopupWithDeleteForm.js';
import Api from '../scripts/components/Api.js';
import {
  profileEditButtonElement,
  profileAddButtonElement,
  avatarElement,
  formsValidator,
  selectorTemlate,
  listsElementSelector,
  popupProfileSelector,
  popupAddCardSelector,
  popupImageSelector,
  popupDeleteSelector,
  popupEditAvatarSelector,
  configInfo,
  validationConfig,
} from '../scripts/utils/constants.js'

/*создаю экземпляр класса Api*/
const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-66',
  headers: {
    authorization: '9f4d5ff3-f724-49c2-9657-4a12392beeb3',
    'Content-Type': 'application/json'
  }
});

/*создаю экземпляр класса UserInfo*/
const userInfo = new UserInfo(configInfo);

/*создаю экземпляр класса PopupWithImage*/
const popupImage = new PopupWithImage(popupImageSelector);

function creatNewCard(element) {
  const card = new Card(element, selectorTemlate, popupImage.open, popupDelete.open, async (likeElement, cardId) => {
    if (likeElement.classList.contains('elements__like-icon_active')) {
      try {
        const res = await api.deleteLike(cardId);
        card.toggelLike(res.likes)
      }
      catch (error) {
        console.error(`Ошибка при снятии лайка ${error}`)
      }
    } else {
      try {
        const res = await api.addLike(cardId);
        card.toggelLike(res.likes)
      }
      catch (error) {
        console.error(`Ошибка при добавлении лайка ${error}`)
      }
    }
  })
  return card.createCard();
}

async function handleSubmit (request, popupInstance, textForCatch = 'Ошибка', lodingText = 'Сохранение...') {
  try {
    popupInstance.setupText(true, lodingText)
    await request()
    popupInstance.close()
  }
  catch (error){
    console.error(`${textForCatch} ${error}`)
  }
  finally {
    popupInstance.setupText(false)
  }
}

/*создаю экземпляр класса Section с объектом начальных карточек и функцией создания разметки карточки*/
const section = new Section((element) => {
  section.addItemAppend(creatNewCard(element))
  }, listsElementSelector);

/*создаю экземпляр класса PopupWithForm для формы редактирования профиля со своим сабмитом*/
const popupProfile = new PopupWithForm(popupProfileSelector, (data) => {
  async function makeRequest() {
    const res = await api.setUserInfo(data)
    userInfo.setUserInfo({name: res.name, job: res.about, avatar: res.avatar})
  }
  handleSubmit(makeRequest, popupProfile, 'Ошибка при редактировании профиля')
});

/*создаю экземпляр класса PopupWithForm для формы добавления карточек со своим сабмитом*/
const popupAddCard = new PopupWithForm(popupAddCardSelector, (data) => {
  async function makeRequest() {
    const [dataUser, dataCard] = await Promise.all([api.getInfo(), api.addCard(data)]);
    dataCard.myid = dataUser._id
    section.addItemPrepend(creatNewCard(dataCard))
  }
  handleSubmit(makeRequest, popupAddCard, 'Ошибка при создании новой карточки', 'Создание...')
});

/*создаю экземпляр класса PopupWithForm для формы добавления карточек со своим сабмитом*/
const popupEditAvatar = new PopupWithForm(popupEditAvatarSelector, (data) => {
  async function makeRequest() {
    const res = await api.setNewAvatar(data)
    userInfo.setUserInfo({name: res.name, job: res.about, avatar: res.avatar})
  }
  handleSubmit(makeRequest, popupEditAvatar, 'Ошибка при обновлении аватара')
});

/*создаю экземпляр класс для попапа удаления карточки */
const popupDelete = new PopupWithDeleteForm(popupDeleteSelector, ({ card, cardId }) => {
  async function makeRequest() {
    await api.deleteCard(cardId)
    card.removeCard()
  }
  handleSubmit(makeRequest, popupDelete, 'Ошибка при удалении карточки', 'Удаление...')
});

/*создаю экземпляры класса FormValidator и сразу активирую валидацию для каждого экземпляра*/
Array.from(document.forms).forEach(item => {
  const form = new FormValidator(validationConfig, item);
  const name = item.getAttribute('name');
  formsValidator[name] = form;
  form.enableValidation()
})

/*Вешаю слушатели для каждого попапа*/
popupImage.setEventListeners()
popupProfile.setEventListeners()
popupAddCard.setEventListeners()
popupDelete.setEventListeners()
popupEditAvatar.setEventListeners()

/*открытие попап редоктирования профиля*/
profileEditButtonElement.addEventListener('click', () => {
  formsValidator.personalData.resetErrorForOpenForm();
  popupProfile.setInputsValue(userInfo.getUserInfo())
  popupProfile.open()
});

/*открытие попап редоктирования карточек*/
profileAddButtonElement.addEventListener('click', () => {
  formsValidator.addCard.resetErrorForOpenForm();
  popupAddCard.open();
});

avatarElement.addEventListener('click', ()=> {
  formsValidator.editAvatar.resetErrorForOpenForm()
  popupEditAvatar.open()
});

(async () => {
  try {
    const [dataUser, dataCards] = await Promise.all([api.getInfo(), api.getCards()]);
    dataCards.forEach(element => element.myid = dataUser._id);
    userInfo.setUserInfo({ name: dataUser.name, job: dataUser.about, avatar: dataUser.avatar });
    section.addCardFromArray(dataCards);
    // console.log(dataCards)
  }
  catch (error){
    console.error(`Ошибка при создании начальных данных страницы ${error}`);
  }
})()
console.log('hi')
