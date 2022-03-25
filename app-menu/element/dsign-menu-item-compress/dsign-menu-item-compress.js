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
import {OrderBehaviour} from "../mixin/order-behaviour/order-behaviour";
import {MergeTraslation} from "../mixin/merge-traslation/merge-traslation";
import "../dsign-badge/dsing-badge";
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-card/paper-card';
import '@polymer/neon-animation/neon-animation';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-button/paper-button';
import {lang} from './language';
import { LocalizeEntityPropriety } from '../mixin/localize/localize-entity-proprierty';
import { OrderService } from '../../src/module/order/service/OrderService';
import { MenuItemBehaviour } from '../mixin/menu-item-behaviour/menu-item-behaviour';

/**
 * @class DsignMenuItemCompress
 */
class DsignMenuItemCompress extends MergeTraslation(OrderBehaviour(MenuItemBehaviour(LocalizeEntityPropriety(LocalizeMixin(ServiceInjectorMixin(PolymerElement)))))) {
    static get template() {
        return html`
    <style> 
    
       :host {
          display: block;
       }
    
       paper-card {
          @apply --layout;
          width: 100%;
          height: 120px;
       }
       
       .header {
           height: 100%;
           width: 100px !important;
           min-width: 100px;
           background-position: center center ;
           background-repeat: no-repeat;
           background-size: cover;
           position: relative;
       }
       
       .content {
         @apply --layout-vertical;
         @apply --layout-flex;
         width: 0vw;
       }
       
       .action {
           height: 32px;
           padding: 0 6px;
           position: absolute;
           right: 0;
           bottom: 0;
       }
       
       .header-card-title {
           font-size: 18px;
           font-weight: 500;
           height: auto;
           text-rendering: optimizeLegibility;
           line-height: 20px;
           display: block;
           padding: 0 6px;
       }

       #image {
           background-color:#eeeeee;
       }
       
      
       .header-card-category {
            font-style: italic ;
            padding: 2px 6px;
            color: #757575;
            font-size: 14px;
       }
       
       .paragraph-card {
           @apply --layout;
           @apply --layout-start;
           @apply --layout-flex;
           text-overflow: ellipsis;
           padding: 0 6px;
           overflow: hidden;
           -webkit-line-clamp: 2;
           -webkit-box-orient: vertical;
           overflow-y: auto;
       }  
       
       [padding-4] {
          padding: 6px;
       }
       
       paper-icon-button {
           width: 26px;
           height: 26px;
           border-radius: 50%;
           --paper-icon-button : {
                padding: 1px;
           }
           
           background-color: var(--munu-background-color);
           color: var(--munu-color);
       }

       iron-icon.allergen {
        
            width: 31px;
            height: 31px;
            border-radius: 50%;
            margin:1px;
            --paper-icon-button : {
                padding: 0px; 
            }    
            background-color: var(--munu-background-color);
            color: var(--munu-color);
        }
       
       dsign-badge {
         z-index: 1;
         --paper-badge-background: var(--munu-color);
         --paper-badge-text-color: var(--munu-background-color);
         border: 1px solid var(--munu-background-color);
         border-radius: 50%;
         font-weight: bold;
         --paper-badge : {
            font-weight: 700;
         }
       }
       
       .price {
            padding: 2px 8px;
            font-size: 18px;
            font-weight: 400;
            width: max-content;
            border-radius: 6px;
            position: absolute;
            top: 4px;
            right: 4px;
            background-color: var(--munu-background-color);
            color: var(--munu-color);
       }     
       
       .triangle {
           position: absolute;
           width: 0;
           height: 0;
           font-size: 8px;
           border-top: 86px solid #fc0303;
           border-right: 86px solid transparent;
       }


       #allergens {
        display:flex;
        flex-wrap: wrap-reverse;
        justify-content: end;
        position: absolute;
        right: 0px;
        bottom: 2px;
        width: 100px;
        height: auto;
       }
       
       #badgeMenu {
        visibility: hidden;
       }
    

       .status-dish {
          top: 24px;
          left: 2px;
          transform:rotate(315deg);
          -webkit-transform: rotate(315deg);
          -o-transform: rotate(315deg);
          -moz-transform: rotate(315deg);
          -ms-transform: rotate(315deg);
          position: absolute;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
       }
       
       paper-icon-button[disabled] {
            background-color:#757575;
       }
       
       [hidden] {
          visibility: hidden;
       }
          
    </style>
    <paper-card>
        <div id="image" class="header">
            <div class="triangle" hidden></div>
            <div id="allergens">
                <dom-repeat id="allergens" items="[[menuItem.allergens]]" as="allergen">
                    <template>
                        <iron-icon icon="allergen:{{allergen}}" class="allergen"></iron-icon>
                    </template>
                </dom-repeat>
            </div>
            <div class="status-dish">{{localize(statusLabel)}}</div>
            <template is="dom-if" if="{{hasPrice}}">
                <div class="price">
                    {{_computePrice(menuItem.price)}} €
                </div>
            </template>
        </div>
        <div class="content">
             <div class="header-card-title">{{localizeEntityPropriety(menuItem.name)}}</div>
             <div class="header-card-category">{{localize(category)}}</div>
             <div class="paragraph-card">{{localizeEntityPropriety(menuItem.description)}}</div>
             <div id="action" class="action">
                 <dsign-badge id="badgeMenu" for="btn-menu" label="{{getTotalItemOrder(menuItem)}}" class="red" offset-x="-2"></dsign-badge>
                 <paper-icon-button icon="add" id="btn-menu" item-order="{{menuItem}}" on-tap="addItemOrder" disabled="{{disableOrder}}"></paper-icon-button>
             </div>
        </div>
    </paper-card>`;
    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties() {
        return {

            categories: {
                observer: 'categoriesChange'
            },

            category: {
                notify: true
            },

            services: {
                value: {
                    _config: 'config',
                    _localizeService: 'Localize',
                    _orderService: 'OrderService',
                    _notifyService: 'Notify'
                }
            },

            _orderService: {
                readOnly: true,
                observer: 'changeOrderService'
            }    
        };
    }

    changeOrderService(service) {
        if (!service) {
          return;
        }
    
        service.getEventManager().on(OrderService.CHANGE_DEFAUL_ORDER, new Listener(this._updateViewOrder.bind(this)));
        service.getEventManager().on(OrderService.LOAD_DEFAUL_ORDER, new Listener(this._updateViewOrder.bind(this)));
        service.getEventManager().on(OrderService.UPDATE_LOCAL_ORDER, new Listener(this._updateViewOrder.bind(this)));
    }

    /**
     * @param value
     */
    categoriesChange(value) {
        if (!value) {
            return;
        }

        this._mergeTraslation(value);
        this.category = this.menuItem ? this.menuItem.category : '';
    }

    /**
     * @param enable
     */
    enableButton(enable) {
        this.$['btn-menu'].disabled = enable;
    }

    changeLanguage(evt) {
        super.changeLanguage(evt);
    }
}

window.customElements.define('dsign-menu-item-compress', DsignMenuItemCompress);
