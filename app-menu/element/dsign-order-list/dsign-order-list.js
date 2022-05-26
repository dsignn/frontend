/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { LocalizeMixin } from "@dsign/polymer-mixin/localize/localize-mixin";
import { ServiceInjectorMixin } from "@dsign/polymer-mixin/service/injector-mixin";
import { Storage } from "@dsign/library/src/storage/Storage";
import { Listener } from "@dsign/library/src/event/Listener";
import '@polymer/paper-icon-button/paper-icon-button';
import '@fluidnext-polymer/paper-pagination/paper-pagination';
import '@fluidnext-polymer/paper-pagination/icons/paper-pagination-icons';
import '@fluidnext-polymer/paper-autocomplete/paper-autocomplete';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-tooltip/paper-tooltip';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-icon-button/paper-icon-button';
import { lang } from './language';
import { OrderBehaviour } from '../mixin/order-behaviour/order-behaviour';
import { OrderService } from '../../src/module/order/service/OrderService';
import '../dsign-order-item/dsign-order-item';
import { OrderItemWrapper } from '../../src/module/order/entity/embedded/OrderItemWrapper';
import { set } from '@polymer/polymer/lib/utils/path';

/** 
 * @class DsignOrderList
 */
class DsignOrderList extends OrderBehaviour(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {

  static get template() {
    return html`
          <style>
            :host {
              display: block;
                               
              --paper-input-container: {
                --paper-input-container-color: var(--munu-color);
                --paper-input-container-focus-color: var(--munu-color);
                --paper-input-container-input-color: var(--munu-color);
              }
            }  

                   
            dsign-badge {
              z-index: 1;
              bottom: 14px;
              --paper-badge-width: 15px;
              --paper-badge-height: 15px;
              --paper-badge-background: var(--munu-color);
              --paper-badge-text-color: var(--munu-background-color);
        
              font-weight: bold;
              --paper-badge : {
                font-weight: 700;
                border: 1px solid var(--munu-background-color);
                border-radius: 50%;
              }
            }        

            paper-icon-button {

              width: 22px;
              height: 22px;
              border-radius: 50%;
              --paper-icon-button : {
                   padding: 0;
              }       
              background-color: var(--munu-background-color);
              color: var(--munu-color);
            }

            .status {
              width: 20px;
              height: 20px; 
              border-radius: 50%;
              margin-left:10px;
              border: 1px solid var(--munu-background-color);
            }

            .to-do {
              background: var(--status-in-queue) ;
            }

            .delivered {
              background: var(--status-can-order) ;
            }

            .terminate {
              background-color: var(--status-close);
            }

            .container {
              display: flex;
              flex-direction: column;
              height: 100%;
            }

            .wrapper {
              display: flex;
              flex-direction: column;
              flex: 1 1 auto;
              overflow-y: scroll;
              min-height: 0px;
            }

            paper-card {
              display:flex;
              flex-direction: row;
              margin: 6px 3px;
              padding: 6px 2px;

            }

            .data {
              flex:1;
              text-align: left;
            }

            .info {
              height: 35px;
              display: flex;
              align-items: end;
            }

            .action {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }

            .total,
            .price {
              margin-left:6px;
              display: flex;
              flex-direction: column;
            }

            .total label ,
            .price label {
              font-size: 10px;
              text-align:center;
            }

            .total div,  
            .price div {
              text-align:center;
              font-size: 14px;
            }

            paper-icon-button[disabled] {
              background-color:#757575;
            }
         

            paper-tooltip {
           
              --paper-tooltip-background: var(--munu-background-color);
              --paper-tooltip-text-color: var(--munu-color);

              --paper-tooltip: {
                font-size: 14px;
              }
            }

          </style>       
            <div class="container">
              <div class="wrapper">
                <dom-repeat id="menu" items="{{items}}" as="item">
                  <template>
                    <dsign-order-item item="{{item}}" menu="[[menu]]"></dsign-order-item>
                  </template>
                  <template is="dom-if" if="{{!hasDishis(items)}}">
                    TODO
                  </template>
                </dom-repeat>
              </div>
            </div>`;
  }

  static get properties() {
    return {
      items: {
        notify: true,
        value: []
      },

      menu: {
        notify: true
      },

      services: {
        value: {
          _config: 'config',
          _localizeService: 'Localize',
          _orderService: 'OrderService',
        }
      },

      _orderService: {
        readOnly: true,
        observer: 'changeOrderService'
      }
    };
  }

  constructor() {
    super();
    this.resources = lang;
  }

  connectedCallback() {
    super.connectedCallback();
    new ResizeObserver((evt) => {
      let ret = this.getBoundingClientRect()
      this.style.height = (window.innerHeight - ret.top) + 'px';
    }).observe(this)

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
    service.getEventManager().on(OrderService.UPDATE_LOCAL_ORDER, new Listener(this._updateViewOrder.bind(this)));
  }


  /**
   * 
   */
  _updateViewOrder() {

    super._updateViewOrder();
    if (!this.currentOrder) {
      this.items = [];
    } else {
      this.items = this.currentOrder.getDistinctItemOrder();
    }
    this.notifyPath('items');
  }


  /**
   * @param {any} dishes 
   * @returns boolean
   */
  hasDishis(dishes) {
    let has = false;
    if (dishes && Array.isArray(dishes) && dishes.length > 0) {
      has = true;
    }

    return has;
  }

}

window.customElements.define('dsign-order-list', DsignOrderList);