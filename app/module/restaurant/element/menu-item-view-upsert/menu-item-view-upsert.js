import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import '@polymer/paper-input/paper-input';
import '@fluidnext-polymer/paper-autocomplete/paper-autocomplete';
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
        <iron-form id="formMenuItem">
            <form method="post">
                 <paper-input value="{{menuItem.name.it}}" name="name[it]" label="{{localize('name-dish')}}" required></paper-input>
                 <!--<paper-input name="name[en]" label="{{localize('name-en')}}" required></paper-input>-->
                 <paper-input value="{{menuItem.description.it}}" name="description[it]" label="{{localize('description')}}" required></paper-input>
                 <!--<paper-input name="description[en]" label="{{localize('description-en')}}" required></paper-input>-->
                 <dsign-paper-dropdown-menu value="{{menuItem.category}}" id="category" name="category" label="{{localize('category')}}" required>
                    <paper-listbox slot="dropdown-content">
                        <template is="dom-repeat" items="[[categories]]" as="category">
                           <paper-item value="{{category}}">{{localize(category)}}</paper-item>
                        </template>
                    </paper-listbox>
                 </dsign-paper-dropdown-menu>
                 <div class="price">
                    <paper-input value="{{menuItem.price.value}}" type="number" name="price[value]" label="{{localize('price')}}">
                        <iron-icon icon="restaurant:eur" slot="suffix"></iron-icon>
                    </paper-input>
                 </div>
                 <dsign-paper-dropdown-menu value="{{menuItem.status}}" id="status" name="status" label="{{localize('status')}}" required>
                    <paper-listbox slot="dropdown-content">
                        <template is="dom-repeat" items="[[status]]" as="state">
                           <paper-item value="{{state}}">{{localize(state)}}</paper-item>
                        </template>
                    </paper-listbox>
                 </dsign-paper-dropdown-menu>
            </form>
        </iron-form>`;
    }

    static get properties() {
        return {

            /**
             * @type FileEntity
             */
            menuItem: {
              //  observer: '_changeEntity',
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
        this.$.formMenuItem.addEventListener('iron-form-presubmit', this.submitMenu.bind(this));
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
                this.resources = this._merge.merge(
                    this.resources,
                    TranslateTransform.entityFormatToElementFormat(categories)
                );
                this.categories = Object.keys(categories);
            })
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
        let menuItem = this._menuItemHydrator.hydrate(data);
        let event = 'menu-item-save';

        // TODO best solution
        if (this.menuItem.id) {
            event = 'menu-item-update';
            menuItem.id = this.menuItem.id;
        }

        this.dispatchEvent(new CustomEvent(event, {'detail': menuItem}));
        this.$.formMenuItem.reset();
        this.$.status.reset();
        this.$.category.reset();
        this.menuItem = {};
    }
}

window.customElements.define('menu-item-view-upsert', MenuItemViewUpsert);