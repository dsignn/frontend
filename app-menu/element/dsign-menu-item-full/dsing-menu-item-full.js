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
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-card/paper-card';
import '@polymer/neon-animation/neon-animation';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-button/paper-button';
import {lang} from './language';

/**
 * @class DsignMenuItemFull
 */
class DsignMenuItemFull extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {
    static get template() {
        return html`
    <style> 
    
       paper-card {
          width: 100%;
          height: 100%;
       }
       
       [padding-6] {
          padding: 6px;
       }
          
       .header-card {
          display: flex;
          flex-direction: row;      
       }
       
        .column-data {
          display: flex;
          flex-direction: column;
          flex:1;
        }
        
        .row-data {
          display: flex;
          flex-direction: row;
          flex:1;
        }
       
       .header-card-title {
          font-family: 'Roboto', 'Noto', sans-serif;
          -webkit-font-smoothing: antialiased;
          /* mixin(--paper-font-common-expensive-kerning); */
          text-rendering: optimizeLegibility;
          font-size: 22px;
          font-weight: 400;
          letter-spacing: -.012em;
          line-height: 32px;
          text-transform: capitalize;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          display: -webkit-box;
          -webkit-box-orient: vertical;
       }
       
       .circle {
            border-radius: 50%;
            background-color: red;
            height: 54px;
            width: 54px;
       }
       
       .img-card {
           min-height: 150px;
           background-size: cover;
           background-repeat: no-repeat;
           width: 100%;
           
       }
       
       [text-right] {
           text-align: right;
       }
       
       [clear] {
            padding: 0 !important;
            margin: 0 !important;
       }
      
       .paragraph-card,
       .price {
            padding: 0 16px;
            flex: 1;
            color: #757575; 
       }  
        
        .price {
            padding: 6px;
            font-size: 18px;
            font-weight: bold;
            color: black; 
        }  
        
          
    </style>
    <paper-card>
        <div>
            <div class="header-card" padding-6>
                <div class="circle" style="margin-right: 6px;"></div>
                <div class="header-card-title">{{menuItem.name.it}}</div>
            </div>
            <div class="img-card">
                <div class="price" text-right>{{_computePrice(menuItem.price)}} €</div>
            </div>
            <div class="row-data" padding-6>
                <div class="paragraph-card">{{menuItem.description.it}}</div>
                <paper-icon-button icon="add"></paper-icon-button>
            </div>
        </div>
    </paper-card>
    `;

    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties() {
        return {
            menuItem: {

            },

            services: {
                value: {
                    _localizeService: 'Localize',
                }
            }
        };
    }

    /**
     * @param price
     * @returns {*}
     * @private
     */
    _computePrice(price) {
        return price.value;
    }

}

window.customElements.define('dsign-menu-item-full', DsignMenuItemFull);
