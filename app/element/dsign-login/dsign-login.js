import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import {AclMixin} from "@dsign/polymer-mixin/acl/acl-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import "@polymer/paper-button/paper-button";
import "@polymer/paper-input/paper-input";
import {layout} from "../layout/dsing-layout";
import {lang} from './language';

/**
 * @class DsignLogin
 */
class DsignLogin extends LocalizeMixin(AclMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
      ${layout}
      <style>
        #recoverPasswordContainer {
            display: none;
        }
         .recover {
            text-align: left;
            font-size: 16px;
            text-transform: uppercase;
            padding: 10px 0;
            color: var(--default-primary-color);
            cursor: pointer;
        }
        
        .error {
            margin: 15px 0;
            height: 20px;
            text-align: left;
            letter-spacing: 0.176px;
            color:var(--error-color);
            font-size: 12px;
        }
        
        .action {
            @apply --layout-horizontal;
            @apply --layout-justified;
          /*  color: var(var(--error-color));*/
        }
        
        paper-input {
            text-align: left;
        }
      </style>
      <div id="loginUserContainer">
          <iron-form id="loginUser">
            <form method="post">
              <paper-input id="username" type="email" name="email" label="{{localize('email')}}" autocomplete="email"  error-message="{{localize('invalid-email')}}"></paper-input>       
              <paper-input id="password" type="password" name="password" label="{{localize('password')}}"  autocomplete="current-password"></paper-input>
              <div class="error">{{errorMessageLogin}}</div>       
              <div class="action">
                <div class="recover" on-tap="toggleRecoverButton">{{localize('recover-password')}}</div>
                <paper-button on-tap="submitLoginButton">{{localize('login')}}</paper-button>  
              </div>
            </form>
          </iron-form>
       </div>
      <div id="recoverPasswordContainer">
          <iron-form id="recoverPassword">
            <form method="post">
              <paper-input id="email" type="email" name="identifier" label="{{localize('email')}}" autocomplete="email"  error-message="{{localize('invalid-email')}}"></paper-input>
              <div class="error">{{errorMessageRecover}}</div>  
              <div class="action">
                <div class="recover" on-tap="toggleRecoverButton">{{localize('back')}}</div>
                <paper-button on-tap="submitRecoverPasswordButton">{{localize('recover-password')}}</paper-button>
              </div>
            </form>
          </iron-form>
      </div>`;
    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties() {
        return {

            isRecover: {
                type: Boolean,
                readOnly: true,
                value: false
            },

            errorMessageLogin: {
                notify: true
            },

            errorMessageRecover: {
                notify: true
            },

            services : {
                value : {
                    _notify : "Notify",
                    _localizeService: 'Localize',
                    _authService: "Auth",
                    StorageContainerAggregate: {
                        recoverPasswordStorage: "RecoverPasswordStorage"
                    }
                }
            },

            recoverPasswordStorage: {
                readOnly: true
            },

            _authService: {
                readOnly: true
            },
        };
    }

    ready() {
        super.ready();
        this.$.loginUser.addEventListener('iron-form-presubmit', this.submitLogin.bind(this));
        this.$.recoverPassword.addEventListener('iron-form-presubmit', this.submitRecoverPassword.bind(this));
    }

    /**
     * @param evt
     */
    submitLoginButton(evt) {
        this.errorMessageLogin = '';
        this.$.loginUser.submit();
    }

    /**
     * @param evt
     */
    submitLogin(evt) {
        evt.preventDefault();
        let data = this.$.loginUser.serializeForm();
        this._authService.login(data.email, data.password)
            .then((data) => {
            this._notify.notify(this.localize('login-ok'));
            this.errorMessageLogin = '';
            this.$.loginUser.reset();
        }).catch((error) => {
            switch (error.status) {
                case 404:
                case 400:
                    this.errorMessageLogin = this.localize('credential-not-found');
                    break;
                case 401:
                    this.errorMessageLogin = this.localize('account-not-verified');
                    break;
            }
        });
    }

    /**
     * @param evt
     */
    submitRecoverPasswordButton(evt) {
        this.errorMessageRecover = '';
        this.$.recoverPassword.submit();
    }

    /**
     * @param evt
     */
    submitRecoverPassword(evt) {
        evt.preventDefault();

        this.recoverPasswordStorage.save(
            this.$.recoverPassword.serializeForm()
        ).then((data) => {
            this._notify.notify(this.localize('recover-password-ok'));
            this.$.recoverPassword.reset();
            this.errorMessageRecover = '';
        }).catch((error) => {
            switch (error.status) {
                case 404:
                    this.errorMessageRecover = this.localize('email-not-found');
                    break;
            }
        });
    }

    toggleRecoverButton(evt) {
        this._setIsRecover(!this.isRecover);
        this.$.loginUserContainer.style.display = this.isRecover ? 'none' : 'block';
        this.$.recoverPasswordContainer.style.display = this.isRecover ? 'block' : 'none';
    }
}

window.customElements.define('dsign-login', DsignLogin);