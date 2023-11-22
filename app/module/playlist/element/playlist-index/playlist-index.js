import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ServiceInjectorMixin } from "@dsign/polymer-mixin/service/injector-mixin";
import { LocalizeMixin } from "@dsign/polymer-mixin/localize/localize-mixin";
import { AclMixin } from '@dsign/polymer-mixin/acl/acl-mixin';
import '@polymer/iron-pages/iron-pages';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-tabs/paper-tabs';
import '../playlist-view-list/playlist-view-list'
import '../playlist-view-upsert/playlist-view-upsert'
import {autocompleteStyle} from "../../../../element/paper-autocomplete/autocomplete-custom-style";

import { lang } from './language';

/**
 * @customElement
 * @polymer
 */
class PlaylistIndex extends AclMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {

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
            </style>
            <iron-pages id="index" selected="{{selected}}">
                <div id="list"> 
                    <playlist-view-list id="viewList" selected="{{selected}}" entity-selected="{{entitySelected}}">
                        <div slot="header" class="header">
                            <paper-filter-storage id="filterStorage" on-value-changed="_filterChange" on-value-deselect="_filterChange">
                                <div slot="filters" class="filter-container">
                                    <template id="domIf" is="dom-if" if="{{isAllowed('playlist', 'search-organization')}}">
                                        <paper-autocomplete
                                            id="orgAutocomplete"
                                            name="organization_reference"
                                            label="{{localize('name-organization')}}"
                                            text-property="name"
                                            value-property="name"
                                            remote-source
                                            on-autocomplete-change="_defaultChanged"
                                            required>
                                                <template slot="autocomplete-custom-template">
                                                ${autocompleteStyle}
                                                    <paper-item class="account-item" on-tap="_onSelect" role="option" aria-selected="false">
                                                        <div index="[[index]]">
                                                            <div class="service-name">[[item.name]]</div>
                                                        </div>
                                                    </paper-item>
                                                </template>
                                        </paper-autocomplete>
                                    </template>
                                    <paper-input name="name" label="{{localize('name')}}" ></paper-input>
                                </div>
                            </paper-filter-storage>
                            <paper-icon-button id="iconBackInsert" icon="insert" class="circle" on-click="displayAddView"></paper-icon-button>
                            <paper-tooltip for="iconBackInsert" position="left">{{localize('insert-playlist')}}</paper-tooltip>
                        </div>
                    </playlist-view-list>
                </div>
                <div id="insert"> 
                    <playlist-view-upsert>
                        <div slot="header" class="header">
                            <div class="text-content">{{localize('insert-playlist')}}</div>
                            <paper-icon-button id="iconBackInsert" icon="arrow-back" class="circle" on-click="displayListView"></paper-icon-button>
                            <paper-tooltip for="iconBackInsert" position="left">{{localize('back')}}</paper-tooltip>
                        </div>
                    </playlist-view-upsert>
                </div>
                <div id="update"> 
                    <playlist-view-upsert entity="{{entitySelected}}">
                        <div slot="header" class="header">
                            <div class="text-content">{{localize('update-playlist')}}</div>
                            <paper-icon-button id="iconBackUpdate" icon="arrow-back" class="circle" on-click="displayListView"></paper-icon-button>
                            <paper-tooltip for="iconBackUpdate" position="left">{{localize('back')}}</paper-tooltip>
                        </div>
                    </playlist-view-upsert>
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
            services: {
                value: {
                    _localizeService: 'Localize',
                    _aclService: "Acl",
                    StorageContainerAggregate : {
                      organizationStorage: "OrganizationStorage"
                    }
                }
            }
        };
    }

    /**
    * @param evt
    * @private
    */
    _defaultChanged(evt) {
        if(!this.organizationStorage) {
            return;
        } 

        this.organizationStorage
            .getAll({ name: evt.detail.value.text })
            .then(
                (data) => {
                    this.shadowRoot.querySelector('#orgAutocomplete').suggestions(data);
                }
            );
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
window.customElements.define('playlist-index', PlaylistIndex);
