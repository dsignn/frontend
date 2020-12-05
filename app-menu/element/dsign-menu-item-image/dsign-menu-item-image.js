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
 * @class DsignMenuItemImage
 */
class DsignMenuItemImage extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {
    static get template() {
        return html`
    <style> 
              :host {
                display: block;
             }
    
    
             paper-card {
                width: 100%;
                height: 100%;
                min-width: 320px;
            }
       
       [padding-6] {
          padding: 6px;
       }
          
       .header-card {
          display: flex;
          flex-direction: row;   
          justify-content:space-between;   
       }
       
        .column-data {
          display: flex;
          flex-direction: column;
          flex:1;
        }
        
               
        .header-card-title {
            font-family: 'Roboto', 'Noto', sans-serif;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
            font-size: 16px;
            font-weight: 400;
            letter-spacing: -.012em;
            line-height: 20px;
            text-transform: capitalize;
        }
       
       .circle {
            border-radius: 50%;
            background-color: red;
            height: 54px;
            width: 54px;
            display:none;
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
      
    .price {
        align-self: flex-end;
        padding: 3px 2px 0px 5px;
        font-size: 14px;
        font-weight: 500;
        color: white;
        background: #015b63;
    }

    .paragraph-card {
        font-size: 16px;
        font-weight: normal;
        color: #757575;
    }
        
        .flex {
            display: flex;
        }

        .desc{
            width: 65%;
        }
      
        .image {
            background: url(http://127.0.0.1:8081/images/fettucce.jpg) no-repeat;
            width: 35%;
            background-size: cover;
            display: flex;
            border: 3px solid white;
            flex-direction: row-reverse;
        }

        paper-icon-button {
            height: 24px;
            width: 24px;
            padding: 0;
            border: 2px solid #015b63;
            border-radius: 50%;
            color: #015b63;
        }

        paper-icon-button.selected {
            color: white;
            background: #015b63;
        } 
        
        @media and max-screen(600px){
            .image {
                height: 25vw;
            }


        }
          
    </style>
    <paper-card>
        <div class="flex">
            <div class="image">
                <div class="price" text-right>{{_computePrice(menuItem.price)}} €</div>
            </div>
            <div class="desc">
                <div class="header-card" padding-6>
                    <div class="header-card-title">{{menuItem.name.it}}</div>    
                    <paper-icon-button icon="add"></paper-icon-button>
                    <div class="circle" style="margin-right: 6px;"></div>
                </div>
                <div class="row-data" padding-6>
                    <div class="paragraph-card">{{menuItem.description.it}}</div>
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
        if (!price || !price.value) {
            return;
        }
        return price.value;
    }

}

window.customElements.define('dsign-menu-item-image', DsignMenuItemImage);
