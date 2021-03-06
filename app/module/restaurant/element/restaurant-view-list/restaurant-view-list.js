import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {RefreshCollectionData} from "../../../../element/mixin/auth/refresh-collection-data";
import {StorageCrudMixin} from "@dsign/polymer-mixin/storage/crud-mixin";
import '@polymer/iron-pages/iron-pages.js';
import '@fluidnext-polymer/paper-pagination/paper-pagination';
import '../paper-restaurant/paper-restaurant'



/**
 * @class RestaurantViewList
 */
class RestaurantViewList extends RefreshCollectionData(StorageCrudMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement)))) {

    static get template() {
        return html`
        <style>
        
            #container {
                padding: var(--padding-top-view-list) 0;
                @apply --layout-horizontal;
                @apply --layout-wrap;
            }
            
            paper-pagination {
                padding: 0 var(--padding-top-view-list);
            }
            
            @media (max-width: 500px) {
                paper-restaurant {
                    flex-basis: 100%;
                    margin-bottom: 6px;
                }
            }

            @media (min-width: 501px) and (max-width: 900px) {
                paper-restaurant {
                    flex-basis: 50%;
                }
            }

            @media (min-width: 901px) and (max-width: 1200px) {
                paper-restaurant {
                    flex-basis: 33.3%;
                }
            }

            @media (min-width: 1201px) and (max-width: 1500px) {
                paper-restaurant {
                    flex-basis: 25%;
                }
            }

            @media (min-width: 1501px) and (max-width: 1919px) {
                paper-restaurant {
                    flex-basis: 20%;
                }
            }

            @media (min-width: 1920px) {
                paper-restaurant {
                    flex-basis: 16.6%;
                }
            }
        </style>
        <slot name="header"></slot>
        <div id="container">
            <template is="dom-repeat" items="[[entities]]" as="restaurant">
               <paper-restaurant entity="{{restaurant}}" on-delete="_deleteEntity" on-update="_showUpdateView" on-enable-monitor="_updateEntity"></paper-restaurant>
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
                value: 3
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

            services : {
                value : {
                    _storage:  "OrganizationStorage",
                    _authService: "Auth",
                    _notifyService: 'Notify',
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

window.customElements.define('restaurant-view-list', RestaurantViewList);