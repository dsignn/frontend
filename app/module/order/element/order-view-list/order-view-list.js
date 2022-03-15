import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {RefreshCollectionData} from "../../../../element/mixin/auth/refresh-collection-data";
import {StorageCrudMixin} from "@dsign/polymer-mixin/storage/crud-mixin";
import "@fluidnext-polymer/paper-pagination/paper-pagination";
import "@fluidnext-polymer/paper-pagination/icons/paper-pagination-icons";
import '../paper-order/paper-order';
import {lang} from './language';


/**
 * @customElement
 * @polymer
 */
class OrderViewList extends RefreshCollectionData(StorageCrudMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement)))) {

    static get template() {
        return html`
            <style>

                #container {
                    @apply --layout-horizontal;
                    @apply --layout-wrap;
                    padding: var(--padding-top-view-list) 0;
                }

                paper-order {
                    flex-basis: 12.2%;
                    --paper-card : {
                       margin-right: 4px;
                       margin-bottom: 4px;
                    }
                }


                @media (min-width: 2100px) and (max-width: 2300px) {
                    paper-order {
                        flex-basis: 14%;
                    }
                }

                @media (min-width: 1900px) and (max-width: 2099px) {
                    paper-order {
                        flex-basis: 16.4%;
                    }
                }

                @media (min-width: 1600px) and (max-width: 1899px) {
                    paper-order {
                        flex-basis: 19.7%;
                    }
                }

                @media (min-width: 1300px) and (max-width: 1599px) {
                    paper-order {
                        flex-basis: 24.6%;
                    }
                }

                @media (min-width: 1000px) and (max-width: 1299px) {
                    paper-order {
                        flex-basis: 32.8%;
                    }
                }

                @media (min-width: 600px) and (max-width: 999px) {
                    paper-order {
                        flex-basis: 48.7%;
                    }
                }

                @media (max-width: 599px)  {
                    paper-order {
                        flex-basis: 100%;
                    }
                }
            </style>
            <slot name="header"></slot>
                <div id="container">
                <template is="dom-repeat" items="[[entities]]" as="order">
                    <paper-order entity="{{order}}" on-delete="_deleteEntity" on-update="_showUpdateView"></paper-order>
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
                        _storage: "OrderStorage"
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
window.customElements.define('order-view-list', OrderViewList);
