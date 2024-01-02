import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin";
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-menu-button/paper-menu-button';
import {lang} from './language';

/**
 * @customElement
 * @polymer
 */
class PaperDevice extends StorageEntityMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
            <style >
                paper-card {
                    @apply --layout-horizontal;
                    @apply --application-paper-card;
                    margin-right: 4px;
                    margin-bottom: 4px;
                }
                
                #leftSection {
                    width: 80px;
                    min-height: 120px;
                    background-size: contain;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-image: url("./../../module/device/element/paper-device/img/cover.png");
                    background-color: #7E79E5;
                }
                
                #fastAction {
                    border-right: 1px solid var(--divider-color);
                }
                
                #fastAction .action {
                    height: 30px;
                    @apply --layout;
                    @apply --layout-center
                    @apply --layout-center-justified;
                }
                
                #rightSection {
                    @apply --layout-horizontal;
                    @apply --layout-flex;
                }
                
                          
                #content {
                    @apply --layout-flex;
                    padding: 4px;
                    word-break: break-all;
                    overflow: hidden;
                }  
                   
                paper-menu-button {
                    padding: 0;
                }
                
                .name {
                    overflow: hidden;
                    height: 20px;
                }

                .disable {
                    color:red;
                }

                .enable {
                    color:green;
                }
                
                .dimension, 
                .size,
                .video {
                    padding-top: 4px;
                    font-size: 14px;
                    font-style: italic;
                }
    
            </style>
            <paper-card>
                <div id="leftSection"></div>
                <div id="rightSection">
                    <div id="content">
                        <div class="name">{{entity.name}}</div>
                        <div>
                            <div id="status">{{localize(status)}}</div>
                        </div>
                    </div>
                    <div id="crud">
                        <paper-menu-button ignore-select horizontal-align="right">
                            <paper-icon-button icon="v-menu" slot="dropdown-trigger" alt="multi menu"></paper-icon-button>
                            <paper-listbox slot="dropdown-content" multi>
                                <paper-item on-click="_update">{{localize('modify')}}</paper-item>
                            </paper-listbox>
                        </paper-menu-button>
                    </div>
                </div>
            </paper-card>
            <paper-dialog id="previewDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_closePreview">
                <div class="title">Preview</div>
                <paper-dialog-scrollable>
                   <div id="contentPreview"></div>
                </paper-dialog-scrollable>
            </paper-dialog>
        `
    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties () {
        return {


            /**
             * @type FileEntity
             */
            entity: {
                observer: '_entityChanged'
            },

            status: {
                value: 'disable'
            },

            /**
             * @type true
             */
            autoUpdateEntity: {
                value: true
            },

            /**
             * @type object
             */
            services : {
                value : {
                    _localizeService: 'Localize',
                    _resourceService : "ResourceService",
                    StorageContainerAggregate: {
                        "_storage":"DeviceStorage"
                    }
                }
            },

            /**
             * @type StorageInterface
             */
            _storage: {
                type: Object,
                readOnly: true
            },

            /**
             * @type ResourceService
             */
            _resourceService: {
                type: Object,
                readOnly: true
            }
        }
    }

    _entityChanged(newValue) {

        if (!newValue) {
            return;
        }

        let now = new Date();
        let diff = now.getTime() -  newValue.lastUpdateDate.getTime();
        
        diff = Math.floor((diff / 1000));



       console.log('DIFF', newValue.lastUpdateDate, now, diff)
        if (diff > 20) {
            this.changeStatus('disable');
        } else {
            this.changeStatus('enable');
        }
    }

    changeStatus(status) {
        if (status === 'disable') {
            this.status = 'disable';
            this.$.status.className = 'disable';
        } else {
            this.status = 'enable';
            this.$.status.className = 'enable';
        }
    }

    /**
     * @param evt
     * @private
     */
    _update(evt) {
        this.dispatchEvent(new CustomEvent('update', {detail: this.entity}));
    }

    /**
     * @param evt
     * @private
     */
    _delete(evt) {
        this.dispatchEvent(new CustomEvent('delete', {detail: this.entity}));
    }
}
window.customElements.define('paper-device', PaperDevice);
