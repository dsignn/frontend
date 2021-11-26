/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {Storage} from "@dsign/library/src/storage/Storage";
import {Listener} from "@dsign/library/src/event/Listener";
import {Localize} from '@dsign/library/src/localize/Localize';
import '@polymer/paper-icon-button/paper-icon-button';
import '@fluidnext-polymer/paper-pagination/paper-pagination';
import '@fluidnext-polymer/paper-pagination/icons/paper-pagination-icons';
import '@fluidnext-polymer/paper-autocomplete/paper-autocomplete';
import '@polymer/paper-tooltip/paper-tooltip';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-button/paper-button';
import {lang} from './language';
import { OrderService } from '../../src/order/service/OrderService';

/** 
 * @class DsignOrder
 */
class DsignOrder extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {

    static get template() {
        return html`
          <style>
            :host {
              --paper-input-container: {
                --paper-input-container-color: var(--munu-color);
                --paper-input-container-focus-color: var(--munu-color);
                --paper-input-container-input-color: var(--munu-color);
              }
            }

            .container {
                @apply --menu-wrap-container;
            }

            paper-icon-button.circle {
              color: var(--munu-color);
              background-color: var(--munu-background-color);
              height: 50px;
              width: 50px;
              border-radius: 100%;
              box-shadow: 0 3px 8px rgba(0,0,0,.23), 0 3px 8px rgba(0,0,0,.16);
            }

            .header {
              display:flex;
              margin-top: 8px;
            }

            .header .title {
              flex:1;
              display: flex;
              align-items: center;
              font-size:22px;
            }

            .item-order {
              display: flex;
              flex-direction: column;
              align-items: self-start;
            }

            .item-order .name {
              padding: 6px 0 0 0;
              font-size: 18px;
            }

            .item-order .date {
              font-style: italic;
              font-size: 12px;
              opacity: 0.6;
            }

            paper-pagination {
              display: flex;
              justify-content: center;
            }

            paper-autocomplete {
              text-align: left;
            }

            paper-tooltip {
           
              --paper-tooltip-background: var(--munu-background-color);
              --paper-tooltip-text-color: var(--munu-color);

              --paper-tooltip: {
                font-size: 14px;
              }
            }

            paper-pagination {
              --paper-icon-button:{
                color: var(--munu-background-color);
                opacity: 1;
              }
              --paper-icon-button-disabled: {
                color: var(--munu-color);
                opacity: 0.5;
              }
        
              --paper-input-container: {
                --paper-input-container-color: var(--munu-color);
                --paper-input-container-focus-color: var(--munu-background-color);
                --paper-input-container-input-color: var(--munu-background-color);
              }
        
              --paper-input-container-underline: {
                opacity: 0.5;
              }
        
              --paper-button: {
                color: var(--munu-background-color);
              }
        
              --paper-button-disabled: {
                background-color: var(--munu-background-color);
                color: white;
              }
        
              --paper-dropdown-menu: {
                color: var(--munu-background-color);
                --paper-listbox-color: var(--munu-background-color);
                --paper-listbox-color: var(--munu-background-color);
              }
              --paper-dropdown-menu-icon: {
                color: var(--munu-background-color);
              }
            }
            
          </style>
          <div class="header">
            <div class="title">{{localize('list-order')}}</div>
            <paper-icon-button id="iconOrder" icon="insert" class="circle" on-tap="openDialog"></paper-icon-button>
            <paper-tooltip for="iconOrder" position="left">{{localize('insert-order')}}</paper-tooltip>
          </div>
          <template is="dom-repeat" items="[[orders]]" as="order">
            <div class="item-order">
              <div class="name">{{order.name}}</div>
              <div class="date">{{getOrderDate(order.createdAt)}}</div>
            </div>
          </template>
          <paper-pagination page="{{page}}" 
            total-items="{{totalItems}}" 
            item-per-page="{{itemPerPage}}" 
            view-page-range="3"
            next-icon="paper-pagination:next-arrow" 
            previous-icon="paper-pagination:previous-arrow"
            hide-page-element
            hide-number-element>
            </paper-pagination>
          <paper-autocomplete 
            id="autocomplete"
            label="{{localize('enable-order')}}"
            text-property="name"
            remote-source
            on-autocomplete-change="_autocompleteChanged"
            on-autocomplete-selected="_autocompleteSelect">
              <template id="customTemplate" slot="autocomplete-custom-template">
                <style>
                    .container{
                        display: flex;
                        flex-direction: column;
                    }

                    .info{
                        padding: 2px;
                        width: 100%;
                    }

                    .info > div{
                        padding-left: 4px;
                    }
                 
                    .order {
                        margin-top: 4px;
                        color: var(--munu-color);
                    }

                    .date {
                      font-style: italic;
                      font-size: 12px;
                      opacity: 0.6;
                    }
                </style>
                <paper-item id="suca" class="custom-item" on-tap="_onSelect" role="option" aria-selected="false">
                    <div class="container info" index="[[index]]">
                        <div class="order">[[item.name]]</div>    
                        <div class="date">{{getOrderDate(item.createdAt)}}</div>       
                    </div>
                    <paper-ripple></paper-ripple>
                </paper-item>
               
              </template>
            </paper-autocomplete>
            <paper-dialog id="dialogAdd" with-backdrop>
              <h2>{{localize('insert-order')}}</h2>
              <paper-input label=test></paper-input>
            </paper-dialog>
        `;
    }

  static get properties() {
      return {
        organization: {
          notify: true,
        },

        services: {
            value: {
                _config: 'config',
                _localizeService: 'Localize',
                _orderService: 'OrderService',
            }
        },

        orders: { },

        _orderService: {
          readOnly: true,
          observer: 'changeOrderService'
        },

        page: {
          value: 1
        },

        itemPerPage: {
          value: 4
        },

        totalItems: {
          readOnly: true,
        }

      };      
  }

  constructor() {
     super();
     this.resources = lang;
  }

  connectedCallback() {
    super.connectedCallback();

    this.$.autocomplete.shadowRoot.querySelector('paper-autocomplete-suggestions').getOrderDate = this.getOrderDate;
  }

  static get observers() {
    return [
        '_observeOrders(_orderService, organization)',
        '_observePages(_orderService, page, organization)',
        '_obeserveLocalizeService(_localizeService)'
    ];
  }

  _obeserveLocalizeService(service) {
    this._createDialogCreateOrder();
    service.getEventManager().on(Localize.CHANGE_LANGUAGE, this._changeLanguage.bind(this))
  }

  _changeLanguage(evt) {
    let dialog = document.getElementById('addOrderDialog')
    dialog.querySelector('h3').innerHTML = this.localize('insert-order');
    dialog.querySelector('paper-input').label = this.localize('name');
    dialog.querySelector('paper-button').innerHTML = this.localize('insert-order');
  }

  changeOrderService(service) {
    if (!service) {
      return;
    }

    service.getEventManager().on(OrderService.CHANGE_DEFAUL_ORDER, (evt) => {
      this._getOrders();
    });
  }

  /***
   * 
   */
  _createDialogCreateOrder() {
    if (document.getElementById('addOrderDialog')) {
      return;
    }

    let dialog = document.createElement('paper-dialog');
    dialog.setAttribute('id', 'addOrderDialog');
    dialog.setAttribute('with-backdrop', null);

    let h3  = document.createElement('h3');
    h3.innerHTML = this.localize('insert-order');
    let input  = document.createElement('paper-input');
    input.setAttribute('label', this.localize('name'));
    let button = document.createElement('paper-button');
    button.innerHTML = this.localize('insert-order');
    button.disabled = true;
    dialog.appendChild(h3);
    dialog.appendChild(input);
    dialog.appendChild(button);

    document.body.appendChild(dialog);

    input.addEventListener('value-changed', this.changeInput.bind(this));
    button.addEventListener('tap', this.AddOrder.bind(this));
  }

  /**
   * @param {CustomEvent} evt 
   */
  openDialog(evt) {
    document.getElementById('addOrderDialog').open();
  }

  AddOrder(evt) {

    let now = new Date(); 
    let entity = this._orderService.getStorage().getHydrator().hydrate({});
    // TODO remove when add multi storage
    entity.id =((m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
    s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h)))();
    entity.name = evt.target.parentElement.querySelector('paper-input').value;
    entity.createdAt = new Date();
    entity.organization.id = this.organization._id;

    this._orderService.getStorage().save(entity);

    evt.target.parentElement.querySelector('paper-input').value = null;
    document.getElementById('addOrderDialog').close()
  }

  changeInput(evt) {
    if (!evt.detail.value) {
      document.getElementById('addOrderDialog').querySelector('paper-button').disabled = true;
    } else {
      document.getElementById('addOrderDialog').querySelector('paper-button').disabled = false;
    }
  }

  /**
   * 
   * @param {OrderService} orderService 
   * @param {*} organization 
   * @returns 
   */
   _observeOrders(orderService, organization) {

    if (!orderService || !organization) {
      return;
    }

    orderService.getStorage().getEventManager().on(Storage.POST_REMOVE, new Listener(this.updateOrder.bind(this)));
    orderService.getStorage().getEventManager().on(Storage.POST_SAVE, new Listener(this.updateOrder.bind(this)));

    orderService.loadCurreOrder(organization._id)
      .then((data) => {
        this.$.autocomplete.value = data;
      });
  }

  updateOrder() {
    this._getOrders();
  }

  /**
   * 
   */
  _getOrders() {
    this._orderService.getStorage()
        .getPaged(this.page, this.itemPerPage, {'restaurantId': this.organization._id})
        .then((pagination) => {
  
      this.set('orders', pagination);
      this._setTotalItems(pagination.totalItems);
      this.notifyPath('totalItems');
    });
  }

  /**
   * 
   * @param {Date} date 
   * @returns 
   */
  getOrderDate(date) {
    return `${date.getHours()}:${date.getMinutes()} ${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
  }

  _observePages(service, page, organization) {
    if (!service || !page || !organization) {
      return;
    }
    this._getOrders();
  }

  _autocompleteChanged(evt) {
      this._orderService.getStorage()
        .getAll({'restaurantId': this.organization._id, name: evt.detail.text})
          .then((reults) => {

            this.$.autocomplete.suggestions(reults);
        });
  }

  _autocompleteSelect(evt) {
    this._orderService.setCurrentOrder(evt.detail.value);
  }

}
                        
window.customElements.define('dsign-order', DsignOrder);