import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import '@polymer/paper-input/paper-input';
import '@fluidnext-polymer/paper-autocomplete/paper-autocomplete';
import '@fluidnext-polymer/paper-chip/paper-chip';
import '@polymer/iron-form/iron-form';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-tooltip/paper-tooltip';
import {lang} from './language';
import {Flatten} from "../../../../src/transform/Flatten";
import {Auth} from "../../../../src/authentication/Auth";
import {TranslateTransform} from "../../../../src/util/TranslateTransform";

/**
 * @class RestaurantViewUpsert
 */
class MenuItemViewUpsert extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {

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
            
            paper-listbox {
                padding-right: 10px;
            }
            
            paper-item {
                width: max-content;
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

            .row {
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

            [w50] {
                flex-basis: 49.6%;
            }

            [w33] {
                flex-basis: 33.1%;
            }

            [w30] {
                flex-basis: 29.8%;
            }

            [w70] {
                flex-basis: 69.8%;
            }

            .space-b {
                justify-content: space-between;
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
        <iron-form id="formMenuItem">
            <form method="post">
                <div class="row space-b">
                    <paper-input value="{{menuItem.name.it}}" name="name[it]" label="{{localize('name-it')}}" required w50></paper-input>
                    <paper-input value="{{menuItem.name.en}}"  name="name[en]" label="{{localize('name-en')}}" w50></paper-input>
                </div>
                <paper-input value="{{menuItem.description.it}}" name="description[it]" label="{{localize('description-it')}}"></paper-input>
                <paper-input  value="{{menuItem.description.en}}" name="description[en]" label="{{localize('description-en')}}"></paper-input>
                <div class="row space-b">
                    <dsign-paper-dropdown-menu value="{{menuItem.category}}" id="category" name="category" label="{{localize('category')}}" required w33>
                        <paper-listbox slot="dropdown-content">
                            <template is="dom-repeat" items="[[categories]]" as="category">
                            <paper-item value="{{category}}">{{localize(category)}}</paper-item>
                            </template>
                        </paper-listbox>
                    </dsign-paper-dropdown-menu>
                    <div class="price" w33>
                        <paper-input value="{{menuItem.price.value}}" name="price[value]" label="{{localize('price')}}">
                            <iron-icon icon="restaurant:eur" slot="suffix"></iron-icon>
                        </paper-input>
                    </div>
                    <dsign-paper-dropdown-menu value="{{menuItem.status}}" id="status" name="status" label="{{localize('status')}}" required w33>
                        <paper-listbox slot="dropdown-content">
                            <template is="dom-repeat" items="[[status]]" as="state">
                            <paper-item value="{{state}}">{{localize(state)}}</paper-item>
                            </template>
                        </paper-listbox>
                    </dsign-paper-dropdown-menu>
                </div>
                <div class="row space-b">
                    <dsign-paper-dropdown-menu label="{{localize('type-dish')}}" id="typeDish" value="{{menuItem.typeDish}}" on-iron-select="changeStatus"  required w30>
                        <paper-listbox id="listboxStatus" slot="dropdown-content">
                            <template is="dom-repeat" items="[[typeDish]]" as="value">
                                <paper-item value="{{value}}">{{localize(value)}}</paper-item>
                            </template>
                        </paper-listbox>
                    </dsign-paper-dropdown-menu>
                    <div w70>
                        <dsign-paper-dropdown-menu id="allergen" label="{{localize('allergens')}}" on-iron-select="selectAllergen">
                            <paper-listbox id="listAllergens" slot="dropdown-content">
                                <template is="dom-repeat" items="[[allergens]]" as="allergen">
                                <paper-item value="{{allergen}}">{{localize(allergen)}}</paper-item>
                                </template>
                            </paper-listbox>
                        </dsign-paper-dropdown-menu>
                        <paper-chips id="tagChips" items="{{menuItem.allergens}}"></paper-chips>
                    </div>
                </div>
            </form>
        </iron-form>`;
    }

    static get properties() {
        return {

            /**
             * @type FileEntity
             */
            menuItem: {
                observer: '_changeEntity',
                value: {}
            },

            status: {
                notify: true,
                value: [
                    'available',
                    'over',
                    'not-available'
                ]
            },

            typeDish: {
                notify: true,
                value: [
                    'generic',
                    'vegetarian',
               //     'date',
                    'vegan'
                ]
            },

            services: {
                value: {
                    _localizeService: 'Localize',
                    _flattenService: 'Flatten',
                    _authService: "Auth",
                    _merge: "merge",
                    StorageContainerAggregate : {
                        _menuCategoryStorage :"MenuCategoryStorage",
                    },
                    HydratorContainerAggregate: {
                        _menuItemHydrator: "MenuItemHydrator"
                    }
                }
            },

            _flattenService: {
                readOnly: true
            },


            apiCategory: {
                observer: 'changeApiCategory'
            },

            apiAllergen: {
                observer: 'changeApiAllergen'
            }
        };
    }

    constructor() {
        super();
        this.resources = lang;
    }

    ready() {
        super.ready();
        this.$.formMenuItem.addEventListener('iron-form-presubmit', this.submitMenu.bind(this));
        this.$.tagChips.computeDataFn = this.translateAllergens.bind(this);
        this.$.tagChips.addEventListener('delete-item', this._controllAllergens.bind(this));
    }

    _changeEntity(entity) {
        console.log('CHANGE', entity);
        this._controllAllergens();
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    translateAllergens(data) {
        return this.localize(data);
    }

    /**
     *
     * @param value
     */
    changeApiCategory(value) {
        if (!value) {
            return;
        }

        this.resources = this._merge.merge(this.resources, TranslateTransform.entityFormatToElementFormat(value));
        this.categories = Object.keys(value);
    }

    translateAllergen(data) {
        // TODO check

        var translate = function(data) {
            console.log('translate', data);
            this._localizeService.loca
            return data;
        }.bind(this);
   
        return translate(data);
    }

        /**
     *
     * @param value
     */
    changeApiAllergen(value) {
        if (!value) {
            return;
        }

        this.resources = this._merge.merge(this.resources, TranslateTransform.entityFormatToElementFormat(value));
        this.allergens = Object.keys(value);
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
     * @param evt 
     */
    selectAllergen(evt) {

        console.log('select', evt);
        if(!this.menuItem.allergens) {
            this.menuItem.allergens = [];
        }

        let search = this.menuItem.allergens.find((value) => {
            return evt.detail.item.value === value
        });

        if (search) {
            console.warn('Allergen already set in menu');
            return;
        }

        this.menuItem.allergens.push(evt.detail.item.value);
        this.notifyPath('menuItem.allergens');
        this.$.tagChips.shadowRoot.querySelector('dom-repeat').render();
        this.$.allergen.reset();
        this._controllAllergens();
    }

    /**
     * 
     */
    _controllAllergens() {
       
        if (!Array.isArray(this.menuItem.allergens)) {
            console.warn('menuitem.allergens must be a array');
            return;
        }

        let nodes = this.$.listAllergens.querySelectorAll('paper-item');

        for(let index = 0; nodes.length > index; index++) {
            nodes[index].removeAttribute("disabled");
            for(let cont = 0; this.menuItem.allergens.length > cont; cont++) {
                if (nodes[index].value === this.menuItem.allergens[cont]) {
                    console.log('disable', nodes[index].value);
                    nodes[index].setAttribute('disabled', '');
                    break;
                }
            }
        }
    }

    /**
     *
     */
    _enbleAllergens()  {
        let nodes = this.$.listAllergens.querySelectorAll('paper-item');
        for(let index = 0; nodes.length > index; index++) { 
            nodes[index].removeAttribute("disabled");
        }
    }

    /**
     *
     */
    submit() {
        this.$.formMenuItem.submit();
    }

    /**
     * @param evt
     */
    submitMenu(evt) {
        evt.preventDefault();

        let data = this._flattenService.unFlatten(this.$.formMenuItem.serializeForm());
        let menuItemObj = JSON.parse(JSON.stringify(this.menuItem));
        let menuItem = this._menuItemHydrator.hydrate(menuItemObj);
        this._menuItemHydrator.hydrate(data, menuItem);
        let event = 'menu-item-save';

        // TODO best solution
        if (this.menuItem.id) {
            event = 'menu-item-update';
            menuItem.id = this.menuItem.id;
        }

        this.dispatchEvent(new CustomEvent(event, {'detail': menuItem}));

        this.$.status.reset();
        this.$.category.reset();
        this.$.typeDish.reset();
        this.menuItem = {
            allergens: []
        };
        this._enbleAllergens();
    }
}

window.customElements.define('menu-item-view-upsert', MenuItemViewUpsert);