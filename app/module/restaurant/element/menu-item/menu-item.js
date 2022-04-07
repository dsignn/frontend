import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {lang} from './language';
import {Listener} from "@dsign/library/src/event/Listener";
import {Localize} from "@dsign/library/src/localize/Localize";
import '@fluidnext-polymer/paper-input-file/paper-input-file';
import {TranslateTransform} from "../../../../src/util/TranslateTransform";

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
                   @apply --menu-item-paper-card;
                   margin-right: 4px;
                   margin-bottom: 4px;
               }
                
               paper-input-file {
                   outline: none;
                   color: var(--accent-color);
                   --primary-text-color: var(--accent-color);
                   --paper-input-container-color: var(--accent-color);
                   --paper-input-container-focus-color: var(--accent-color);
                   --paper-input-container-invalid-color: var(--accent-color);
                   --paper-input-container-underline: {
                      border-bottom: 3px solid var(--paper-input-container-focus-color, var(--primary-color));
                   };
               }
                
               #leftSection {
                   width: 80px;
                   min-height: 120px;
                   background-size: cover;
                   background-position: center;
                   background-repeat: no-repeat;
                   @apply --application-paper-card-left-content;
                   @apply --layout-vertical;
                   @apply --layout-end-justified;
                   padding: 0 6px;
               }
                
               #fastAction {
                   border-right: 1px solid var(--divider-color);
               }
                
               .name {
                   overflow: hidden;
                   text-overflow: ellipsis;
                   height: 27px;
                   font-size: 18px;
                   display: flex;
                   flex-direction: row;
                   align-items: center;
               }
               
               .name-container {
                   overflow: hidden;
                   height: 27px;
                   font-size: 18px;
               }
               
               .name-header {
                 @apply --layout-horizontal;
                 @apply --layout-justified;
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
                
               #status {
                    border-radius: 50%;
                    background-color: red;
                    width: 20px;
                    min-width: 20px;
                    height: 20px;
                    margin-right: 6px;
               }
               
               .category {
                    font-style: italic;
               }
                
               .description {
                   font-size: 14px;
                   overflow: hidden;
                   text-overflow: ellipsis;
                   display: -webkit-box;
                   -webkit-line-clamp: 2;
                   -webkit-box-orient: vertical;
               }
               
               #formResource {
                    display: none;
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
                
                paper-menu-button {
                    padding: 4px;
                    --paper-icon-button : {
                         padding: 0 !important;
                         width: 28px;
                         height: 28px;
                    }
                }
                
                [capitalize] {
                    text-transform: capitalize;
                }
        </style>
         <paper-card>
                <div id="leftSection">              
                    <iron-form id="formResource">
                        <form method="post">
                            <paper-input-file id="file" value="{{file}}"></paper-input-file>
                        </form>
                    </iron-form>
                </div>             
                <div id="rightSection">
                    <div id="content">
                        <div class="name-header">
                            <div class="name" capitalize>
                                <div id="status"></div>
                                <div class="name-container">{{name}}</div>    
                            </div>
                            <paper-tooltip id="tooltip" for="status" position="right"></paper-tooltip>
                            <template is="dom-if" if="{{showCrud}}">
                                <paper-menu-button ignore-select horizontal-align="right">
                                    <paper-icon-button icon="v-menu" slot="dropdown-trigger" alt="multi menu"></paper-icon-button>
                                    <paper-listbox slot="dropdown-content" multi>
                                        <paper-item on-click="_update">{{localize('modify')}}</paper-item>
                                        <paper-item  on-click="_delete">{{localize('delete')}}</paper-item>
                                    </paper-listbox>
                                </paper-menu-button>
                            </template>
                        </div>
                        <div class="middle-info">
                          <div class="category" capitalize>{{localize(menuItem.category)}}</div>
                          <div id="price" class="price">{{_computePrice(menuItem.price.value)}}</div>
                        </div>
                        <div class="description">{{description}}</div>
                    </div>
                </div>
            </paper-card>`;
    }

    static get properties() {
        return {

            file: {
                type: Object,
                notify: true,
                observer: 'changedFile'
            },

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

            exist: {
                readOnly: true,
                value: false
            },


            show: {
                reflectToAttribute: true,
                observer: 'changedShow',
                value: false
            },

            showCrud: {
                type: Boolean,
                value: false
            },

            showPrice: {
                type: Boolean,
                value: false,
                notify: true,
                observer: 'changedShowPrice',
            },

            /**
             * @type object
             */
            services: {
                value: {
                    _localizeService: 'Localize',
                    _merge: "merge",
                    StorageContainerAggregate: {
                        _resourceStorage: "ResourceStorage",
                    }
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

            _resourceStorage: {
                readOnly: true
            },
        };
    }

    /**
     * @inheritDoc
     */
    static get observers() {
        return [
            '_activeMenuItem(menuItem, _localizeService)',
            '_changedMenuItem(menuItem, _resourceStorage)',
            'changeApiCategory(apiCategory, _merge)'
        ]
    }

    constructor() {
        super();
        this.resources = lang;
    }

    ready() {
        super.ready();
        this.$.formResource.addEventListener('iron-form-presubmit', this.submitResource.bind(this));
    }

    _computePrice(price) {
        if (!price) {
            return 0;
        } else {
            if (Intl) {
                let formatter = Intl.NumberFormat('it-IT', {style: 'currency', currency: 'EUR'});
                return formatter.format(price);
            } else {
                return value;
            }           
        }
    }

    /**
     * @param value
     */
    changeApiCategory(value, merge) {
        if (!value || !merge) {
            return;
        }

        this.resources = this._merge.merge(this.resources, TranslateTransform.entityFormatToElementFormat(value));
        this.categories = Object.keys(value);
        this.notifyPath('menuItem.category')
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
     *
     * @param menuItem
     * @param _resourceStorage
     */
    _changedMenuItem(menuItem, _resourceStorage) {

        if (!menuItem || !_resourceStorage) {
            return;
        }

        if (Array.isArray(menuItem.photos) && menuItem.photos.length > 0) {
            this.loadResource(menuItem.photos[0].id);
            this.$.leftSection.style.borderRight = `none`;
        } else {
            this.$.leftSection.style.backgroundImage = `url(https://dsign-asset.s3.eu-central-1.amazonaws.com/dish-not-found.png)`;
            this.$.leftSection.style.borderRight = `1px solid #eeeeee`;
        }

        this._checkStatus();
    }

    changedShow(value) {

        if(value) {
            this.$.formResource.style.display = 'block'
        } else {
            this.$.formResource.style.display = 'none'
        }
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
        evt.target.parentElement.parentElement.close();
    }

    /**
     * @param evt
     * @private
     */
    _delete(evt) {
        this.dispatchEvent(new CustomEvent('delete', {detail: this.menuItem}));
        evt.target.parentElement.parentElement.close();
    }

    /**
     * @param id
     * @private
     */
    loadResource(id) {
        this._resourceStorage.get(id)
            .then((entity) => {
                this.$.leftSection.style.backgroundImage = `url(${entity.src}?cache=${(new Date()).getTime()})`;
            });
    }

    /**
     * @param value
     */
    changedFile(value) {
        if (!value) {
            return;
        }

        this.$.formResource.submit();
    }

    /**
     * @private
     */
    _checkStatus() {

        if (!this.menuItem ) {
            return
        }

        switch (this.menuItem.status) {
            case 'available':
                this.$.status.style.backgroundColor = '#015b63';
                this.$.tooltip.innerText = this.localize('available-status');
                break;
            case 'over':
                this.$.status.style.backgroundColor = '#f0b80e';
                this.$.tooltip.innerText = this.localize('over-status');
                break;
            case 'not-available':
                this.$.status.style.backgroundColor = '#ff0000';
                this.$.tooltip.innerText = this.localize('not-available-status');
                break;
        }
    }

    /**
     * @param evt
     */
    submitResource(evt) {
        evt.preventDefault();

        this.dispatchEvent(new CustomEvent('upload-file', {
            detail: {
                file: this.$.file.files[0],
                menuItem: this.menuItem
            }
        }));

        setTimeout(
            () => {
                this.$.file.reset();
            },
            300
        );
    }

    changedShowPrice(value) {
        console.log('change VIsibilit', value);
        if (value) {
            this.$.price.style.display = 'flex';
        } else {
            this.$.price.style.display = 'none';
        }
    }
}

window.customElements.define('menu-item', MenuItem);