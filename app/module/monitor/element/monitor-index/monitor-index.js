import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";

import '@polymer/iron-pages/iron-pages';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-tooltip/paper-tooltip';
import '@polymer/iron-pages/iron-pages';
import '../monitor-view-list/monitor-view-list';
import '../monitor-view-upsert/monitor-view-upsert';
import './../../../../element/paper-filter-storage/paper-filter-storage'
import {lang} from './language';

/**
 * @class MonitorIndex
 */
class MonitorIndex extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {

    static get template() {
        return html`
       <style >
       
        .header {
            @apply --layout-horizontal;
            @apply --layout-center;
            padding-bottom: 8px;
        }
        
        .text-content {
            font-size: 20px;
            flex: 1;
        }
        
        .circle {
            @apply --paper-icon-button-action;
        }
        
        paper-filter-storage {
            flex: 1;
            --paper-filter-storage : {
                padding: 0 8px;
                align-items: center;
                display: flex;
                min-height: 70px;
                width: -webkit-fill-available;
                margin-right: 8px;
            }
        }
       
       </style>
       <iron-pages id="index" selected="{{selected}}">
            <div id="list">
                <monitor-view-list id="viewList" selected="{{selected}}" entity-selected="{{entitySelected}}">
                    <div slot="header" class="header">
                        <paper-filter-storage id="filterStorage" on-value-changed="_filterChange">
                            <div slot="filters" class="filter-container">
                                <paper-input name="name" label="{{localize('name')}}" ></paper-input>
                            </div>
                        </paper-filter-storage>
                        <paper-icon-button id="iconInsertMonitor" icon="insert" class="circle" on-click="displayAddView"></paper-icon-button>
                        <paper-tooltip for="iconInsertMonitor" position="left">{{localize('insert-monitor')}}</paper-tooltip>
                     </div>
                </monitor-view-list>
            </div>
            <div id="insert">
                <monitor-view-upsert>
                    <div slot="header" class="header">
                        <div class="text-content">{{localize('insert-monitor')}}</div>
                        <paper-icon-button id="iconInsertMonitor" icon="arrow-back" class="circle" on-click="displayListView"></paper-icon-button>
                        <paper-tooltip for="iconInsertMonitor" position="left">{{localize('insert-monitor')}}</paper-tooltip>
                     </div>
                </monitor-view-upsert>  
            </div>
            <div id="update">
                <monitor-view-upsert entity="{{entitySelected}}">
                    <div slot="header" class="header">
                        <div class="text-content">{{localize('insert-monitor')}}</div>
                        <paper-icon-button id="iconInsertMonitor" icon="arrow-back" class="circle" on-click="displayListView"></paper-icon-button>
                        <paper-tooltip for="iconInsertMonitor" position="left">{{localize('insert-monitor')}}</paper-tooltip>
                     </div>
                </monitor-view-upsert>  
            </div>
       </iron-pages>`;
    }

    /**
     * Property
     */
    static get properties() {
        return {

            /**
             * @type Number
             */
            selected: {
                type: Number,
                value: 0
            },

            /**
             * @type object
             */
            services: {
                value: {
                    _localizeService: 'Localize'
                }
            },
        }
    }

    /**
     * @constructor
     */
    constructor() {
        super();
        this.resources = lang;
    }

    _filterChange(evt) {
        this.$.viewList.filter = JSON.parse(JSON.stringify(evt.detail));
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

window.customElements.define('monitor-index', MonitorIndex);
