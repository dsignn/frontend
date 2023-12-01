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
import './../monitor-plylist-viewer/monitor-playlist-viewer';

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

            monitor-playlist-viewer {
                flex: 1;
                margin-right: 4px;
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
            <iron-form id="formDevice">
                <form method="post">
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
                    <div id="monPlay" class="monitors">
                        <template is="dom-repeat" items="[[monitors]]" id="labels-row">
                            <monitor-playlist-viewer monitor="{{item}}" monitor-container="[[monitor]]"></monitor-playlist-viewer>
                        </template>
                    </div>
                    <div class="layout-horizontal layout-end-justified">
                        <paper-button on-tap="submitDeviceButton">{{localize(labelAction)}}</paper-button>
                    </div>
                </form>
            </iron-form>
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
                value: 'update'
            },

            monitor: {
                notify: true
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
                    StorageContainerAggregate : {
                        _playlistStorage :"PlaylistStorage",
                        _monitorStorage :"MonitorStorage",
                        _storage :"DeviceStorage",
                    }
                }
            },
        };
    }

    constructor() {
        super();
        this.resources = lang;
    }

    ready() {
        super.ready();
        this.$.formDevice.addEventListener('iron-form-presubmit', this.submitDevice.bind(this));
    }

    /**
     * @param {CustomEvent} evt
     */
     submitDeviceButton(evt) {
        this.$.formDevice.submit();
    }

    submitDevice(evt) {

        evt.preventDefault();
        this.entity.monitor = this.monitor;
        this._storage.save(this.entity)
            .then((data) => {
                this.notify(this.localize('notify-update'));
            });
    }

    _entityChanged(newValue) {
       
        if (newValue.monitor && newValue.monitor.id) {

            this._monitorStorage.get(newValue.monitor.id)
                .then((monitor) => {
                    this.monitor = monitor;
                    setTimeout(
                        () => {
                            this.sendMessageToChild('change-monitor');
                        },
                        200
                    );
                });
        }

        if (newValue.monitor && newValue.monitor.monitors) { 
            this.monitors = newValue.monitor.monitors;
        } else {
            this.monitors = [];
        }

    }

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
        this.monitors =  this.monitor.getMonitors();
        
        setTimeout(
            () => {
                let nodes = this.$.monPlay.children;
              
                this.sendMessageToChild('select-monitor');
                this.$.autocompleteMonitors.clear();
                this.notifyPath('entity');
            },
            200
        )
    }

    sendMessageToChild(event) {
        let nodes = this.$.monPlay.children;
        for (let cont = 0; nodes.length > cont; cont++) {
            nodes[cont].dispatchEvent(new CustomEvent(event, {}));
        }
    }
}

window.customElements.define('device-view-upsert', DeviceViewUpsert);