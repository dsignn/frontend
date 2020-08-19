import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {NotifyMixin} from "@dsign/polymer-mixin/notify/notify-mixin";
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin";
import '@polymer/paper-input/paper-input';
import '@fluidnext-polymer/paper-input-color/paper-input-color';
import '@polymer/paper-card/paper-card';
import '@polymer/iron-form/iron-form';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-toggle-button/paper-toggle-button';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-tooltip/paper-tooltip';
import '../menu-item/menu-item';
import '../../../../element/dsign-paper-dropdown/dsign-paper-dropdown';
import {lang} from './language';
import {Flatten} from "../../../../src/transform/Flatten";
import {TranslateTransform} from "../../../../src/util/TranslateTransform";

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
            
            paper-toggle-button {
              --paper-toggle-button-checked-bar-color:  var(--app-primary-color);
              --paper-toggle-button-checked-button-color:  var(--app-primary-color);
              --paper-toggle-button-checked-ink-color: var(--app-primary-color);
            }
            
            .top {
                @apply --layout-horizontal;
            }
            
            .top paper-input {
                flex: 1;
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
            
            .price {
               @apply --layout-horizontal;
            }
            
              .price paper-input {
                width: 100%;
              }
            
            .price .eur {
                padding-left: 6px;
                font-size: 20px;
                font-weight: bold;
                @apply  --layout-horizontal;
                @apply  --layout-center-center;
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
            
            #menuItemContainer {
                padding: 16px 0;
                @apply --layout-horizontal;
                @apply --layout-wrap;
            }
            
            menu-item {
                flex-basis: 20%;
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
                   @apply --layout-flex-9;
                }
                
                #content-right {
                   @apply --layout-flex-3;
                }
            }
        </style>
        <slot name="header"></slot>
        <div id="container">
            <div id="content-left">
                <iron-form id="formMenu">
                    <form method="post">
                        <div class="top">
                            <paper-input  name="name" label="{{localize('name')}}" value="{{entity.name}}" required></paper-input>
                            <paper-toggle-button checked="{{entity.enable}}">{{localize('enable')}}</paper-toggle-button>
                        </div>
                        <dsign-paper-dropdown-menu label="{{localize('restaurant')}}" value="{{entity.organization.id}}" required>
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
                <h2>{{localize('menu-title')}}</h2>
                <div id="menuItemContainer">
                     <template id="items" is="dom-repeat" items="[[entity.items]]" as="menuItem">
                        <menu-item menu-item="{{menuItem}}" index$="{{index}}" on-delete="_deleteMenuItem"></menu-item>
                     </template>
                </div>
            </div>
            <div id="content-right">
                <paper-card>
                    <h2>{{localize('menu-item')}}</h2>
                    <iron-form id="formMenuItem">
                        <form method="post">
                             <paper-input name="name[it]" label="{{localize('name-it')}}" required></paper-input>
                             <paper-input name="name[en]" label="{{localize('name-en')}}" required></paper-input>
                             <paper-input name="description[it]" label="{{localize('description-it')}}" required></paper-input>
                             <paper-input name="description[en]" label="{{localize('description-en')}}" required></paper-input>
                             <div class="price">
                                <paper-input type="number" name="price[value]" label="{{localize('price')}}" required>
                                    <iron-icon icon="restaurant:eur" slot="suffix"></iron-icon>
                                </paper-input>
                                <input hidden name="price[currency]" value="eur">
                             </div>
                             <dsign-paper-dropdown-menu id="status" name="status" label="{{localize('status')}}" required>
                                <paper-listbox slot="dropdown-content">
                                    <template is="dom-repeat" items="[[status]]" as="state">
                                       <paper-item value="{{state}}">{{localize(state)}}</paper-item>
                                    </template>
                                </paper-listbox>
                             </dsign-paper-dropdown-menu>
                             <dsign-paper-dropdown-menu id="category" name="category" label="{{localize('category')}}" required>
                                <paper-listbox slot="dropdown-content">
                                    <template is="dom-repeat" items="[[categories]]" as="category">
                                       <paper-item value="{{category}}">{{localize(category)}}</paper-item>
                                    </template>
                                </paper-listbox>
                             </dsign-paper-dropdown-menu>
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

            categories: {
                notify: true,
            },

            status: {
                notify: true,
                value: [
                    'available',
                    'over',
                    'not-available'
                ]
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
                    _merge: "merge",
                    StorageContainerAggregate : {
                        _storage :"MenuStorage",
                        _resourceStorage :"ResourceStorage",
                        _organizationStorage :"OrganizationStorage",
                        _menuCategoryStorage :"MenuCategoryStorage",
                        _qrCodeGeneratorStorage: "QrCodeGeneratorStorage"
                    },
                    HydratorContainerAggregate: {
                        _menuItemHydrator: "MenuItemHydrator"
                    }
                }
            },

            _flattenService: {
                readOnly: true,
                value: new Flatten()
            },

            _merge: {
                readOnly: true
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
            },

            _menuItemHydrator: {
                readOnly: true,
            }
        };
    }

    /**
     * @inheritDoc
     */
    static get observers() {
        return [
            'loadMenuCategory(_menuCategoryStorage, _merge)'
        ]
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

    loadMenuCategory(loadMenuCategory, merge) {
        if (!loadMenuCategory || !merge) {
            return;
        }

        this._menuCategoryStorage.getAll()
            .then((categories) => {
                if (categories && categories.length > 0) {

                    this.resources = this._merge.merge(
                        this.resources,
                        TranslateTransform.entityFormatToElementFormat(categories[0])
                    );
                    this.categories = Object.keys(categories[0]);
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

        let data = this._flattenService.unFlatten(this.$.formMenuItem.serializeForm());
        let menuItem = this._menuItemHydrator.hydrate(data);

        this.entity.appendMenuItem(menuItem);
        this.$.items.render();
        this.$.formMenuItem.reset();
        this.$.status.reset();
        this.$.category.reset();
    }

    /**
     * @param evt
     */
    _deleteMenuItem(evt) {
        let index = parseInt(evt.target.getAttribute('index'));
        this.entity.items.splice(index, 1);
        this.$.items.render();
    }

    /**
     * @param {CustomEvent} evt
     */
    submitMenuButton(evt) {
        this.$.formMenu.submit();
        this._storage.getPaged(1,3,[]).then((data) => {
            console.log('porco dio', data);
        })
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
                    this.entity = this._storage.getHydrator().hydrate({});
                    this.$.formMenu.reset();
                }

                this.notify(this.localize(method === 'save' ? 'notify-save' : 'notify-update'));
            });
    }
}

window.customElements.define('menu-view-upsert', MenuViewUpsert);