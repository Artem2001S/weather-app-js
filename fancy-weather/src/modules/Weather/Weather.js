import Utils from '../Utils/Utils';
import './weather.scss';

import clearDay from '../../assets/weather/clear-day.png';
import clearNight from '../../assets/weather/clear-night.png';
import fog from '../../assets/weather/fog.png';
import hail from '../../assets/weather/hail.png';
import partlyCloudyDay from '../../assets/weather/partly-cloudy-day.png';
import partlyCloudyNight from '../../assets/weather/partly-cloudy-night.png';
import rain from '../../assets/weather/rain.png';
import sleet from '../../assets/weather/sleet.png';
import snow from '../../assets/weather/snow.png';
import thunderstorm from '../../assets/weather/thunderstorm.png';
import tornado from '../../assets/weather/tornado.png';
import wind from '../../assets/weather/wind.png';
import cloudy from '../../assets/weather/cloudy.png';
import thermometer from '../../assets/weather/thermometer.png';
import Localization from '../Localization/Localization';
import TemperatureMeasurement from '../TemperatureMeasurement/TemperatureMeasurement';

export default class Weather {
  constructor(lat, long, darkSkyKey) {
    this.lat = lat;
    this.long = long;
    this.key = darkSkyKey;
  }

  async getForecast() {
    try {
      const url = `https://api.darksky.net/forecast/${this.key}/${this.lat},${this.long}?extend=daily&exclude=hourly&units=si&lang=${Localization.currentLang === 'BY' ? 'BE' : Localization.currentLang}`;
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const data = await fetch(proxyUrl + url);
      const res = await data.json();
      this.weatherInfo = {
        currently: {
          apparentTemperature: res.currently.apparentTemperature,
          icon: res.currently.icon,
          temperature: res.currently.temperature,
          windSpeed: res.currently.windSpeed,
          summary: res.currently.summary,
          humidity: res.currently.humidity,
        },
        1: {
          time: res.daily.data[1].time * 1000,
          temperatureHigh: res.daily.data[1].temperatureHigh,
          temperatureLow: res.daily.data[1].temperatureLow,
          icon: res.daily.data[1].icon,
        },
        2: {
          time: res.daily.data[2].time * 1000,
          temperatureHigh: res.daily.data[2].temperatureHigh,
          temperatureLow: res.daily.data[2].temperatureLow,
          icon: res.daily.data[2].icon,
        },
        3: {
          time: res.daily.data[3].time * 1000,
          temperatureHigh: res.daily.data[3].temperatureHigh,
          temperatureLow: res.daily.data[3].temperatureLow,
          icon: res.daily.data[3].icon,
        },
      };
    } catch (error) {
      Utils.showAlert(Localization.translateObject[Localization.currentLang].alerts.error, 5000);
    }
  }

  getCurrentWeatherDOM() {
    const currWeather = document.createElement('div');
    currWeather.classList.add('current-day');

    currWeather.append(this.getCurrentWeatherInfoDOM());

    return currWeather;
  }

  getCurrentWeatherInfoDOM() {
    const weatherInfo = Utils.createElement('div', { class: 'current-weather-info' });
    weatherInfo.append(this.getWeatherIcon(this.weatherInfo.currently.icon, 190));

    const container = Utils.createElement('div', { class: 'weather-parameters' });

    const summary = Utils.createElement('div', { class: 'weather-parameters__summary' });
    summary.textContent = this.weatherInfo.currently.summary;

    const feelsLike = Utils.createElement('div', { class: 'weather-parameters__feels-like' });
    feelsLike.textContent = `${Localization.translateObject[Localization.currentLang].Weather.feelsLike}: ${this.weatherInfo.currently.apparentTemperature} ${TemperatureMeasurement.current}°`;

    const windElement = Utils.createElement('div', { class: 'weather-parameters__wind' });
    windElement.textContent = `${Localization.translateObject[Localization.currentLang].Weather.wind}: ${this.weatherInfo.currently.windSpeed} m/s`;

    const humidity = Utils.createElement('div', { class: 'weather-parameters__humidity' });
    humidity.textContent = `${Localization.translateObject[Localization.currentLang].Weather.humidity}: ${(this.weatherInfo.currently.humidity * 100).toFixed(2)}%`;

    const currWeatherValue = Utils.createElement('div', { class: 'temperature' });
    currWeatherValue.textContent = `${this.weatherInfo.currently.temperature} ${TemperatureMeasurement.current}°`;
    container.append(currWeatherValue, summary, feelsLike, windElement, humidity);

    weatherInfo.append(container);
    return weatherInfo;
  }

  /* eslint-disable */
  getWeatherIcon(iconString, size) {
    const img = Utils.createElement('img', { width: size, height: size });
    let src = cloudy; // default value

    switch (iconString) {
      case 'clear-day':
        src = clearDay;
        break;
      case 'clear-night':
        src = clearNight;
        break;
      case 'fog':
        src = fog;
        break;
      case 'hail':
        src = hail;
        break;
      case 'partly-cloudy-day':
        src = partlyCloudyDay;
        break;
      case 'partly-cloudy-night':
        src = partlyCloudyNight;
        break;
      case 'rain':
        src = rain;
        break;
      case 'sleet':
        src = sleet;
        break;
      case 'snow':
        src = snow;
        break;
      case 'thunderstorm':
        src = thunderstorm;
        break;
      case 'tornado':
        src = tornado;
        break;
      case 'wind':
        src = wind;
        break;
      default:
        break;
    }

    img.src = src;
    return img;
  }
  /* eslint-enable */

  getAnotherDayWeatherDOM(dayNum) {
    const element = Utils.createElement('div', { class: 'weather-card' });
    const img = this.getWeatherIcon(this.weatherInfo[dayNum].icon, 100);
    const value = Utils.createElement('div', { class: 'weather-card__temperature-info' });
    value.innerHTML = `${Localization.translateObject[Localization.currentLang].Weather.from} <span class='temperature_small'>${this.weatherInfo[dayNum].temperatureLow} ${TemperatureMeasurement.current}°</span> ${Localization.translateObject[Localization.currentLang].Weather.to} <span class='temperature_small'>${this.weatherInfo[dayNum].temperatureHigh} ${TemperatureMeasurement.current}°</span>`;

    const avgTemperature = Utils.createElement('div', { class: 'weather-card__avg-temperature' });
    avgTemperature.append(Utils.createElement('img', { src: thermometer, width: 40, height: 40 }));
    const avgText = Utils.createElement('div', { class: 'temperature_smallest' });
    avgText.textContent = `${((this.weatherInfo[dayNum].temperatureLow + this.weatherInfo[dayNum].temperatureHigh) / 2).toFixed(2)} ${TemperatureMeasurement.current}°`;
    avgTemperature.append(avgText);

    const dayOfWeek = Utils.createElement('div', { class: 'day-of-week' });
    dayOfWeek.textContent = Utils.getDayOfWeek(this.weatherInfo[dayNum].time);

    element.append(dayOfWeek, img, value, avgTemperature);
    return element;
  }

  getWeatherWidgetDOM() {
    this.weatherWidget = document.createElement('div');
    this.weatherWidget.classList.add('weather-widget');
    this.weatherWidget.append(this.getCurrentWeatherDOM());

    const anotherDays = Utils.createElement('div', { class: 'another-days' });

    for (let day = 1; day < 4; day += 1) {
      anotherDays.append(this.getAnotherDayWeatherDOM(day));
    }

    this.weatherWidget.append(anotherDays);

    return this.weatherWidget;
  }

  changeWidget() {
    if (this.weatherInfo !== undefined) {
      // change current info
      const currentTemperature = document.querySelector('.temperature');

      if (localStorage.getItem('temperatureMeasurement') === 'F') {
        currentTemperature.textContent = `${Utils.toFahrenheit(this.weatherInfo.currently.temperature)} ${TemperatureMeasurement.current}°`;
      } else {
        currentTemperature.textContent = `${this.weatherInfo.currently.temperature} ${TemperatureMeasurement.current}°`;
      }

      const summary = document.querySelector('.weather-parameters__summary');
      summary.textContent = this.weatherInfo.currently.summary;

      const feelsLike = document.querySelector('.weather-parameters__feels-like');
      feelsLike.textContent = `${Localization.translateObject[Localization.currentLang].Weather.feelsLike}: ${this.weatherInfo.currently.apparentTemperature}${TemperatureMeasurement.current} °`;

      const windElement = document.querySelector('.weather-parameters__wind');
      windElement.textContent = `${Localization.translateObject[Localization.currentLang].Weather.wind}: ${this.weatherInfo.currently.windSpeed} m/s`;

      const humidity = document.querySelector('.weather-parameters__humidity');
      humidity.textContent = `${Localization.translateObject[Localization.currentLang].Weather.humidity}: ${(this.weatherInfo.currently.humidity * 100).toFixed(2)}%`;

      // change image
      document.querySelector('.current-weather-info img').src = this.getWeatherIcon(this.weatherInfo.currently.icon).src;

      // change another days
      const cards = document.querySelectorAll('.weather-card');

      cards.forEach((el, index) => {
        const dayNum = index + 1;

        const dayOfWeek = el.querySelector('.day-of-week');
        dayOfWeek.textContent = Utils.getDayOfWeek(this.weatherInfo[dayNum].time);

        const img = el.querySelector('img');
        img.src = this.getWeatherIcon(this.weatherInfo[dayNum].icon, 100).src;

        const value = el.querySelector('.weather-card__temperature-info');
        if (localStorage.getItem('temperatureMeasurement') === 'F') {
          value.innerHTML = `${Localization.translateObject[Localization.currentLang].Weather.from} <span class='temperature_small'>${Utils.toFahrenheit(this.weatherInfo[dayNum].temperatureLow)} ${TemperatureMeasurement.current}°</span> ${Localization.translateObject[Localization.currentLang].Weather.to} <span class='temperature_small'>${Utils.toFahrenheit(this.weatherInfo[dayNum].temperatureHigh)} ${TemperatureMeasurement.current}°</span>`;
        } else {
          value.innerHTML = `${Localization.translateObject[Localization.currentLang].Weather.from} <span class='temperature_small'>${this.weatherInfo[dayNum].temperatureLow} ${TemperatureMeasurement.current}°</span> ${Localization.translateObject[Localization.currentLang].Weather.to} <span class='temperature_small'>${this.weatherInfo[dayNum].temperatureHigh} ${TemperatureMeasurement.current}°</span>`;
        }

        const avg = el.querySelector('.temperature_smallest');
        if (localStorage.getItem('temperatureMeasurement') === 'F') {
          avg.textContent = `${Utils.toFahrenheit(((this.weatherInfo[dayNum].temperatureLow + this.weatherInfo[dayNum].temperatureHigh) / 2).toFixed(2))} ${TemperatureMeasurement.current}°`;
        } else {
          avg.textContent = `${((this.weatherInfo[dayNum].temperatureLow + this.weatherInfo[dayNum].temperatureHigh) / 2).toFixed(2)} ${TemperatureMeasurement.current}°`;
        }
      });
    }
  }

  async translateSummary() {
    if (this.key !== undefined) {
      const url = `https://api.darksky.net/forecast/${this.key}/${this.lat},${this.long}?&exclude=flags, minutely, daily,data, alerts, hourly&units=si&lang=${Localization.currentLang === 'BY' ? 'BE' : Localization.currentLang}`;
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const data = await fetch(proxyUrl + url);
      const res = await data.json();
      this.weatherInfo.currently.summary = res.currently.summary;
      document.querySelector('.weather-parameters__summary').textContent = this.weatherInfo.currently.summary;
    }
  }
}
