import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {RefreshCollectionData} from "../../../../element/mixin/auth/refresh-collection-data";
import {StorageCrudMixin} from "@dsign/polymer-mixin/storage/crud-mixin";
import "@fluidnext-polymer/paper-pagination/paper-pagination";
import "@fluidnext-polymer/paper-pagination/icons/paper-pagination-icons";
import "./../paper-user/paper-user";
import {lang} from './language';


/**
 * @customElement
 * @polymer
 */
class UserViewList extends RefreshCollectionData(StorageCrudMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement)))) {

    static get template() {
        return html`
            <style>

                #container {
                    padding: var(--padding-top-view-list);
                    @apply --layout-horizontal;
                    @apply --layout-wrap;
                }
                
                @media (max-width: 500px) {
                    paper-user {
                        flex-basis: 100%;
                    }
                }
    
                @media (min-width: 501px) and (max-width: 900px) {
                    paper-user {
                        flex-basis: 50%;
                    }
                }
    
                @media (min-width: 901px) and (max-width: 1200px) {
                    paper-user {
                        flex-basis: 33.3%;
                    }
                }
    
                @media (min-width: 1201px) and (max-width: 1500px) {
                    paper-user {
                        flex-basis: 25%;
                    }
                }
    
                @media (min-width: 1501px) and (max-width: 1919px) {
                    paper-user {
                        flex-basis: 20%;
                    }
                }
    
                @media (min-width: 1920px) {
                    paper-user {
                        flex-basis: 16.6%;
                    }
                }
            </style>
            <slot name="header"></slot>
                <div id="container">
                <template is="dom-repeat" items="[[entities]]" as="user">
                    <paper-user entity="{{user}}" on-delete="_deleteEntity" on-update="_showUpdateView" on-enable-monitor="_updateEntity"</paper-user>
                </template>
            </div>
            <paper-pagination page="{{page}}" total-items="{{totalItems}}" item-per-page="{{itemPerPage}}" next-icon="next" previous-icon="previous"></paper-pagination>
        `;
    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties () {
        return {

            itemPerPage: {
                value: 20
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

            /**
             * @type object
             */
            services : {
                value : {
                    _notify : "Notify",
                    _localizeService: 'Localize',
                    _authService: "Auth",
                    "StorageContainerAggregate": {
                        _storage: "UserStorage"
                    }
                }
            }
        };
    }

    static get observers() {
        return [
            '_changeAuthStorage(_authService, _storage)'
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
window.customElements.define('user-view-list', UserViewList);
