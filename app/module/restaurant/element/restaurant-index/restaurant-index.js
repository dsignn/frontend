import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-pages/iron-pages';
import {lang} from './language';

/**
 * @customElement
 * @polymer
 */
class RestaurantIndex extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {

    static get template() {
        return html`
         
            <style>
                   
               .header {
                  @apply --layout-horizontal;
                  @apply --layout-center;
                  padding: 10px 20px;
               }
               
              .text-content {
                  font-size: 20px;
                  flex: 1;
               }
               
            
                paper-icon-button.circle {
                    @apply --paper-icon-button-action;
                }
            </style>
            <iron-pages id="index" selected="{{selected}}">
                <div id="list"> 
                    LIST
                </div>
                <div id="insert"> 
                   INSERT
                </div>
                <div id="update"> 
                    UPDATE
                </div>
            </iron-pages>
    `;
    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties () {
        return {
            selected: {
                type: Number,
                value: 0
            },

            /**
             * @type object
             */
            services : {
                value : {
                    _localizeService: 'Localize'
                }
            },
        };
    }

    /**
     * @param evt
     */
    displayAddView(evt) {
        this.selected = 1;
    }

    /**
     * @param evt
     */
    displayListView(evt) {
        this.selected = 0;
    }
}
window.customElements.define('restaurant-index', RestaurantIndex);