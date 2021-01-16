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
import {FavoriteService} from "@dsign/library/src/frontend/favorite/FavoriteService";
import {Listener} from "@dsign/library/src/event/Listener";
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
import '../dsign-logo/dsing-logo';
import {lang} from './language';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

/**
 * @class DsignMenu
 */
class DsignMenu extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {
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
       
       h2.title {
          font-family: var(--paper-font-common-base_-_font-family);
          margin: 0;
          margin-top: 10px;
          margin-bottom: 10px;
          text-align: center;
          text-transform: uppercase;
       }
       
       .subtitle {
            display: flex;
            flex-direction: row;
            padding-bottom: 6px;
       }
       
       .amount {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 4px;
            font-size: 18px;
            font-family: var(--paper-font-common-base_-_font-family);
       }
       
       [no-padding] {
            padding: 0;
       }
       
       .item {
       
         background-color: #eee;
         flex-basis: 13.9%;
         margin: 0 6px 6px 0;
       }
       
       .search {
         width: 100%;
         padding: 0 12px;
       }
       
       .flex-row {
         display: flex;
         flex-direction: row;
       }
       
       [down] {
         align-items: flex-end;
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
           display: flex;
           justify-content: center;
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
       
       .drawerContainer {
        padding: 6px;
       }
       
       paper-select-language {
         width: 100%;
       }   
       
              
       #menuContainer {
        padding: 6px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
       }
       
       dsign-menu-wrap-item {
           flex-basis: 10%;
           --menu-wrap-container : {
               margin-bottom: 8px;
               margin-right: 8px;
           }
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
                --menu-wrap-container : {
                   margin-bottom: 8px;
                   margin-right: 0;
                }
            }
            
              #language, #category {
                width: 96px;
            }
            
             #menuContainer {
                flex-direction: column;
             }
            
            .item {
                flex-basis: 100%;
            }
       }      
    </style>
    <app-header-layout fullbleed>
      <app-header slot="header" fixed effects="waterfall">
        <app-toolbar>
            <dsign-logo organization="{{organization}}"></dsign-logo>
            <div class="search flex-row">
                <paper-input id="search" label="{{localize('search')}}" on-input="searchByName"></paper-input>
            </div>
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
            <div class="flex-row">
                <paper-icon-button icon="v-menu" on-tap="tapMenu"></paper-icon-button>
            </div>
        </app-toolbar>
      </app-header>
      <div id="menuContainer">
          <dom-repeat id="list" items="[[items]]" as="menuItem">
              <template>
                    <dsign-menu-wrap-item item="[[menuItem]]" type="[[layoutType]]"></dsign-menu-wrap-item>
              </template>
          </dom-repeat>
      </div>
    </app-header-layout>
    <app-drawer id="drawer" align="right">
        <div class="drawerContainer">
            <h2 class="title">Preferiti</h2>
            <div class="subtitle">
                <div class="amount">{{amount}}</div>
                <div id="action">
                    <paper-menu-button id="paperAction" no-padding ignore-select horizontal-align="right">
                        <paper-icon-button class="menu-drawer" icon="v-menu" slot="dropdown-trigger" alt="multi menu"></paper-icon-button>
                        <paper-listbox slot="dropdown-content" multi>
                            <paper-item on-click="_reset">{{localize('reset-dishes-arrived')}}</paper-item>
                        </paper-listbox>
                    </paper-menu-button>
                </div>
            </div>
            <dom-repeat id="favorites" items="[[favorites]]" as="favorite">
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
                notify: true
            },

            items: { },

            services: {
                value: {
                    _localizeService: 'Localize',
                    _config: 'config',
                    _favoriteService: 'FavoriteService'
                }
            },

            amount: {
                notify: true
            },

            layoutType: {
                value: 'dsign-menu-item-image',
                readOnly: true
            },

            apiUrl: { },

            favorites: {
                value: []
            },

            _favoriteService: {
                readOnly: true,
                observer: 'changeFavoriteService'
            },

            _config: {
                readOnly: true,
                observer: 'changeConfig'
            },

            categories: {
                notify: true
            },

            allCategory: {
                observer: 'changeAllCategory'
            }
        };
    }


    static get observers() {
        return [
            '_observeCategory(items, apiUrl)'
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
     * @param {object} config
     */
    changeConfig(config) {
        if (!config) {
            return;
        }

        this.apiUrl = config.apiUrl;
        this.menu = config.menu;
    }

    /**
     * @param service
     */
    changeFavoriteService(service) {
        if (!service) {
            return;
        }

        service.getEventManager().on(Storage.POST_REMOVE, new Listener(this.deleteFavoriteEvt.bind(this)));
        service.getEventManager().on(FavoriteService.RESET_FAVORITES, new Listener(this.updateFavoriteEvt.bind(this)));
        service.getEventManager().on(FavoriteService.NEW_FAVORITES, new Listener(this.updateFavoriteEvt.bind(this)));
        service.getEventManager().on(Storage.POST_UPDATE, new Listener(this.updateAmountEvt.bind(this)));

        this._updateAmount();
    }

    /**
     * @param categories
     */
    changeAllCategory(categories) {
        if (!categories) {
            return;
        }
        this.updateFavoriteEvt();
    }

    /**
     * @private
     */
    _updateAmount() {
        // TODO add metadata to localize service
        this.amount = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(this._favoriteService.getAmount());
    }

    /**
     * @param evt
     */
    updateAmountEvt(evt) {
        setTimeout(() => {
                this._updateAmount()
            },
            500
        )
    }

    /**
     * @param evt
     */
    updateFavoriteEvt(evt) {
        this._favoriteService.getFavorites().then((data) => {
            this.favorites = this.sortFavorites(data);
            this._updateAmount();
            this.$.favorites.render();
        });
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

    deleteFavoriteEvt(evt) {
        let favorites = this.shadowRoot.querySelectorAll('dsign-menu-favorites');
        for (let index = 0; favorites.length > index; index++) {
            if (favorites[index].menuItem._id === evt.data._id) {
                console.log('ELIMINA TROVATO', evt);
                favorites[index].remove();
                break;
            }
        }
        this._updateAmount();

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

        this.getCategory().then((category) => {
            this._attachCategory([]);
            this.allCategory = category;
            this._attachCategory(this._distinctCategory(this.items, category));
        });
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

        this.items = menu.items;
        for (let index = 0;  this.items.length > index; index++) {
            if (this.items[index].status === 'not-available') {
                this.items.splice(index, 1);
            }
        }
        delete this.menu.items;
        this.organization = menu.organization;

        if (menu.background_header) {
            this._changeBackgroundColorHeader(menu.background_header)
        }

        if (menu.color_header) {
            this._changeColorHeader(menu.color_header)
        }

        if (menu.layout_type) {
            this._setLayoutType(menu.layout_type);
        }
    }

    /**
     * @param evt
     */
    tapMenu(evt) {
        this.$.drawer.toggle();
    }

    /**
     * @param evt
     * @private
     */
    _reset(evt) {
        this._favoriteService.resetFavorites();
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
            //console.log(hide);
            //console.log(name, !name === false && nodes[index].item.name[lang].toLowerCase().includes(name.toLowerCase()) === false);
            //console.log(category, !category === false && nodes[index].item.category !== category);
            //console.log('------------------');
            nodes[index].hide = hide;
            hide = false;
        }
    }

    /**
     * @param categoryDocument
     * @private
     */
    _attachCategory(categoryDocument) {

        let categoryTranslation = {};
        let categories = [];
        let languages = this._localizeService.getLanguages();
        for (let index = 0; languages.length > index; index++) {
            categoryTranslation[languages[index]] = {};
        }

        if (typeof categoryDocument === 'object' && categoryDocument !== null) {
            for (let property1 in categoryDocument) {
                categories.push(property1);
                for (let property2 in categoryDocument[property1]) {
                    categoryTranslation[property2][property1] = categoryDocument[property1][property2];
                }
            }
        }

        this.resources = Object.assign(this.resources, categoryTranslation);
        this.categories = categories;
    }
}

window.customElements.define('dsign-menu', DsignMenu);
