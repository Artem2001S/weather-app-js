import preLoaderGif from '../../assets/loader.gif';
import Localization from '../Localization/Localization';

export default {
  createElement(tagName, properties) {
    const element = document.createElement(tagName);
    if (properties !== undefined) {
      const keys = Object.keys(properties);
      keys.forEach((key) => {
        element.setAttribute(key, properties[key]);
      });
    }
    return element;
  },

  convertToDegreesAndMinutes(value) {
    return `${value.toFixed(0)}°${Math.round((value % 1) * 60)}'`;
  },

  getDayOfWeek(time) {
    const { days } = Localization.translateObject[Localization.currentLang].Utils;
    return days[new Date(time).getDay()];
  },

  getCurrentDateTime(newDate) {
    const daysEng = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const { daysSmall } = Localization.translateObject[Localization.currentLang].Weather;
    const { months } = Localization.translateObject[Localization.currentLang].Weather;
    const date = newDate || new Date();

    const day = daysSmall[daysEng.indexOf(date.toDateString().split(' ')[0])];
    const d = `${day} ${date.toDateString().split(' ')[2]} ${months[date.getMonth()]}`;
    const time = date.toLocaleTimeString().split(':').slice(0, 2).join(':');
    return `${d} ${time}`;
  },

  createPreloader() {
    const container = this.createElement('div', { class: 'preloader' });
    const image = this.createElement('img', { class: 'preloader__gif' });
    image.src = preLoaderGif;
    container.append(image);
    container.style.opacity = '0.8';
    document.body.append(container);
  },

  addPreloader() {
    document.querySelector('.preloader').style.display = 'flex';
  },

  deletePreloader() {
    document.querySelector('.preloader').style.animation = 'hide 0.5s';
    setTimeout(() => {
      document.querySelector('.preloader').style.animation = '';
      document.querySelector('.preloader').style.display = 'none';
    }, 460);
  },

  getQueryForUnsplash(geoInfo) {
    const date = this.datetime;
    return `${this.getTimeOfYear(date)} weather`;
    //return `${this.getTimeOfDay(date)}, ${this.getTimeOfYear(date)}, ${geoInfo.summary} weather`;
  },

  getTimeOfDay(date) {
    let currentDate = new Date();
    if (date !== undefined) {
      currentDate = date;
    }
    const hours = currentDate.getHours();
    if (hours >= 20 || hours < 6) return 'night';
    if (hours >= 16) return 'evening';
    if (hours >= 12) return 'day';
    if (hours >= 6) return 'morning';
    return '';
  },

  getTimeOfYear(date) {
    let currentDate = new Date();
    if (date !== undefined) {
      currentDate = date;
    }
    const month = currentDate.getMonth();
    if (month === 11) return 'winter';
    if (month >= 8) return 'autumn';
    if (month >= 5) return 'summer';
    if (month >= 2) return 'spring';
    if (month >= 0) return 'winter';
    return '';
  },

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  showAlert(text, timeout) {
    const alert = this.createElement('div', { class: 'alert' });
    alert.textContent = text;
    document.body.append(alert);
    setTimeout(() => {
      alert.style.animation = 'hide 2s';
    }, timeout - 2000);
    setTimeout(() => {
      document.body.removeChild(alert);
    }, timeout);
  },

  toFahrenheit(value) {
    const pointOfIceMelting = 32;
    return (value * (9 / 5) + pointOfIceMelting).toFixed(2);
  },
  toCelsius(value) {
    return (((value - 32) / 2) * (1 + 1 / 9)).toFixed(2);
  },
};
