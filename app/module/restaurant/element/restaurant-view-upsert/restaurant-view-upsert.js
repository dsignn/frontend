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
import {FormErrorMessage} from "../../../../element/mixin/form-error-message/form-error-message";

/**
 * @class RestaurantViewUpsert
 */
class RestaurantViewUpsert extends FormErrorMessage(StorageEntityMixin(NotifyMixin(ServiceInjectorMixin(PolymerElement)))) {

    static get template() {
        return html`
        <style>
        
            #monitorUpdate {
                margin-bottom: 10px;
            }
        
            #container {
                @apply --layout-vertical;
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
                 @apply --layout-horizontal;
                 @apply --layout-center;
                 @apply --layout-justified;
            }
            
            .img-container {
                 @apply --layout-vertical;
                 @apply --layout-center;
            }
            
            #stampButton,
            #stampButtonDelivery {
                visibility: hidden;
            }
            
            #prefix {
                width: 100px;
                margin-right: 6px;
            }
            
            #whatsappPhone {
                flex: 1;
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
            
            @media (max-width: 1050px) {
                .img {
                    height: 200px;
                    width: 200px;
                }
            }
        
            @media (max-width: 900px) {
      
            
                #content-left {
                    @apply --layout-flex;pko
                }
                
                #contentRight {
                    @apply --layout-flex;
                }
            }
            
            @media (max-width: 750px) {
                .img {
                    height: 300px;
                    width: 300px;
                }
                
                #contentRight {
                     @apply  --layout-vertical;
                }
            }
               
                       
            @media (max-width: 450px) {
                .action {
                     @apply  --layout-vertical;
       
                }
                
                paper-button {
                    margin-top: 8px;;
                }
            }
        </style>
        <slot name="header"></slot>
        <div id="container">
           <div id="contentRight">
                <div class="img-container">
                    <h2>{{localize('qr-code-standard')}}</h2>
                    <div id="qrCode" class="img"></div>
                    <div class="action" style="margin-top: 8px;">
                        <paper-button on-tap="generateQrCodeStandard">{{localize('generate-qrcode')}}</paper-button>
                        <paper-button id="stampButton" on-tap="openPrintableStandard">{{localize('page-stamp')}}</paper-button>
                    </div>
                </div>
                <div class="img-container">
                    <h2>{{localize('qr-code-delivery')}}</h2>
                    <div id="qrCodeDelivery" class="img"></div>
                    <div class="action" style="margin-top: 8px;">
                        <paper-button on-tap="generateQrCodeDelivery">{{localize('generate-qrcode')}}</paper-button>
                        <paper-button id="stampButtonDelivery" on-tap="openPrintableDelivery">{{localize('page-stamp')}}</paper-button>
                    </div>
                </div>
                <div class="img-container" style="margin-top: 8px;">
                    <h2>{{localize('logo')}}</h2>
                    <div id="logo" class="img">
                        <iron-form id="formResource">
                            <form method="post" style="padding: 0 8px;">
                                <paper-input-file id="file" value="{{file}}"></paper-input-file>
                            </form>
                        </iron-form>
                    </div>
                    <div class="action" style="margin-top: 8px;"></div>
                </div>
            </div>
            <div id="content-left">
                <iron-form id="formRestaurant">
                    <form method="post">
                        <paper-input id="name" name="name" label="{{localize('name-restaurant')}}" value="{{entity.name}}" on-value-changed="changeNameRestaurant" required></paper-input>
                        <div class="action">
                          <dsign-paper-dropdown-menu id="prefix" value="{{entity.whatsappPhone.prefix}}" id="category" name="category" label="{{localize('prefix')}}" required>
                            <paper-listbox slot="dropdown-content">
                                <template is="dom-repeat" items="[[prefixes]]" as="prefix">
                                   <paper-item value="{{prefix}}">{{prefix}}</paper-item>
                                </template>
                            </paper-listbox>
                          </dsign-paper-dropdown-menu>
                          <!--<paper-input id="prefix" name="prefix" label="{{localize('prefix')}}" value="{{entity.whatsappPhone.prefix}}"></paper-input>-->
                          <paper-input id="whatsappPhone" type="number" name="whatsappPhone" label="{{localize('whatsapp-phone')}}" value="{{entity.whatsappPhone.number}}"></paper-input>
                        </div>
                        <paper-input id="siteUrl" name="siteUrl" label="{{localize('site-url')}}" value="{{entity.siteUrl}}"></paper-input>
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
                        </div>
                    </form>
                </iron-form>
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

            prefixes: {
                type: Array,
                notify: true,
                value: [
                    "+39",
                    "+44",
                    "+1",
                    "+213",
                    "+376",
                    "+244",
                    "+1264",
                    "+1268",
                    "+54",
                    "+374",
                    "+297",
                    "+61",
                    "+43",
                    "+994",
                    "+1242",
                    "+973",
                    "+880",
                    "+1246",
                    "+375",
                    "+32",
                    "+501",
                    "+229",
                    "+1441",
                    "+975",
                    "+591",
                    "+387",
                    "+267",
                    "+55",
                    "+673",
                    "+359",
                    "+226",
                    "+257",
                    "+855",
                    "+237",
                    "+238",
                    "+1345",
                    "+236",
                    "+56",
                    "+86",
                    "+57",
                    "+269",
                    "+242",
                    "+682",
                    "+506",
                    "+385",
                    "+53",
                    "+90392",
                    "+357",
                    "+42",
                    "+45",
                    "+253",
                    "+1809",
                    "+593",
                    "+20",
                    "+503",
                    "+240",
                    "+291",
                    "+372",
                    "+251",
                    "+500",
                    "+298",
                    "+679",
                    "+358",
                    "+33",
                    "+594",
                    "+689",
                    "+241",
                    "+220",
                    "+7880",
                    "+49",
                    "+233",
                    "+350",
                    "+30",
                    "+299",
                    "+1473",
                    "+590",
                    "+671",
                    "+502",
                    "+224",
                    "+245",
                    "+592",
                    "+509",
                    "+504",
                    "+852",
                    "+36",
                    "+354",
                    "+91",
                    "+62",
                    "+98",
                    "+964",
                    "+353",
                    "+972",
                    "+1876",
                    "+81",
                    "+962",
                    "+7",
                    "+254",
                    "+686",
                    "+850",
                    "+82",
                    "+965",
                    "+996",
                    "+856",
                    "+371",
                    "+961",
                    "+266",
                    "+231",
                    "+218",
                    "+417",
                    "+370",
                    "+352",
                    "+853",
                    "+389",
                    "+261",
                    "+265",
                    "+60",
                    "+960",
                    "+223",
                    "+356",
                    "+692",
                    "+596",
                    "+222",
                    "+52",
                    "+691",
                    "+373",
                    "+377",
                    "+976",
                    "+1664",
                    "+212",
                    "+258",
                    "+95",
                    "+264",
                    "+674",
                    "+977",
                    "+31",
                    "+687",
                    "+64",
                    "+505",
                    "+227",
                    "+234",
                    "+683",
                    "+672",
                    "+670",
                    "+47",
                    "+968",
                    "+680",
                    "+507",
                    "+675",
                    "+595",
                    "+51",
                    "+63",
                    "+48",
                    "+351",
                    "+1787",
                    "+974",
                    "+262",
                    "+40",
                    "+250",
                    "+378",
                    "+239",
                    "+966",
                    "+221",
                    "+381",
                    "+248",
                    "+232",
                    "+65",
                    "+421",
                    "+386",
                    "+677",
                    "+252",
                    "+27",
                    "+34",
                    "+94",
                    "+290",
                    "+1869",
                    "+1758",
                    "+249",
                    "+597",
                    "+268",
                    "+46",
                    "+41",
                    "+963",
                    "+886",
                    "+66",
                    "+228",
                    "+676",
                    "+1868",
                    "+216",
                    "+90",
                    "+993",
                    "+1649",
                    "+688",
                    "+256",
                    "+380",
                    "+971",
                    "+598",
                    "+678",
                    "+379",
                    "+58",
                    "+84",
                    "+681",
                    "+969",
                    "+967",
                    "+260",
                    "+263",
                ]
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
                    StorageContainerAggregate: {
                        _storage: "OrganizationStorage",
                        _resourceStorage: "ResourceStorage",
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
     *
     * @param isDelivery
     * @private
     */
    _openPrintable(isDelivery) {
        let win = window.open(`${this._config.app.menuPath}/print-qrcode/${this.entity.id}${isDelivery ? '?delivery' : ''}`, '_blank');
        win.focus();
    }

    /**
     * @param evt
     */
    openPrintableDelivery(evt) {
        this._openPrintable(true);
    }

    /**
     * @param evt
     */
    openPrintableStandard(evt) {
        this._openPrintable(false);
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
    generateQrCodeStandard(evt) {
        this._generateQrCode(false);
    }

    /**
     * @param evt
     */
    generateQrCodeDelivery(evt) {
        this._generateQrCode(true);
    }

    /**
     *
     * @param {boolean} isDelivery
     */
    _generateQrCode(isDelivery) {

        this._qrCodeGeneratorStorage.get(this.entity.id + (isDelivery ? '?delivery' : ''))
            .then((restaurant) => {
                this.entity = restaurant;
                this._storage.getEventManager().emit(Storage.POST_UPDATE, this.entity);
                this._updateQrCode();
                this._updateQrCodeDelivery();
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

        if (newValue && oldValue && newValue.id !== oldValue.id) {
            this._updateQrCode();
            this._updateQrCodeDelivery();
            this._updateLogo();
        }

        if (newValue.hasQrCode()) {
            this.$.stampButton.style.visibility = 'visible';
        } else {
            this.$.stampButton.style.visibility = 'hidden';
        }

        if (newValue.hasQrCodeDelivery()) {
            this.$.stampButtonDelivery.style.visibility = 'visible';
        } else {
            this.$.stampButtonDelivery.style.visibility = 'hidden';
        }


        if (!newValue.logo || !newValue.logo.id) {
            this.$.logo.style.backgroundImage = 'url(https://dsign-asset.s3.eu-central-1.amazonaws.com/dish-not-found.png)';
        }

        if (!newValue.qrCode || !newValue.qrCode.id) {
            this.$.qrCode.style.backgroundImage = null;
        }

        if (!newValue.qrCodeDelivery || !newValue.qrCodeDelivery.id) {
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
        if (this.entity.qrCode.id) {
            this._resourceStorage.get(this.entity.qrCode.id)
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
    _updateQrCodeDelivery() {
        if (this.entity.qrCodeDelivery.id) {
            this._resourceStorage.get(this.entity.qrCodeDelivery.id)
                .then((resource) => {
                    if (resource) {
                        this.$.qrCodeDelivery.style.backgroundImage = `url(${resource.src}?cache=${(new Date()).getTime()})`;
                    }

                })
        }
    }

    /**
     * @param restaurant
     * @private
     */
    _updateLogo() {
        if (this.entity.logo.id) {
            this._resourceStorage.get(this.entity.logo.id)
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
            }).catch((error) => {
            this.errorMessage(this.$.formRestaurant, error);
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