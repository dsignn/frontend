import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {AclMixin} from "@dsign/polymer-mixin/acl/acl-mixin";
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-tabs/paper-tabs';
import '@polymer/iron-pages/iron-pages';
import '../restaurant-view-list/restaurant-view-list';
import '../restaurant-view-upsert/restaurant-view-upsert';
import '../menu-view-list/menu-view-list';
import '../menu-view-upsert/menu-view-upsert';
import {lang} from './language';

/**
 * @customElement
 * @polymer
 */
class RestaurantIndex extends LocalizeMixin(AclMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
         
            <style>
                :host {
                    display: block;
                    padding: 6px;
                }  
                   
               paper-tabs {
                   width: 340px;
               }    
                   
               .header {
                  @apply --layout-horizontal;
                  @apply --layout-center;
                  padding: 10px 20px;
               }
               
              .text-content {
                  font-size: 20px;
                  flex: 1;
               }
               
            
                paper-icon-button.circle {
                    @apply --paper-icon-button-action;
                }
            </style>
            <paper-tabs selected="{{selectedTab}}" tabindex="0">
                <paper-tab>{{localize('restaurants')}}</paper-tab>
                <paper-tab>{{localize('menu')}}</paper-tab>
            </paper-tabs>
            <iron-pages id="restaurant" selected="{{selectedTab}}">
                <div id="restaurant"> 
                    <iron-pages id="restaurant" selected="{{selectedRestaurant}}">
                       <div id="list"> 
                            <restaurant-view-list selected="{{selectedRestaurant}}" entity-selected="{{entitySelected}}">
                               <div slot="header" class="header">
                                   <div class="text-content">{{localize('list-restaurant')}}</div>
                                   <template is="dom-if" if="{{isAllowed('restaurant', 'add')}}">
                                       <paper-icon-button id="iconInsertMonitor" icon="insert" class="circle" on-click="displayRestaurantAddView"></paper-icon-button>
                                       <paper-tooltip for="iconInsertMonitor" position="left">{{localize('insert-restaurant')}}</paper-tooltip>
                                   </template>
                               </div>
                            </restaurant-view-list>
                       </div>
                       <div id="insert"> 
                           <restaurant-view-upsert>
                                <div slot="header" class="header">
                                    <div class="text-content">{{localize('insert-restaurant')}}</div>
                                    <paper-icon-button id="iconInsertMonitor" icon="arrow-back" class="circle" on-click="displayRestaurantListView"></paper-icon-button>
                                    <paper-tooltip for="iconInsertMonitor" position="left">{{localize('insert-restaurant')}}</paper-tooltip>
                                </div>
                           </restaurant-view-upsert>
                       </div>
                       <div id="update"> 
                           <restaurant-view-upsert entity="{{entitySelected}}">
                                <div slot="header" class="header">
                                    <div class="text-content">{{localize('update-restaurant')}}</div>
                                    <paper-icon-button id="iconInsertMonitor" icon="arrow-back" class="circle" on-click="displayRestaurantListView"></paper-icon-button>
                                    <paper-tooltip for="iconInsertMonitor" position="left">{{localize('update-restaurant')}}</paper-tooltip>
                                </div>
                           </restaurant-view-upsert>
                       </div>
                    </iron-pages>
                </div>
                <div id="menu"> 
                    <iron-pages id="restaurant" selected="{{selectedMenu}}">
                        <div id="list"> 
                            <menu-view-list selected="{{selectedMenu}}" entity-selected="{{menuSelected}}">
                               <div slot="header" class="header">
                                   <div class="text-content">{{localize('list-menu')}}</div>
                                   <template is="dom-if" if="{{isAllowed('menu', 'add')}}">
                                       <paper-icon-button id="iconInsertMonitor" icon="insert" class="circle" on-click="displayRestaurantMenuAddView"></paper-icon-button>
                                       <paper-tooltip for="iconInsertMonitor" position="left">{{localize('insert-menu')}}</paper-tooltip>
                                   </template>
                               </div>
                            </menu-view-list>
                       </div>
                       <div id="insert"> 
                           <menu-view-upsert on-saved="goToUpdateView">
                                <div slot="header" class="header">
                                    <div class="text-content">{{localize('insert-menu')}}</div>
                                    <paper-icon-button id="iconInsertMonitor" icon="arrow-back" class="circle" on-click="displayRestaurantMenuListView"></paper-icon-button>
                                    <paper-tooltip for="iconInsertMonitor" position="left">{{localize('insert-menu')}}</paper-tooltip>
                                </div>
                           </menu-view-upsert>
                       </div>
                       <div id="update"> 
                           <menu-view-upsert entity="{{menuSelected}}">
                                <div slot="header" class="header">
                                    <div class="text-content">{{localize('update-restaurant')}}</div>
                                    <paper-icon-button id="iconInsertMonitor" icon="arrow-back" class="circle" on-click="displayRestaurantMenuListView"></paper-icon-button>
                                    <paper-tooltip for="iconInsertMonitor" position="left">{{localize('update-menu')}}</paper-tooltip>
                                </div>
                           </menu-view-upsert>
                       </div>
                   </iron-pages>
                </div>
            </iron-pages>
    `;
    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties () {
        return {
            /**
             * @type number
             */
            selectedTab: {
                value: 1
            },

            selectedRestaurant: {
                type: Number,
                value: 0
            },

            selectedMenu: {
                type: Number,
                value: 0
            },

            /**
             * @type object
             */
            services : {
                value : {
                    _localizeService: 'Localize',
                    _aclService: "Acl"
                }
            },
        };
    }

    goToUpdateView(evt) {
        this.menuSelected = evt.detail;
        this.selectedMenu = 2;
    }

    /**
     * @param evt
     */
    displayRestaurantAddView(evt) {
        this.selectedRestaurant = 1;
    }

    /**
     * @param evt
     */
    displayRestaurantListView(evt) {
        this.selectedRestaurant = 0;
    }

    displayRestaurantMenuAddView() {
        this.selectedMenu = 1;
    }

    displayRestaurantMenuListView() {
        this.selectedMenu = 0;
    }
}
window.customElements.define('restaurant-index', RestaurantIndex);