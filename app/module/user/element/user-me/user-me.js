import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import {StoragePaginationMixin} from "@dsign/polymer-mixin/storage/pagination-mixin";
import {StorageCrudMixin} from "@dsign/polymer-mixin/storage/crud-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
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
class UserMe extends StoragePaginationMixin(StorageCrudMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement)))) {
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
                            <paper-input label="{{localize('name')}}" value="{{userData.name}}" ></paper-input>
                            <paper-input label="{{localize('surname')}}" value="{{userData.lastName}}" ></paper-input>
                        </div>
                    </div>
                    <paper-input label="{{localize('email')}}" value="{{userData.email}}"></paper-input>
                    <paper-input type="password" label="{{localize('password')}}"></paper-input>
                    <paper-input type="password" label="{{localize('repeat-password')}}"></paper-input>
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

}
window.customElements.define('user-me', UserMe);