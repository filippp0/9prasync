export default class Api {
  constructor(options) {
    this._url = options.baseUrl;
    this._headers = options.headers
    this._authorization = options.headers.authorization
  }

  _checkResponse(res) {return res.ok ? res.json() : Promise.reject}

  async getInfo() {
    const res = await fetch(`${this._url}/users/me`, {
      headers: {
        authorization: this._authorization
      }
    });
    return this._checkResponse(res);
  }


  async setUserInfo(data) {
    const res = await fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: data.username,
        about: data.job,
      })
    });
    return this._checkResponse(res);
  }

  async getCards() {
    const res = await fetch(`${this._url}/cards`, {
      headers: {
        authorization: this._authorization
      }
    });
    return this._checkResponse(res);
  }

  async addCard(data) {
    const res = await fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: data.title,
        link: data.link,
      })
    });
    return this._checkResponse(res);
  }

  async setNewAvatar(data) {
    const res = await fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar,
      })
    });
    return this._checkResponse(res);
  }

  async deleteCard(cardId) {
    const res = await fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: this._authorization
      }
    });
    return this._checkResponse(res);
  }

  async deleteLike(cardId) {
    const res = await fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: {
        authorization: this._authorization
      }
    });
    return this._checkResponse(res);
  }

  async addLike(cardId) {
    const res = await fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: {
        authorization: this._authorization
      }
    });
    return this._checkResponse(res);
  }
}
