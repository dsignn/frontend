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
import {ItemFavorite} from "../mixin/item-favorite/item-favorite";
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
class DsignMenuItemImage extends ItemFavorite(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {
    static get template() {
        return html`
    <style> 
        :host {
            display: block;
        }
   
        paper-card {
            width: 100%;
            height: 260px;
            display: flex;
            flex-direction: column;
        }
       
        .header {
            height: 40px;
            width: 100%;
            display: flex;
            align-items: center;
            padding: 4px;
        }
        
        .image {
            flex: 1;
            background-image: url(https://via.placeholder.com/150);
            background-position: center center;
            background-size: cover;
            background-repeat: no-repeat;
            position: relative;
        }
        
        .content {
            height: 60px;
        }
        
        .header-card-title {
           text-rendering: optimizeLegibility;
           font-size: 18px;
           font-weight: 400;
           overflow: hidden;
           text-overflow: ellipsis;
           height: 32px;
           padding: 4px;
       }
       
       .paragraph-card {
           flex: 1;
           color: #757575; 
           display: flex;
           align-items: start;
           padding: 4px;
           height: -webkit-fill-available;
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
       
       
       paper-icon-button {
           position: absolute;
           bottom: 4px;
           right: 4px;
           width: 26px;
           height: 26px;
           border-radius: 50%;
           --paper-icon-button : {
                padding: 1px;
           }       
           background-color: var(--munu-background-color);
           color: var(--munu-color);
       }
    </style>
    <paper-card>
        <div class="header">
            <div class="header-card-title">{{_capitalize(menuItem.name.it )}}</div>
        </div>
        <div id="image" class="image">
            <div class="price">
                {{_computePrice(menuItem.price)}} €
            </div>
            <paper-icon-button icon="add" on-tap="addFavorite"></paper-icon-button>
        </div>
        <div class="content">
            <div class="paragraph-card">{{menuItem.description.it}}</div>
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
                observer: '_changeMenu'
            },

            services: {
                value: {
                    _localizeService: 'Localize',
                    _favoriteService: 'FavoriteService',
                }
            }
        };
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
     * @param menu
     * @private
     */
    _changeMenu(menu) {
        if (!menu) {
            return;
        }

        if (menu.photos && Array.isArray(menu.photos) && menu.photos.length > 0) {
            this.$.image.style.backgroundImage = `url(${menu.photos[0].src})`;
        }
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
