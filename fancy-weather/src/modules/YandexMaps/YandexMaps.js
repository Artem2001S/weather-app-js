import './map.scss';
import Utils from '../Utils/Utils';
import Localization from '../Localization/Localization';

export default {
  init() {
    this.map = Utils.createElement('div', { id: 'map' });
  },

  loadMapToDOM(parent) {
    if (parent === null || parent === undefined) return;
    const container = Utils.createElement('div', { style: 'margin-bottom: 5rem;' });
    container.append(this.map);
    const latitudeText = Utils.createElement('div', { class: 'map__coordinates' });
    const longitudeText = Utils.createElement('div', { class: 'map__coordinates' });
    latitudeText.innerHTML = `${Localization.translateObject[Localization.currentLang].YandexMaps.latitude}: ${Utils.convertToDegreesAndMinutes(this.geographicParameters.latitude)}`;
    longitudeText.innerHTML = `${Localization.translateObject[Localization.currentLang].YandexMaps.longitude}: ${Utils.convertToDegreesAndMinutes(this.geographicParameters.longitude)}`;
    this.latitudeText = latitudeText;
    this.longitudeText = longitudeText;

    container.append(latitudeText);
    container.append(longitudeText);

    parent.append(container);
    const that = this;
    /* eslint-disable */
    ymaps.ready(() => {
      let myMap = new ymaps.Map('map', {
        center: [that.geographicParameters.latitude, that.geographicParameters.longitude],
        zoom: 15,
      });
      let suggestView = new ymaps.SuggestView('suggest');
      that.myMap = myMap;
    });
    /* eslint-enable */
  },

  getGeographicParameters() {
    return this.geographicParameters;
  },

  async initMap() {
    const data = await fetch('https://get.geojs.io/v1/ip/geo.js');
    let json = await data.text();
    json = JSON.parse(json.slice(6, json.length - 2));
    this.geographicParameters = {
      latitude: Number(json.latitude),
      longitude: Number(json.longitude),
      city: json.city,
      country: json.country,
      timezone: json.timezone,
    };

    const that = this;
    function success(pos) {
      that.geographicParameters.latitude = (pos.coords.latitude);
      that.geographicParameters.longitude = (pos.coords.longitude);
    }
    navigator.geolocation.getCurrentPosition(success);
  },

  async loadUserGeoInfoToDOM() {
    const result = Utils.createElement('div', { class: 'user-info' });
    const userLocation = Utils.createElement('div', { class: 'user-info__location' });
    userLocation.textContent = `${this.geographicParameters.city}, ${this.geographicParameters.country}`;
    await this.translaterAPI(userLocation, 'en');

    const userTime = Utils.createElement('div', { class: 'user-info__time' });
    const timezoneApiToken = 'KBGUO1DLXXVO';
    const data = await fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneApiToken}&format=json&zone=${this.geographicParameters.timezone}&by=zone`);

    const res = await data.json();
    Utils.datetime = new Date(res.formatted);
    userTime.textContent = Utils.getCurrentDateTime(Utils.datetime);

    if (document.querySelector('.user-info__time') !== null) {
      document.querySelector('.user-info__time').textContent = Utils.getCurrentDateTime(Utils.datetime);
    }

    if (document.querySelector('.user-info__location') !== null) {
      document.querySelector('.user-info__location').textContent = `${this.geographicParameters.city}, ${this.geographicParameters.country}`;
      await this.translaterAPI(document.querySelector('.user-info__location'), 'en');
    }

    result.append(userLocation);
    result.append(userTime);
    return result;
  },

  changeCoordinatesDOM() {
    if (this.latitudeText !== undefined || this.longitudeText !== undefined) {
      this.latitudeText.innerHTML = `${Localization.translateObject[Localization.currentLang].YandexMaps.latitude}: ${Utils.convertToDegreesAndMinutes(this.geographicParameters.latitude)}`;
      this.longitudeText.innerHTML = `${Localization.translateObject[Localization.currentLang].YandexMaps.longitude}: ${Utils.convertToDegreesAndMinutes(this.geographicParameters.longitude)}`;
    }
  },

  async translate(oldLang) {
    if (this.latitudeText !== undefined || this.longitudeText !== undefined) {
      this.latitudeText.innerHTML = `${Localization.translateObject[Localization.currentLang].YandexMaps.latitude}: ${Utils.convertToDegreesAndMinutes(this.geographicParameters.latitude)}`;
      this.longitudeText.innerHTML = `${Localization.translateObject[Localization.currentLang].YandexMaps.longitude}: ${Utils.convertToDegreesAndMinutes(this.geographicParameters.longitude)}`;
      document.querySelector('.user-info__time').textContent = Utils.getCurrentDateTime();
      await this.translaterAPI(document.querySelector('.user-info__location'), oldLang === 'BY' ? 'be' : oldLang);
    }
  },

  async translaterAPI(element, langFrom) {
    const key = 'trnsl.1.1.20190330T153908Z.e0971ed6a2add4b1.f1ea0f7b103368215ffdf18c27e84b7bb6ccbdd1';
    let text = element.textContent;
    text = text.split(' ').join('+');

    const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${key}&text=${text}&lang=${langFrom.toLowerCase()}-${Localization.currentLang === 'BY' ? 'be' : Localization.currentLang.toLowerCase()}`;
    const data = await fetch(url);
    const json = await data.json();

    /* eslint-disable */
    element.textContent = json.text;
    /* eslint-enable */
  },
};
