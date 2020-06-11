import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-pages/iron-pages.js';

/**
 * @class MonitorViewList
 */
class MonitorViewList extends PolymerElement {

    static get template() {
        return html`
        <slot name="header"></slot>
        <div id="container">
            <template is="dom-repeat" items="[[entities]]" as="monitor">
                {{monitor.name}}
            </template>
        </div>`;
    }
}

window.customElements.define('monitor-index', MonitorViewList);