import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin"
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin"
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin"
import {MenuEntity} from '../../src/entity/MenuEntity'
import '@polymer/paper-card/paper-card';
import '@polymer/paper-tooltip/paper-tooltip';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-toggle-button/paper-toggle-button';
import '@polymer/paper-menu-button/paper-menu-button';
import {lang} from './language';

/**
 * @customElement
 * @polymer
 */
class PaperMenu extends StorageEntityMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
            <style >
                paper-card {
                    @apply --layout-horizontal;
                    @apply --application-paper-card;
                    @apply --paper-card;
                }
                
                #left-section {
                    width: 80px;
                    min-height: 120px;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-image: url("./../../module/restaurant/element/paper-menu/img/cover.jpg");
                }
                
                #fastAction {
                    border-right: 1px solid var(--divider-color);
                }
                .action {
                    padding-top: 5px;
                    padding-bottom: 5px;
                }
                
                #fastAction .action {
                    @apply --layout;
                    @apply --layout-vertical;
                    @apply --layout-center
                    @apply --layout-center-justified;
                }
                
                #right-section {
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

                paper-menu-button {
                    padding: 4px;
                    --paper-icon-button : {
                         padding: 0 !important;
                         width: 28px;
                         height: 28px;
                    }
                }
    
            </style>
            <paper-card>
                <div id="left-section"></div>
                <div id="fastAction">
                    <div class="action">
                        <paper-toggle-button id="paperToggleDefault" on-change="_enbleIndoor" checked="{{enableDefault}}"></paper-toggle-button>
                        <paper-tooltip for="paperToggleDefault" position="bottom">{{localize('public-menu')}}</paper-tooltip>
                    </div>
                          <div class="action">
                        <paper-toggle-button id="paperToggleDelivery" on-change="_enableDelivery" checked="{{enableDelivery}}"></paper-toggle-button>
                        <paper-tooltip for="paperToggleDelivery" position="bottom">{{localize('public-delivery')}}</paper-tooltip>
                    </div>
                </div>
                <div id="right-section">
                    <div id="content">
                        {{entity.name}}
                    </div>
                    <div id="crud">
                        <paper-menu-button ignore-select horizontal-align="right">
                            <paper-icon-button icon="v-menu" slot="dropdown-trigger" alt="multi menu"></paper-icon-button>
                            <paper-listbox slot="dropdown-content" multi>
                                <paper-item on-click="_update">{{localize('modify')}}</paper-item>
                                <paper-item  on-click="_delete">{{localize('delete')}}</paper-item>
                            </paper-listbox>
                        </paper-menu-button>
                    </div>
                </div>
            </paper-card>
        `
    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties () {
        return {
            /**
             * @object
             */
            services : {
                value : {
                    _localizeService: 'Localize',
                    _notify : "Notify",
                    StorageContainerAggregate: {
                        "_storage":"MenuStorage"
                    }
                }
            },

            /**
             * @type object
             */
            entity: {
                type: Object,
                notify: true,
                observer: '_changeEntity',
            },

            /**
             * @type StorageInterface
             */
            _storage: {
                type: Object,
                readOnly: true
            },

            enableDefault: {
                type: Boolean,
                readOnly: true,
                value: false
            },

            enableDelivery: {
                type: Boolean,
                readOnly: true,
                value: false
            },

            /**
             * @type true
             */
            autoUpdateEntity: {
                value: true
            }
        }
    }

    /**
     * 
     * @param {object} entity 
     * @returns 
     */
    _changeEntity(entity) {

        if (!this.entity) {
            return;
        }
        this._updateStatus();
    }

    /**
     * Update status  
     */
    _updateStatus() {

        if (this.entity.status === MenuEntity.STATUS_ENABLE  && this.entity.type ===  MenuEntity.TYPE_INDOOR ) {
            this._setEnableDefault(true);
        } else {
            this._setEnableDefault(false);
        }

        if (this.entity.status === MenuEntity.STATUS_ENABLE  && this.entity.type ===  MenuEntity.TYPE_DELIVERY ) {
            this._setEnableDelivery(true);
        } else {
            this._setEnableDelivery(false);
        }
    }


    /**
     * @param evt
     * @private
     */
     _enbleIndoor(evt) {

        this.disableToggle();
        if (evt.target.checked) {
            this.entity.type = MenuEntity.TYPE_INDOOR;
            this.entity.status = MenuEntity.STATUS_ENABLE;
        } else {
            this.entity.status = MenuEntity.STATUS_DISABLE;
        }

        this._storage.update(this.entity)
            .then((data) => {
                this.enableToggle();
                this._updateStatus();
                this._notify.notify(this.localize('public-menu-ok'));
        }).catch((error) => {
            console.error('Update status paper menu', error);
            this.enableToggle();
        });

    }

    /**
     * @private
     */
    _enableDelivery(evt) {

        this.disableToggle();
        if (evt.target.checked) {
            this.entity.type =  MenuEntity.TYPE_DELIVERY;
            this.entity.status = MenuEntity.STATUS_ENABLE;
        } else {
            this.entity.status = MenuEntity.STATUS_DISABLE;
        }

        this._storage.update(this.entity)
            .then((data) => {
                this.enableToggle();
                this._updateStatus();
                this._notify.notify(this.localize('public-menu-ok'));
            }).catch((error) => {
                console.error('Update status paper menu', error);
                this.enableToggle();
            });
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

    disableToggle() {
        this.$.paperToggleDefault.disabled = true;
        this.$.paperToggleDelivery.disabled = true;
    }

    enableToggle() {
        this.$.paperToggleDefault.disabled = false;
        this.$.paperToggleDelivery.disabled = false;
    }
}

window.customElements.define('paper-menu', PaperMenu);