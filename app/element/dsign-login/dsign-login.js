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
      
      </style>
      <iron-form id="loginUser">
        <form method="post">
          <paper-input id="username" name="email"  label="{{localize('email')}}"></paper-input>
          <paper-input id="password" type="password" name="password" label="{{localize('password')}}"></paper-input>
          <paper-button on-tap="submitLoginButton">{{localize('login')}}</paper-button>
        </form>
      </iron-form>`;
    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties() {
        return {

            services : {
                value : {
                    _notify : "Notify",
                    _localizeService: 'Localize',
                    _authService: "Auth"
                }
            },

            _authService: {
                readOnly: true
            },
        };
    }

    ready() {
        super.ready();
        this.$.loginUser.addEventListener('iron-form-presubmit', this.submitLogin.bind(this));
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
}

window.customElements.define('dsign-login', DsignLogin);