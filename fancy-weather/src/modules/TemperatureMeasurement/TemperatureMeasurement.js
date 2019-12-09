import './style.scss';
import Utils from '../Utils/Utils';

export default {
  current: 'C',
  init() {
    const storageValue = localStorage.getItem('temperatureMeasurement');
    if (storageValue !== null && storageValue !== 'C') {
      this.changeMeasurement(storageValue);
    }
  },

  changeMeasurement(to) {
    if (this.current === to) return;
    const activeIndicator = document.querySelector('.active-el');
    if (this.current === 'F') {
      activeIndicator.style.animation = 'toLeft 1s';
      activeIndicator.style.right = '50px';
    } else {
      activeIndicator.style.animation = 'toRight 1s';
      activeIndicator.style.right = '0';
    }

    this.current = to;
    const mainTemp = document.querySelector('.temperature');
    const anotherDaysMinMax = document.querySelectorAll('.temperature_small');
    const anotherDaysAvg = document.querySelectorAll('.temperature_smallest');

    if (to === 'F') {
      mainTemp.textContent = `${Utils.toFahrenheit(this.parseTemperature(mainTemp.textContent))} ${this.current}°`;
      anotherDaysMinMax.forEach((el) => {
        const element = el;
        element.textContent = `${Utils.toFahrenheit(this.parseTemperature(el.textContent))} ${this.current}°`;
      });
      anotherDaysAvg.forEach((el) => {
        const element = el;
        element.textContent = `${Utils.toFahrenheit(this.parseTemperature(el.textContent))} ${this.current}°`;
      });
    } else if (to === 'C') {
      mainTemp.textContent = `${Utils.toCelsius(this.parseTemperature(mainTemp.textContent))} ${this.current}°`;
      anotherDaysMinMax.forEach((el) => {
        const element = el;
        element.textContent = `${Utils.toCelsius(this.parseTemperature(el.textContent))} ${this.current}°`;
      });
      anotherDaysAvg.forEach((el) => {
        const element = el;
        element.textContent = `${Utils.toCelsius(this.parseTemperature(el.textContent))} ${this.current}°`;
      });
    }
    localStorage.setItem('temperatureMeasurement', to);
  },

  parseTemperature(value) {
    return value.slice(0, value.length - 2);
  },

  getDOM() {
    const container = Utils.createElement('div', { class: 'temperature-control-container' });
    const buttonF = Utils.createElement('button', { class: 'temperature-control-container__btn' });
    const buttonC = Utils.createElement('button', { class: 'temperature-control-container__btn' });
    const active = Utils.createElement('div', { class: 'active-el' });

    buttonC.textContent = 'C°';
    buttonF.textContent = 'F°';
    buttonC.addEventListener('click', this.changeMeasurement.bind(this, 'C'));
    buttonF.addEventListener('click', this.changeMeasurement.bind(this, 'F'));
    container.append(buttonC, buttonF, active);
    if (this.current === 'F') {
      active.style.left = '20px';
    }
    return container;
  },
};
