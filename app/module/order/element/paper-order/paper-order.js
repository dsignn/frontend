import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin"
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin"
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin"
import '@polymer/paper-card/paper-card';
import '@polymer/paper-tooltip/paper-tooltip';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-toggle-button/paper-toggle-button';
import '@polymer/paper-menu-button/paper-menu-button';
import {lang} from './language';
import { EntityIdentifier } from '@dsign/library/src/storage/entity';
import { OrderEntity } from './../../src/entity/OrderEntity';

/**
 * @customElement
 * @polymer
 */
class PaperOrder extends StorageEntityMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
            <style >
                :host {
                    display: block;
                }

                paper-card {
                    @apply --layout-horizontal;
                    @apply --application-paper-card;
                    @apply --paper-card;
                }
                
                #fastAction {
                    border-right: 1px solid var(--divider-color);
                }

                .action {
                    padding-top: 5px;
                    padding-bottom: 5px;
                }

                            
                #status {
                    border-radius: 50%;
                    width: 20px;
                    min-width: 20px;
                    height: 20px;
                    margin-right: 6px;
                }

                #status[queue] {
                    background-color: var(--status-in-queue);
                }

                #status[preparation] {
                    background-color: var(--status-in-preparation);
                }

                #left-section {
                    width: 80px;
                    min-height: 120px;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-image: url("./../../module/order/element/paper-order/img/cover.jpg");
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

                .title-container {
                    display: flex;
                    flex-direction: row;
                    align-items: start;
                    height: 46px;
                    font-size: 14px;
                }

                .title-container .name {
                    height: 46px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 18px;
                    line-height: 18px;
                }
                
                #content {
                    @apply --layout-flex;
                    padding: 4px;
                    word-break: break-all;
                    overflow: hidden;
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
                </div>
                <div id="right-section">
                    <div id="content">
                        <div class="title-container" capitalize>
                            <div id="status"></div>
                            <paper-tooltip for="status" position="right">{{localize(statusMessage)}}</paper-tooltip>
                            <div class="name">{{entity.name}}</div> 
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
                        "_storage":"OrderStorage"
                    }
                }
            },

            /**
             * @type object
             */
            entity: {
                type: Object,
                notify: true,
                observer: 'changeEntity'
            },

            /**
             * @type StorageInterface
             */
            _storage: {
                type: Object,
                readOnly: true
            },

            hideCrud: {
                type: Boolean,
                value: false,
                observer: 'changeHideCrud'
            }
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
     * @param {bool} hideCrud 
     */
    changeHideCrud(hideCrud) {
    
        if (hideCrud) {
            this.$.crud.style.display = 'none';
        } else {
            this.$.crud.style.display = 'block';
        }

    }

    /**
     * @param {object} entity 
     */
    changeEntity(entity) {
        this._clearStatus();
        if (!entity) {
            return;
        }

        switch (entity.status) {
            case OrderEntity.STATUS_QUEUE:
                this.$.status.setAttribute('queue', null);
                this.statusMessage = OrderEntity.STATUS_QUEUE;
                break;
            case OrderEntity.STATUS_PREPARATION:
                this.$.status.setAttribute('preparation', null);
                this.statusMessage = OrderEntity.STATUS_PREPARATION;
                break;
        }
        console.log('ENTITY', entity);
    }

    /**
     * 
     */
    _clearStatus() {
        this.$.status.removeAttribute('queue');
        this.$.status.removeAttribute('preparation');
    }
}

window.customElements.define('paper-order', PaperOrder);