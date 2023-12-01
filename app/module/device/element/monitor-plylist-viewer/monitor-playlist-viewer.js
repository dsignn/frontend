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

/**
 * @class MonitorPlaylistViewer
 */
class MonitorPlaylistViewer extends StorageEntityMixin(NotifyMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement)))) {

    static get template() {
        return html`
        <style>
        
            .title {
                background: white;
                padding: 8px;
            }
            
        </style>
    
            <div class="monitor">
                <div class="title">[[monitor.name]]</div>
                <paper-autocomplete 
                    label="{{localize('playlist')}}" 
                    text-property="name"
                    value-property="name"
                    on-autocomplete-change="_searchPlaylist"
                    on-autocomplete-selected="_selectPlaylist"
                    value={{monitor.playlist}}
                    remote-source>
                    <template slot="autocomplete-custom-template">
                        ${customAutocomplete}
                        <style>
                            :host {

                                width: 100%;
                            }
                        </style>
                        <paper-item class="account-item" on-tap="_onSelect" role="option" aria-selected="false">
                            <div index="[[index]]">
                                <div class="service-name">[[item.name]]</div>
                                <div class="service-description">[[item.type]]</div>
                            </div>
                            <paper-ripple></paper-ripple>
                        </paper-item>
                    </template>
                </paper-autocomplete>
            </div>`;
    }
    static get properties() {
        return {

            monitorContainer : {
                notify: true,
            },

            monitor: {
                notify: true,
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

    static get observers() {
        return [
            '_changeMonitor(monitor, monitorContainer, _playlistStorage)'
        ]
    }

    ready() {
        super.ready();
        this.addEventListener('select-monitor', (evt) => {
            let monitors = this.monitorContainer.getMonitors({nested: true});
            for (let cont = 0; monitors.length > cont; cont++) {
                if (monitors[cont].id === this.monitor.id) {
                    this.monitor = monitors[cont];
                    break;
                }
            }
        });

        this.addEventListener('change-monitor', (evt) => {
            console.log();
            let monitors = this.monitorContainer.getMonitors({nested: true});
            for (let cont = 0; monitors.length > cont; cont++) {
                if (monitors[cont].id === this.monitor.id) {
                    monitors[cont].playlist = this.monitor.playlist;
                    this.monitor = monitors[cont];
                    break;
                }
            }

            if(this.monitor && this.monitor.playlist && this.monitor.playlist.id) {
                this._playlistStorage.get(this.monitor.playlist.id)
                    .then((playlist) => {
                        this.monitor.playlist = playlist;
                        this.notifyPath('monitor.playlist');
                    });
            }
        });
    }

    _searchPlaylist(evt) {
        if (!this._playlistStorage) {
            return;
        }

        let search = {name : evt.detail.value.text};
        search['monitor_container'] =  {};
        search['monitor_container'].id = this.monitor.id ;
        search['monitor_container'].parentId =  this.monitorContainer.id; 

        this._playlistStorage.getAll(search)
            .then((filter) => {

                evt.detail.target.suggestions(
                    filter
                );
            });
    }

    _selectPlaylist(evt) {

        this.monitor.playlist = evt.target.value;
    }
}

window.customElements.define('monitor-playlist-viewer', MonitorPlaylistViewer);