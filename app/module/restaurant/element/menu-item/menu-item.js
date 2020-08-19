import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {lang} from './language';
import {Listener} from "@dsign/library/src/event/Listener";
import {Localize} from "@dsign/library/src/localize/Localize";

/**
 * @class MenuItem
 */
class MenuItem extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {

    static get template() {
        return html`
        <style>
               paper-card {
                    @apply --layout-horizontal;
                    @apply --application-paper-card;
                    margin-right: 4px;
                    margin-bottom: 4px;
                }
                
                #leftSection {
                    width: 80px;
                    min-height: 120px;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    @apply --application-paper-card-left-content;
                }
                
                #fastAction {
                    border-right: 1px solid var(--divider-color);
                }
                
                .name {
                    font-size: 18px;
                }
                
                .middle-info {
                    @apply --layout-horizontal;
                    @apply --layout-justified;
                }
                
                .price,
                .category,
                .description {
                    color: #757575; 
                }
                
               .description {
                    font-size: 14px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
               }

                
                #fastAction .action {
                    height: 30px;
                    @apply --layout;
                    @apply --layout-center
                    @apply --layout-center-justified;
                }
                
                #rightSection {
                    @apply --layout-horizontal;
                    @apply --layout-flex;
                }
                
                          
                #content {
                    @apply --layout-flex;
                    padding: 4px;
                    word-break: break-all;
                    overflow: hidden;
                } 
                
                [capitalize] {
                    text-transform: capitalize;
                }
        </style>
         <paper-card>
                <div id="leftSection"></div>
                <div id="fastAction">
                    <div class="action">
                       
                    </div>
                </div>
                <div id="rightSection">
                    <div id="content">
                        <div class="name" capitalize>{{name}}</div>
                        <div class="middle-info">
                          <div class="category" capitalize>{{menuItem.category}}</div>
                          <div class="price">{{menuItem.price.value}} €</div>
                        </div>
                        <div class="description">{{description}}</div>
                    </div>
                    <div id="crud">
                        <paper-menu-button ignore-select horizontal-align="right">
                            <paper-icon-button icon="v-menu" slot="dropdown-trigger" alt="multi menu"></paper-icon-button>
                            <paper-listbox slot="dropdown-content" multi>
                                <paper-item on-click="_update">{{localize('modify')}}</paper-item>
                                <paper-item  on-click="_delete">{{localize('delete')}}</paper-item>
                            </paper-listbox>
                        </paper-menu-button>
                    </div>
                </div>
            </paper-card>`;
    }

    static get properties() {
        return {

            name: {
                type: String,
                notify: true,
            },

            description: {
                type: String,
                notify: true,
            },

            /**
             * @type MenuItem
             */
            menuItem: {
                notify: true,
                value: {}
            },

            /**
             * @type object
             */
            services : {
                value : {
                    _localizeService: 'Localize',
                    _merge: "merge",
                }
            },

            _localizeService: {
                type: Object,
                readOnly: true,
                notify: true,
                observer: 'changedLocalizeService'
            },

            _merge: {
                readOnly: true
            },
        };
    }

    constructor() {
        super();
        this.resources = lang;
    }

    /**
     * @inheritDoc
     */
    static get observers() {
        return [
            '_activeMenuItem(menuItem, _localizeService)'
        ]
    }

    /**
     * @param service
     */
    changedLocalizeService(service) {

        super.changedLocalizeService(service);
        if (!service) {
            return;
        }

        this._evtListener = new Listener(this.changeLanguage.bind(this));
        this._localizeService.getEventManager().on(Localize.CHANGE_LANGUAGE, this._evtListener);
    }

    /**
     * @param evt
     */
    changeLanguage(evt) {

        super.changeLanguage(evt);
        this.name = this.menuItem.name[this._localizeService.getDefaultLang()];
        this.description = this.menuItem.description[this._localizeService.getDefaultLang()];
    }

    _activeMenuItem(menuItem, _localizeService) {
        if (!menuItem || !_localizeService) {
            return;
        }

        this.name = menuItem.name[_localizeService.getDefaultLang()];
        this.description = menuItem.description[_localizeService.getDefaultLang()];
    }

    /**
     * @param evt
     * @private
     */
    _update(evt) {
        this.dispatchEvent(new CustomEvent('update', {detail: this.menuItem}));
    }

    /**
     * @param evt
     * @private
     */
    _delete(evt) {
        this.dispatchEvent(new CustomEvent('delete', {detail: this.menuItem}));
    }
}

window.customElements.define('menu-item', MenuItem);