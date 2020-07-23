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
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-card/paper-card';
import '@polymer/neon-animation/neon-animation';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-button/paper-button';
import '@dsign/polymer-mixin/localize/localize-mixin';
import '../element/paper-select-language/paper-select-language';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

let lang = {
    "it": {
        "search": "Cerca",
        "category": "Categoria",
        'all': "Tutti",
        'first': "Primi",
        'second': "Secondi"
    },
    "en": {
        "search": "Search",
        "category": "Category",
        'all': "All",
        'first': "First",
        'second': "Main courses"
    }
};

class MenuTemplate extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {
    static get template() {
        return html`
    <style>
       app-toolbar {
         background-color:  #009688;
         padding-left: 6px;
         padding-right: 6px;
         color: white;
       }
       
       #menuContainer {
        padding: 6px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
       }
       
       .item {
       
         background-color: #eee;
         flex-basis: 13.9%;
         margin: 0 0 6px 6px;
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
       
       app-drawer {
        padding: 6px;
       }
       
       .drawerContainer {
        padding: 6px;
       }
       
       paper-select-language {
         width: 100%;
       }
      
       
       .header-card {
          display: flex;
          flex-direction: row;
          padding: 12px;
      
       }
       
        .header-card-data {
          display: flex;
          flex-direction: column;
          flex:1;
          padding:0 0 0 12px;
        }
       
       .header-card-title {
         font-family: 'Roboto', 'Noto', sans-serif;
          -webkit-font-smoothing: antialiased;
          /* mixin(--paper-font-common-expensive-kerning); */
          text-rendering: optimizeLegibility;
          font-size: 24px;
          font-weight: 400;
          letter-spacing: -.012em;
          line-height: 32px;
          display: ;
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
           background-image: url("./template/COPERTINA.jpg");
            width: 100%;
       }
       
       [clear] {
            padding: 0 !important;
            margin: 0 !important;
       }

       .paragraph-card {
            padding: 0 16px;
            color: #757575; 
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
            <div class="search flex-row" down>
                <paper-input label="{{localize('search')}}"></paper-input>
                <paper-icon-button icon="search" down></paper-icon-button>
            </div>
            <paper-dropdown-menu id="category" label="{{localize('category')}}">
                <paper-listbox slot="dropdown-content" selected="0">
                    <dom-repeat id="menu" items="{{categories}}" as="category">
                      <template>
                         <paper-item value="{{category}}">{{localize(category)}}</paper-item>
                      </template>
                    </dom-repeat>
                </paper-listbox>
            </paper-dropdown-menu>
            <div class="flex-row padding-l-6">
                <paper-icon-button icon="v-menu" on-tap="tapMenu"></paper-icon-button>
            </div>
        </app-toolbar>
      </app-header>
      <div id="menuContainer">
        <paper-card class="item">
          <div>
            <div class="header-card">
               <div class="circle"></div>
               <div class="header-card-data">
                  <div class="header-card-title">Title</div>
                  <p class="paragraph-card" clear>30,00 euro</p>
               </div>
            </div>
            <div class="img-card"></div>
            <p class="paragraph-card">Small plates, salads & sandwiches in an intimate setting with 12 indoor seats plus patio seating.</p>
          </div>
          <div class="card-actions">
           <paper-button>Add</paper-button>
            <paper-button>Share</paper-button>
          </div>
          </paper-card>
             <paper-card class="item">
          <div>
            <div class="header-card">
               <div class="circle"></div>
               <div class="header-card-data">
                  <div class="header-card-title">Title</div>
                  <p class="paragraph-card" clear>sub title here</p>
               </div>
            </div>
            <div class="img-card"></div>
            <p class="paragraph-card">Small plates, salads & sandwiches in an intimate setting with 12 indoor seats plus patio seating.</p>
          </div>
          <div class="card-actions">
           <paper-button>Add</paper-button>
            <paper-button>Share</paper-button>
          </div>
          </paper-card>
             <paper-card class="item">
          <div>
            <div class="header-card">
               <div class="circle"></div>
               <div class="header-card-data">
                  <div class="header-card-title">Title</div>
                  <p class="paragraph-card" clear>sub title here</p>
               </div>
            </div>
            <div class="img-card"></div>
            <p class="paragraph-card">Small plates, salads & sandwiches in an intimate setting with 12 indoor seats plus patio seating.</p>
          </div>
          <div class="card-actions">
           <paper-button>Add</paper-button>
            <paper-button>Share</paper-button>
          </div>
          </paper-card>
             <paper-card class="item">
          <div>
            <div class="header-card">
               <div class="circle"></div>
               <div class="header-card-data">
                  <div class="header-card-title">Title</div>
                  <p class="paragraph-card" clear>sub title here</p>
               </div>
            </div>
            <div class="img-card"></div>
            <p class="paragraph-card">Small plates, salads & sandwiches in an intimate setting with 12 indoor seats plus patio seating.</p>
          </div>
          <div class="card-actions">
           <paper-button>Add</paper-button>
            <paper-button>Share</paper-button>
          </div>
          </paper-card>
           <paper-card class="item">
          <div>
            <div class="header-card">
               <div class="circle"></div>
               <div class="header-card-data">
                  <div class="header-card-title">Title</div>
                  <p class="paragraph-card" clear>sub title here</p>
               </div>
            </div>
            <div class="img-card"></div>
            <p class="paragraph-card">Small plates, salads & sandwiches in an intimate setting with 12 indoor seats plus patio seating.</p>
          </div>
          <div class="card-actions">
           <paper-button>Add</paper-button>
            <paper-button>Share</paper-button>
          </div>
          </paper-card>
           <paper-card class="item">
          <div>
            <div class="header-card">
               <div class="circle"></div>
               <div class="header-card-data">
                  <div class="header-card-title">Title</div>
                  <p class="paragraph-card" clear>sub title here</p>
               </div>
            </div>
            <div class="img-card"></div>
            <p class="paragraph-card">Small plates, salads & sandwiches in an intimate setting with 12 indoor seats plus patio seating.</p>
          </div>
          <div class="card-actions">
           <paper-button>Add</paper-button>
            <paper-button>Share</paper-button>
          </div>
          </paper-card>
                     <paper-card class="item">
          <div>
            <div class="header-card">
               <div class="circle"></div>
               <div class="header-card-data">
                  <div class="header-card-title">Title</div>
                  <p class="paragraph-card" clear>sub title here</p>
               </div>
            </div>
            <div class="img-card"></div>
            <p class="paragraph-card">Small plates, salads & sandwiches in an intimate setting with 12 indoor seats plus patio seating.</p>
          </div>
          <div class="card-actions">
           <paper-button>Add</paper-button>
            <paper-button>Share</paper-button>
          </div>
          </paper-card>
                     <paper-card class="item">
          <div>
            <div class="header-card">
               <div class="circle"></div>
               <div class="header-card-data">
                  <div class="header-card-title">Title</div>
                  <p class="paragraph-card" clear>sub title here</p>
               </div>
            </div>
            <div class="img-card"></div>
            <p class="paragraph-card">Small plates, salads & sandwiches in an intimate setting with 12 indoor seats plus patio seating.</p>
          </div>
          <div class="card-actions">
           <paper-button>Add</paper-button>
            <paper-button>Share</paper-button>
          </div>
          </paper-card>
      </div>
    </app-header-layout>
    <app-drawer id="drawer" align="right">
        <div class="drawerContainer">
            <paper-select-language id="language"></paper-select-language>
        </div>
    </app-drawer>
    `;

    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties() {
        return {
            services: {
                value: {
                    _localizeService: 'Localize',
                }
            },

            categories: {
                value: [
                    'all',
                    'first',
                    'second'
                ]

            }
        };
    }

    tapMenu(evt) {
        this.$.drawer.toggle();
    }


}

window.customElements.define('menu-template', MenuTemplate);
