import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {NotifyMixin} from "@dsign/polymer-mixin/notify/notify-mixin";
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin";
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
import {lang} from './language';
import {OrderEntity} from './../../src/entity/OrderEntity';
import {MenuEntity} from './../../../restaurant/src/entity/MenuEntity';
import {FormErrorMessage} from "../../../../element/mixin/form-error-message/form-error-message";

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
                </style>
                <slot name="header"></slot>
                <div id="container">
                   <iron-form id="formOrder">
                        <form method="post">
                            <div>
                                <paper-input id="name" name="name" label="{{localize('name')}}" value="{{entity.name}}" required></paper-input>
                                <dsign-paper-dropdown-menu value="{{entity.status}}" id="status" name="status" label="{{localize('status')}}" required>
                                    <paper-listbox slot="dropdown-content">
                                        <template is="dom-repeat" items="[[states]]" as="status">
                                            <paper-item value="{{status}}">{{localize(status)}}</paper-item>
                                        </template>
                                    </paper-listbox>
                                </dsign-paper-dropdown-menu>
                                <!--
                                <dsign-paper-dropdown-menu value="{{entity.type}}" id="type" name="type" label="{{localize('type')}}" d>
                                    <paper-listbox slot="dropdown-content">
                                        <template is="dom-repeat" items="[[types]]" as="type">
                                            <paper-item value="{{type}}">{{localize(type)}}</paper-item>
                                        </template>
                                    </paper-listbox>
                                </dsign-paper-dropdown-menu>-->
                                <div id="additionalInfo">
                                    <template  is="dom-repeat" items="[[_toArray(entity.additionalInfo)]]" as="item">
                                        {{renderAdditionalInfo(item)}}
                                    </template>
                                </div>
                            </div
                            <div>
                                <div class="flex flex-horizontal-end" style="margin-top: 20px;">
                                    <paper-button on-tap="submitOrderButton">{{localize(labelAction)}}</paper-button>
                                </div>
                            </div>
                        </form>
                    </iron-form>
                </div>
        `;
    }

    static get properties () {
        return {

            /**
             * @type FileEntity
             */
            entity: {
         //       observer: '_changeEntity',
                value: {}
            },

            /**
             * @type string
             */
            labelAction: {
                type: String,
                value: 'save'
            },

            states: {

                value: [
                    OrderEntity.STATUS_CHECK,
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

        console.log(evt);
    }

        /**
     * @param {CustomEvent} evt
     */
    submitOrderButton(evt) {
        this.$.formOrder.submit();

    
        let method = this.getStorageUpsertMethod();
        this._storage[method](this.entity)
            .then((data) => {
console.log(method, 'salvato');
                if (method === 'save') {
                    this.entity = this._storage.getHydrator().hydrate({});
                    this.$.formOrder.reset();
                }

                this.notify(this.localize(method === 'save' ? 'notify-save' : 'notify-update'));
            }).catch((error) => {
            this.errorMessage(this.$.formOrder, error);
        });
    }
    
}

window.customElements.define('order-view-upsert', OrderViewUpsert);
