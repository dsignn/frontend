import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {NotifyMixin} from "@dsign/polymer-mixin/notify/notify-mixin";
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin";
import {Flatten} from "../../../../src/transform/Flatten";
import {TranslateTransform} from "../../../../src/util/TranslateTransform";
import {Auth} from "../../../../src/authentication/Auth";
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
import '../menu-item-view-upsert/menu-item-view-upsert';
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
               @apply --layout-flex-9;
               padding-right: 10px;
            }
            
            #content-right {
               @apply --layout-flex-3;
            }
            
            h2 {
                margin: 0;
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
                padding-top: 10px;
                @apply  --layout-horizontal;
            }
            
            .padding-top-52 {
                padding-top: 52px;
            }
            
            .margin-0 {
                margin: 0;
            }
            
            menu-item {
                --menu-item-paper-card: {
                    max-height: 120px;
                }
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
            
            @media (max-width: 700px) {
                #container {
                    @apply --layout-vertical-reverse;
                }
            
                #content-left {
                    @apply --layout-flex;
                    padding-right: 0;
                }
                
                #content-right {
                    @apply --layout-flex;
                }
            }
            
            @media (min-width: 701px) and (max-width: 1100px) {
            
                #content-left {
                      @apply --layout-flex-7;
                }
                
                #content-right {
                      @apply --layout-flex-5;
                }
            }
        /*
            @media (max-width: 900px) {
                #menuItemContainer {
                    background-color: red;
                }
            
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
                #menuItemContainer {
                    background-color: yellow;
                }
            
            
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
            
         */
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
                          <paper-listbox id="listboxRestaurant" slot="dropdown-content"></paper-listbox>
                        </dsign-paper-dropdown-menu>
                        <dsign-paper-dropdown-menu label="{{localize('layout-type')}}" value="{{entity.layoutType}}" required>
                            <paper-listbox id="listboxLayoutType" slot="dropdown-content"></paper-listbox>
                        </dsign-paper-dropdown-menu>
                        <paper-input-color name="backgroundHeader" label="{{localize('background-header')}}" value="{{entity.backgroundHeader}}" required></paper-input-color>
                        <paper-input-color name="colorHeader" label="{{localize('background-header')}}" value="{{entity.colorHeader}}" required></paper-input-color>
                        <div class="action padding-top-52">
                            <paper-button class="margin-0" on-tap="submitMenuButton">{{localize(labelAction)}}</paper-button>
                        </div>
                    </form>
                </iron-form>
            </div>
            <div id="content-right">
                <paper-card>
                    <h2>{{localize(menuItemUpsertLabel)}}</h2>
                    <menu-item-view-upsert id="menuItemViewUpsert" on-menu-item-save="appendMenuItem" on-menu-item-update="modifyMenuItem" menu-item="{{menuItem}}"></menu-item-view-upsert>
                    <div class="action">
                        <paper-button on-tap="submitMenuItem">{{localize(labelActionMenuItem)}}</paper-button>
                    </div>
                </paper-card>
            </div>
        </div>
        <h2>{{localize('menu-title')}}</h2>
        <div id="menuItemContainer">
             <template id="items" is="dom-repeat" items="[[entity.items]]" as="menuItem">
                 <menu-item menu-item="{{menuItem}}" index$="{{index}}" on-delete="_deleteMenuItem" on-update="_updateMenuItem" on-upload-file="uploadFile" show="{{showUpdateMenuItem}}"></menu-item>
             </template>
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
             * @type string
             */
            labelAction: {
                type: String,
                value: 'save'
            },

            labelActionMenuItem: {
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

            layoutType: {
                notify: true,
                value: {
                    'dsign-menu-item-image': 'dsign-menu-item-image',
                    'dsign-menu-item-compress': 'dsign-menu-item-compress'
                }
            },

            showUpdateMenuItem: {
                notify: true,
                value: false
            },

            menuItemUpsertLabel: {
                type: String,
                value: 'menu-item-insert'
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
                    _authService: "Auth",
                    StorageContainerAggregate : {
                        _storage :"MenuStorage",
                        _resourceStorage :"ResourceStorage",
                        _organizationStorage :"OrganizationStorage",
                        _menuCategoryStorage :"MenuCategoryStorage",
                        _qrCodeGeneratorStorage: "QrCodeGeneratorStorage",
                        _uploadMenuResourceStorage: "UploadMenuResourceStorage"
                    }
                }
            },

            _merge: {
                readOnly: true
            },

            _resourceStorage: {
                readOnly: true
            },

            _organizationStorage: {
                readOnly: true
            },

            _uploadMenuResourceStorage: {
                readOnly: true,
            },

            _menuCategoryStorage: {
                readOnly: true,
            }
        };
    }

    /**
     * @inheritDoc
     */
    static get observers() {
        return [
            'changeOrganizationStorage(_organizationStorage, _authService)',
            '_changeLayoutType(layoutType, _localizeService)'
        ]
    }

    constructor() {
        super();
        this.resources = lang;
    }

    ready() {
        super.ready();
        this.$.formMenu.addEventListener('iron-form-presubmit', this.submitMenu.bind(this));
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
            this.showUpdateMenuItem = true;
        }
    }

    /**
     * @param value
     * @private
     */
    _changeLayoutType(value, service) {

        if (!value || !service) {
            return;
        }

        for (const property in value) {
            let el = document.createElement('paper-item');
            el.setAttribute('value', property);
            el.innerText = this.localize(value[property]);
            this.$.listboxLayoutType.appendChild(el);
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

    /**
     * @param storage
     * @param auth
     */
    changeOrganizationStorage(storage, auth) {
        if (!storage || !auth) {
            return;
        }

        if (auth.token) {
            this.loadRestaurant();
        }

        auth.eventManager.on(
            Auth.LOGIN,
            (evt) => {
                this.loadRestaurant();
            }
        );
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
     * @param evt
     */
    appendMenuItem(evt) {
        this.entity.appendMenuItem(evt.detail);
        this.$.items.render();
    }

    /**
     * @param evt
     */
    modifyMenuItem(evt) {

        let nodes = this.shadowRoot.querySelectorAll('menu-item');
        for (let index = 0; nodes.length > index; index++) {
            if (nodes[index].menuItem.id === evt.detail.id) {
                nodes[index].menuItem = evt.detail;
                break;
            }
        }

        this.labelActionMenuItem = 'save';
        this.menuItemUpsertLabel = 'menu-item-insert';
        this.$.items.render();
    }

    /**
     * @param evt
     * @private
     */
    _deleteMenuItem(evt) {
        let index = parseInt(evt.target.getAttribute('index'));
        this.entity.items.splice(index, 1);
        this.$.items.render();
    }

    /**
     * @param evt
     * @private
     */
    _updateMenuItem(evt) {

        this.menuItem = evt.detail;
        this.labelActionMenuItem = 'update'
        this.menuItemUpsertLabel = 'menu-item-update';
    }

    /**
     * @param {CustomEvent} evt
     */
    submitMenuButton(evt) {
        this.$.formMenu.submit();
        // TODO
        this._storage.getPaged(1,3,[]).then((data) => {
            //console.log('porco dio', data);
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
                    this.dispatchEvent(new CustomEvent('saved', {detail: data}));
                    this.entity = this._storage.getHydrator().hydrate({});
                    this.$.formMenu.reset();
                }

                this.notify(this.localize(method === 'save' ? 'notify-save' : 'notify-update'));
            });
    }

    /**
     * @param {CustomEvent} evt
     */
    uploadFile(evt) {

        let data = evt.detail;

        this._storage.update(this.entity)
            .then((entity) => {

                let requestData = {
                    menu_id: this.entity.id,
                    resource_menu_id: data.menuItem.id,
                    file:  data.file
                };

                this._uploadMenuResourceStorage.save(requestData)
                    .then((entity) => {

                        this.entity = entity;
                    }).catch((error) => {
                        console.error(error)
                });
            })
    };

    /**
     * @param evt
     */
    submitMenuItem(evt) {
        this.$.menuItemViewUpsert.submit();
    }
}

window.customElements.define('menu-view-upsert', MenuViewUpsert);