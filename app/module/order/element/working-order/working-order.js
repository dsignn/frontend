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

                .container-order {
                    min-height: 260px;
                    overflow-y: scroll;
                }

                .list {
                    width: 25%;
                }

                .details {
                    width: 75%;
                    padding-left: 8px;
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: row;
                    align-content: flex-start;
                }

                paper-order-item {
                    width: 19.4%;
                    margin-bottom: 6px;
                    margin-right: 6px;
                }

                paper-order {
                    margin-bottom: 6px;
                }
            </style>
            <div class="container">
                <div class="list">
                    <paper-input id="selected" label="{{localize('selected-order')}}"></paper-input>
                    <div id="list" class="container-order">
                        <template is="dom-repeat" items="[[orders]]" as="order">
                            <paper-order entity="{{order}}" on-select="_selectEntity" small enable-action='{"modify":false,"select":true}'></paper-order>
                        </template>
                    </div>
                </div>
                <div class="details">
                    <template id="listItems" is="dom-repeat" items="[[entitySelected.items]]" as="ordered">
                        <paper-order-item item="{{ordered}}" on-update="updateView"></paper-order-item>
                    </template>
                </div>
            </div>
        `
    }

    constructor() {
        super();
        this.resources = lang;
        window.addEventListener("resize", (evt) => {
            this._resizeList();
        });
    }

    connectedCallback() {
        super.connectedCallback();
        this._resizeList();
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

            entitySelected: {
                notify: true,
                observer: 'changeEntitySelected'
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

        this._pollingKitchen()
    }

    /**
     * 
     */
    _pollingKitchen() {
        setInterval( 
            () => {
                console.log('Polling kitchen');
                this._storage.getAll({status: 'for-kitchen'})
                .then((data) => {
    
                    this.orders = data;
                });
            },
            5000
        );
    }

    /**
     * 
     */
    _resizeList() {
        this.$.list.style.height = (window.innerHeight - 64 -36 - 48 -6 - 40 - 10) + 'px'
    }

    /**
     * @param {Event} evt 
     */
    _selectEntity(evt) {
        this.entitySelected = evt.detail;
        let paperButton =  evt.target.shadowRoot.querySelector('paper-menu-button');
        paperButton.close();
    }

    /**
     * @param {object} newEntity 
     */
    changeEntitySelected(newEntity) {
        //console.log('fffffffffffff', newEntity);
        this.$.selected.value = newEntity.name;
    }
}

window.customElements.define('working-order', WorkingOrder);