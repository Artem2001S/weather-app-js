import './style/main.scss';
import Utils from './modules/Utils/Utils';
import BackgroundImage from './modules/BackgroundImage/BackgroundImage';
import YandexMaps from './modules/YandexMaps/YandexMaps';
import Weather from './modules/Weather/Weather';
import ControlPanel from './modules/ControlPanel/ControlPanel';
import TemperatureMeasurement from './modules/TemperatureMeasurement/TemperatureMeasurement';
import Localization from './modules/Localization/Localization';
import Search from './modules/Search/Search';
import favIcon from './assets/sun.png';

const app = document.querySelector('.application');
let geoInfo = {};

const darkSkyKey = 'f623cba9ef61d6ec94bebb38cd8e5427';
const unsplashClientId = 'b2d7444553e47f531a6a08bc2b4a31b5967d429fadc524e327439a28a53f61f3';
YandexMaps.init();

Utils.createPreloader();

Utils.addPreloader();

if (localStorage.getItem('lang') !== null) {
  Localization.currentLang = localStorage.getItem('lang');
} else {
  Localization.currentLang = 'EN';
}

((async function loadMap() {
  try {
    // add tools panel (header)
    const controlPanel = new ControlPanel();
    app.append(controlPanel.getControlPanel());


    await YandexMaps.initMap();
    const mainContent = Utils.createElement('div', { class: 'main-container' });

    const userGeoInfo = await YandexMaps.loadUserGeoInfoToDOM();
    app.append(userGeoInfo);

    geoInfo = YandexMaps.geographicParameters;

    const weather = new Weather(geoInfo.latitude, geoInfo.longitude, darkSkyKey);
    await weather.getForecast();

    Search.weatherObject = weather;
    mainContent.append(weather.getWeatherWidgetDOM());
    YandexMaps.loadMapToDOM(mainContent);

    app.append(mainContent);

    // set actual temperature measurement
    TemperatureMeasurement.init();
    Localization.weatherObject = weather;

    // set actual lang
    Localization.init();

    const queryForUnsplash = `${Utils.getQueryForUnsplash({ summary: weather.weatherInfo.currently.summary })}`;
    await BackgroundImage.loadImage(queryForUnsplash, unsplashClientId);

    BackgroundImage.defaultQuery = queryForUnsplash;
    BackgroundImage.unsplashId = unsplashClientId;

    const link = Utils.createElement('link', { type: 'image/x-icon', rel: 'shortcut icon', href: favIcon });
    document.head.appendChild(link);
  } catch (err) {
    Utils.deletePreloader();
    Utils.showAlert('Error', 4400);
  }
})());

// services ---------------------------------------------

// update date and time
setInterval(() => {
  const userDateTime = document.querySelector('.user-info__time');
  if (userDateTime !== null) {
    Utils.datetime.setMinutes(Utils.datetime.getMinutes() + 1);
    userDateTime.textContent = Utils.getCurrentDateTime(Utils.datetime);
  }
}, 60000);
