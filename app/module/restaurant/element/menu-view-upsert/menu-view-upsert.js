import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {NotifyMixin} from "@dsign/polymer-mixin/notify/notify-mixin";
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin";
import {MongoIdGenerator} from "@dsign/library/src/storage/util/MongoIdGenerator";
import {Auth} from "../../../../src/authentication/Auth";
import {MenuEntity} from "../../src/entity/MenuEntity";
import '@polymer/paper-input/paper-input';
import '@polymer/paper-input/paper-textarea';
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
import '../../../../element/paper-input-datepicker/paper-datepicker';
import '../../../../element/paper-input-datepicker/icons/paper-input-datepicker-icons';
import '../menu-item-view-upsert/menu-item-view-upsert';
import {lang} from './language';
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
                padding: var(--padding-top-view-list) 0;
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
            
            #content-left {
                  @apply --layout-flex-6;
            }
            
            #content-right {
                  @apply --layout-flex-6;
            }
            
            menu-item {
                flex-basis: 10%;
                
            }
            
            #statusDate {
                display: none;
            }
            
            paper-card {
                width: 100%;
                padding: 10px;
            }
            
            #preview,
            #printMenu {
                display: none;
            }
            
            paper-button {
                text-align: center;
            }
                  
            @media only screen and (max-width: 2600px) and (min-width: 2201px) {
                menu-item {
                    flex-basis: 12.5%;
                }
               
                paper-menu:nth-child(8n) { 
                    --paper-card : {
                       margin-right: 0;
                    }
                }
            }
    
            @media only screen and (max-width: 2200px) and (min-width: 1981px) {
                menu-item {
                    flex-basis: 14.27%;
                }
                
                menu-item:nth-child(7n) { 
                    --paper-card : {
                       margin-right: 0;
                    }
                }
            }  
           
            @media only screen and (max-width: 1980px) and (min-width: 1701px) {
                menu-item {
                    flex-basis: 16.6%;
                }
                
                menu-item:nth-child(6n) { 
                    --paper-card : {
                       margin-right: 0;
                    }
                }
            }  
                
            @media only screen and (max-width: 1700px) and (min-width: 1201px) {
                menu-item {
                    flex-basis: 20%;
                }
                
                menu-item:nth-child(5n) { 
                    --paper-card : {
                       margin-right: 0;
                    }
                }
            }  
    
            @media only screen and (max-width: 1200px) and (min-width: 971px) {
                menu-item {
                    flex-basis: 25%;
                }
               
                menu-item:nth-child(4n) { 
                    --paper-card : {
                       margin-right: 0;
                    }
                }
            }        
    
            @media only screen and (max-width: 970px) and (min-width: 771px) {
                menu-item {
                    flex-basis: 33.3%;
                }
                
                menu-item:nth-child(3n) { 
                    --paper-card : {
                       margin-right: 0;
                    }
                }
            }
                  
            @media only screen and (max-width: 770px) and (min-width: 501px) {
                menu-item {
                    flex-basis: 50%;
                }
                
                menu-item:nth-child(2n) { 
                    --paper-card : {
                       margin-right: 0;
                    }
                }
            }
           
            @media only screen and (max-width: 500px)  {
                 menu-item {
                    flex-basis: 100%;
                    --paper-card : {
                       margin-right: 0;
                    }
                }
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
            
             @media (max-width: 450px) {
                .action.main {
                     @apply  --layout-vertical;
       
                }
                
                .main paper-button {
                    margin: 0;
                    margin-top: 8px;
                }
            }
        </style>
        <slot name="header"></slot>
        <div id="container">
            <div id="content-left">
                <iron-form id="formMenu">
                    <form method="post">
                        <paper-input  name="name" label="{{localize('name-menu')}}" value="{{entity.name}}" required></paper-input>
                        <dsign-paper-dropdown-menu label="{{localize('restaurant')}}" value="{{entity.organization.id}}" required>
                            <paper-listbox id="listboxRestaurant" slot="dropdown-content"></paper-listbox>
                        </dsign-paper-dropdown-menu>
                        <div  class="action">
                            <dsign-paper-dropdown-menu label="{{localize('status')}}" value="{{entity.status}}" on-iron-select="changeStatus"  required>
                                <paper-listbox id="listboxStatus" slot="dropdown-content">
                                     <template is="dom-repeat" items="[[status]]" as="value">
                                       <paper-item value="{{value}}">{{localize(value)}}</paper-item>
                                    </template>
                                </paper-listbox>
                            </dsign-paper-dropdown-menu>
                            <!--<paper-toggle-button id="enableOrder" checked="{{entity.enableOrder}}"></paper-toggle-button>
                            <paper-tooltip for="enableOrder" position="left">{{localize('enable-order')}}</paper-tooltip>-->
                        </div>
                        <paper-datepicker name="statusDate" id="statusDate" label="{{localize('date-activation')}}" value="{{entity.statusDate}}"></paper-datepicker>
                        <dsign-paper-dropdown-menu label="{{localize('layout-type')}}" value="{{entity.layoutType}}" required>
                            <paper-listbox id="listboxLayoutType" slot="dropdown-content"></paper-listbox>
                        </dsign-paper-dropdown-menu>
                        <div  class="action">
                            <paper-input-color name="backgroundHeader" label="{{localize('background-header')}}" value="{{entity.backgroundHeader}}" required></paper-input-color>
                            <paper-input-color name="colorHeader" label="{{localize('color-header')}}" value="{{entity.colorHeader}}" required></paper-input-color>
                        </div>
                        <paper-textarea name="note" label="{{localize('note')}}" value="{{entity.note}}"></paper-textarea>
                        <div class="action main padding-top-52">
                            <paper-button on-tap="submitMenuButton">{{localize(labelAction)}}</paper-button>
                            <paper-button id="preview" on-tap="openPreview">{{localize('preview')}}</paper-button>
                            <paper-button id="printMenu" on-tap="openPrintMenu">{{localize('print-menu')}}</paper-button>
                        </div>
                    </form>
                </iron-form>
            </div>
            <div id="content-right">
                <paper-card>
                    <h2>{{localize(menuItemLabel)}}</h2>
                    <menu-item-view-upsert id="menuItemViewUpsert" on-menu-item-save="appendMenuItem" on-menu-item-update="modifyMenuItem" menu-item="{{menuItem}}" api-category="{{apiCategory}}" api-allergen="{{apiAllergen}}"></menu-item-view-upsert>
                    <div class="action">
                        <paper-button on-tap="submitMenuItem">{{localize(labelActionMenuItem)}}</paper-button>
                    </div>
                </paper-card>
            </div>
        </div>
        <h2>{{localize('menu-title')}}</h2>
        <div id="menuItemContainer">
             <template id="items" is="dom-repeat" items="[[entity.items]]" as="menuItem">
                 <menu-item menu-item="{{menuItem}}" index$="{{index}}" on-delete="_deleteMenuItem" on-update="_updateMenuItem" on-upload-file="uploadFile" show="{{showUpdateMenuItem}}" api-category="{{apiCategory}}" api-allergen="{{apiAllergen}}" show-crud></menu-item>
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
                value: 'add-item-menu'
            },

            categories: {
                notify: true,
            },

            status: {
                notify: true,
                value: [
                    'indoor',
                    'delivery',
               //     'date',
                    'disable'
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

            menuItemLabel: {
                type: String,
                value: 'menu-item-title'
            },


            apiCategory: {
                notify: true,
            },

            apiAllergen: {
                notify: true,
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
                        _menuAllergenStorage :"MenuAllergenStorage",
                        _qrCodeGeneratorStorage: "QrCodeGeneratorStorage",
                        _uploadMenuResourceStorage: "UploadMenuResourceStorage"
                    }
                }
            },

            _config: {
                observer: '_changeConfig',
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
            },

            _menuAllergenStorage: {
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
            '_changeLayoutType(layoutType, _localizeService)',
            'loadMenuCategory(_menuCategoryStorage, _merge)',
            'loadMenuAllergen(_menuAllergenStorage, _merge)'
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
     * @param loadMenuCategory
     * @param merge
     */
    loadMenuCategory(loadMenuCategory, merge) {
        if (!loadMenuCategory || !merge) {
            return;
        }

        this._menuCategoryStorage.getAll()
            .then((categories) => {
                this.apiCategory = categories;
                this.notifyPath('apiCategory');
            })
    }

    /**
     * @param loadMenuaAllergen 
     * @param merge 
     */
    loadMenuAllergen(loadMenuaAllergen, merge) {
        if (!loadMenuaAllergen || !merge) {
            return;
        }

        this._menuAllergenStorage.getAll()
            .then((allergens) => {
                this.apiAllergen = allergens;
                this.notifyPath('apiAllergen');
            })
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
            this.$.preview.style.display = 'none';
            this.$.printMenu.style.display = 'none';
            return;
        }

        if (newValue.id) {
            this.labelAction = 'update';
            this.showUpdateMenuItem = true;
            this.$.preview.style.display = 'block';
            this.$.printMenu.style.display = 'block';
        }

        if (newValue.status === MenuEntity.STATUS_DATE) {
            this.$.statusDate.style.display = 'block';
        } else {
            this.$.statusDate.style.display = 'none';
        }
    }

    changeStatus(evt) {

        if (evt.detail.item.value === MenuEntity.STATUS_DATE) {
            this.$.statusDate.style.display = 'block';
        } else {
            this.$.statusDate.style.display = 'none';
        }
    }

    /**
     * @param evt
     */
    openPreview(evt) {
        window.open(`${this._config.app.menuPath}/__previews?id=${this.entity.id}`,"_blank");
    }

    /**
     * @param evt
     */
     openPrintMenu(evt) {
        window.open(`${this._config.app.menuPath}/print-menu/${this.entity.id}?auth=${this._authService.token.access_token}`,"_blank");
    }

    /**
     * @param config
     * @private
     */
    _changeConfig(config) {
        if (!config) {
            return;
        }

        this._getCategories().then((data) => {
            this.allCategory = data;
        })
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

        evt.detail.id = MongoIdGenerator.statcGenerateId();
        this.entity.appendMenuItem(evt.detail);
        if (this.allCategory) {
            let tmp = this.sortFavorites( this.entity.items);
            this.entity.items = [];
            this.entity.items = tmp;
        }
        this.notifyPath('entity.items');
        this.$.items.render();
    }

    /**
     * @returns {Promise<unknown>}
     * @private
     */
    _getCategories() {

        return new Promise( (resolve, reject) => {
            let request = new XMLHttpRequest();

            request.addEventListener("load", (data) => {

                if (request.status >= 300) {
                    let response = {
                        status: request.status,
                        message: request.responseText
                    };

                    return reject(response)
                }
                resolve(JSON.parse(request.response));
            });

            request.open("GET", `${this._config.rest.path}/menu-category`);
            request.setRequestHeader('Accept','application/json');
            request.send();
        });
    }

    /**
     * @param favorites
     * @returns {[]}
     */
    sortFavorites(favorites) {
        let tmpFavorites = [];
        for (let property in this.allCategory) {
            for (let index = 0; favorites.length > index; index++) {
                if (favorites[index].category === property) {
                    tmpFavorites.push(favorites[index]);
                }
            }

        }
        return tmpFavorites;
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

        this.labelActionMenuItem = 'add-item-menu';

        if (this.allCategory) {
            let tmp = this.sortFavorites( this.entity.items);
            this.entity.items = [];
            this.entity.items = tmp;
        }
        this.notifyPath('entity.items');
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
        this.labelActionMenuItem = 'update-item-menu';
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
                    this.dispatchEvent(new CustomEvent('saved', {detail: data}));
                    this.$.formMenu.reset();

                    let elements = this.shadowRoot.querySelectorAll('dsign-paper-dropdown-menu');
                    elements.forEach(function(element) {
                        element.reset();
                    });
                    this.entity = this._storage.getHydrator().hydrate({});
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