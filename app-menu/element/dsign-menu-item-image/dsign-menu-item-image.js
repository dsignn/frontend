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
import {MergeTraslation} from "../mixin/merge-traslation/merge-traslation";
import {Storage} from "@dsign/library/src/storage/Storage";
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

/**
 * @class DsignMenuItemImage
 */
class DsignMenuItemImage extends MergeTraslation(ItemFavorite(LocalizeEntityPropriety(LocalizeMixin(ServiceInjectorMixin(PolymerElement))))) {
    static get template() {
        return html`
    <style> 
        :host {
            display: block;
        }
   
        paper-card {
            @apply --layout-vertical;
            width: 100%;
            height: 260px;
        }
       
        .header {
            @apply --layout;
            @apply --layout-center;
            height: 40px;
            padding: 6px;
        }
        
        .image {
            @apply --layout-flex;
            background-position: center center;
            background-size: cover;
            background-repeat: no-repeat;
            position: relative;
            border-bottom: 2px solid #eeeeee;
            border-top: 2px solid #eeeeee;
        }
        
        .content {
            height: 50px;
            padding: 6px;
        }
        
        .header-card-title {
           @apply --layout-flex;
           @apply --layout-center;
           text-rendering: optimizeLegibility;
           font-size: 18px;
           font-weight: 500;
           height: auto;
           line-height: 22px;
           display: block;
           padding: 0 6px;
           width: 1vw;
       }
       
       .paragraph-card {
           display: block;
           height: 60px;
           color: #757575;
           font-size: 15px;
           overflow: hidden;
           overflow-y: auto;
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
       
       .header-card-category {
            position: absolute;
            border-radius: 6px;
            bottom: 4px;
            left: 4px;
            padding: 4px;
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
       
       paper-icon-button #btn-menu {
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
       
       paper-icon-button[disabled] #btn-menu {
            background-color:#757575;
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
            right: 4px;
            bottom: 4px;
            width: 100px;
            height: auto;
       }
       
       .status-dish {
          top: 24px;
          left: 10px;
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
          
       [hidden] {
          visibility: hidden;
       }
    </style>
    <paper-card>
        <div class="header">
            <div class="header-card-title">{{localizeEntityPropriety(menuItem.name)}}</div>
        </div>
        <div id="image" class="image">
            <div class="triangle"></div>
            <div class="status-dish">{{localize(statusLabel)}}</div>
            <template is="dom-if" if="{{hasPrice}}">
                <div class="price">
                    {{_computePrice(menuItem.price)}} €
                </div>
            </template>
            <div class="header-card-category">{{localize(category)}}</div>
            <div id="action">
                <dsign-badge id="badgeMenu" for="btn-menu" label="{{dishCount}}" class="red" offset-x="-2"></dsign-badge>
                <paper-icon-button icon="add" id="btn-menu"  on-tap="addFavorite"></paper-icon-button>
            </div>
            <div id="allergens">
                <dom-repeat id="allergens" items="[[menuItem.allergens]]" as="allergen">
                    <template>
                        <iron-icon icon="allergen:{{allergen}}" class="allergen"></iron-icon>
                    </template>
                </dom-repeat>
            </div>
        </div>
        <div class="content">
            <div class="paragraph-card">{{localizeEntityPropriety(menuItem.description)}}</div>
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

            categories: {
                observer: 'categoriesChange'
            },

            services: {
                value: {
                    _config: 'config',
                    _localizeService: 'Localize',
                    _menuStorage: 'MenuStorage',
                    _notifyService: 'Notify',
                }
            },

            statusLabel: {
                notify: true
            },

            /**
             * @type Number
             */
            dishCount: {
                value: 0,
                observer: 'changeDishCount'
            },
        };
    }

    static get observers() {
        return [
            '_observeMenu(menuItem, _config, _menuStorage)'
        ];
    }

    /**
     *
     */
    ready() {
        super.ready();
        this.$.image.style.backgroundImage = 'url(https://dsign-asset.s3.eu-central-1.amazonaws.com/dish-not-found.png)';
    }

    /**
     * @param dishCount
     */
    changeDishCount(dishCount) {
        if (!dishCount) {
            this.$.badgeMenu.style.visibility = 'hidden';
            return;
        }
        this.$.badgeMenu.style.visibility = 'visible';
    }

    /**
     *
     * @param menu
     * @param config
     * @param {Storage} menuStorage
     * @private
     */
    _observeMenu(menu, config, menuStorage) {
        if (!menu || !config || !menuStorage) {
            return;
        }

        if (menu && menu.name && menu.name.it) {
            menu.name.it = menu.name.it.charAt(0).toUpperCase() + menu.name.it.slice(1);
        }

        if (menu && menu.name && menu.name.en) {
            menu.name.en = menu.name.en.charAt(0).toUpperCase() + menu.name.en.slice(1);
        }

        if (menu.photos && Array.isArray(menu.photos) && menu.photos.length > 0) {
            this.$.image.style.backgroundImage = `url(${menu.photos[0].src})`;
        } else {
            this.$.image.style.backgroundSize = `cover`;
        }

        menuStorage.getEventManager().on(Storage.POST_REMOVE, this.updateDishCount.bind(this));
        menuStorage.getEventManager().on(Storage.POST_UPDATE, this.updateDishCount.bind(this));
        menuStorage.getEventManager().on(Storage.POST_SAVE,  this.updateDishCount.bind(this));

        if (menu) {
            this.initDishCount(menu);
            this._changeStatus(menu.status);
        }
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
        if (!price || !price.value) {
            return;
        }
        return price.value;
    }

    _changeStatus(status) {

        switch (status) {
            case 'available':
                this.statusLabel = '';
                this.shadowRoot.querySelector('.triangle').setAttribute('hidden', '');
                this.shadowRoot.querySelector('.status-dish').setAttribute('hidden', '');
                this.enableButton(false);
                break;
            case 'over':
                this.statusLabel = 'finished';
                this.shadowRoot.querySelector('.triangle').removeAttribute('hidden');
                this.shadowRoot.querySelector('.status-dish').removeAttribute('hidden');
                this.enableButton(true);
                break;
            case 'not-available':
                this.statusLabel = 'off-the-menu';
                this.shadowRoot.querySelector('.triangle').removeAttribute('hidden');
                this.shadowRoot.querySelector('.status-dish').removeAttribute('hidden');
                this.enableButton(true);
                break;
        }
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
        console.log('cambio')
    }
}

window.customElements.define('dsign-menu-item-image', DsignMenuItemImage);
