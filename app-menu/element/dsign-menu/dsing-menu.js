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
import '../dsign-logo/dsing-logo';
import {lang} from './language';
import {mockMenu} from './mockMenu';

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
          background-color: blue;
       }
       
       app-drawer {
        padding: 6px;
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
        flex-basis: 12%;
       }
       
       #category {
         padding-bottom: 2px;
       }

       @media only screen and (max-width: 1980px) and (min-width: 1481px) {
           .item {
                flex-basis: 16.2%;
            }
       }  
            
       @media only screen and (max-width: 1480px) and (min-width: 1181px) {
           .item {
                flex-basis: 19.4%;
            }
       }  

       @media only screen and (max-width: 1180px) and (min-width: 981px) {
           .item {
                flex-basis: 24.4%;
            }
       }        

       @media only screen and (max-width: 980px) and (min-width: 781px) {
           .item {
                flex-basis: 32.5%;
            }
       }
              
       @media only screen and (max-width: 780px) and (min-width: 481px) {
            .item {
                flex-basis: 48.7%;
            }
       }
 
       @media only screen and (max-device-width: 480px) {
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
                    <paper-listbox slot="dropdown-content">
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
                    <dsign-menu-wrap-item item="[[menuItem]]" type="[[itemLayout]]"></dsign-menu-wrap-item>
              </template>
          </dom-repeat>
      </div>
    </app-header-layout>
    <app-drawer id="drawer" align="right">
        <div class="drawerContainer">
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

            items: {
        //        observer: 'changeItems'
            },

            services: {
                value: {
                    _localizeService: 'Localize',
                }
            },

            itemLayout: {
                value: 'dsign-menu-item-image',
                readOnly: true
            },

            categories: {
                notify: true
            }
        };
    }

    /**
     * @inheritDoc
     */
    constructor() {
        super();
        this.resources = lang;
        let param = this.parseUrlParam();
        if (param && param['menu'] &&  param['menu'] === 'compress') {
            this._setItemLayout('dsign-menu-item-compress');
        }
    }

    /**
     * @inheritDoc
     */
    ready() {
        super.ready();
        /**
         * Load category
         */
        this.getCategory().then((category) => {
            this._attachCategory(category);
        });

        switch (true) {
            case menu !== undefined:
                this.menu = menu;
                break;
            case dev === true:
                this.menu = mockMenu;
                break;
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

                resolve(JSON.parse(request.response)[0]);
            });
            request.open("GET", 'http://127.0.0.150/menu-category');
            request.setRequestHeader('Accept','application/json');
            request.send();
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
            return
        }

        this.items = menu.items;
        this.organization = menu.organization;

        if (menu.backgroundHeader) {
            this._changeBackgroundColorHeader(menu.backgroundHeader)
        }

        if (menu.colorHeader) {
            this._changeColorHeader(menu.colorHeader)
        }
    }

    /**
     * @param items
     */
    changeItems(items) {
        if (!items || (Array.isArray(items) && items.length === 0)) {
            return;
        }
    }

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
