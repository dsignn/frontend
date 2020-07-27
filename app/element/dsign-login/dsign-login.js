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
            font-size: 14px;
            padding: 10px 0;
            color: #32b0ff;
            cursor: pointer;
        }
        
        paper-input {
            text-align: left;
        }
      </style>
      <div id="loginUserContainer">
          <iron-form id="loginUser">
            <form method="post">
              <paper-input id="username" name="email"  label="{{localize('email')}}"></paper-input>
              <paper-input id="password" type="password" name="password" label="{{localize('password')}}"></paper-input>
              <div class="recover" on-tap="toggleRecoverButton">{{localize('recover-password')}}</div>
              <paper-button on-tap="submitLoginButton">{{localize('login')}}</paper-button>  
            </form>
          </iron-form>
       </div>
      <div id="recoverPasswordContainer">
          <iron-form id="recoverPassword">
            <form method="post">
              <paper-input id="email" name="identifier" label="{{localize('email')}}" ></paper-input>
              <div class="recover" on-tap="toggleRecoverButton">{{localize('back')}}</div>
              <paper-button on-tap="submitRecoverPasswordButton">{{localize('recover-password')}}</paper-button>
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
        this.$.loginUser.submit();
    }

    /**
     * @param evt
     */
    submitLogin(evt) {
        evt.preventDefault();
        let data = this.$.loginUser.serializeForm();
        console.log(data);
        this._authService.login(data.email, data.password)
            .then((data) => {
            this._notify.notify(this.localize('login-ok'));
            this.$.loginUser.reset();
        }).catch((error) => {
            console.log('ERROR', error);
        });
    }

    /**
     * @param evt
     */
    submitRecoverPasswordButton(evt) {
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
        }).catch((error) => {
            console.log('ERROR', error);
        });
    }

    toggleRecoverButton(evt) {
        this._setIsRecover(!this.isRecover);
        this.$.loginUserContainer.style.display = this.isRecover ? 'none' : 'block';
        this.$.recoverPasswordContainer.style.display = this.isRecover ? 'block' : 'none';
    }
}

window.customElements.define('dsign-login', DsignLogin);