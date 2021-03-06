import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-pages/iron-pages';
import '../timeslot-view-list/timeslot-view-list'
import '../timeslot-view-upsert/timeslot-view-upsert'
import {lang} from './language';

/**
 * @customElement
 * @polymer
 */
class TimeslotIndex extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {

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
                    <timeslot-view-list selected="{{selected}}" entity-selected="{{entitySelected}}">
                         <div slot="header" class="header">
                            <div class="text-content">{{localize('list-timeslot')}}</div>
                            <paper-icon-button id="iconInsertMonitor" icon="insert" class="circle" on-click="displayAddView"></paper-icon-button>
                            <paper-tooltip for="iconInsertMonitor" position="left">{{localize('insert-timeslot')}}</paper-tooltip>
                         </div>
                    </timeslot-view-list>
                </div>
                <div id="insert"> 
                    <timeslot-view-upsert>
                        <div slot="header" class="header">
                            <div class="text-content">{{localize('insert-timeslot')}}</div>
                            <paper-icon-button id="iconBackInsert" icon="arrow-back" class="circle" on-click="displayListView"></paper-icon-button>
                            <paper-tooltip for="iconBackInsert" position="left">{{localize('back')}}</paper-tooltip>
                        </div>
                    </timeslot-view-upsert>
                </div>
                <div id="update"> 
                     <timeslot-view-upsert entity="{{entitySelected}}">
                        <div slot="header" class="header">
                            <div class="text-content">{{localize('update-timeslot')}}</div>
                            <paper-icon-button id="iconBackInsert" icon="arrow-back" class="circle" on-click="displayListView"></paper-icon-button>
                            <paper-tooltip for="iconBackInsert" position="left">{{localize('back')}}</paper-tooltip>
                        </div>
                    </timeslot-view-upsert>
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

            /**
             * @type number
             */
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
            }
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
window.customElements.define('timeslot-index', TimeslotIndex);
