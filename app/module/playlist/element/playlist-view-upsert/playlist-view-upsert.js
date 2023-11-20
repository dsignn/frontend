import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin";
import '@polymer/paper-checkbox/paper-checkbox';
import '@fluidnext-polymer/paper-autocomplete/paper-autocomplete';
import '@fluidnext-polymer/paper-chip/paper-chips';
import '@polymer/iron-form/iron-form';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-tooltip/paper-tooltip';
import '@polymer/iron-flex-layout/iron-flex-layout';

import {AudioEntity} from '../../../resource/src/entity/AudioEntity';
import {VideoEntity} from '../../../resource/src/entity/VideoEntity';


import {customAutocomplete} from '../../../../element/custom-autocomplete/custom-autocomplete';
import {lang} from './language';

/**
 * @customElement
 * @polymer
 */
class PlaylistViewUpsert extends StorageEntityMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
                <style>
                    div#container {
                        margin-top: 8px;
                    }
                    
                    #monitorUpdate paper-monitor-update {
                      margin-bottom: 4px;
                    }
                                        
                    #content-left {
                        padding-right: 8px;
                    }
                
                    paper-card.container {
                        @apply --paper-card-container;
                    }
                    
                    iron-icon.info {
                        @apply --info-cursor;
                    }
                
                    @media (max-width: 900px) {
                       
                    }
                        
                    @media (min-width: 901px) {
                        
                    }
                </style>
                <slot name="header"></slot>
                <iron-form id="formPlaylist">
                    <form method="post">
                        <div id="container">
                            <paper-input id="name" name="name" label="{{localize('name')}}" value="{{entity.name}}" required></paper-input>
                            <paper-checkbox checked="{{entity.enableAudio}}" style="padding-top: 20px;">{{localize('enable-audio')}} <i>({{localize('working-only-video')}})</i></paper-checkbox>
                            <paper-autocomplete 
                                id="autocompleteMonitor"
                                label="{{localize('monitor')}}" 
                                text-property="name"
                                value-property="name"
                                on-autocomplete-change="_searchMonitor"
                                value="{{entity.monitorContainerReference}}"
                                remote-source>
                                    <template slot="autocomplete-custom-template">
                                        ${customAutocomplete}
                                        <paper-item class="account-item" on-tap="_onSelect" role="option" aria-selected="false">
                                            <div index="[[index]]">
                                                <div class="service-name">[[item.name]]</div>
                                                <div class="service-description">[[item.parent.name]]</div>
                                            </div>
                                            <paper-ripple></paper-ripple>
                                        </paper-item>
                                    </template>
                            </paper-autocomplete>   
                            <paper-autocomplete 
                                id="autocompleteResource"
                                label="{{localize('resources')}}" 
                                text-property="name"
                                value-property="name"
                                on-autocomplete-selected="_selectResource"
                                on-autocomplete-change="_searchResource"
                                remote-source>
                                <template id="resourceStyle" slot="autocomplete-custom-template">
                                    ${customAutocomplete}
                                    <paper-item class="account-item" on-tap="_onSelect" role="option" aria-selected="false">
                                        <div index="[[index]]">
                                            <div class="service-name">[[item.name]]</div>
                                            <div class="service-description">[[item.mimeType]] {{calcSize(item)}}</div>
                                        </div>
                                        <paper-ripple></paper-ripple>
                                    </paper-item>
                                </template>
                            </paper-autocomplete>
                            <paper-chips id="listResource" items="{{entity.resources}}"></paper-chips> 
                            <paper-autocomplete 
                                id="autocompleteBindPlaylist"
                                label="{{localize('bind-playlist')}}" 
                                text-property="name"
                                value-property="name"
                                on-autocomplete-selected="_selectBindPlaylist"
                                on-autocomplete-change="_searchBindPlaylist"
                                remote-source>
                                <template slot="autocomplete-custom-template">
                                   
                                    <paper-item class="account-item" on-tap="_onSelect" role="option" aria-selected="false">
                                        <div index="[[index]]">
                                            <div class="service-name">[[item.name]]</div>
                                            <div class="service-description">[[item.type]]</div>
                                        </div>
                                        <paper-ripple></paper-ripple>
                                    </paper-item>
                                </template>
                            </paper-autocomplete>
                            <paper-chips id="listPlaylist" items="{{entity.binds}}"></paper-chips> 
                            <div class="layout-horizontal layout-end-justified">
                                <paper-button on-tap="submitPlaylistButton">{{localize('save')}}</paper-button>
                            </div>
                           
                        </div>
                    </form>
                </iron-form>
        `;
    }

    static get properties () {
        return {

            /**
             * @type PlaylistEntity
             */
            entity: {
                observer: '_changeEntity',
                value: {}
            },

            /**
             * @type number
             */
            selected: {
                type: Number,
                value: 0
            },

            /**
             * @type string
             */
            labelAction: {
                type: String,
                value: 'save'
            },

            /**
             * @type object
             */
            services : {
                value : {
                    _notify : "Notify",
                    _localizeService: 'Localize',
                    "HydratorContainerAggregate" : {
                        _monitorHydrator : "MonitorEntityHydrator"
                    },
                    StorageContainerAggregate : {
                        _storage :"PlaylistStorage",
                        _resourceStorage:"ResourceStorage",
                        _monitorStorage:"MonitorStorage",
                    }
                }
            },

            /**
             * @type Notify
             */
            _notify: {
                type: Object,
                readOnly: true
            },

            /**
             * @type StorageInterface
             */
            _resourceStorage: {
                type: Object,
                readOnly: true
            }
        };
    }

    constructor() {
        super();
        this.resources = lang;
    }

    ready() {
        super.ready();
        this.$.formPlaylist.addEventListener('iron-form-presubmit', this.submitPlaylist.bind(this));
        this.$.autocompleteResource.$.paperAutocompleteSuggestions.calcSize = this.calcSize;
    }

    /**
     * @param {Number} size
     * @private
     */
    calcSize(item) {
        let unit, units = ["TB", "GB", "MB", "KB", "Byte"];
        let size = item.size;
        for (unit = units.pop(); units.length && size >= 1024; unit = units.pop()) {
            size /= 1024;
        }

        return Math.ceil(size) + ' ' + unit;
    }

    /**
     * @param newValue
     * @private
     */
    _changeEntity(newValue) {
        this.labelAction = 'save';
        if (!newValue) {
            return;
        }

        if (newValue.id) {
            this.labelAction = 'update';
            this._monitorStorage.get(newValue.monitorContainerReference.parentId)
                .then((monitor) => {
                   
                    let allMonitor = monitor.getMonitors({nested: true});
                    for (let cont = 0; allMonitor.length > cont; cont++) {
                        if (newValue.monitorContainerReference.id == allMonitor[cont].id) {
                            console.log('MONITORE ggg', newValue.monitorContainerReference);
                            newValue.monitorContainerReference = allMonitor[cont];
                            newValue.monitorContainerReference.parentId = monitor.id;
                            newValue.monitorContainerReference.parent = monitor;
                            this.notifyPath('entity.monitorContainerReference');

                            break;
                        }
                    }
                });
        } else {
            newValue.monitorContainerReference = {};
        }
    }

    /**
     * @param evt
     * @private
     */
    _searchResource(evt) {
        if (!this._resourceStorage) {
            return;
        }

        // TODO filter fot monitor id
        this._resourceStorage.getAll({name : evt.detail.value.text})
            .then((resources) => {

                evt.detail.target.suggestions(
                    resources.filter((resource) => {
                        return ((resource instanceof VideoEntity) || (resource instanceof AudioEntity))
                    })
                );
            });
    }

    /**
     * @param evt
     * @private
     */
    _selectResource(evt) {
        let search = 

        this.entity.appendResource(evt.detail.value);
     
        // TODO better solution.
        this.$.listResource.shadowRoot.querySelector('dom-repeat').render();

        setTimeout(
            function () {
                this.clear();
            }.bind(evt.target),
            300
        );
    }

    /**
     *
     * @param evt
     * @private
     */
    _searchMonitor(evt) {
        if (!this._monitorStorage &&  evt.detail.value.text.length > 2) {
            return;
        }

        // TODO filter fot monitor id
        this._monitorStorage.getAll({name : evt.detail.value.text})
            .then((monitors) => {

                let data = [];
                for(let cont = 0; monitors.length > cont; cont++) {
                    let nested = monitors[cont].getMonitors({nested:true});
                    for (let nestCont = 0; nested.length > nestCont; nestCont++) {
                        nested[nestCont].parent = monitors[cont];
                        nested[nestCont].parentId = monitors[cont].id;
                        data.push(nested[nestCont]);
                    }
                }

                evt.detail.target.suggestions(
                    data
                );
            });
    }

    /**
     * @param evt
     * @private
     */
    _selectBindPlaylist(evt) {
        this.push('entity.binds', evt.detail.value);

        setTimeout(
            function () {
                this.clear();
            }.bind(evt.target),
            300
        );
    }

    /**
     * @param evt
     * @private
     */
    _searchBindPlaylist(evt) {
        if (!this._storage) {
            return;
        }

        this._storage.getAll({name : evt.detail.value.text})
            .then((filter) => {

                let reference;
                for (let cont =  0; filter.length > cont; cont++) {
                    reference = new (require("@dsign/library").storage.entity.EntityNestedReference)();
                    reference.setCollection('playlist');
                    reference.setId(filter[cont].id);
                    reference.name = filter[cont].name;
                    filter[cont] = reference;
                }

                evt.detail.target.suggestions(
                    filter
                );
            });
    }

    /**
     * @param evt
     */
    submitPlaylistButton(evt) {
        this.$.formPlaylist.submit();
    }

    /**
     * @param evt
     */
    submitPlaylist(evt) {
        evt.preventDefault();

        let method = this.getStorageUpsertMethod();
        this._storage[method](this.entity)
            .then((data) => {

                if (method === 'save') {
                    this.entity = this._storage.getHydrator().hydrate({});
                    this.$.formPlaylist.reset();
                }

                this._notify.notify(this.localize(method === 'save' ? 'notify-save' : 'notify-update'));
            });

    }
}
window.customElements.define('playlist-view-upsert', PlaylistViewUpsert);
