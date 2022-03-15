import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-tabs/paper-tabs';
import '@polymer/iron-pages/iron-pages';
import '../order-view-list/order-view-list';
import '../order-view-upsert/order-view-upsert';
import '../working-order/working-order';
import {lang} from './language';

/**
 * @customElement
 * @polymer
 */
class OrderIndex extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {

    static get template() {
        return html`
         
            <style>
                
                :host {
                    display: block;
                    padding: 6px;
                    --paper-tabs-selection-bar-color: var(--default-primary-color);
                }  

                .header {
                    @apply --layout-horizontal;
                    @apply --layout-center;
                    padding: var(--padding-top-view-list) 0;
                }
               
                paper-tabs {
                    width: 340px;
                }  
                
                .title-tab {
                    text-transform: uppercase;
                    font-size: 18px;
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
                <paper-tab class="title-tab">{{localize('list')}}</paper-tab>
                <paper-tab class="title-tab">{{localize('in-the-kitchen')}}</paper-tab>
            </paper-tabs>
            <iron-pages id="resorderaurant" selected="{{selectedTab}}">
                <div id="list"> 
                    <iron-pages id="index" selected="{{selected}}" entity-selected="{{entitySelected}}">
                        <div id="list"> 
                            <order-view-list selected="{{selected}}" entity-selected="{{entitySelected}}">
                                <div slot="header" class="header">
                                    <div class="text-content">{{localize('list-order')}}</div>
                                </div>
                            </order-view-list>
                        </div>
                        <div id="insert"> 
                            <!-- TODO learn if add this section
                            <order-view-upsert>
                                <div slot="header" class="header">
                                    <div class="text-content">{{localize('insert-order')}}</div>
                                    <paper-icon-button id="iconBackInsert" icon="arrow-back" class="circle" on-click="displayListView"></paper-icon-button>
                                    <paper-tooltip for="iconBackInsert" position="left">{{localize('back')}}</paper-tooltip>
                                </div>
                            </order-view-upsert>
                            -->
                        </div>
                        <div id="update"> 
                            <order-view-upsert entity="{{entitySelected}}">
                                <div slot="header" class="header">
                                    <div class="text-content">{{localize('update-order')}}</div>
                                    <paper-icon-button id="iconBackUpdate" icon="arrow-back" class="circle" on-click="displayListView"></paper-icon-button>
                                    <paper-tooltip for="iconBackUpdate" position="left">{{localize('back')}}</paper-tooltip>
                                </div>
                            </order-view-upsert>
                        </div>
                    </iron-pages>
                </div>
                <div id="details"> 
                    <working-order></working-order>
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
            selected: {
                type: Number,
                value: 0
            },

            selectedTab: {
                value: 1
            },

            /**
             * @type object
             */
            services : {
                value : {
                    _localizeService: 'Localize'
                }
            },
        };
    }

    /**
     * @param evt
     */
    displayAddView(evt) {
        this.selected = 1;
    }

    /**
     * @param evt
     */
    displayListView(evt) {
        this.selected = 0;
    }
}
window.customElements.define('order-index', OrderIndex);