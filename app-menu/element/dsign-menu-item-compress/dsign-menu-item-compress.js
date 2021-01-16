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
import {ItemFavorite} from "../mixin/item-favorite/item-favorite";

/**
 * @class DsignMenuItemCompress
 */
class DsignMenuItemCompress extends ItemFavorite(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {
    static get template() {
        return html`
    <style> 
    
       :host {
          display: block;
       }
    
       paper-card {
          width: 100%;
          height: 120px;
          display: flex;
       }
       
       .header {
           height: 100%;
           width: 100px;
           background-position: center center ;
           background-repeat: no-repeat;
           background-size: cover;
           position: relative;
       }
       
       .content {
         flex: 1;
         display: flex;
         flex-direction: column;
       }
       
       .action {
           height: 32px;
           display: flex;
           padding: 0 6px;
           align-items: center;
           justify-content: flex-end;
       }
       
       .header-card-title {
           text-rendering: optimizeLegibility;
           font-size: 18px;
           font-weight: 400;
           overflow: hidden;
           text-overflow: ellipsis;
           height: 32px;
           display: inline-flex;
           align-items: center;
           padding: 0 6px;
           word-wrap: break-word; 
           white-space: nowrap;
       }
       
       .paragraph-card {
            flex: 1;
            color: #757575; 
            display: flex;
            align-items: start;
            padding: 0 6px;
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
          
    </style>
    <paper-card>
        <div id="image" class="header">
            <div class="price">
                {{_computePrice(menuItem.price)}} €
            </div>
        </div>
        <div class="content">
             <div class="header-card-title">{{_capitalize(menuItem.name.it)}}</div>
             <div class="paragraph-card">{{menuItem.description.it}}</div>
             <div class="action">
                 <paper-icon-button icon="add" on-tap="addFavorite"></paper-icon-button>
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
            menuItem: { },

            services: {
                value: {
                    _config: 'config',
                    _localizeService: 'Localize',
                    _favoriteService: 'FavoriteService',
                    _notifyService: 'Notify'
                }
            }
        };
    }

    static get observers() {
        return [
            '_observeMenu(menuItem, _config)'
        ];
    }

    /**
     * @param value
     * @returns {string}
     * @private
     */
    _capitalize(value) {
        return typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : '';
    }

    /**
     * @param price
     * @returns {*}
     * @private
     */
    _computePrice(price) {
        if (!price) {
            return ;
        }
        return price.value;
    }

    /**
     * @param menu
     * @param config
     * @private
     */
    _observeMenu(menu, config) {
        if (!menu || !config) {
            return;
        }

        if (menu.photos && Array.isArray(menu.photos) && menu.photos.length > 0) {
            this.$.image.style.backgroundImage = `url(${menu.photos[0].src})`;
        } else {
            this.$.image.style.backgroundImage = `url(${config.bucket}/${menu.category}.png)`;
            this.$.image.style.backgroundSize = `contain`;
        }
    }


}

window.customElements.define('dsign-menu-item-compress', DsignMenuItemCompress);
