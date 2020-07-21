import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import {AclMixin} from "@dsign/polymer-mixin/acl/acl-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import "@polymer/paper-button/paper-button";
import "@polymer/paper-input/paper-input";
import "@polymer/iron-form/iron-form";
import {layout} from "../layout/dsing-layout";
import {lang} from './language';

/**
 * @DsignSignup
 */
class DsignSignup extends LocalizeMixin(AclMixin(ServiceInjectorMixin(PolymerElement))) {

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
      </style>
      <div id="signupUserContainer">
          <iron-form id="signupUser">
            <form method="post">
              <paper-input id="name" name="name" label="{{localize('name')}}" required></paper-input>
              <paper-input id="lastname" name="lastname" label="{{localize('lastname')}}" required></paper-input>
              <paper-input id="email" name="email" label="{{localize('email')}}" required></paper-input>
              <paper-input id="password" type="password" name="password" label="{{localize('password')}}" required></paper-input>
              <paper-input name="confirmPassword" type="password" label="{{localize('repeat-password')}}" required></paper-input>
              <div class="recover" on-tap="toggleRecoverButton">{{localize('recover-password')}}</div>
              <paper-button on-tap="submitSignupButton">{{localize('signup')}}</paper-button>
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

            services: {
                value: {
                    _notify: "Notify",
                    _localizeService: 'Localize',
                    StorageContainerAggregate: {
                        userStorage: "UserStorage",
                        recoverPasswordStorage: "RecoverPasswordStorage"
                    }
                }
            },

            userService: {
                readOnly: true
            },

            recoverPasswordStorage: {
                readOnly: true
            },
        };
    }

    ready() {
        super.ready();
        this.$.signupUser.addEventListener('iron-form-presubmit', this.submitSignup.bind(this));
        this.$.recoverPassword.addEventListener('iron-form-presubmit', this.submitRecoverPassword.bind(this));
    }

    /**
     * @param evt
     */
    submitSignupButton(evt) {
        this.$.signupUser.submit();
    }

    /**
     * @param evt
     */
    submitSignup(evt) {
        evt.preventDefault();

        this.userStorage.save(
            this.$.signupUser.serializeForm()
        ).then((data) => {
            this._notify.notify(this.localize('signup-ok'));
            this.$.signupUser.reset();
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

    /**
     * @param evt
     */
   toggleRecoverButton(evt) {
        this._setIsRecover(!this.isRecover);
        this.$.signupUserContainer.style.display = this.isRecover ? 'none' : 'block';
        this.$.recoverPasswordContainer.style.display = this.isRecover ? 'block' : 'none';
    }
}

window.customElements.define('dsign-signup', DsignSignup);