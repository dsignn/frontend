import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import {AclMixin} from "@dsign/polymer-mixin/acl/acl-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import "@polymer/paper-button/paper-button";
import "@polymer/paper-input/paper-input";
import "@polymer/iron-form/iron-form";
import {lang} from './language';

/**
 * @ResetPassword
 */
class ResetPassword extends LocalizeMixin(AclMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
      <style>
        #resetPasswordContainer {
            padding: 6px;
            @apply --layout-vertical;
            @apply --layout-center;
        }
        
        #resetPassword {
            max-width: 1024px;
            width: 100%;
        }
        
        .action {
          margin-top: 20px;
          @apply --layout-horizontal;
          @apply  --layout-end-justified;
        }
      </style>
      <div id="resetPasswordContainer">
        <h2>{{localize('recover-password')}}</h2>
        <iron-form id="resetPassword">
          <form method="post">
            <paper-input id="token" name="token" value="{{token}}" hidden="hidden"></paper-input>
            <paper-input id="password" type="password" name="password" label="{{localize('password')}}"></paper-input>
            <paper-input name="confirmPassword" type="password" label="{{localize('repeat-password')}}"></paper-input>
            <div class="action" style="margin-top: 20px;">
              <paper-button on-tap="submitRecoverPasswordButton">{{localize('repeat-password')}}</paper-button>
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

            query: {
                notify: true,
                observer: 'queryChange'

            },

            token: {
                readOnly: true
            },

            services: {
                value: {
                    _notify: "Notify",
                    _localizeService: 'Localize',
                    StorageContainerAggregate: {
                        resetPasswordStorage: "ResetPasswordStorage"
                    }
                }
            },

            resetPasswordStorage: {
                readOnly: true
            },
        };
    }

    ready() {
        super.ready();
        this.$.resetPassword.addEventListener('iron-form-presubmit', this.submitRecoverPassword.bind(this));
    }

    /**
     * @param evt
     */
    submitRecoverPasswordButton(evt) {
        this.$.resetPassword.submit();
    }

    /**
     * @param evt
     */
    submitRecoverPassword(evt) {
        evt.preventDefault();

        this.resetPasswordStorage.save(
            this.$.resetPassword.serializeForm()
        ).then((data) => {
            this._notify.notify(this.localize('reset-password-ok'));
            this.$.resetPassword.reset();
        }).catch((error) => {
            console.log('ERROR', error);
        });
    }

    /**
     * @param query
     */
    queryChange(query) {
        if (query && query.token) {
            this._setToken(query.token);
        }
    }

}

window.customElements.define('reset-password', ResetPassword);