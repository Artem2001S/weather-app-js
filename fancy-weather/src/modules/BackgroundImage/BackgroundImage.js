import Utils from '../Utils/Utils';
import updImageIcon from '../../assets/control-panel/update-image.svg';
import './background-image.scss';
import Localization from '../Localization/Localization';

export default {
  async loadImage(queryForUnsplash, unsplashClientId) {
    try {
      const data = await fetch(`https://api.unsplash.com/search/photos?page=${Utils.getRandomNumber(2, 500)}&query=${queryForUnsplash}&client_id=${unsplashClientId}`);

      /* eslint-disable */
      if (data.status === 403) {
        console.clear();
      }
      /* eslint-enable */

      const urls = await data.json();
      let imageType = 'regular';
      if (window.innerWidth < 900) imageType = 'small';
      if (window.innerWidth < 330) imageType = 'thumb';

      const urlToImage = urls.results[Utils.getRandomNumber(1, 9)].urls[imageType];
      localStorage.setItem('urlToLastImage', urlToImage);
    } catch (e) {
      Utils.showAlert(Localization.translateObject[Localization.currentLang].alerts.noImage, 5000);
    } finally {
      const urlToImage = localStorage.getItem('urlToLastImage');
      if (urlToImage === null) {
        Utils.deletePreloader();
      } else {
        const img = Utils.createElement('img', { src: urlToImage });
        img.onload = function onImageLoad() {
          document.body.style.backgroundImage = `url('${urlToImage}')`;
          Utils.deletePreloader();
        };
      }
    }
  },

  getImageChangeTool() {
    const res = Utils.createElement('div', { class: 'change-bg' });
    const that = this;
    const icon = Utils.createElement('img', { src: updImageIcon, class: 'change-bg__icon' });
    res.append(icon);
    res.addEventListener('click', async () => {
      Utils.addPreloader();
      await that.loadImage(that.defaultQuery, that.unsplashId);
      Utils.deletePreloader();
    });
    this.buttonToChangeBackground = res;
    return res;
  },
};
