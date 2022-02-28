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
import { OrderService } from '../../src/module/order/service/OrderService';
import { OrderBehaviour } from '../mixin/order-behaviour/order-behaviour';
import { OrderEntity } from '../../src/module/order/entity/OrderEntity';

/** 
 * @class DsignOrder
 */
class DsignOrder extends OrderBehaviour(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
          <style>
            :host {
              --paper-input-container: {
                --paper-input-container-focus-color: var(--munu-background-color);
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

            .item-wrapper {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              margin: 4px 0;
            }

            .item-order {
              width: 49%;
              display: flex;
              flex-direction: column;
              align-items: self-start;
              margin: 1px;
              padding: 6px 2px;
              align-items: center;
              color: var(--munu-color);;
              background-color: var(--munu-background-color);
            }

            .item-order .name {
              padding: 6px 0 0 0;
              font-size: 18px;
              text-align: center;
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
            
            #status {
              height:20px;
              width: 20px;
              border-radius:50%;
              margin-right: 4px;
              margin-bottom: 8px;
              border: 1px solid var(--munu-background-color);
              background: var(--status-can-order) ;
            }

            #status[delivered] {
              background: var(--status-in-order) ;
            }

            #status[close] {
              background-color: var(--status-close-order);
            }

            .select {
              display: flex;
              align-items: end;
            }

            .price {
              display: flex;
              flex-direction: column;
              align-items: start;
              justify-content: space-around;
              padding: 8px 0;
              color: var(--munu-background-color);
            }

            .total label ,
            .price label {
              font-size: 11px;
              text-align:center;
            }

            .total div,  
            .price div {
              text-align:center;
              font-size: 14px;
            }

            paper-autocomplete {
              text-align: left;
              flex: 1;
              margin-right: 10px;
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
          <div class="item-wrapper">
            <template is="dom-repeat" items="[[orders]]" as="order">
              <paper-card class="item-order" elevation="0">
                <div class="name">{{order.name}}</div>
                <div class="date">{{getOrderDate(order.createdAt)}}</div>
              </paper-card>
            </template>
          </div>
          <paper-pagination page="{{page}}" 
            total-items="{{totalItems}}" 
            item-per-page="{{itemPerPage}}" 
            view-page-range="3"
            next-icon="paper-pagination:next-arrow" 
            previous-icon="paper-pagination:previous-arrow"
            hide-page-element
            hide-number-element>
          </paper-pagination>
          <div class="select">
            <div id="status" close></div>
            <paper-tooltip for="status" position="right">{{statusMessage}}</paper-tooltip>
            <paper-autocomplete 
            id="autocomplete"
            label="{{localize('select-order')}}"
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
                    }

                    .date {
                      font-style: italic;
                      font-size: 12px;
                      opacity: 0.6;
                    }
                </style>
                <paper-item class="custom-item" on-tap="_onSelect" role="option" aria-selected="false">
                    <div class="container info" index="[[index]]">
                        <div class="order">[[item.name]]</div>    
                        <div class="date">{{getOrderDate(item.createdAt)}}</div>       
                    </div>
                    <paper-ripple></paper-ripple>
                </paper-item>
              </template>
            </paper-autocomplete>
            <div id="price" class="price"> 
              <label>{{localize('total')}}</label>
              [[getTotalOrderItemPrice()]] 
            </div>
          </div>
        `;
    }

  static get properties() {
      return {

        organization: {
          notify: true,
        },

        currentOrder: {
          observer: 'changeCurrentOrder'
        },

        menu: {
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
        },

        statusMessage: {
          notify: true,
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
        '_obeserveLocalizeService(_localizeService)',
        '_obeserveOrderDialog(_localizeService, menu)'
    ];
  }

  /**
   * @param {OrderService} service 
   */
  _obeserveLocalizeService(service) {
    service.getEventManager().on(Localize.CHANGE_LANGUAGE, this._changeLanguage.bind(this))
  }

  /**
   * 
   * @param {OrderService} service 
   * @param {object} menu 
   */
  _obeserveOrderDialog(service, menu) {
    if (!service || !menu) {
      return;
    }
   
    this._createDialogCreateOrder();
  }

  changeCurrentOrder(value) {
    if (!value) {
      this.$.status.style.visibility = 'hidden';
      this.$.price.style.visibility = 'hidden';
    } else {
      this.$.status.style.visibility = 'visible';
      this.$.price.style.visibility = 'visible';
    }
  }

  _changeLanguage(evt) {
    let dialog = document.getElementById('addOrderDialog')
    dialog.querySelector('h3').innerHTML = this.localize('insert-order');
    dialog.querySelector('paper-input').label = this.localize('name');
    dialog.querySelector('paper-button').innerHTML = this.localize('insert-order');
  }

  _setStatusMessage() {
    if (!this.currentOrder) {
      this.statusMessage = "";
      return;
    }

    switch(this.currentOrder.status) {
      case OrderEntity.STATUS_CHECK:
      case OrderEntity.STATUS_QUEUE:
        this.statusMessage = this.localize('status-message-can-order');
        break;
      case OrderEntity.STATUS_PREPARATION:
        this.statusMessage = this.localize('status-message-waiting-order');
        break;
      default:
        this.statusMessage = this.localize('status-message-cant-order');
    }
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

    // Add title
    let h3  = document.createElement('h3');
    h3.innerHTML = this.localize('insert-order');
    dialog.appendChild(h3);

    // Add Name order
    let input  = document.createElement('paper-input');
    input.setAttribute('id', 'nameOrder');
    input.setAttribute('label', this.localize('name'));
    input.addEventListener('value-changed', this.validateInput.bind(this));
    dialog.appendChild(input);
  

    switch(this.menu.status) {
      case 'indoor':
        // Add table number
        input = document.createElement('paper-input');
        input.setAttribute('id', 'tableNumber');
        input.setAttribute('type', 'number');
        input.setAttribute('label', this.localize('table-number'));
        input.addEventListener('value-changed', this.validateInput.bind(this));
        dialog.appendChild(input);
        break;

     default:
        // Add phone number
        input = document.createElement('paper-input');
        input.setAttribute('id', 'phoneNumber');
        input.setAttribute('type', 'number');
        input.setAttribute('label', this.localize('phone-number'));
        input.addEventListener('value-changed', this.validateInput.bind(this));
        dialog.appendChild(input);

        // Add email
        input = document.createElement('paper-input');
        input.setAttribute('id', 'email');
        input.setAttribute('type', 'email');
        input.setAttribute('label', this.localize('email'));
        input.addEventListener('value-changed', this.validateInput.bind(this));
        dialog.appendChild(input);
        break;
    }

    // Add button
    let button = document.createElement('paper-button');
    button.innerHTML = this.localize('insert-order');
    button.disabled = true;
    button.addEventListener('tap', this.AddOrder.bind(this));
    dialog.appendChild(button);

    document.body.appendChild(dialog);   
  }

  /**
   * @param {CustomEvent} evt 
   */
  openDialog(evt) {
    document.getElementById('addOrderDialog').open();
  }

  /** 
   * @param {CustomEvent} evt 
   */
  AddOrder(evt) {

    let now = new Date(); 
    let entity = this._orderService.getStorage().getHydrator().hydrate({});

    // TODO remove when add multi storage
    /*
    entity.id =((m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
    s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h)))();
    */
    entity.name = evt.target.parentElement.querySelector('#nameOrder').value;

    // in the menu the variable controll also the status of the menu "disable" in the order "rename" the value
    entity.pushAdditionInfo('orderType', this.menu.status);
    if (evt.target.parentElement.querySelector('#tableNumber')) {
      entity.pushAdditionInfo('tableNumber', evt.target.parentElement.querySelector('#tableNumber').value);
    }

    if (evt.target.parentElement.querySelector('#email')) {
      entity.pushAdditionInfo('email', evt.target.parentElement.querySelector('#email').value);
    }

    if (evt.target.parentElement.querySelector('#phoneNumber')) {
      entity.pushAdditionInfo('phoneNumber', evt.target.parentElement.querySelector('#phoneNumber').value);
    }
    entity.createdAt = new Date();
    entity.organization.id = this.organization._id;
    entity.organization.collection = 'organization';
    entity.type = this.menu.status;

    this._orderService.getStorage().save(entity);

    evt.target.parentElement.querySelector('#nameOrder').value = null;
    if (evt.target.parentElement.querySelector('#tableNumber')) {
      evt.target.parentElement.querySelector('#tableNumber').value = null;
    }
    document.getElementById('addOrderDialog').close()
  }

  /** 
   * @param {CustomEvent} evt 
   */
  validateInput(evt) {
    
    document.getElementById('addOrderDialog').querySelector('paper-button').disabled = false;
    let inputName = evt.target.parentElement.querySelector('#nameOrder');
    
    if (!inputName.value) {
      document.getElementById('addOrderDialog').querySelector('paper-button').disabled = true;
    }

    let inputEmail = evt.target.parentElement.querySelector('#email');
    if (inputEmail  != null && (!inputEmail.value || this._validateEmail(inputEmail.value) === null)) { 
      document.getElementById('addOrderDialog').querySelector('paper-button').disabled = true;
    }

    let inputTable = evt.target.parentElement.querySelector('#phoneNumber');
    if (inputTable  != null && !inputTable.value) { 
      document.getElementById('addOrderDialog').querySelector('paper-button').disabled = true;
    }
  }

  _validateEmail(email) {
    return String(email).toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }

  /**
   * 
   * @param {OrderService} service 
   * @returns 
   */
  changeOrderService(service) {
      if (!service) {
        return;
      }
  
      service.getStorage().getEventManager().on(Storage.POST_UPDATE, new Listener(this._updateViewOrder.bind(this)));
      service.getStorage().getEventManager().on(Storage.POST_SAVE, new Listener(this._updateViewOrder.bind(this)));
      service.getEventManager().on(OrderService.CHANGE_DEFAUL_ORDER, new Listener(this._updateViewOrder.bind(this)));
      service.getEventManager().on(OrderService.LOAD_DEFAUL_ORDER, new Listener(this._updateViewOrder.bind(this)));
      service.getEventManager().on(OrderService.CHANGE_DEFAUL_ORDER, new Listener(this._updateCurrentOrder.bind(this)));
      service.getEventManager().on(OrderService.LOAD_DEFAUL_ORDER, new Listener(this._updateCurrentOrder.bind(this)));
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
/*
    orderService.loadCurreOrder(organization._id)
      .then((data) => {
        this.$.autocomplete.value = data;
        this._setStatusMessage();
      });
      */
  }

  /**
   * @param {CustomEvent} evt 
   */
   _updateViewOrder(evt) {
    super._updateViewOrder();
    this._getOrders();
  }
  
  /**
   * @param {CustomEvent} evt 
   */
  _updateCurrentOrder(evt) {

    this.__updateStatus(evt.data);
    this._setStatusMessage();
  }

  __updateStatus(order) {
    
    switch(order.status) {
      case OrderEntity.STATUS_QUEUE:
      case OrderEntity.STATUS_CHECK:
        this.$.status.removeAttribute('close');
        this.$.status.removeAttribute('delivered');
        break;
      case OrderEntity.STATUS_PREPARATION:
        this.$.status.setAttribute('delivered', null);
        break;
      default:
        this.$.status.setAttribute('close', null);
    }
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

  _isOrderIndor() {
      return window.location.href.search(new RegExp('89')) > -1
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