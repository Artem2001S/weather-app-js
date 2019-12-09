import './localization-style.scss';
import Utils from '../Utils/Utils';
import YandexMaps from '../YandexMaps/YandexMaps';
import Search from '../Search/Search';

export default {
  translateObject: {
    EN: {
      YandexMaps: {
        longitude: 'Longitude',
        latitude: 'Latitude',
      },
      Search: {
        searchBtnText: 'Search',
      },
      Utils: {
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
      Weather: {
        from: 'from',
        to: 'to',
        feelsLike: 'Feels like',
        wind: 'Wind',
        humidity: 'Humidity',
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        daysSmall: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      alerts: {
        error: 'An error occurred',
        noValue: 'Enter the required data',
        noImage: 'Could not upload a new image. Last image uploaded',
      },
    },
    RU: {
      YandexMaps: {
        longitude: 'Долгота',
        latitude: 'Широта',
      },
      Search: {
        searchBtnText: 'Поиск',
      },
      Utils: {
        days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      },
      Weather: {
        from: 'от',
        to: 'до',
        feelsLike: 'Ощущается как',
        wind: 'Ветер',
        humidity: 'Влажность',
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        daysSmall: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      },
      alerts: {
        error: 'Произошла ошибка',
        noValue: 'Введите необходимые данные',
        noImage: 'Не удалось загрузить новое изображение. Загружено последнее изображение.',
      },
    },
    BY: {
      YandexMaps: {
        longitude: 'Даўгата',
        latitude: 'Шырата',
      },
      Search: {
        searchBtnText: 'Пошук',
      },
      Utils: {
        days: ['Нядзеля', 'Панядзелак', 'Аўторак', 'Асяроддзе', 'Чацвер', 'Пятніца', 'Субота'],
      },
      Weather: {
        from: 'ад',
        to: 'да',
        feelsLike: 'Адчуваецца як',
        wind: 'Вецер',
        humidity: 'Вільготнасць',
        months: ['Студзень', 'Люты', 'Сакавік', 'Красавік', 'Май', 'Чэрвень', 'Ліпень', 'Жнівень', 'Верасень', 'Кастрычнік', 'Лістапад', 'Снежань'],
        daysSmall: ['Пн', 'Аў', 'Ср', 'Чц', 'Пт', 'Сб', 'Нд'],
      },
      alerts: {
        error: 'Адбылася памылка',
        noValue: 'Увядзіце неабходныя дадзеныя',
        noImage: 'Немагчыма загрузіць новы малюнак. Апошняе загружанае малюнак',
      },
    },
  },

  init() {
    if (this.select !== undefined) {
      this.select.value = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'EN';
      document.documentElement.lang = this.select.value;
    }
  },

  getDOM() {
    const langsSelector = Utils.createElement('div', { class: 'langs' });
    const select = Utils.createElement('select', { class: 'langs__select' });
    const en = Utils.createElement('option', { class: 'langs__select-option' });
    en.textContent = 'EN';

    const ru = Utils.createElement('option', { class: 'langs__select-option' });
    ru.textContent = 'RU';

    const by = Utils.createElement('option', { class: 'langs__select-option' });
    by.textContent = 'BY';

    select.append(en, ru, by);
    langsSelector.append(select);
    const that = this;
    select.addEventListener('change', () => {
      that.translateApplication(select.options[select.selectedIndex].textContent);
    });
    this.select = select;
    return langsSelector;
  },

  async translateApplication(language) {
    Utils.addPreloader();
    const langFrom = localStorage.getItem('lang') || 'EN';
    this.currentLang = language;
    localStorage.setItem('lang', language);
    await YandexMaps.translate(langFrom);
    Search.translate();
    this.weatherObject.changeWidget();
    await this.weatherObject.translateSummary();
    document.documentElement.lang = language;
    setTimeout(() => {
      Utils.deletePreloader();
    }, 400);
  },
};
