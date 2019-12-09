import './search-style.scss';
import Utils from '../Utils/Utils';
import SearchMicrophone from '../../assets/control-panel/search-microphone.svg';
import YandexMaps from '../YandexMaps/YandexMaps';
import TemperatureMeasurement from '../TemperatureMeasurement/TemperatureMeasurement';
import Localization from '../Localization/Localization';
import BackgroundImage from '../BackgroundImage/BackgroundImage';

export default {
  getDOM() {
    const result = Utils.createElement('div', { class: 'search' });
    const input = Utils.createElement('input', { class: 'search__input', type: 'text', id: 'suggest' });
    const btn = Utils.createElement('button', { class: 'search__btn' });
    const microphone = Utils.createElement('img', { class: 'search__microphone' });
    const that = this;

    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        btn.click();
      }
    });

    microphone.addEventListener('click', async () => {
      microphone.classList.toggle('search__microphone_active');

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const analyzer = new SpeechRecognition();
      analyzer.start();

      const words = [];

      analyzer.addEventListener('result', (e) => {
        words.push(e.results[0][0].transcript);
      });

      analyzer.addEventListener('end', async () => {
        input.value = words.join(' ');
        if (words.join(' ') === '') {
          Utils.showAlert(Localization.translateObject[Localization.currentLang].alerts.noValue,
            5000);
          microphone.classList.toggle('search__microphone_active');
          return;
        }
        input.blur();

        await that.search(words.join(' '));
        microphone.classList.toggle('search__microphone_active');
      });
    });

    microphone.src = SearchMicrophone;
    btn.addEventListener('click', async () => {
      if (input.value === '') {
        Utils.showAlert(Localization.translateObject[Localization.currentLang].alerts.noValue,
          4800);
        return;
      }
      await that.search(input.value);
    });

    btn.textContent = `${Localization.translateObject[Localization.currentLang].Search.searchBtnText}`;

    this.btn = btn;

    result.append(input, btn, microphone);
    return result;
  },

  async search(cityToSearch) {
    Utils.addPreloader();
    const that = this;

    // source code https://tech.yandex.ru/maps/jsbox/2.1/direct_geocode
    /* eslint-disable */
    ymaps.ready(() => {
      ymaps.geocode(cityToSearch, {
        results: 1,
      }).then(async (res) => {
        const firstGeoObject = res.geoObjects.get(0);
        const coords = firstGeoObject.geometry.getCoordinates();
        // Создание геообъекта с типом точка (метка).
        const myGeoObject = new ymaps.GeoObject({
          /* eslint-enable */
          geometry: {
            type: 'Point', // тип геометрии - точка
            coordinates: [...coords], // координаты точки
          },
        });

        // Размещение геообъекта на карте.
        YandexMaps.myMap.geoObjects.add(myGeoObject);
        YandexMaps.myMap.panTo([...coords], {
          flying: 1,
        });

        const [lat, long] = coords;
        YandexMaps.geographicParameters.latitude = lat;
        YandexMaps.geographicParameters.longitude = long;

        const openKey = '22e5125ee9ad4d638190d1932a9f6a55';

        const geoData = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${coords[0]}+${coords[1]}&key=${openKey}&language=en`);
        const geoDataJson = await geoData.json();

        YandexMaps.geographicParameters.country = geoDataJson.results[0].components.country;
        YandexMaps.geographicParameters.city = geoDataJson.results[0].components.city;
        YandexMaps.geographicParameters.timezone = geoDataJson.results[0]
          .annotations.timezone.name;
        if (YandexMaps.geographicParameters.city === undefined) {
          YandexMaps.geographicParameters.city = '';
        }

        await YandexMaps.loadUserGeoInfoToDOM();
        YandexMaps.changeCoordinatesDOM();

        that.weatherObject.lat = YandexMaps.geographicParameters.latitude;
        that.weatherObject.long = YandexMaps.geographicParameters.longitude;
        await that.weatherObject.getForecast();
        that.weatherObject.changeWidget();

        TemperatureMeasurement.init();

        const queryForUnsplash = `${Utils.getQueryForUnsplash({ summary: that.weatherObject.weatherInfo.currently.summary })}`;

        const unsplashClientId = '45947ee41bcdbe0f5b1dc053db93703bda2bc4cb931799a09821d1a74a829b15';

        BackgroundImage.defaultQuery = queryForUnsplash;
        BackgroundImage.unsplashId = unsplashClientId;
        await BackgroundImage.loadImage(queryForUnsplash, unsplashClientId);

        Utils.deletePreloader();
      });
    });
  },

  translate() {
    this.btn.textContent = `${Localization.translateObject[Localization.currentLang].Search.searchBtnText}`;
  },
};
