import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {NotifyMixin} from "@dsign/polymer-mixin/notify/notify-mixin";
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin";
import '@polymer/paper-input/paper-input';
import '@fluidnext-polymer/paper-autocomplete/paper-autocomplete';
import '@polymer/iron-form/iron-form';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-tooltip/paper-tooltip';
import {lang} from './language';

/**
 * @class RestaurantViewUpsert
 */
class RestaurantViewUpsert extends StorageEntityMixin(NotifyMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement)))) {

    static get template() {
        return html`
        <style>
        
            #monitorUpdate {
                margin-bottom: 10px;
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
            
            #content-right {
                 @apply --layout-horizontal;
                justify-content: space-between;
            }
            
            img {
                height: 300px;
                width: 300px;
            }
            
            .action {
                @apply  --layout-horizontal;
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
                   @apply --layout-flex-8;
                }
                
                #content-right {
                   @apply --layout-flex-4;
                }
            }
        </style>
        <slot name="header"></slot>
        <div id="container">
            <div id="content-left">
                <iron-form id="formRestaurant">
                    <form method="post">
                        <paper-input id="name" name="name" label="{{localize('name')}}" value="{{entity.name}}" on-value-changed="changeNameRestaurant" required></paper-input>
                        <paper-input 
                            id="url"
                            name="url"
                            label="{{localize('url')}}" 
                            value="{{url}}"
                            always-float-label
                            disabled>
                            <div class="url" slot="prefix">{{_config.app.basePath}}menu/</div>
                        </paper-input>
                        <div class="action">
                            <paper-button on-tap="generateQrCode">{{localize('generate-qrcode')}}</paper-button>
                            <paper-button on-tap="submitRestaurantButton">{{localize(labelAction)}}</paper-button>
                        </div>
                    </form>
                </iron-form>
            </div>
            <div id="content-right">
                <div>
                    <h2>{{localize('qr-code')}}</h2>
                    <img id="qrCode">
                </div>
                <div>
                     <h2>{{localize('logo')}}</h2>
                    <img id="logo">
                </div>
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

            /**
             * @type object
             */
            services: {
                value: {
                    _localizeService: 'Localize',
                    _notifyService: 'Notify',
                    _slugify: "Slugify",
                    _config: "config",
                    StorageContainerAggregate : {
                        _storage :"OrganizationStorage",
                        _resourceStorage :"ResourceStorage",
                        _qrCodeGeneratorStorage: "QrCodeGeneratorStorage"
                    }
                }
            },

            _resourceStorage: {
                readOnly: true
            }
        };
    }

    constructor() {
        super();
        this.resources = lang;
    }

    ready() {
        super.ready();
        this.$.formRestaurant.addEventListener('iron-form-presubmit', this.submitRestaurant.bind(this));
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
                console.log('RESTAURANT', restaurant)
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
        this.$.qrCode.setAttribute('src', '');
        
        if (this.$.name.value) {
            this.$.name.dispatchEvent(new CustomEvent('value-changed', {detail: this.$.name}));
        }

        if (newValue && oldValue && newValue.id !== oldValue.id ) {
            this._updateQrCode();
        }

        if (newValue.id) {
            this.labelAction = 'update';
        }
    }

    /**
     * @param restaurant
     * @private
     */
    _updateQrCode() {
        if ( this.entity.qrCode.id) {
            console.log('update', this.entity.qrCode.id);
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
    submitRestaurantButton(evt) {
        this.$.formRestaurant.submit();
    }

    /**
     * @param evt
     */
    submitRestaurant(evt) {
        evt.preventDefault();

        let method = this.getStorageUpsertMethod();
        this._storage[method](this.entity)
            .then((data) => {

                if (method === 'save') {
                    this.entity = this._storage.getHydrator().hydrate({type: "text/html"});
                    this.$.formRestaurant.reset();
                }

                this.notify(this.localize(method === 'save' ? 'notify-save' : 'notify-update'));
            });
    }
}

window.customElements.define('restaurant-view-upsert', RestaurantViewUpsert);