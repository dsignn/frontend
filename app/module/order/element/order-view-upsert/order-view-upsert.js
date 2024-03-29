import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {NotifyMixin} from "@dsign/polymer-mixin/notify/notify-mixin";
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin";
import {OrderEntity} from './../../src/entity/OrderEntity';
import {MenuEntity} from './../../../restaurant/src/entity/MenuEntity';
import {FormErrorMessage} from "../../../../element/mixin/form-error-message/form-error-message";
import '@polymer/paper-input/paper-input';
import '@fluidnext-polymer/paper-autocomplete/paper-autocomplete';
import '@fluidnext-polymer/paper-chip/paper-chips';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-form/iron-form';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import '@fluidnext-polymer/paper-input-file/paper-input-file';
import '@polymer/paper-tooltip/paper-tooltip';
import '../paper-order-item/paper-order-item';
import {lang} from './language';


/**
 * @customElement
 * @polymer
 */
class OrderViewUpsert extends FormErrorMessage(StorageEntityMixin(NotifyMixin(ServiceInjectorMixin(PolymerElement)))) {

    static get template() {
        return html`
          
                <style>
                    iron-form {
                        width: 100%;
                    }
                    
                    video {
                        outline: none;
                    }
                    
                    .name {
                       @apply --layout-horizontal;
                       @apply --layout-center;
                    }
                    
                     .name paper-input {
                       width: 100%;
                       margin-right: 12px;
                    }
                    
                    #container {
                        padding: var(--padding-top-view-list);
                        @apply --layout-horizontal;
                        @apply --layout-wrap;
                    }

                    .container {
                        display: flex;
                        justify-content: space-between;
                    }

                    .container paper-input {
                        width: 49.8%;
                    }

                    .container dsign-paper-dropdown-menu {
                        width: 24.8%;
                    }

                    .container #additionalInfo {
                        width: 24.8%;
                    }

                    #additionalInfo dsign-paper-dropdown-menu {
                        width: 100%;
                    }

                    .container-item {
                        margin-top: 4px;
                        display: flex;
                        flex-wrap: wrap;
                    }

                    paper-order-item {
                        flex-basis: 12.2%;
                        margin-bottom: 4px;
                        margin-right: 4px;
                    }

                    @media (min-width: 2100px) and (max-width: 2300px) {
                        paper-order-item {
                            flex-basis: 14%;
                        }
                    }

                    @media (min-width: 1900px) and (max-width: 2099px) {
                        paper-order-item {
                            flex-basis: 16.4%;
                        }
                    }

                    @media (min-width: 1600px) and (max-width: 1899px) {
                        paper-order-item {
                            flex-basis: 19.7%;
                        }
                    }

                    @media (min-width: 1300px) and (max-width: 1599px) {
                        paper-order-item {
                            flex-basis: 24.6%;
                        }
                    }

                    @media (min-width: 1000px) and (max-width: 1299px) {
                        paper-order-item {
                            flex-basis: 32.8%;
                        }
                    }

                    @media (min-width: 600px) and (max-width: 999px) {
                        paper-order-item {
                            flex-basis: 48.7%;
                        }
                    }

                    @media (max-width: 599px)  {
                        paper-order-item {
                            flex-basis: 100%;
                        }
                    }
                </style>
                <slot name="header"></slot>
                <div id="container">
                   <iron-form id="formOrder">
                        <form method="post">
                            <div class="container">
                                <paper-input id="name" name="name" label="{{localize('name')}}" value="{{entity.name}}" required></paper-input>
                                <dsign-paper-dropdown-menu value="{{entity.status}}" id="status" name="status" label="{{localize('status')}}" required>
                                    <paper-listbox slot="dropdown-content">
                                        <template is="dom-repeat" items="[[states]]" as="status">
                                            <paper-item value="{{status}}">{{localize(status)}}</paper-item>
                                        </template>
                                    </paper-listbox>
                                </dsign-paper-dropdown-menu>
             
                                <div id="additionalInfo">
                                    <template is="dom-repeat" items="[[_toArray(entity.additionalInfo)]]" as="item">
                                        {{renderAdditionalInfo(item)}}
                                    </template>
                                </div>
                            </div>
                            <div>
                                <div class="flex flex-horizontal-end" style="margin-top: 20px;">
                                    <paper-button on-tap="submitOrderButton">{{localize(labelAction)}}</paper-button>
                                </div>
                            </div>
                            <div class="container-item">
                                <template id="listItems" is="dom-repeat" items="[[entity.items]]" as="ordered" sort="sortItems">
                                    <paper-order-item item="{{ordered}}" on-update="updateView"></paper-order-item>
                                </template>
                            </div>        
                        </form>
                    </iron-form>
                </div>
        `;
    }

    static get properties () {
        return {

            /**
             * @type string
             */
            labelAction: {
                type: String,
                value: 'save'
            },

            states: {

                value: [
                    OrderEntity.STATUS_VALIDATING,
                    OrderEntity.STATUS_CAN_ORDER,
                    OrderEntity.STATUS_QUEUE,
                    OrderEntity.STATUS_PREPARATION,
                    OrderEntity.STATUS_DELIVERING,
                    OrderEntity.STATUS_INVALID,
                    OrderEntity.STATUS_CLOSE
                ]
            },

            types: {
                value: [
                    MenuEntity.STATUS_DEFAULT,
                    MenuEntity.STATUS_DELIVERY
                ]
            },


            /**
             * @type object
             */
            services : {
                value : {
                    _notifyService : "Notify",
                    _localizeService: 'Localize',
                    "HydratorContainerAggregate" : {
                        _resourceHydrator : "ResourceEntityHydrator"
                    },
                    StorageContainerAggregate : {
                        _storage :"OrderStorage"
                    }
                }
            }
        };
    }

    constructor() {
        super();
        this.resources = lang;
    }

    ready() {
        super.ready();
        this.$.formOrder.addEventListener('iron-form-presubmit', this.submitOrder.bind(this));
    }

    _toArray(obj) {
        if (!obj) {
            return
        }

        return Object.keys(obj).map(function(key) {
            return {
                name: key,
                value: obj[key]
            };
        });
    }
  
    /**
     * @returns {string}
     */
    getStorageUpsertMethod() {
        return this.entity.id ? 'update' : 'save';
    }

    /**
     * @param {*} item 
     */
    renderAdditionalInfo(item) {


        this.shadowRoot.querySelector('#additionalInfo').textContent = '';

        let ele;

        switch(item.name) {
            case 'orderType':
                
                let listBox = document.createElement('paper-listbox');
                listBox.setAttribute('slot' ,'dropdown-content');

                let eleItem = document.createElement('paper-item');
                eleItem.setAttribute('value', MenuEntity.STATUS_DEFAULT);
                eleItem.innerHTML = this.localize( MenuEntity.STATUS_DEFAULT);
                listBox.appendChild(eleItem);

                eleItem = document.createElement('paper-item');
                eleItem.setAttribute('value', MenuEntity.STATUS_DELIVERY);
                eleItem.innerHTML = this.localize(MenuEntity.STATUS_DELIVERY);

                listBox.appendChild(eleItem);

                ele = document.createElement('dsign-paper-dropdown-menu');
                ele.setAttribute('value', item.value);
                ele.setAttribute('label', this.localize('type'));

                ele.appendChild(listBox);

                this.shadowRoot.querySelector('#additionalInfo').appendChild(ele);

                ele.addEventListener("value-changed", (ev) => {
                   this.entity.additionalInfo.orderType = ev.detail.value;
                });
                break;

        }
    }

    /**
     * @param {Event} evt 
     */
    submitOrder(evt) {
        evt.preventDefault();

        let method = this.getStorageUpsertMethod();
        this._storage[method](this.entity)
            .then((data) => {

                if (method === 'save') {
                    this.entity = this._storage.getHydrator().hydrate({});
                    this.$.formOrder.reset();
                }

                this.notify(this.localize(method === 'save' ? 'notify-save' : 'notify-update'));
            }).catch((error) => {
            this.errorMessage(this.$.formOrder, error);
        });
    }

        /**
     * @param {CustomEvent} evt
     */
    submitOrderButton(evt) {
        this.$.formOrder.submit();
    }

    /**
     * @param {object} item 
     */
    sortItems(item1, item2) {

        let status1 = item1.status === 'to_do' ? 0 : (item1.status === 'delivered') ? 1 : 2;
        let status2 = item2.status === 'to_do' ? 0 : (item2.status === 'delivered') ? 1 : 2;

        if (status1 < status2) {
            return -1;
        }

        if (status1 === status2) {
            return 0;
        }

        return 1;
    }

    updateView() {
        console.log('UPDATE BENE');
        this.$.listItems.render();
    }
    
}

window.customElements.define('order-view-upsert', OrderViewUpsert);
