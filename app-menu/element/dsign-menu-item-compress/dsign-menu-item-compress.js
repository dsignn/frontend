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
import {ItemFavorite} from "../mixin/item-favorite/item-favorite";
import {MergeCategory} from "../mixin/merge-category/merge-category";
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



/**
 * @class DsignMenuItemCompress
 */
class DsignMenuItemCompress extends MergeCategory(ItemFavorite(LocalizeMixin(ServiceInjectorMixin(PolymerElement)))) {
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
           display: flex;
           padding: 0 6px;
           @apply --layout-center;
            @apply --layout-end-justified;
       }
       
       .header-card-title {
           text-rendering: optimizeLegibility;
           font-size: 18px;
           font-weight: 500;
           height: 28px;
           line-height: 28px;
           display: block;
           padding: 0 6px;
           white-space: nowrap;
           overflow: hidden;
           text-overflow: ellipsis;
       }
       
      
       .header-card-category {
            font-style: italic ;
            padding: 0 6px;
            color: #757575;
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
            <div class="triangle"></div>
            <div class="status-dish">{{localize(statusLabel)}}</div>
            <template is="dom-if" if="{{hasPrice}}">
                <div class="price">
                    {{_computePrice(menuItem.price)}} €
                </div>
            </template>
        </div>
        <div class="content">
             <div class="header-card-title">{{_capitalize(menuItem.name.it)}}</div>
             <div class="header-card-category">{{localize(category)}}</div>
             <div class="paragraph-card">{{menuItem.description.it}}</div>
             <div id="action" class="action">
                 <dsign-badge id="badgeMenu" for="btn-menu" label="{{dishCount}}" class="red" offset-x="-2"></dsign-badge>
                 <paper-icon-button icon="add" id="btn-menu" on-tap="addFavorite"></paper-icon-button>
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
                    _menuStorage: 'MenuStorage',
                    _notifyService: 'Notify'
                }
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
     * @param value
     */
    categoriesChange(value) {
        if (!value) {
            return;
        }

        this._mergeCategory(value);
        this.category = this.menuItem ? this.menuItem.category : '';
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

        this.$.image.style.backgroundImage = `url(${config.bucket}/${menu.category}.png)`;
        this.$.image.style.backgroundSize = `contain`;
        this.$.image.style.backgroundColor = `#eeeeee`;

        menuStorage.getEventManager().on(Storage.POST_REMOVE, this.updateDishCount.bind(this));
        menuStorage.getEventManager().on(Storage.POST_UPDATE, this.updateDishCount.bind(this));
        menuStorage.getEventManager().on(Storage.POST_SAVE,  this.updateDishCount.bind(this));

        if (menu) {
            this.initDishCount(menu);
            this._changeStatus(menu.status);
        }
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
     * @param enable
     */
    enableButton(enable) {
        this.$['btn-menu'].disabled = enable;
    }
}

window.customElements.define('dsign-menu-item-compress', DsignMenuItemCompress);
