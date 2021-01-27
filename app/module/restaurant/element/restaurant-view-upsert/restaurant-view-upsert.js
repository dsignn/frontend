import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {NotifyMixin} from "@dsign/polymer-mixin/notify/notify-mixin";
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin";
import {Storage} from "@dsign/library/src/storage";
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
            
            .top {
                @apply --layout-horizontal;
            }
            
            #name {
                width: 100%;
            }
            
            #content-left {
                padding-right: 16px;
            }
            
            h2 {
                margin-top: 0;
                text-align: center;
            }
            
            #contentRight {
                 @apply --layout-vertical;
                 @apply --layout-center;
            }
            
            #stampButton {
                visibility: hidden;
            }
            
            paper-input-file {
               outline: none;
               color: var(--accent-color);
               --primary-text-color: var(--accent-color);
               --paper-input-container-color: var(--accent-color);
               --paper-input-container-focus-color: var(--accent-color);
               --paper-input-container-invalid-color: var(--accent-color);
               --paper-input-container-underline: {
                  border-bottom: 3px solid var(--paper-input-container-focus-color, var(--primary-color));
               };
            }
            
            .img {
                @apply --application-paper-card-left-content;
                @apply --layout-vertical;
                @apply --layout-end-justified;
                height: 300px;
                width: 300px;
                background-repeat: no-repeat;
                background-position: center center;
                background-size: contain;
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
                    @apply --layout-flex;pko
                }
                
                #contentRight {
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
                
                #contentRight {
                   @apply --layout-flex-3;
                }
            }
        </style>
        <slot name="header"></slot>
        <div id="container">
            <div id="content-left">
                <iron-form id="formRestaurant">
                    <form method="post">
                        <div class="top">
                            <paper-input id="name" name="name" label="{{localize('name-restaurant')}}" value="{{entity.name}}" on-value-changed="changeNameRestaurant" required></paper-input>
                            <paper-toggle-button checked="{{entity.open}}">{{localize('active-order')}}</paper-toggle-button>
                        </div>
                        <paper-input id="whatsappPhone" name="whatsappPhone" label="{{localize('whatsapp-phone')}}" value="{{entity.whatsappPhone}}" required></paper-input>
                        <paper-input 
                            id="url"
                            name="url"
                            label="{{localize('url')}}" 
                            value="{{url}}"
                            always-float-label
                            disabled>
                            <div class="url" slot="prefix">{{_config.app.menuPath}}/</div>
                        </paper-input>
                        <div class="action">
                            <paper-button on-tap="submitRestaurantButton">{{localize(labelAction)}}</paper-button>
                            <paper-button on-tap="generateQrCode">{{localize('generate-qrcode')}}</paper-button>
                            <paper-button id="stampButton" on-tap="openPrintable">{{localize('page-stamp')}}</paper-button>
                        </div>
                    </form>
                </iron-form>
            </div>
            <div id="contentRight">
                <div>
                    <h2>{{localize('qr-code')}}</h2>
                    <div id="qrCode" class="img">
                    </div>
                </div>
                <div style="margin-top: 8px;">
                    <h2>{{localize('logo')}}</h2>
                    <div id="logo" class="img">
                        <iron-form id="formResource">
                            <form method="post" style="padding: 0 8px;">
                                <paper-input-file id="file" value="{{file}}"></paper-input-file>
                            </form>
                        </iron-form>
                    </div>
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

            file: {
                type: Object,
                notify: true,
                observer: 'changedFile'
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
                        _qrCodeGeneratorStorage: "QrCodeGeneratorStorage",
                        _uploadOrganizationResourceStorage: "UploadOrganizationResourceStorage"
                    }
                }
            },

            _resourceStorage: {
                readOnly: true
            },

            _uploadOrganizationResourceStorage: {
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
        this.$.formResource.addEventListener('iron-form-presubmit', this.submitResource.bind(this));
        this.$.formRestaurant.addEventListener('iron-form-presubmit', this.submitRestaurant.bind(this));
    }

    /**
     * @param evt
     */
    openPrintable(evt) {
        let win = window.open(`${this._config.app.menuPath}/print-qrcode/${this.entity.id}`, '_blank');
        win.focus();
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
                this.entity = restaurant;
                this._storage.getEventManager().emit(Storage.POST_UPDATE, this.entity);
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
            this.$.logo.style.backgroundImage = null;
            this.$.qrCode.style.backgroundImage = null;
            return;
        }

        if (this.$.name.value) {
            this.$.name.dispatchEvent(new CustomEvent('value-changed', {detail: this.$.name}));
        }

        if (newValue && oldValue && newValue.id !== oldValue.id ) {
            this._updateQrCode();
            this._updateLogo();
        }

        if (newValue.hasQrCode()) {
            this.$.stampButton.style.visibility = 'visible';
        } else {
            this.$.stampButton.style.visibility = 'hidden';
        }

        if (!newValue.logo || !newValue.logo.id) {
            this.$.logo.style.backgroundImage = null;
        }

        if (!newValue.qrCode || !newValue.qrCode.id) {
            this.$.qrCode.style.backgroundImage = null;
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
            this._resourceStorage.get( this.entity.qrCode.id)
                .then((resource) => {
                    if (resource) {
                        this.$.qrCode.style.backgroundImage = `url(${resource.src}?cache=${(new Date()).getTime()})`;
                    }

                })
        }
    }

    /**
     * @param restaurant
     * @private
     */
    _updateLogo() {
        if ( this.entity.logo.id) {
            this._resourceStorage.get( this.entity.logo.id)
                .then((resource) => {
                    if (resource) {
                        this.$.logo.style.backgroundImage = `url(${resource.src}?cache=${(new Date()).getTime()})`;
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
     * @param value
     */
    changedFile(value) {
        if (!value) {
            return;
        }

        this.$.formResource.submit();
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

    /**
     * @param evt
     */
    submitResource(evt) {
        evt.preventDefault();

        let requestData = {
            organization_id: this.entity.id,
            file: this.$.file.files[0]
        };

        this._uploadOrganizationResourceStorage.save(requestData)
            .then((entity) => {

                this.entity = entity;
                this._updateLogo();
                setTimeout(
                    () => {
                        this.$.file.reset();
                    },
                    300
                );
                this._storage.getEventManager().emit(Storage.POST_UPDATE, this.entity);
            }).catch((error) => {
            console.error(error)
        });
    }
}

window.customElements.define('restaurant-view-upsert', RestaurantViewUpsert);