
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-pages/iron-pages.js';

/**
 * @class MonitorIndex
 */
class MonitorIndex extends PolymerElement {

  static get template() {
    return html`
       <iron-pages id="index" selected="{{selected}}">
            <div id="list">
            list
            </div>
            <div id="insert">
              insert  
            </div>
            <div id="update">
            update
            </div>
       </iron-pages>`;
  }

  static get properties() {
    return {

      selected: {
        type: Number,
        value: 0
      }
    }
  }
}

window.customElements.define('monitor-index', MonitorIndex);
