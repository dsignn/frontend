import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import "@polymer/paper-button/paper-button";

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
            <template is="dom-if" if="{{!isEntity()}}">
                <div class="center">
                    <h2>Non hai ancora pubblicato il tuo menù corri a crearlo</h2>
                </div>
                <div class="center">
                    <paper-button on-tap="goToMenu">Vai</paper-button>
                </div>
            </template>
            <template is="dom-if" if="{{isEntity()}}">
                trovato
            </template>`
    }

    static get properties() {
        return {


            /**
             * @type FileEntity
             */
            entity: {
                value: null
            },

            /**
             * @type object
             */
            services: {
                value: {
                    StorageContainerAggregate : {
                        _storage :"MenuStorage"
                    },
                    _authService: "Auth",
                }
            },

            _storage: {
                readOnly: true,
            },

            _authService : {
                type: Object,
                readOnly: true,
            },

            /**
             * @type Function
             */
            isEntity : {
                type: Function,
                computed: '_computeEntity(_storage, _authService, entity)'
            }
        };
    }

    static get observers() {
        return [
            '_changeStorage(_storage, _authService)',
        ]
    }

    /**
     * @param entity
     * @private
     */
    _computeEntity(storage, authService, entity) {
        return () => {
            if (!storage || !authService) {
                return false;
            }
console.log('test', entity);
            return !!entity;
        }
    }

    /**
     *
     * @param storage
     * @param authService
     * @returns {*}
     * @private
     */
    _changeStorage(storage, authService) {
        if (!storage || !authService) {
            return;
        }
        this.checkMenu();
    }

    /**
     * @param evt
     */
    checkMenu(evt) {
        this._storage.getAll({enable:true}).then((data) => {
            if (data.length > 0) {
                this.entity = data[0];
                console.log('fffff');
            }
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
}


window.customElements.define('active-menu', ActiveMenu);