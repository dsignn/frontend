import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin"
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin"
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin"
import {lang} from './language';

/**
 * @customElement
 * @polymer
 */
class WorkingOrder extends StorageEntityMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
            <style >
                :host {
                    display: block;
                }

                paper-card {
                    @apply --layout-horizontal;
                    @apply --application-paper-card;
                    @apply --paper-card;
                }    

                .container {
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    height: 100%;
                }

                .list {
                    width: 25%;
                }

                .details {
                    width: 75%;
                }

                paper-order {
                    margin-bottom: 6px;
                }
            </style>
            <div class="container">
                <div class="list">
                    <h2>{{localize('list-order')}}</h2>
                    <template is="dom-repeat" items="[[orders]]" as="order">
                        <paper-order entity="{{order}}" on-delete="_deleteEntity" on-update="_showUpdateView" hide-crud="true"></paper-order>
                    </template>
                </div>
                <div class="details">
                    <h2>{{localize('detail-order')}}</h2>
                </div>
            </div>
        `
    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties () {
        return {
            /**
             * @object
             */
            services : {
                value : {
                    _localizeService: 'Localize',
                    _notify : "Notify",
                    StorageContainerAggregate: {
                        "_storage": "OrderStorage"
                    }
                }
            },

            /**
             * @type StorageInterface
             */
            _storage: {
                type: Object,
                readOnly: true,
                observer: 'changeStorage'
            },

            orders: { }
        }
    } 

    /**
     * @param {*} storage 
     * @returns 
     */
    changeStorage(storage) {

        if (!storage) {
            return;
        }

        storage.getAll({status: 'for-kitchen'})
            .then((data) => {

                this.orders = data;
            });
    }
}

window.customElements.define('working-order', WorkingOrder);