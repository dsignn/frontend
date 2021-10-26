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
import {MergeTraslation} from "../mixin/merge-traslation/merge-traslation";
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
import '@polymer/paper-tabs/paper-tabs'; 
import '@polymer/paper-tabs/paper-tab'; 
import '@polymer/paper-tooltip/paper-tooltip'; 
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
class DsignMenu extends MergeTraslation(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {
    static get template() {
        return html`
    <style>    

       :host {  --paper-input-container-focus-color: var(--munu-background-color);  }

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

       .paper-btn {
            background-color: var(--munu-background-color);
            color: var(--munu-color);
            flex: 1;
            text-align: center;
       }

       .paper-btn:nth-child(2) {
         margin-left: 4px;
       }
       .paper-btn:nth-child(3) {
        margin-left: 4px;
      }
       
       .btn-order {
           @apply --layout-flex;
           margin: 0;
       }

       dsign-badge {
         --paper-badge-background: var(--munu-color);
         --paper-badge-text-color: var(--munu-background-color);
         --paper-badge : {
            font-weight: 700;
         }
       }

       paper-tooltip {
            --paper-tooltip-background: var(--munu-background-color);
            --paper-tooltip-text-color: var(--munu-color);
       }

       paper-tabs {
            --paper-tabs: {
                color: var(--munu-color);
                background-color: var(--munu-background-color);
            }

            --paper-tabs-selection-bar-color: var(--munu-color);
            font-size: 14px;
            text-transform: uppercase;
        }

        paper-input#search {
            --paper-input-container-label: {
                font-size: 20px;
              };
        }
       
       .restaurant-title {
           font-family: var(--paper-font-common-base_-_font-family);
           text-transform: capitalize;
           margin: 14px 0;
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

            .btn-order {
                font-size: 0px;
                height: 42px;
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
                       
            .item {
                flex-basis: 100%;
               -webkit-flex-basis:  100%;
            }

            .btn-order {
                font-size: 0px;
                height: 42px;
            }
       }     
       
       .a-btn {
            background-color:red;
            color:white;
            outline-offset: 0px;
            outline: none;
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
            text-decoration: unset;
            flex:1;
        }

        .sect-type {
            display:flex;
            margin-top: 60px;
            justify-content: space-around; 
        }

        .type-btn {
            height:60px;
            width:60px;
            background-size: contain;
            background-repeat: no-repeat;
            cursor: pointer;
        }

        .sect-allergen{
            margin-top: 60px;
            display:flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
        }

        .allergen-btn {
            height:50px;
            width:50px;
            background-size: contain;
            background-repeat: no-repeat;
            margin-bottom: 6px;
        }

        paper-icon-button.type {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            --paper-icon-button : {
                 padding: 3px;
            }
            
            background-color: var(--munu-color);
            color: var(--munu-background-color) !important;
            border: 2px solid var(--munu-background-color);
        }

        paper-tooltip {
            --paper-tooltip: {
                font-size: 15px;
            }
        }

        paper-icon-button.allergen { 
            margin: 1px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            --paper-icon-button : {
                 padding: 1px;
            }
            
            background-color: var(--munu-color);
            color: var(--munu-background-color) !important;
            border: 2px solid var(--munu-background-color);
        }

        paper-icon-button[selected] { 
            background-color: var(--munu-background-color);
            color: var(--munu-color) !important;
            border: none !important;
        }

       
    </style>
    <app-header-layout fullbleed>
      <app-header slot="header" fixed effects="waterfall">
        <app-toolbar>
            <template is="dom-if" if="{{hasLogo}}">
                <dsign-logo organization="{{organization}}"></dsign-logo>
            </template>
            <div class="search flex-row">
                <paper-input id="search" label="{{localize('search-dish')}}" on-input="searchByName"></paper-input>
            </div>          
            <div id="orderButtonContainer" class="flex-row">
                <paper-icon-button id="btn-menu" icon="v-menu" on-tap="tapMenu"></paper-icon-button>
                <dsign-badge id="badgeMenu" for="btn-menu" label="{{totalOrder}}" offset-y="6"></dsign-badge>
            </div>
        </app-toolbar>
        <paper-tabs scrollable align-bottom>
            <dom-repeat id="menu" items="{{categories}}" as="category">
                <template>
                    <paper-tab value={{category}} index="{{index}}" on-tap="searchByCategory">{{localize(category)}}</paper-tab>
                </template>
            </dom-repeat>
        </paper-tabs>
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
                <a id="aBtnPhone" class="a-btn"  href="[[callMe]]">
                    <paper-button id="btnCall" class="btn-order paper-btn" style="width:100%">
                        <iron-icon id="whatsappIcon" icon="phone"></iron-icon>
                        {{localize('call')}}
                    </paper-button>
                </a>
                <paper-button id="btnWhattapp" class="btn-order paper-btn" on-tap="_sendWhattapp">
                    <iron-icon id="whatsappIcon" icon="whatsapp"></iron-icon>
                    {{localize('write-whatsapp')}}
                </paper-button>
                <paper-button id="btnMaps" class="btn-order paper-btn" on-tap="_goToMaps">
                    <iron-icon id="mapsIcon" icon="maps"></iron-icon>
                    {{localize('direction')}}
                </paper-button>
            </div>
            <div id="language">
                <paper-select-language><paper-select-language>
            </div>
            <div class="sect-type">
                <paper-icon-button id="btnVegetarian" icon="vegetarian" id="btn-menu" type="vegetarian" on-tap="searchByType" class="type"></paper-icon-button>
                <paper-tooltip for="btnVegetarian" position="top">{{localize('vegetarian-dish')}}</paper-tooltip>
                <paper-icon-button id="btnVegan" icon="vegan" id="btn-menu" type="vegan" on-tap="searchByType" class="type"></paper-icon-button>
                <paper-tooltip for="btnVegan" position="top">{{localize('vegetarian-dish')}}</paper-tooltip>
            </div>
            <div class="sect-allergen">
                <dom-repeat id="allergens" items="[[allergens]]" as="allergen">
                    <template>
                        <paper-icon-button id="btn-{{allergen}}" icon="allergen:{{allergen}}" type="{{allergen}}" on-tap="searchByAllergen" allergen class="allergen-btn allergen"></paper-icon-button>
                        <paper-tooltip for="btn-{{allergen}}" position="top">{{localize(allergen)}}</paper-tooltip>               
                    </template>
                </dom-repeat>
            <div/>
            <div class="subtitle" style="display:none;">
                <div class="amount">{{amount}}</div>
            </div>
            <!--
            <dom-repeat id="favorites" items="[[favorites]]" as="favorite" sort="sortArrayFavorites">
              <template>
                <dsign-menu-favorites menu-item="{{favorite}}"></dsign-menu-favorites>
              </template>
            </dom-repeat>
            -->
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

            allergens: {
                notify: true,
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

            searchType: {
                value: ''
            },

            searchAllergen: {
                value: []
            },

            /**
             *
             */
            interval: {
                type: Number,
                readOnly: true,
                value: 60000
            }
        };
    }


    static get observers() {
        return [
            '_observeCategory(items, apiUrl)',
            '_observeAllergen(items, apiUrl)',
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
     * TODO config url and create service
     * @returns array
     */
     getAllergen() {

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
            request.open("GET", `${this.apiUrl}menu-allergen`);
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
            this.$.aBtnPhone.style.display = 'flex';
            this.$.btnWhattapp.style.display = 'flex';
            this.callMe = `tel:${organization.whatsapp_phone.prefix}${organization.whatsapp_phone.number}`;
        } else {
            this.$.aBtnPhone.remove();
            this.$.btnWhattapp.remove();
        }

        if (typeof organization.address === 'object' && organization.address.lat && organization.address.lng ) {
            this.$.btnMaps.style.display = 'flex';
        } else {
            this.$.btnMaps.remove();
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
     * @returns 
     */
    hasEnglish() {
        let has = false;
        if(!this.menu && !Array.isArray(this.menu.items)) {
            return;
        } else {
            has = !!this.menu.items[0].name['en'];
        }

        return has;
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
     * @param {CustomEvent} evt
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
     * @deprecated
     * @param {CustomEvent} evt
     */
    _sendOrder(evt) {

        let ele = document.createElement('a');
        ele.href = `https://api.whatsapp.com/send?phone=${this.organization.whatsapp_phone.prefix}${this.organization.whatsapp_phone.number}&text=${encodeURIComponent(this._getOrder())}`;
        ele.target="_blank";
        ele.click();
    }

    /**
     * @param {CustomEvent} evt 
     */
    _sendWhattapp(evt) {

        let ele = document.createElement('a');
        ele.href = `https://api.whatsapp.com/send?phone=${this.organization.whatsapp_phone.prefix}${this.organization.whatsapp_phone.number}`;
        ele.target="_blank";
        ele.click();
    }

    /**
     * @param {CustomEvent} evt
     */
    _goToMaps(evt) {
        window.open(`https://maps.google.com/maps?daddr=${this.organization.address.lat},${this.organization.address.lng}&amp;ll=`);
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
     * 
     * @param {array} items 
     * @param {string} apiUrl 
     */
    _observeAllergen(items, apiUrl) {
        if (!items || !apiUrl) {
            return;
        }

        if(!this.allergens) {
            this.getAllergen().then((allergens) => {
                this._mergeTraslation(allergens);
                this.allergens = Object.keys(allergens);
            });
        }
    }

    /**
     * @returns string|undefined
     * @private
     */
    _getCategorySelect() {
        let category = null;
        if (this.shadowRoot.querySelector('paper-tabs').selected !== undefined ) {
            let nodes = this.shadowRoot.querySelector('paper-tabs').querySelectorAll('paper-tab');
            category = nodes[this.shadowRoot.querySelector('paper-tabs').selected].value
        }

        return category
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
        
        let tmpMenu = [];

        for (let index = 0;  menu.items.length > index; index++) {
            if (menu.items[index].status === 'not-available') {
                continue;
            }

            tmpMenu.push(menu.items[index]);

        }

        menu.items = tmpMenu;
        this.items = menu.items;
        //delete this.menu.items;
        setTimeout(
            () => {
                this.search(
                    this.$.search.value, 
                    this._getCategorySelect(),
                    this.searchType,
                    this.searchAllergen
                );
            },
            50
        );

        if (this.hasEnglish()) {
            this.$.language.style.display = "block";
        } else {
            this.$.language.style.display = "none";
        }

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
    }

    /**
     * @param {Event} evt
     */
    searchByName(evt) {
        this.search(
            evt.target.value, 
            this._getCategorySelect(),
            this.searchType,
            this.searchAllergen
        );
    }

    /**
     * @param {Event} evt
     */
    searchByCategory(evt) {
        if (this.shadowRoot.querySelector('paper-tabs').selected === evt.target.index) {
            setTimeout(() => {
                    this.shadowRoot.querySelector('paper-tabs').selected = undefined;
                    this.search(
                        this.$.search.value ? this.$.search.value : null,
                         evt.target.value,
                        this.searchType,
                        this.searchAllergen
                    );
                },
                200
            );
            return;
        }

       
        this.search(
            this.$.search.value ? this.$.search.value : null,
             evt.target.value,
            this.searchType,
            this.searchAllergen
        );
    }

    /**
     * @param {Event} evt 
     */
    searchByType(evt) { 
        
        this.searchType = '';
        let isSelect = evt.target.getAttribute('selected') !== null ? true : false;
  
        if(isSelect) {
            evt.target.removeAttribute('selected');
            this

        } else {
            evt.target.setAttribute('selected', '');
            this.searchType = evt.target.getAttribute('type');
            let id = this.searchType === 'vegetarian' ? 'btnVegan' : 'btnVegetarian';
            this.$[id].removeAttribute('selected');
        }

        this.search(
            this.$.search.value ? this.$.search.value : null,
            this._getCategorySelect(),
            this.searchType,
            this.searchAllergen
        );
    }

    /**
     * @param {Event} evt 
     */
    searchByAllergen(evt) {
        
        let isSelect = evt.target.getAttribute('selected') !== '' ? true : false;
        let allergen = evt.target.type;
  
        if(isSelect) {
            evt.target.setAttribute('selected', '');
            this.searchAllergen.push(allergen)

        } else {
     
            let index =  this.searchAllergen.indexOf(allergen);
            if (index > -1) {
                this.searchAllergen.splice(index, 1);
                evt.target.removeAttribute('selected');
            }
        }

        this.search(
            this.$.search.value ? this.$.search.value : null,
            this._getCategorySelect(),
            this.searchType,
            this.searchAllergen
        );
    }

    /**
     * @param name
     * @param category
     * @param type
     */
    search(name, category, type, allergen) {

        let nodes = this.shadowRoot.querySelectorAll('dsign-menu-wrap-item ');
        let lang = this._localizeService.getDefaultLang();
        let hide = false;
        for (let index = 0; nodes.length > index; index++) {

            if (!name === false && nodes[index].item.name[lang].toLowerCase().includes(name.toLowerCase()) === false) {
                hide = true;
            }

            if (!category === false && nodes[index].item.category !== category ) {
                hide = true;
            }

            if (!!type === true && nodes[index].item.type_dish !== type) {
                hide = true;
            }

            if (Array.isArray(allergen) && allergen.length > 0 && Array.isArray(nodes[index].item.allergens) && nodes[index].item.allergens.length > 0 ) {
                for (let cont = 0; allergen.length > cont; cont++) {
                    if(nodes[index].item.allergens.indexOf(allergen[cont]) > -1) {
                        hide = true;
                        break;
                    }
                }
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

        this._mergeTraslation(categoryDocument);

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
