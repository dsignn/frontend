import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {RefreshCollectionData} from "../../../../element/mixin/auth/refresh-collection-data";
import '@polymer/iron-pages/iron-pages.js';
import '@fluidnext-polymer/paper-pagination/paper-pagination';
import '../paper-menu/paper-menu'
import {Listener} from "@dsign/library/src/event/Listener";
import {Storage} from "@dsign/library/src/storage/Storage";

/**
 * @class MenuViewList
 */
class MenuViewList extends RefreshCollectionData(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
        <style>
        
        #container {
            padding: var(--padding-top-view-list) 0;
            @apply --layout-horizontal;
            @apply --layout-wrap;
        }
        
        paper-menu {
            flex-basis: 10%;
            --paper-card : {
               margin-right: 4px;
               margin-bottom: 4px;
            }
        }
        
         paper-menu:nth-child(10n) { 
                --paper-card : {
                   margin-right: 0;
                }
         }

       @media only screen and (max-width: 2600px) and (min-width: 2201px) {
           paper-menu {
                flex-basis: 12.5%;
           }
           
           paper-menu:nth-child(8n) { 
                --paper-card : {
                   margin-right: 0;
                }
           }
       }

       @media only screen and (max-width: 2200px) and (min-width: 1981px) {
            paper-menu {
                flex-basis: 14.27%;
            }
            
            paper-menu:nth-child(7n) { 
                --paper-card : {
                   margin-right: 0;
                }
            }
       }  
       
       @media only screen and (max-width: 1980px) and (min-width: 1701px) {
            paper-menu {
                flex-basis: 16.6%;
            }
            
            paper-menu:nth-child(6n) { 
                --paper-card : {
                   margin-right: 0;
                }
            }
       }  
            
       @media only screen and (max-width: 1700px) and (min-width: 1201px) {
            paper-menu {
                flex-basis: 20%;
            }
            
            paper-menu:nth-child(5n) { 
                --paper-card : {
                   margin-right: 0;
                }
            }
       }  

       @media only screen and (max-width: 1200px) and (min-width: 971px) {
            paper-menu {
                flex-basis: 25%;
            }
           
            paper-menu:nth-child(4n) { 
                --paper-card : {
                   margin-right: 0;
                }
            }
       }        

       @media only screen and (max-width: 970px) and (min-width: 771px) {
             paper-menu {
                flex-basis: 33.3%;
            }
            
            paper-menu:nth-child(3n) { 
                --paper-card : {
                   margin-right: 0;
                }
            }
       }
              
       @media only screen and (max-width: 770px) and (min-width: 501px) {
            paper-menu {
                flex-basis: 50%;
            }
            
            paper-menu:nth-child(2n) { 
                --paper-card : {
                   margin-right: 0;
                }
            }
       }
       
       @media only screen and (max-width: 500px)  {
             paper-menu {
                flex-basis: 100%;
                --paper-card : {
                   margin-right: 0;
                }
            }
       }   
        </style>
        <slot name="header"></slot>
        <div id="container">
            <template is="dom-repeat" items="[[entities]]" as="menu">
               <paper-menu entity="{{menu}}" on-delete="_deleteEntity" on-update="_showUpdateView" on-enable-monitor="_updateEntity" auto-update-entity></paper-menu>
            </template>
        </div>
        <paper-pagination page="{{page}}" total-items="{{totalItems}}" item-per-page="{{itemPerPage}}" next-icon="next" previous-icon="previous"></paper-pagination>`;
    }

    static get properties() {
        return {

            /**
             * @type number
             */
            itemPerPage: {
                value: 8
            },

            /**
             * @type number
             */
            selected: {
                type: Number,
                notify: true,
                value: 0
            },

            /**
             * @type FileEntity
             */
            entitySelected: {
                notify: true
            },

            _storage: {
                observer: '_changeStorage'
            },

            services : {
                value : {
                    _storage:  "MenuStorage",
                    _authService: "Auth"
                }
            }
        };
    }

    static get observers() {
        return [
            '_changeAuthStorage(_authService, _storage)',
            '_changeItemPerPage(itemPerPage, _storage, _authService)',
            '_changePage(page, _storage, _authService)',
        ]
    }

    /**
     * @param storage
     * @private
     */
    _changeStorage(storage) {
        if (!storage) {
            return;
        }

        this.listenerUdate = new Listener( () => {
            this.getPagedEntities();
        });
        this._storage.getEventManager().on(Storage.POST_UPDATE, this.listenerUdate);
    }

    /**
     * @param {CustomEvent} evt
     * @private
     */
    _showUpdateView(evt) {
        this.entitySelected = evt.detail;
        this.selected = 2;
    }

    /**
     * @private
     */
    _deleteCallback() {
        this._notify.notify(this.localize('notify-delete'));
    }
}

window.customElements.define('menu-view-list', MenuViewList);