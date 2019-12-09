import './control-panel.scss';
import Utils from '../Utils/Utils';
import BackgroundImage from '../BackgroundImage/BackgroundImage';
import TemperatureMeasurement from '../TemperatureMeasurement/TemperatureMeasurement';
import Search from '../Search/Search';
import Localization from '../Localization/Localization';

export default class ControlPanel {
  constructor() {
    this.controlPanel = Utils.createElement('header', { class: 'header' });
    this.controlPanel.append(BackgroundImage.getImageChangeTool());
    this.controlPanel.append(TemperatureMeasurement.getDOM());
    this.controlPanel.append(Search.getDOM());
    this.controlPanel.append(Localization.getDOM());
  }

  getControlPanel() {
    return this.controlPanel;
  }
}
