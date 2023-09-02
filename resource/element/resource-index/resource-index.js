import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-pages/iron-pages';
import './../resource-view-list/resource-view-list'
import './../resource-view-upsert/resource-view-upsert'
import {lang} from './language';

/**
 * @customElement
 * @polymer
 */
class ResourceIndex extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {

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
                    <resource-view-list selected="{{selected}}" entity-selected="{{entitySelected}}">
                         <div slot="header" class="header">
                            <div class="text-content">{{localize('list-resource')}}</div>
                            <paper-icon-button id="iconInsertMonitor" icon="insert" class="circle" on-click="displayAddView"></paper-icon-button>
                            <paper-tooltip for="iconInsertMonitor" position="left">{{localize('insert-resource')}}</paper-tooltip>
                         </div>
                    </resource-view-list>
                </div>
                <div id="insert"> 
                    <resource-view-upsert>
                        <div slot="header" class="header">
                            <div class="text-content">{{localize('insert-resource')}}</div>
                            <paper-icon-button id="iconBackInsert" icon="arrow-back" class="circle" on-click="displayListView"></paper-icon-button>
                            <paper-tooltip for="iconBackInsert" position="left">{{localize('back')}}</paper-tooltip>
                        </div>
                    </resource-view-upsert>
                </div>
                <div id="update"> 
                    <resource-view-upsert entity="{{entitySelected}}">
                        <div slot="header" class="header">
                            <div class="text-content">{{localize('update-resource')}}</div>
                            <paper-icon-button id="iconBackUpdate" icon="arrow-back" class="circle" on-click="displayListView"></paper-icon-button>
                            <paper-tooltip for="iconBackUpdate" position="left">{{localize('back')}}</paper-tooltip>
                        </div>
                    </resource-view-upsert>
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
window.customElements.define('resource-index', ResourceIndex);