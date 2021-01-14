import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import {AclMixin} from "@dsign/polymer-mixin/acl/acl-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {Storage} from "@dsign/library/src/storage/Storage";
import '../menu-item/menu-item'
import '@polymer/paper-item/paper-item'
import {lang} from "./language";
import {Auth} from "../../../../src/authentication/Auth";
import {Listener} from "@dsign/library/src/event/Listener";

/**
 * @ActivationCode
 */
class MenuActive extends LocalizeMixin(AclMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`       
        <style>
            
            :host {
                padding: 6px;
                display: block;
            }
                    
            #menuItemContainer {
                padding: 16px 0;
                @apply --layout-horizontal;
                @apply --layout-wrap;
            }
            
            .row {
                display: flex;
            }
            
            paper-input-color,
            dsign-paper-dropdown-menu {
                flex: 1;
            }
            
            .divider {
                width: 6px;
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
        </style>
        <div class="top">
            <paper-input  name="name" label="{{localize('name')}}" value="{{entity.name}}" disabled></paper-input>
        </div>
        <div class="row">
            <dsign-paper-dropdown-menu id="inputRestaurant" label="{{localize('restaurant')}}" value="{{entity.organization.id}}" disabled>
                <paper-listbox id="listboxRestaurant" slot="dropdown-content"></paper-listbox>
            </dsign-paper-dropdown-menu>
            <div class="divider"></div>
            <dsign-paper-dropdown-menu id="inputLayoutType" label="{{localize('layout-type')}}" value="{{entity.layoutType}}" disabled>
                <paper-listbox id="listboxLayoutType" slot="dropdown-content"></paper-listbox>
            </dsign-paper-dropdown-menu>
        </div>
        <div class="row">
            <paper-input-color name="backgroundHeader" label="{{localize('background-header')}}" value="{{entity.backgroundHeader}}" disabled></paper-input-color>
            <div class="divider"></div>
            <paper-input-color name="colorHeader" label="{{localize('background-header')}}" value="{{entity.colorHeader}}" disabled></paper-input-color>
        </div>
      
        <div id="menuItemContainer">
             <template id="items" is="dom-repeat" items="[[entity.items]]" as="menuItem">
                 <menu-item menu-item="{{menuItem}}" index$="{{index}}"></menu-item>
             </template>
        </div>`;
    }

    static get properties() {
        return {

            layoutType: {
                notify: true,
                value: {
                    'dsign-menu-item-image': 'dsign-menu-item-image',
                    'dsign-menu-item-compress': 'dsign-menu-item-compress'
                }
            },


            /**
             * @type FileEntity
             */
            entity: {
                value: null,
                notify: true
            },

            /**
             * @type object
             */
            services: {
                value: {
                    _localizeService: 'Localize',
                    _authService: "Auth",
                    StorageContainerAggregate : {
                        _organizationStorage :"OrganizationStorage",
                        _menuStorage :"MenuStorage",
                    }
                }
            },

            _menuStorage: {
                observer: '_menuStorageChanged'
            }
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
            'changeOrganizationStorage(_organizationStorage, _authService)',
            '_changeLayoutType(layoutType, _localizeService)'
        ]
    }

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
     * @param storage
     * @private
     */
    _menuStorageChanged(storage) {
        if (!storage) {
            return;
        }

        this.updateEntity = new Listener((evt) => {
            if (evt.data.enable) {
                this.entity = evt.data;
            }
        });

        this.deleteEntity = new Listener((evt) => {
            if (evt.data.enable) {
                this.entity = null;
            }
        });

        storage.getEventManager().on(Storage.POST_SAVE, this.updateEntity);
        storage.getEventManager().on(Storage.POST_UPDATE, this.updateEntity);
        storage.getEventManager().on(Storage.POST_REMOVE, this.deleteEntity);
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

                    if (this.entity) {

                        let id = this.entity.organization.id;
                        this.$.inputRestaurant.value = null;
                        this.$.inputRestaurant.value = id;
                    }
                }
            })
    };

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

        if (this.entity) {

            let type = this.entity.layoutType;
            this.$.inputLayoutType.value = null;
            this.$.inputLayoutType.value = type;
        }
    }
}

window.customElements.define('menu-active', MenuActive);
