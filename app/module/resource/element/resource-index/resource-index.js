import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ServiceInjectorMixin } from "@dsign/polymer-mixin/service/injector-mixin";
import { LocalizeMixin } from "@dsign/polymer-mixin/localize/localize-mixin";
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-pages/iron-pages';
import './../resource-view-list/resource-view-list'
import './../resource-view-upsert/resource-view-upsert'
import './../../../../element/paper-filter-storage/paper-filter-storage'
import './../../../../element/paper-input-list/paper-input-list'

import { lang } from './language';

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
                  padding-bottom: 8px;
               }
               
              .text-content {
                  font-size: 20px;
                  flex: 1;
               }
               
                paper-icon-button.circle {
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

                .filter-container {
                    display: flex;
                    padding-bottom: 6px;
                }

                .filter-container > * { 
                    padding-right: 6px !important;
                }

                .searchIcon {
                    position: relative;
                    backface-visibility : hidden;
                    padding: 0;
                    height: 20px;
                    width: 20px;
                }

                .flex-slot {
                    display: flex;
                }

                .rotate-up {
                    transform: rotate(0deg);
                    transition: transform 1s linear;
                }
                  
                .rotate-down {
                    transform: rotate(180deg);
                    transition: transform 1s linear;
                }
            </style>
            <iron-pages id="index" selected="{{selected}}">
                <div id="list"> 
                    <resource-view-list id="viewList" selected="{{selected}}" entity-selected="{{entitySelected}}">
                        <div slot="header" class="header">
                            <paper-filter-storage id="filterStorage" on-value-changed="_filterChange">
                                <div slot="filters" class="filter-container">
                                    <paper-input name="name" label="{{localize('name')}}"></paper-input>
                                    <paper-dropdown-menu id="type" name="type" label="{{localize('type')}}" style="padding:0px">
                                        <paper-listbox slot="dropdown-content" class="dropdown-content">
                                            <dom-repeat id="menu" items="{{resourceType}}" as="type">
                                                <template>
                                                    <paper-item value="{{type.value}}">{{type.name}}</paper-item>
                                                </template>
                                            </dom-repeat>
                                        </paper-listbox>
                                    </paper-dropdown-menu>
                                    <paper-input name="size" type="number" label="{{localize('size')}}" min="0" direction="down">
                                        <div slot="suffix" class="flex-slot">
                                            <div>MB</div>
                                            <paper-icon-button icon="resource:low_arrow" alt="clear" title="clear" class="searchIcon" on-tap="toggleDimension"></paper-icon-button>
                                        </div>
                                    </paper-input>
                                    <paper-input name="height" type="number" label="{{localize('height')}}"  min="0" direction="down">
                                        <div slot="suffix" class="flex-slot">
                                            <div>MB</div>
                                            <paper-icon-button icon="resource:low_arrow" alt="clear" title="clear" class="searchIcon" on-tap="toggleDimension"></paper-icon-button>
                                        </div>    
                                    </paper-input>
                                    <paper-input name="width" type="number" label="{{localize('width')}}"  min="0" direction="down">
                                        <div slot="suffix" class="flex-slot">      
                                            <div>MB</div>
                                            <paper-icon-button icon="resource:low_arrow" alt="clear" title="clear" class="searchIcon" on-tap="toggleDimension"></paper-icon-button>
                                        </div> 
                                    </paper-input>
                                    <paper-input-list name="tags" label="{{localize('tags')}}"></paper-input-list>
                                </div>
                            </paper-filter-storage>
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

    static get properties() {
        return {

            resourceType: {
                value: [
                    { "name": "jpg", "value": "image/jpeg" },
                    { "name": "png", "value": "image/png" },
                    { "name": "mp4", "value": "video/mp4" },
                    { "name": "mp4", "value": "video/mp4" },
                    { "name": "webm", "value": "video/webm" },
                    { "name": "audio (ogg)", "value": "audio/ogg" },
                    { "name": "zip", "value": "application/zip" },
                ]
            },

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
        };
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

     /**
     * 
     * @param {Event} evt 
     */
    toggleDimension(evt) {

        let ele = evt.target.parentElement.parentElement;
        let direction = ele.getAttribute('direction');
        if (direction === 'down') {
            ele.setAttribute('direction', 'up');
            evt.target.className = 'searchIcon rotate-down'; 

        } else {
            ele.setAttribute('direction', 'down');
            evt.target.className = 'searchIcon rotate-up'; 

        }

        if (ele.value) {
            ele.dispatchEvent(new CustomEvent(
                'value-changed', 
                 { detail: {value: ele.value,}}
            ));
        }
    }

}
window.customElements.define('resource-index', ResourceIndex);