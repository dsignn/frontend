import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {NotifyMixin} from "@dsign/polymer-mixin/notify/notify-mixin";
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin";
import {mergeDeep} from '@dsign/library/src/object/Utils';
import '@polymer/paper-input/paper-input';
import '@fluidnext-polymer/paper-input-color/paper-input-color';
import '@polymer/paper-card/paper-card';
import '@polymer/iron-form/iron-form';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-tooltip/paper-tooltip';
import '../../../../element/dsign-paper-dropdown/dsign-paper-dropdown';
import {lang} from './language';

/**
 * @class MenuViewUpsert
 */
class MenuViewUpsert extends StorageEntityMixin(NotifyMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement)))) {

    static get template() {
        return html`
        <style>
        
            #monitorUpdate {
                margin-bottom: 10px;
            }
            
            paper-input-color {
                outline: none;
            }
            
            dsign-paper-dropdown-menu {
                width: 100%;
            }
        
            #container {
                @apply --layout-horizontal;
                padding: 10px 20px;
            }
            
            #content-left {
                padding-right: 16px;
            }
            
            h2 {
                margin-top: 0;
                text-align: center;
            }
            
            #content-right {
                 @apply --layout-vertical;
                justify-content: space-between;
            }
            
            img {
                height: 300px;
                width: 300px;
            }
            
            .action {
                @apply  --layout-horizontal;
            }
            
            paper-card {
                width: 100%;
                padding: 10px;
            }
        
            @media (max-width: 900px) {
                #container {
                    @apply --layout-vertical-reverse;
                }
            
                #content-left {
                    @apply --layout-flex;
                }
                
                #content-right {
                    @apply --layout-flex;
                }
            }
                
            @media (min-width: 901px) {
                #container {
                     @apply  --layout-horizontal;
                }
            
                #content-left {
                   @apply --layout-flex-8;
                }
                
                #content-right {
                   @apply --layout-flex-4;
                }
            }
        </style>
        <slot name="header"></slot>
        <div id="container">
            <div id="content-left">
                <iron-form id="formMenu">
                    <form method="post">
                        <paper-input  name="name" label="{{localize('name')}}" value="{{entity.name}}" required></paper-input>
                        <dsign-paper-dropdown-menu label="{{localize('restaurant')}}" value="{{entity.colorHeader}}">
                          <paper-listbox id="listboxRestaurant" slot="dropdown-content">
                          </paper-listbox>
                        </dsign-paper-dropdown-menu>
                        <paper-input-color name="backgroundHeader" label="{{localize('background-header')}}" value="{{entity.backgroundHeader}}" required></paper-input-color>
                        <dsign-paper-dropdown-menu label="{{localize('color-header')}}" value="{{entity.colorHeader}}">
                          <paper-listbox slot="dropdown-content">
                            <paper-item value="clear">{{localize('clear')}}</paper-item>
                            <paper-item value="dark">{{localize('dark')}}</paper-item>
                          </paper-listbox>
                        </dsign-paper-dropdown-menu>
                        <div class="action">
                            <paper-button on-tap="submitMenuButton">{{localize(labelAction)}}</paper-button>
                        </div>
                    </form>
                </iron-form>
            </div>
            <div id="content-right">
                <paper-card>
                    <h2>{{localize('menu-item')}}</h2>
                    <iron-form id="formMenuItem">
                        <form method="post">
                             <paper-input name="name" label="{{localize('name')}}" required></paper-input>
                             <paper-input name="description" label="{{localize('description')}}" required></paper-input>
                             <paper-input  name="price" label="{{localize('price')}}" required></paper-input>
                             <paper-dropdown-menu label="{{localize('status')}}">
                                <paper-listbox slot="dropdown-content">
                                    <paper-item value="ffff">{{localize('color-header')}}</paper-item>
                                    <paper-item>{{localize('color-header')}}</paper-item>
                                    <paper-item>{{localize('color-header')}}</paper-item>
                                    <paper-item value="#B7A967">Vegas Gold</paper-item>
                                    <paper-item value="#29753A">Kelly Green</paper-item>
                                </paper-listbox>
                             </paper-dropdown-menu>
                             <paper-dropdown-menu label="{{localize('category')}}" required>
                                <paper-listbox  id="listboxCategory" slot="dropdown-content">
                                </paper-listbox>
                             </paper-dropdown-menu>
                             <div class="action">
                                <paper-button on-tap="submitMenuItemButton">{{localize('add')}}</paper-button>
                             </div>
                        </form>
                    </iron-form>
                </paper-card>

            </div>
        </div>`;
    }
    static get properties() {
        return {


            /**
             * @type FileEntity
             */
            entity: {
                observer: '_changeEntity',
            },

            url: {
                notify: true,
                value: ''
            },

            /**
             * @type Number
             */
            /**
             * @type string
             */
            labelAction: {
                type: String,
                value: 'save'
            },

            /**
             * @type object
             */
            services: {
                value: {
                    _localizeService: 'Localize',
                    _notifyService: 'Notify',
                    _slugify: "Slugify",
                    _config: "config",
                    StorageContainerAggregate : {
                        _storage :"MenuStorage",
                        _resourceStorage :"ResourceStorage",
                        _organizationStorage :"OrganizationStorage",
                        _menuCategoryStorage :"MenuCategoryStorage",
                        _qrCodeGeneratorStorage: "QrCodeGeneratorStorage"
                    }
                }
            },

            _resourceStorage: {
                readOnly: true
            },

            _organizationStorage: {
                readOnly: true,
                observer: 'loadRestaurant'
            },

            _menuCategoryStorage: {
                readOnly: true,
                observer: 'loadMenuCategory'
            }
        };
    }

    constructor() {
        super();
        this.resources = lang;
    }

    ready() {
        super.ready();
        this.$.formMenu.addEventListener('iron-form-presubmit', this.submitMenu.bind(this));
        this.$.formMenuItem.addEventListener('iron-form-presubmit', this.submitMenuItem.bind(this));
    }

    /**
     * @param evt
     */
    changeNameRestaurant(evt) {
        if (!this._slugify) {
            return;
        }

        this.url = evt.detail.value ? this._slugify.slugify(evt.detail.value) : '';
    }

    /**
     * @param evt
     */
    generateQrCode(evt) {

        this._qrCodeGeneratorStorage.get(this.entity.id)
            .then((restaurant) => {
                this.entity = null;
                this.entity = restaurant;
                this._updateQrCode();
            });
    }

    /**
     *
     * @param newValue
     * @param oldValue
     * @private
     */
    _changeEntity(newValue, oldValue) {

        this.labelAction = 'save';
        if (!newValue) {
            return;
        }

        if (newValue.id) {
            this.labelAction = 'update';
        }
    }

    /**
     *
     */
    loadRestaurant() {
        this._organizationStorage.getAll()
            .then((restaurants) => {
                if (restaurants) {

                    for (const restaurant of restaurants) {
                        let el = document.createElement('paper-item');
                        el.setAttribute('value', restaurant.id);
                        el.innerText = restaurant.name;
                        this.$.listboxRestaurant.appendChild(el);
                    }
                }

            })
    };

    loadMenuCategory() {
        this._menuCategoryStorage.getAll()
            .then((categories) => {
                if (categories && categories.length > 0) {
                    categories = categories[0];
                    let translate = {};
                    for (const property in categories) {

                        for (const lang in categories[property]) {
                            if (!translate[lang]) {
                                translate[lang] = {};
                            }
                            translate[lang][property] = categories[property][lang];
                        }

                        let el = document.createElement('paper-item');
                        el.setAttribute('value', property);
                        el.innerText = `{{localize(${property})}}`;
                        console.log('ffffffffffffffffff', el.innerText);
                        this.$.listboxCategory.appendChild(el);
                    }
                }

            })
    }

    /**
     * @param restaurant
     * @private
     */
    _updateQrCode() {
        if ( this.entity.qrCode.id) {
            this._resourceStorage.get( this.entity.qrCode.id)
                .then((resource) => {
                    if (resource) {
                        this.$.qrCode.setAttribute('src', `${resource.src}`);
                    }

                })
        }
    }

    /**
     * @param {CustomEvent} evt
     */
    submitMenuItemButton(evt) {
        this.$.formMenuItem.submit();
    }

    /**
     * @param {CustomEvent} evt
     */
    submitMenuItem(evt) {
        evt.preventDefault();

        console.log('fdsfdsfdsfdsfsd')
    }

    /**
     * @param {CustomEvent} evt
     */
    submitMenuButton(evt) {
        this.$.formMenu.submit();
    }

    /**
     * @param evt
     */
    submitMenu(evt) {
        evt.preventDefault();

        let method = this.getStorageUpsertMethod();
        this._storage[method](this.entity)
            .then((data) => {

                if (method === 'save') {
                    this.entity = this._storage.getHydrator().hydrate({type: "text/html"});
                    this.$.formRestaurant.reset();
                }

                this.notify(this.localize(method === 'save' ? 'notify-save' : 'notify-update'));
            });
    }
}

window.customElements.define('menu-view-upsert', MenuViewUpsert);