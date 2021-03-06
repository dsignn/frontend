import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {StoragePaginationMixin} from "@dsign/polymer-mixin//storage/pagination-mixin";
import '@polymer/iron-pages/iron-pages.js';
import '@fluidnext-polymer/paper-pagination/paper-pagination';
import '../paper-monitor/paper-monitor';

/**
 * @class MonitorViewList
 */
class MonitorViewList extends StoragePaginationMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
        <style>
        
            #container {
                padding: var(--padding-top-view-list);
                @apply --layout-horizontal;
                @apply --layout-wrap;
            }
            
            paper-pagination {
                padding: 0 var(--padding-top-view-list);
            }
            
            @media (max-width: 500px) {
                paper-monitor {
                    flex-basis: 100%;
                }
            }

            @media (min-width: 501px) and (max-width: 900px) {
                paper-monitor {
                    flex-basis: 50%;
                }
            }

            @media (min-width: 901px) and (max-width: 1200px) {
                paper-monitor {
                    flex-basis: 33.3%;
                }
            }

            @media (min-width: 1201px) and (max-width: 1500px) {
                paper-monitor {
                    flex-basis: 25%;
                }
            }

            @media (min-width: 1501px) and (max-width: 1919px) {
                paper-monitor {
                    flex-basis: 20%;
                }
            }

            @media (min-width: 1920px) {
                paper-monitor {
                    flex-basis: 16.6%;
                }
            }
        </style>
        <slot name="header"></slot>
        <div id="container">
            <template is="dom-repeat" items="[[entities]]" as="monitor">
                <paper-monitor entity="{{monitor}}" on-delete="_deleteEntity" on-update="_showUpdateView" on-enable-monitor="_updateEntity"></paper-monitor>
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

            services : {
                value : {
                    _storage:  "MonitorStorage"
                }
            }
        };
    }

    /**
     * @inheritDoc
     */
    static get observers() {
        return [
           'observerPaginationEntities(page, itemPerPage, _storage)'
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

window.customElements.define('monitor-view-list', MonitorViewList);