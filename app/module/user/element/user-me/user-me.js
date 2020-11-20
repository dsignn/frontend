import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import {StorageCrudMixin} from "@dsign/polymer-mixin/storage/crud-mixin";
import {FormErrorMessage} from "../../../../element/mixin/form-error-message/form-error-message";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {Auth} from "../../../../src/authentication/Auth";
import "@polymer/paper-input/paper-input";
import "@polymer/iron-icon/iron-icon";
import "../../../../element/paper-select-language/paper-select-language";
import {lang} from './language';

/**
 * @customElement
 * @polymer
 */
class UserMe extends StorageCrudMixin(FormErrorMessage(ServiceInjectorMixin(PolymerElement))) {
    /**
     * @returns {HTMLTemplateElement}
     */
    static get template() {
        return html`
            <style>
            
                :host {
                    display: block;
                }
            
                .container {
                     @apply --layout-horizontal;
                }
                
                .avatar {
                    margin: 6px;      
                   flex-basis: 30%;
                   @apply --layout-vertical;
                   @apply --layout-center-center;
                }
                
                iron-icon {
                    height: 100%;
                    width: 100%;
                }
                
                .name {
                    padding-left: 8px;
                     @apply --layout-vertical;
                     @apply --layout-center-justified;
                     flex-basis: 70%;
                }
                
                .name .text {
                    @apply --layout;
                    @apply --layout-start;
                }

                .test {
                 background-color: red;
                }
            </style>
            <iron-form id="formUserMe">
                <form method="post">
                    <div class="container">
                        <div class="avatar">
                            <iron-icon icon="account"></iron-icon>
                        </div>
                        <div class="name">
                            <paper-input name="name" label="{{localize('name')}}" value="{{userData.name}}" ></paper-input>
                            <paper-input name="lastName" label="{{localize('surname')}}" value="{{userData.lastName}}" ></paper-input>
                        </div>
                    </div>
                    <paper-input name="email" label="{{localize('email')}}" value="{{userData.email}}"></paper-input>
                    <paper-input name="password" type="password" label="{{localize('password')}}"></paper-input>
                    <paper-input name="recoverPassword" type="password" label="{{localize('repeat-password')}}" skip></paper-input>
                    <!--<paper-select-language></paper-select-language>-->
                </form>
            </iron-form>`;
    }

    /**
     * @returns {object}
     */
    static get properties () {
        return {
            /**
             * @type object
             */
            services : {
                value : {
                    _localizeService: 'Localize',
                    _authService: "Auth",
                    _notify : "Notify",
                    StorageContainerAggregate: {
                        _storage: "UserStorage"
                    }
                }
            },

            _authService: {
                readOnly: true,
                observer: '_authServiceChanged'
            },

            userData: {
                readOnly: true,
            }
        }

    }

    /**
     * @constructor
     */
    constructor() {
        super();
        this.resources = lang;
    }

    /**
     * @inheritDoc
     */
    ready() {
        super.ready();
        this.$.formUserMe.addEventListener('iron-form-presubmit', this.submitUserMe.bind(this));
    }

    /**
     * @param service
     * @private
     */
    _authServiceChanged(service) {
        if (!service) {
            return;
        }

        service.eventManager.on(
            Auth.IDENTITY,
            () =>  {
                console.log('evento')
            }
        );

        if (service.getIdentity()) {
            this._setUserData(service.getIdentity());
        }
    }

    /***
     * @param evt
     */
    submitUserMe(evt) {
        evt.preventDefault();
        this._storage.adapter.updateMethod = 'PATCH';
        let data = this.getFormData(this.$.formUserMe);
        data.id = this.userData.id;

        this._storage.update(data)
            .then((data) => {

                this._storage.adapter.updateMethod = 'PUT';
                this._notify.notify(this.localize('notify-update'));
            })
            .catch((error) => {
                console.warn(error)
                this._storage.adapter.updateMethod = 'PUT';
            });

        console.log(this.getFormData(this.$.formUserMe));
        console.log('manda i dati', evt, this._storage);

    }

    /**
     *
     */
    updateUserData() {
        this.$.formUserMe.submit();
    }

}
window.customElements.define('user-me', UserMe);