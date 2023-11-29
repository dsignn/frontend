import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {NotifyMixin} from "@dsign/polymer-mixin//notify/notify-mixin";
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin";
import '@polymer/paper-input/paper-input';
import '@fluidnext-polymer/paper-autocomplete/paper-autocomplete';
import '@polymer/iron-form/iron-form';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-tooltip/paper-tooltip';
import '../../../../element/paper-input-points/paper-input-points';

import {customAutocomplete} from '../../../../element/custom-autocomplete/custom-autocomplete';
import {lang} from './language';
import { AclMixin } from '@dsign/polymer-mixin/acl/acl-mixin';

/**
 * @class DeviceViewUpsert
 */
class DeviceViewUpsert extends StorageEntityMixin(NotifyMixin(AclMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement))))) {

    static get template() {
        return html`
        <style>
        
            #monitorUpdate {
                margin-bottom: 10px;
            }
        
            #container {
                @apply --layout-vertical;
                padding: 10px 20px;
                display: flex;
                flex-direction: column !important;
            }
            
            #content-left {
                padding-right: 8px;
            }

            .monitors {
                display: flex;
                flex-direction: row;
            }

            .monitor {
                flex:1;
                text-align: center;
                padding: 6px;
                font-size: 18px;
            }
            
            .title {
                background: white;
            }
            
            paper-card {
                width: 100%;
                padding: 10px;
            }
        
            @media (max-width: 900px) {
                #container {
                    @apply --layout-vertical-reverse;
                }
            
                #content-left {
                    @apply --layout-flex;
                }
                
                #content-right {
                    @apply --layout-flex;
                }
            }
                
            @media (min-width: 901px) {
                #container {
                     @apply  --layout-horizontal;
                }
            
                #content-left {
                   @apply --layout-flex-8;
                }
                
                #content-right {
                   @apply --layout-flex-4;
                }
            }
        </style>
        <slot name="header"></slot>
        <div id="container">
            
            <paper-autocomplete 
                id="autocompleteMonitors"
                label="{{localize('monitor')}}" 
                text-property="name"
                value-property="name"
                on-autocomplete-change="_searchMonitors"
                on-autocomplete-selected="_selectMonitors"
                remote-source>
                <template slot="autocomplete-custom-template">
                    ${customAutocomplete}
                    <paper-item class="account-item" on-tap="_onSelect" role="option" aria-selected="false">
                        <div index="[[index]]">
                            <div class="service-name">[[item.name]]</div>
                            <div class="service-description">[[item.type]]</div>
                        </div>
                        <paper-ripple></paper-ripple>
                    </paper-item>
                </template>
            </paper-autocomplete>
            <div class="monitors">
                <template is="dom-repeat" items="[[monitors]]" id="labels-row">
                    <div class="monitor" monitor="{{item}}">
                        <div class="title">[[item.name]]</div>
                        <paper-autocomplete 
                            label="{{localize('playlist')}}" 
                            text-property="name"
                            value-property="name"
                            on-autocomplete-change="_searchPlaylist"
                            on-autocomplete-selected="_selectPlaylist"
                            remote-source>
                            <template slot="autocomplete-custom-template">
                                ${customAutocomplete}
                                <paper-item class="account-item" on-tap="_onSelect" role="option" aria-selected="false">
                                    <div index="[[index]]">
                                        <div class="service-name">[[item.name]]</div>
                                        <div class="service-description">[[item.type]]</div>
                                    </div>
                                    <paper-ripple></paper-ripple>
                                </paper-item>
                            </template>
                        </paper-autocomplete>
                    </div>
                    
                </template>
            </div>
        </div>`;
    }
    static get properties() {
        return {

            entity: {
                observer: '_entityChanged'
            },

            /**
             * @type Number
             */
            /**
             * @type string
             */
            labelAction: {
                type: String,
                value: 'save'
            },

            monitor: {
                observer: '_monitorChanged'
            },

            monitors: {
         
            },

            /**
             * @type object
             */
            services: {
                value: {
                    _localizeService: 'Localize',
                    _notifyService: 'Notify',
                    _aclService: "Acl",
                    "HydratorContainerAggregate" : {
                        _monitorHydrator : "MonitorEntityHydrator"
                    },
                    StorageContainerAggregate : {
                        _playlistStorage :"PlaylistStorage",
                        _monitorStorage :"MonitorStorage"
                    }
                }
            },
        };
    }

    constructor() {
        super();
        this.resources = lang;
    }
/*
    static get observers() {
        return [
          '_changeMonitor(entity.monitor)'
        ];
      }
*/
    /**
     * @param evt
     * @private
     */
     _searchMonitors(evt) {
        if (!this._monitorStorage) {
            return;
        }

        this._monitorStorage.getAll({name : evt.detail.value.text})
            .then((filter) => {

                evt.detail.target.suggestions(
                    filter
                );
            });
    }

    _selectMonitors(evt) {
      
        this.monitor = evt.detail.value;
        setTimeout(
            () => {
                this.$.autocompleteMonitors.clear();
                this.notifyPath('entity');
            },
            200
        )
    }

    _searchPlaylist(evt) {
        if (!this._playlistStorage) {
            return;
        }

        let search = {name : evt.detail.value.text};
        search['monitor_container'] =  {};
        search['monitor_container'].id = evt.target.parentElement.monitor.id;
        search['monitor_container'].parentId =  this.monitor.id 

        this._playlistStorage.getAll(search)
            .then((filter) => {

                evt.detail.target.suggestions(
                    filter
                );
            });
    }

    _entityChanged(newValue) {
        console.log('FFFFFFFFF', newValue);
    }

    _monitorChanged(newValue) {
        console.log('BBBBBBBBBBBBBB', newValue);
        this.monitors = newValue.getMonitors();
    }
}

window.customElements.define('device-view-upsert', DeviceViewUpsert);