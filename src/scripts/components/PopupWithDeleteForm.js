import Popup from "./Popup.js";

export default class PopupWithDeleteForm extends Popup{
  constructor (popupSelector, submitFunction) {
    super(popupSelector);
    this._submitFunction = submitFunction;
    this._form = this._popup.querySelector('.popup__form');
    this._submitButton = this._popup.querySelector('.popup__submit');
    this._defaultButtonText = this._submitButton.textContent;
  }

  setEventListeners() {
    super.setEventListeners()
    this._form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.submitButton.textContent = `${this.submitButton.textContent}...`
      this._submitFunction({ card: this._card, cardId: this._cadrId })
    })
  }

  setupText(isLoading, loadingText) {
    if (isLoading) {
      this._submitButton.textContent = loadingText
      // this._submitButton.style.backgroundImage = `url(${this._load})`
    } else {
      // this._submitButton.style.backgroundImage = 'none'
      this._submitButton.textContent = this._defaultButtonText
    }
  }

  // ловлю объект карточки и её Id
  open = ({ cardId, card }) => {
    super.open()
    this._card = card;
    this._cadrId = cardId;
  }
}
