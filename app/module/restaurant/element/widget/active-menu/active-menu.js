import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {Listener} from "@dsign/library/src/event/Listener";
import {Storage} from "@dsign/library/src/storage/Storage";
import "@polymer/paper-button/paper-button";
import "../../menu-active/menu-active";
import {lang} from "./language";

/**
 * @customElement
 * @polymer
 */
class ActiveMenu extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {

    static get template() {
        return html`
            <style >
                paper-card {
                    @apply --layout-horizontal;
                    @apply --application-paper-card;
                    @apply --paper-card;
                }
                
                .center {
                    text-align: center;
                }
    
            </style>
            <template is="dom-if" if="{{!isEntityMenu('general')}}">
                <div class="center">
                    <h2>{{localize('advice-message')}}</h2>
                </div>
                <div class="center">
                    <template is="dom-if" if="{{!isEntityMenu('hasMenu')}}">
                        <paper-button on-tap="goToMenu">{{localize('public-menu')}}</paper-button>
                    </template>
                    <template is="dom-if" if="{{!isEntityMenu('hasQrcode')}}">
                        <paper-button on-tap="goToRestaurant">{{localize('load-qrcode-restaurant')}}</paper-button>
                    </template>
                    <template is="dom-if" if="{{!isEntityMenu('hasLogo')}}">
                        <paper-button on-tap="goToRestaurant">{{localize('load-logo-restaurant')}}</paper-button>
                    </template>
                </div>
            </template>
            <template is="dom-if" if="{{isEntityMenu('hasMenu')}}">
                <div style="padding: 6px; font-size: 34px; text-align: center;">{{localize('active-menu')}}</div>
                <menu-active entity="{{entityMenu}}"></menu-active>
            </template>`
    }

    static get properties() {
        return {


            /**
             * @type FileEntity
             */
            entityMenu: {
                value: null,
                notify: true
            },

            entityRestaurant: {
                value: {},
                notify: true
            },

            /**
             * @type object
             */
            services: {
                value: {
                    _authService: "Auth",
                    _localizeService: 'Localize',
                    StorageContainerAggregate : {
                        _menuStorage :"MenuStorage",
                        _organizationStorage : "OrganizationStorage"
                    }
                }
            },

            _menuStorage: {
                readOnly: true,
                observer: '_menuStorageChanged'
            },

            _organizationStorage: {
                readOnly: true,
                observer: '_storageOrganizationChanged'
            },

            _authService : {
                type: Object,
                readOnly: true,
            },

            /**
             * @type Function
             */
            isEntityMenu : {
                type: Function,
                computed: '_computeEntity(_menuStorage, _organizationStorage, _authService, entityMenu, entityRestaurant)'
            }
        };
    }

    static get observers() {
        return [
            '_changeMenuStorage(_menuStorage, _authService)',
            '_changeOrganizationStorage(_organizationStorage, _authService)',
        ]
    }

    constructor() {
        super();
        this.resources = lang;
    }

    /**
     * @param obj
     * @returns {boolean}
     * @private
     */
    _isObject(obj) {
        return typeof obj === 'object' && obj !== null;
    }

    /**
     * @param entity
     * @private
     */
    _computeEntity(storageMenu, organizationStorage, authService, entityMenu, entityRestaurant) {
        return (type) => {
            if (!storageMenu || !authService || !organizationStorage) {
                return false;
            }

            switch (type) {
                case 'general':
                    return !!entityMenu && this._isObject(entityRestaurant) && entityRestaurant.qrCode && !!entityRestaurant.qrCode.id &&  entityRestaurant.logo && !!entityRestaurant.logo.id;
                case 'hasMenu':
                    return !!entityMenu;
                case 'hasQrcode':
                    return this._isObject(entityRestaurant) && entityRestaurant.qrCode && !!entityRestaurant.qrCode.id;
                case 'hasLogo':
                    return this._isObject(entityRestaurant) && entityRestaurant.logo && !!entityRestaurant.logo.id;
                default:
                    console.warn('error call fuction');
                    return false;
            }
        }
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
                this.entityMenu = evt.data;
                this.notifyPath('entityMenu');
            } else if (this.entityMenu && this.entityMenu.id === evt.data.id) {
                this.entityMenu = null;
            }
        });

        this.deleteEntity = new Listener((evt) => {
            if (evt.data.enable) {
                this.entityMenu = null;
            }
        });

        storage.getEventManager().on(Storage.POST_SAVE, this.updateEntity);
        storage.getEventManager().on(Storage.POST_UPDATE, this.updateEntity);
        storage.getEventManager().on(Storage.POST_REMOVE, this.deleteEntity);
    }

    /**
     * @param storage
     * @private
     */
    _storageOrganizationChanged(storage) {
        if (!storage) {
            return;
        }

        this.updateOrganizzationEntity = new Listener((evt) => {
            console.log('test')
            if (this.entityRestaurant  && evt.data.id ===  this.entityRestaurant.id) {
                this.entityRestaurant = evt.data;
                this.notifyPath('entityRestaurant');
            }
        });

        storage.getEventManager().on(Storage.POST_SAVE, this.updateOrganizzationEntity);
        storage.getEventManager().on(Storage.POST_UPDATE, this.updateOrganizzationEntity);
    }

    /**
     *
     * @param storage
     * @param authService
     * @returns {*}
     * @private
     */
    _changeMenuStorage(storage, authService) {
        if (!storage || !authService) {
            return;
        }
        this.checkMenu();
    }

    _changeOrganizationStorage(storage, authService) {
        if (!storage || !authService) {
            return;
        }

        if(authService.getIdentity() && authService.getIdentity()['organizations'] && authService.getIdentity()['organizations'][0] && authService.getIdentity()['organizations'][0].id) {
            this.getOrganization(authService.getIdentity()['organizations'][0].id);
        }
    }

    /**
     * @param evt
     */
    checkMenu(evt) {
        this._menuStorage.getAll({enable:true}).then((data) => {
            if (data.length > 0) {
                this.entityMenu = data[0];
            }
        });
    }

    /**
     * @param id
     */
    getOrganization(id) {
        this._organizationStorage.get(id).then((entity) => {
            this.entityRestaurant = entity;
        });
    }

    /**
     * @param evt
     */
    goToMenu(evt) {

        let restaurantIndex = document.querySelector('dsign-app').shadowRoot.querySelector('restaurant-index');
        restaurantIndex.selectedTab = 1;
        restaurantIndex.selectedMenu = 1;

        let router = document.querySelector('dsign-app').shadowRoot.querySelector('app-route');
        router.route = {
            prefix: "",
            path: "/restaurant"
        };
    }

    goToRestaurant(evt) {
        let paperRestaurant = document.querySelector('dsign-app')
            .shadowRoot.querySelector('restaurant-index')
            .shadowRoot.querySelector('restaurant-view-list')
            .shadowRoot.querySelector('paper-restaurant');

        paperRestaurant.dispatchEvent(new CustomEvent('update', {detail: paperRestaurant.entity}));

        let restaurantIndex = document.querySelector('dsign-app').shadowRoot.querySelector('restaurant-index');
        restaurantIndex.selectedTab = 0;

        let router = document.querySelector('dsign-app').shadowRoot.querySelector('app-route');
        router.route = {
            prefix: "",
            path: "/restaurant"
        };
    }
}


window.customElements.define('active-menu', ActiveMenu);