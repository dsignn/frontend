import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin"
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin"
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin"
import {OrderItemWrapper} from "./../../src/entity/embedded/OrderItemWrapper"
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
class PaperOrderItem extends StorageEntityMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
            <style >
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

                #content {
                    @apply --layout-flex;
                    padding: 4px;
                    word-break: break-all;
                    overflow: hidden;
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
                
                #status {
                    border-radius: 50%;
                    background-color: var(--status-in-queue);
                    color: var(--status-in-queue);
                    width: 20px;
                    min-width: 20px;
                    height: 20px;
                    margin-right: 6px;
                }

                #status[terminate] {
                    background-color: var(--status-close);
                    color: var(--status-close);
                }

                #status[ready] {
                    background-color: var(--status-can-order);
                    color: var(--status-can-order);
                }


                paper-menu-button {
                    padding: 4px;
                    --paper-icon-button : {
                        padding: 0 !important;
                        width: 28px;
                        height: 28px;
                    }
                }
                
                [capitalize] {
                    text-transform: capitalize;
                }
    
            </style>
            <paper-card>
                <div id="left-section"></div>
               
                <div id="right-section">
                    <div id="content">                  
                        <div class="title-container" capitalize>
                            <paper-menu-button id="p_m_b" on-iron-select="selectStatus" ignore-select horizontal-align="right">
                                <paper-icon-button id="status" icon="order:status" slot="dropdown-trigger" alt="multi menu"></paper-icon-button>
                                <paper-listbox id="listStatus" slot="dropdown-content">
                                    <paper-item value="to_do">{{localize("to_do")}}</paper-item>
                                    <paper-item value="delivered">{{localize("delivered")}}</paper-item>
                                    <paper-item value="terminate">{{localize("terminate")}}</paper-item>
                                </paper-listbox>
                            </paper-menu-button>
                            <div class="name">{{name}}</div>    
                        </div>
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
            item: {
                type: Object,
                notify: true,
            },

            /**
             * @type StorageInterface
             */
            _storage: {
                type: Object,
                readOnly: true
            }
        }
    } 

    static get observers() {
        return [
          // Observer method name, followed by a list of dependencies, in parenthesis
          'changeItem(item, _localizeService)'
        ]
      }

        /**
     * @param evt
     * @private
     */
    _update(evt) {
        this.dispatchEvent(new CustomEvent('update', {detail: this.item}));
    }

    /**
     * @param {object} item 
     * @param {Localize} _localizeService 
     */
    changeItem(item, _localizeService) {

        if (!item || ! _localizeService) {
            return;
        }

        if (item.ordered && item.ordered.name && item.ordered.name[this._localizeService.getDefaultLang()]) {
            this.name = item.ordered.name[this._localizeService.getDefaultLang()];
        }

        switch (item.status) {
            case 'to_do':
                this.$.listStatus.selected = 0;
                break;
            case 'delivered':
                this.$.listStatus.selected = 1;
                break;    
            case 'terminate':
                this.$.listStatus.selected = 2;
                break;    
        }
    }

    /**
     * @param {Event} evt 
     */
    selectStatus(evt) {
        this.$.status.removeAttribute('ready');
        this.$.status.removeAttribute('terminate');

        switch (evt.detail.item.getAttribute('value')) {
            case 'delivered':
                this.$.status.setAttribute('ready', null);
                this.item.status = 'delivered';
                break;    
            case 'terminate':
                this.$.status.setAttribute('terminate', null);
                this.item.status = 'terminate'
                break;    
            default:
                this.item.status = 'to_do';
        }

        this.dispatchEvent(new CustomEvent('update', {detail: this.item}));
        this.$.p_m_b.close();
    }
}

window.customElements.define('paper-order-item', PaperOrderItem);
