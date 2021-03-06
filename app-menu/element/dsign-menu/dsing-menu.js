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
import {setPassiveTouchGestures, setRootPath} from '@polymer/polymer/lib/utils/settings.js';
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {Storage} from "@dsign/library/src/storage/Storage";
import {Listener} from "@dsign/library/src/event/Listener";
import {MergeCategory} from "../mixin/merge-category/merge-category";
import {mergeDeep} from "@dsign/library/src/object/Utils";
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-button/paper-button';
import '@dsign/polymer-mixin/localize/localize-mixin';
import '../paper-select-language/paper-select-language';
import '../dsign-menu-wrap-item/dsing-menu-wrap-item';
import '../dsign-menu-favorites/dsign-menu-favorites';
import '../dsign-badge/dsing-badge';
import '../dsign-logo/dsing-logo';
import '../dsign-info/dsing-info';
import {lang} from './language';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

/**
 * @class DsignMenu
 */
class DsignMenu extends MergeCategory(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {
    static get template() {
        return html`
    <style>    
       app-toolbar {
         background-color:  #015b63;
         padding-left: 6px;
         padding-right: 6px;
         color: white;
       }
       
       app-toolbar paper-input,
       app-toolbar paper-dropdown-menu {
           --primary-text-color: white; 
           --paper-input-container-color: white;
           --paper-input-container-focus-color: #BFBFBF;
           --paper-input-container-invalid-color: white;
       }
       
       app-toolbar paper-dropdown-menu paper-item {
            color: #757575;; ;
       }
       
       dsign-menu-favorites {
            margin-bottom: 4px;
       }
       
       .btn-order {
           @apply --layout-flex;
           background-color: var(--munu-background-color);
           color: var(--munu-color);
           margin: 0;
       }
       
       dsign-badge {
         --paper-badge-background: var(--munu-color);
         --paper-badge-text-color: var(--munu-background-color);
         --paper-badge : {
            font-weight: 700;
         }
       }
       
       .restaurant-title {
           font-family: var(--paper-font-common-base_-_font-family);
           text-transform: capitalize;
           margin-top: 10px;
           margin-bottom: 10px;
           font-size: 22px;
           text-align: center;
       }
     
       
       h2.title {
          font-family: var(--paper-font-common-base_-_font-family);
          margin: 0;
          margin-top: 10px;
          margin-bottom: 10px;
          text-align: center;
          text-transform: uppercase;
       }
       
       .subtitle {
            @apply --layout-horizontal;
            @apply --layout-center;
            padding-bottom: 10px;
            padding-top: 10px;
       }
       
       .amount {
            @apply --layout;
            @apply --layout-flex;
            @apply --layout-center;
            @apply --layout-end-justified;
            padding-right: 4px;
            font-size: 20px;
            font-weight: 600;
            font-family: var(--paper-font-common-base_-_font-family);
       }
       
       [no-padding] {
            padding: 0;
       }
       
       .item {
       
         background-color: #eee;
         flex-basis: 13.9%;
         -webkit-flex-basis: 13.9%;
         margin: 0 6px 6px 0;
       }
       
       .search {
         width: 100%;
       }
       
       .flex-row {
         @apply --layout-horizontal;
       }
       
       [down] {
         @apply --layout-end;
       }
       
       .search paper-input {
         width: 100%;
       }
       
       .padding-l-6 {
         padding-left: 6px;
       }
       
       paper-listbox {
         min-width: 150px;
         width: 100%;
       }
       
       paper-select-language {
            font-size: 18px;
            font-family: "Roboto", "Noto", sans-serif;
            color:rgb(33, 33, 33);
       }
       
       .logo {
          height: 64px;
          width: 64px;
          border-radius: 50%;
          background-position: center center;
          background-size: 60px;
       }
       
       app-drawer {
        padding: 6px;
       }
       
       #action {
           @apply --layout;
           @apply --layout-center;
           width: 40px;
       }
       
       
       paper-icon-button.menu-drawer {
           color: #000000 !important;
           width: 20px;
           height: 20px;
           border-radius: 50%;
           --paper-icon-button : {
                padding: 0;
           }       
       }
       #paperAction {
            padding-left: 12px;
       }
       
       paper-icon-button.copy {
           width: 34px;
           height: 34px;
           --paper-icon-button : {
                padding: 3px;
           }   
       }
       
       #order {
          @apply --layout;
          @apply --layout-horizontal;
          @apply --layout-center;
       }
       
       .drawerContainer {
        padding: 6px;
       }
       
       paper-select-language {
         width: 100%;
       }   
              
       #menuContainer {
         @apply --layout-horizontal;
         @apply --layout-start-justified;
         @apply --layout-wrap;
         padding: 3px;
       }
       
       .divider {
            width: 6px;
       }
       
       dsign-menu-wrap-item {
           flex-basis: 10%;
           -webkit-flex-basis: 10%;
           --menu-wrap-container : {
               margin-bottom: 8px;
               margin-right: 8px;
           }
       }
       
       #whatsappIcon {
        margin-right: 6px;
       }
       
       #category {
         padding-bottom: 2px;
       }
              
       app-drawer {           
           --app-drawer-width: 400px;
       }
  

       @media only screen and (max-width: 2600px) and (min-width: 2201px) {
           dsign-menu-wrap-item {
                flex-basis: 12.5%;
                -webkit-flex-basis: 12.5%;
                max-width: 12.5%;
           }
           
           dsign-menu-wrap-item:nth-child(8n) { 
               --menu-wrap-container : {
                   margin-right: 0;
               }
           }
       }

       @media only screen and (max-width: 2200px) and (min-width: 1981px) {
           dsign-menu-wrap-item {
               flex-basis: 14.2%;
               -webkit-flex-basis: 14.2%;
               max-width: 14.2%;
           }
           
           dsign-menu-wrap-item:nth-child(7n) { 
               --menu-wrap-container : {
                   margin-right: 0;
               }
           }
       }  
       
       @media only screen and (max-width: 1980px) and (min-width: 1701px) {
           dsign-menu-wrap-item {
               flex-basis: 16.66%;
               -webkit-flex-basis: 16.66%;
               max-width: 16.66%;
           }
           
           dsign-menu-wrap-item:nth-child(6n) { 
               --menu-wrap-container : {
                   margin-right: 0;
               }
           }
       }  
            
       @media only screen and (max-width: 1700px) and (min-width: 1201px) {
           dsign-menu-wrap-item {
               flex-basis: 20%;
               -webkit-flex-basis: 20%;
               max-width: 20%;
           }
           
           dsign-menu-wrap-item:nth-child(5n) { 
               --menu-wrap-container : {
                   margin-right: 0;
               }
           }
       }  

       @media only screen and (max-width: 1200px) and (min-width: 971px) {
           dsign-menu-wrap-item {
               flex-basis: 25%;
               -webkit-flex-basis: 25%;
               max-width: 25%;
           }
           
           dsign-menu-wrap-item:nth-child(4n) { 
               --menu-wrap-container : {
                   margin-right: 0;
               }
           }
       }        

       @media only screen and (max-width: 970px) and (min-width: 771px) {
            dsign-menu-wrap-item {
                flex-basis: 33.3%;
                -webkit-flex-basis: 33.3%;
                max-width: 33.3%;
            }
            
            dsign-menu-wrap-item:nth-child(3n) { 
               --menu-wrap-container : {
                   margin-right: 0;
               }
            }
       }
              
       @media only screen and (max-width: 770px) and (min-width: 501px) {
       
            app-drawer {           
                --app-drawer-width: 250px;
            }
       
            dsign-menu-wrap-item {
                flex-basis: 50%;
                -webkit-flex-basis:  50%;
                max-width: 50%;
            }
            
            dsign-menu-wrap-item:nth-child(2n) { 
               --menu-wrap-container : {
                   margin-right: 0;
               }
            }
       }
       
       @media only screen and (max-width: 500px)  {
            app-drawer {           
                --app-drawer-width: 250px;
            }
       
            dsign-menu-wrap-item {
                flex-basis: 100%;
                -webkit-flex-basis:  100%;
                --menu-wrap-container : {
                   margin-bottom: 8px;
                   margin-right: 0;
                }
            }
            
              #language, #category {
                width: 96px;
            }
                       
            .item {
                flex-basis: 100%;
               -webkit-flex-basis:  100%;
            }
       }      
    </style>
    <app-header-layout fullbleed>
      <app-header slot="header" fixed effects="waterfall">
        <app-toolbar>
            <template is="dom-if" if="{{hasLogo}}">
                <dsign-logo organization="{{organization}}"></dsign-logo>
            </template>
            <div class="search flex-row">
                <paper-input id="search" label="{{localize('search')}}" on-input="searchByName"></paper-input>
            </div>
            <div class="divider"></div>
            <div class="flex-row" down>
                <paper-dropdown-menu id="category" label="{{localize('category')}}" on-iron-select="searchByCategory">
                    <paper-listbox id="categories" slot="dropdown-content">
                        <dom-repeat id="menu" items="{{categories}}" as="category">
                          <template>
                             <paper-item value="{{category}}">{{localize(category)}}</paper-item>
                          </template>
                        </dom-repeat>
                    </paper-listbox>
                </paper-dropdown-menu>
                <paper-icon-button icon="clear" on-tap="clearCategory" disable down></paper-icon-button>
            </div>
            <div id="orderButtonContainer" class="flex-row">
                <paper-icon-button id="btn-menu" icon="v-menu" on-tap="tapMenu"></paper-icon-button>
                <dsign-badge id="badgeMenu" for="btn-menu" label="{{totalOrder}}" offset-y="6"></dsign-badge>
            </div>
        </app-toolbar>
      </app-header>
      <div id="menuContainer">
          <dom-repeat id="list" items="[[items]]" as="menuItem">
              <template>
                    <dsign-menu-wrap-item item="[[menuItem]]" type="[[layoutType]]" restaurant="[[organization]]" show-order="[[menu.enable_order]]" categories="{{allCategory}}"></dsign-menu-wrap-item>
              </template>
          </dom-repeat>
      </div>
    </app-header-layout>
    <app-drawer id="drawer" align="right">
        <div class="drawerContainer">
            <div class="restaurant-title">{{organization.name}}</div>
            <div id="order" style="display: flex">
                <paper-button class="btn-order" on-tap="_sendOrder">
                    <iron-icon id="whatsappIcon" icon="whatsapp"></iron-icon>
                    {{localize('order-whatsapp')}}
                </paper-button>
            </div>
            <div class="subtitle">
                <div class="amount">{{amount}}</div>
            </div>
            <dom-repeat id="favorites" items="[[favorites]]" as="favorite" sort="sortArrayFavorites">
              <template>
                <dsign-menu-favorites menu-item="{{favorite}}"></dsign-menu-favorites>
              </template>
            </dom-repeat>
        </div>
    </app-drawer>`;
    }

    static get properties() {
        return {
            menu: {
                observer: 'changeMenu'
            },

            organization: {
                notify: true,
                observer: 'changeOrganization'
            },

            items: {
                notify: true,
            },

            services: {
                value: {
                    _localizeService: 'Localize',
                    _config: 'config',
                    _menuStorage: 'MenuStorage',
                    _notifyService: 'Notify',
                }
            },

            totalOrder: {
                value: 0,
                observer: 'changeTotalOrder'
            },

            amount: {
                notify: true
            },

            layoutType: {
                value: 'dsign-menu-item-image',
                readOnly: true
            },

            apiUrl: { },

            menuUrl: {
                observer: 'changeMenuUrl'
            },

            favorites: {
                notify: true,
                value: []
            },

            _menuStorage: {
                readOnly: true,
                observer: 'changeMenuStorage'
            },

            _config: {
                readOnly: true,
                observer: 'changeConfig'
            },

            categories: {
                notify: true
            },

            allCategory: { },

            hasLogo: {
                value: false
            },

            /**
             *
             */
            interval: {
                type: Number,
                readOnly: true,
                value: 30000
            }
        };
    }


    static get observers() {
        return [
            '_observeCategory(items, apiUrl)',
            '_observeMenuStorage(_menuStorage, organization, allCategory)'
        ];
    }

    /**
     * @inheritDoc
     */
    constructor() {
        super();
        this.resources = lang;
        let param = this.parseUrlParam();
        if (param && param['menu'] &&  param['menu'] === 'compress') {
            this._setLayoutType('dsign-menu-item-compress');
        }
    }

    /**
     * TODO config url and create service
     * @returns array
     */
    getCategory() {

        return new Promise( (resolve, reject) => {
            let request = new XMLHttpRequest();

            request.addEventListener("load", (data) => {

                if (request.status >= 300) {
                    let response = {
                        status: request.status,
                        message: request.responseText
                    };

                    return reject(response)
                }
                resolve(JSON.parse(request.response));
            });
            request.open("GET", `${this.apiUrl}menu-category`);
            request.setRequestHeader('Accept','application/json');
            request.send();
        });
    }

    /**
     * @param totalOrder
     */
    changeTotalOrder(totalOrder) {

        if(!totalOrder) {
            this.$.badgeMenu.style.visibility = 'hidden';
            return;
        }

        this.$.badgeMenu.style.visibility = 'visible';
    }

    /**
     * @param {object} config
     */
    changeConfig(config) {
        if (!config) {
            return;
        }

        this.apiUrl = config.apiUrl;
        this.menuUrl = config.menuUrl;
        this.menu = config.menu;
    }

    /**
     * @param organization
     */
    changeOrganization(organization) {

        if (typeof organization.whatsapp_phone === 'object' && !!organization.whatsapp_phone.number && !!organization.whatsapp_phone.prefix) {
            this.$.order.style.display = 'flex';
        } else {
            this.$.order.style.display = 'none';
        }

        if (organization && organization["logo"] && organization["logo"]["_id"]) {
            this.hasLogo = true;
        }
    }

    /**
     *
     * @param menuStorage
     * @param organization
     * @param allCategory
     * @private
     */
    _observeMenuStorage(menuStorage, organization, allCategory) {

        if (!menuStorage || !organization || !allCategory) {
            return;
        }

        this._getFavorites()
    }

    /**
     * @private
     */
    _getFavorites() {
        this._menuStorage.getAll({restaurantId: this.organization._id})
            .then((data) => {
                this.favorites = this.sortFavorites(this.checkStatusFavorite(data));
                this._updateAmount();
                this._updateTotalCount();
            });
    }

    /**
     * @param {Storage} menuStorage
     */
    changeMenuStorage(menuStorage) {
        if (!menuStorage) {
            return;
        }

        menuStorage.getEventManager().on(Storage.POST_REMOVE, new Listener(this.deleteFavoriteEvt.bind(this)));
        menuStorage.getEventManager().on(Storage.POST_UPDATE, new Listener(this.updateFavoriteEvt.bind(this)));
        menuStorage.getEventManager().on(Storage.POST_SAVE, new Listener(this.saveFavoriteEvt.bind(this)));
    }

    /**
     * @param evt
     */
    deleteFavoriteEvt(evt) {

        for (let index = 0; this.favorites.length > index; index++) {
            if (this.favorites[index]._id === evt.data._id) {
                this.splice('favorites', index, 1);
                break;
            }
        }
        this._updateAmount();
        this._updateTotalCount();
    }

    /**
     * @param evt
     */
    updateFavoriteEvt(evt) {
        this._updateAmount();
        this._updateTotalCount();
    }

    /**
     * @param evt
     */
    saveFavoriteEvt(evt) {
        this.push('favorites', evt.data);
        this._updateAmount();
        this._updateTotalCount();
    }

    /**
     *
     * @param favorites
     * @returns {*}
     */
    checkStatusFavorite(favorites) {
        for (let index = 0; favorites.length > index; index++) {


            let dish = this.items.find((element) => {
                return element._id ===  favorites[index]._id;
            });

            switch (true) {
                case dish === undefined && favorites[index].status !== 'not-available':
                    favorites[index].status = 'not-available';
                    this._menuStorage.update(favorites[index]);
                    break;
                case dish !== undefined && favorites[index].status !== dish.status:
                    favorites[index].status = dish.status;
                    this._menuStorage.update(favorites[index]);
                    break
            }
        }

        return favorites;
    }

    /**
     * @param favorites
     * @returns {[]}
     */
    sortFavorites(favorites) {
        let tmpFavorites = [];
        for (let property in this.allCategory) {
            for (let index = 0; favorites.length > index; index++) {
                if (favorites[index].category === property) {
                    tmpFavorites.push(favorites[index]);
                }
            }

        }
        return tmpFavorites;
    }

    /**
     * @param a
     * @param b
     */
    sortArrayFavorites(a, b) {
        if(!this.allCategory || !a || !b) {
            return -1;
        }

        for (let property in this.allCategory) {
            if (a.category === property) {
                return -1
            }

            if (b.category === property) {
                return 1
            }
        }
        return 0;
    }

    /**
     * @private
     */
    _updateAmount() {

        setTimeout(
            () => {
                let amount = 0;
                for (let index = 0; this.favorites.length > index; index++) {
                    if (this.favorites[index].status !== 'available') {
                        continue;
                    }
                    amount = amount + (this.favorites[index].price.value * this.favorites[index].totalCount);
                }

                this.amount = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
            },
            100
        );
    }

    /**
     * @private
     */
    _updateTotalCount() {

        setTimeout(
            () => {
                let total = 0;
                for (let index = 0; this.favorites.length > index; index++) {
                    if (this.favorites[index].status !== 'available') {
                        continue;
                    }
                    total = total + this.favorites[index].totalCount;
                }

                this.totalOrder = total;
            },
            100
        );
    }

    /**
     * @param evt
     */
    updateAmountEvt(evt) {
        this._updateAmount();
        this._updateTotalCount();
    }

    /**
     * @returns {string}
     * @private
     */
    _getOrder() {
        let order = '';

        order = order + this.amount + '\n'

        for (let index = 0; this.favorites.length > index; index++) {
            if (this.favorites[index].status !== 'available') {
                continue;
            }

            order += `${this.favorites[index].totalCount} - ${this.favorites[index].name.it}\n`
        }

        return order;
    }

    /**
     * @private
     */
    _sendOrder() {

        let ele = document.createElement('a');
        ele.href = `https://api.whatsapp.com/send?phone=${this.organization.whatsapp_phone.prefix}${this.organization.whatsapp_phone.number}&text=${encodeURIComponent(this._getOrder())}`;
        ele.target="_blank";
        ele.click();
    }

    /**
     * @param items
     * @param apiUrl
     * @private
     */
    _observeCategory(items, apiUrl) {
        if (!items || !apiUrl) {
            return;
        }

        if (!this.allCategory) {
            this.getCategory().then((category) => {
                this._attachCategory([]);
                this.allCategory = category;
                this._attachCategory(this._distinctCategory(this.items, this.allCategory));
            });
        } else {
            this._attachCategory(this._distinctCategory(this.items, this.allCategory));
        }
    }

    /**
     * @return object
     */
    parseUrlParam() {
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);

        let urlParams = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);

        return urlParams;
    }

    /**
     * @param menu
     */
    changeMenu(menu) {

        if (!menu) {
            this.items = [];
            this.organization = {};
            return;
        }

        this.items = [];
        this.notifyPath('items');
        this.$.list.render();

        for (let index = 0;  menu.items.length > index; index++) {
            if (menu.items[index].status === 'not-available') {
                this.splice('menu.items', index, 1);
                //menu.items.splice(index, 1);
            }
        }

        this.items = menu.items;
        //delete this.menu.items;
        setTimeout(
            () => {
                this.search(this.$.search.value, this.$.category.selectedItem ? this.$.category.selectedItem.value : null);
            },
            50
        );

        this.organization = menu.organization;

        if (menu.background_header) {
            this._changeBackgroundColorHeader(menu.background_header)
        }

        if (menu.color_header) {
            this._changeColorHeader(menu.color_header)
        }

        if(menu.enable_order === true) {
            this.$.orderButtonContainer.style.display = 'block';
        } else {
            this.$.orderButtonContainer.style.display = 'none';
        }

        if (menu.layout_type) {
            this._setLayoutType(menu.layout_type);
        }

        if (menu.note) {
            let ele = document.querySelector('dsign-info');
            if (!ele) {
                ele = document.createElement('dsign-info');
                document.body.appendChild(ele);
            }
            ele.text = menu.note;
        } else {
            let ele = document.querySelector('dsign-info');
            if (ele) {
                ele.remove();
            }
        }

        this.appendStylesheetColor();
    }

    /**
     * @param evt
     */
    tapMenu(evt) {
        this.$.drawer.toggle();
    }

    /**
     * @param color
     * @private
     */
    _changeBackgroundColorHeader(color) {
        this.shadowRoot.querySelector('app-toolbar').style.backgroundColor = color;
    }

    /**
     * @param entities
     * @param categories
     * @returns {*}
     * @private
     */
    _distinctCategory(entities, categories) {
        let accumulatorCategories = [];
        let categoriesToReturn = {};
        for (let index = 0; entities.length > index; index++) {
            if (!accumulatorCategories.includes(entities[index].category)) {
                accumulatorCategories.push(entities[index].category);
            }
        }

        for (const property in categories) {
            if (accumulatorCategories.includes(property)) {
                categoriesToReturn[property] = categories[property];
            }
        }
        return categoriesToReturn;
    }

    /**
     *
     * @param color
     * @private
     */
    _changeColorHeader(color) {
        let icons = this.shadowRoot.querySelectorAll('paper-icon-button');
        for (let index = 0; icons.length > index; index++) {
            icons[index].style.color = color;
        }

        /**
         * paper input style
         */
        this.$.search.shadowRoot.querySelector('label').style.color = color;
        this.$.search.shadowRoot.querySelector('input').style.color = color;
        this.$.search.shadowRoot.querySelector('paper-input-container').shadowRoot.querySelector('div.unfocused-line').style.borderColor = color;

        this.$.category.shadowRoot.querySelector('paper-input').shadowRoot.querySelector('label').style.color = color;
        this.$.category.shadowRoot.querySelector('paper-input').shadowRoot.querySelector('input').style.color = color;
        this.$.category.shadowRoot.querySelector('paper-input').shadowRoot.querySelector('paper-input-container').shadowRoot.querySelector('div.unfocused-line').style.borderColor = color;
    }

    /**
     * @param evt
     */
    searchByName(evt) {
        this.search(evt.target.value, this.$.category.selectedItem ? this.$.category.selectedItem.value : null);
    }

    /**
     * @param evt
     */
    searchByCategory(evt) {
        this.search(this.$.search.value ? this.$.search.value : null, evt.detail.item.value);
    }

    /**
     * @param evt
     */
    clearCategory(evt) {
        this.$.category.value = null;
        this.$.category.selectedItem = null;
        this.$.categories.selected = null;
        this.search(this.$.search.value ? this.$.search.value : null, null);
    }

    /**
     * @param name
     * @param category
     */
    search(name, category) {
        let nodes = this.shadowRoot.querySelectorAll('dsign-menu-wrap-item ');
        let lang = this._localizeService.getDefaultLang();
        let hide = false;
        for (let index = 0; nodes.length > index; index++) {

            switch (true) {
                case !name === false && nodes[index].item.name[lang].toLowerCase().includes(name.toLowerCase()) === false:
                    hide = true;
                case !category === false && nodes[index].item.category !== category:
                    hide = true;
                    break;
            }
            nodes[index].hide = hide;
            hide = false;
        }
    }

    /**
     * @param categoryDocument
     * @private
     */
    _attachCategory(categoryDocument) {

        this._mergeCategory(categoryDocument);

        let categories = [];
        if (typeof categoryDocument === 'object' && categoryDocument !== null) {
            for (let property1 in categoryDocument) {
                categories.push(property1);
            }
        }

        this.categories = categories;
    }

    /**
     * @param apiUrl
     */
    changeMenuUrl(apiUrl) {
        if (!apiUrl) {
            return;
        }
        this.pollingMenu();
    }

    /**
     *
     */
    pollingMenu() {

        setInterval(
            () => {

                let request = new XMLHttpRequest();
                request.onload = (event) => {

                    if (request.status >= 300) {
                        console.warn(request.response);
                        return;
                    }

                    this.menu = JSON.parse(request.response);
                };
                request.open("GET", window.location.href);
                request.setRequestHeader('accept', 'application/json');
                request.send();
            },
            this.interval
        )
    }

    /**
     *
     */
    appendStylesheetColor() {

        let css = `:root { --munu-background-color: ${this.menu.background_header}; --munu-color: ${this.menu.color_header}; } body { overflow-x: hidden; } * { padding: 0; margin: 0; } paper-toast { padding: 16px 24px !important; margin: 12px !important; }}`;

        let style = document.createElement('style');
        style.setAttribute('is', "custom-style");
        style.setAttribute('id', 'colorCustomStyle');
        style.appendChild(document.createTextNode(css));

        let oldElement = document.head.querySelector('colorCustomStyle');
        if (oldElement) {
            oldElement.remove();
        }
        document.head.appendChild(style);
    }
}

window.customElements.define('dsign-menu', DsignMenu);
