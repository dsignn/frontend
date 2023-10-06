import { html, PolymerElement } from "@polymer/polymer/polymer-element";
import { AclMixin } from "@dsign/polymer-mixin/acl/acl-mixin";
import { ServiceInjectorMixin } from "@dsign/polymer-mixin/service/injector-mixin";
import { FormErrorMessage } from "../mixin/form-error-message/form-error-message";
import "@polymer/paper-button/paper-button";
import "@fluidnext-polymer/paper-autocomplete/paper-autocomplete";
import "@polymer/paper-input/paper-input";
import "@polymer/iron-form/iron-form";
import { layout } from "../layout/dsing-layout";
import { lang } from './language';

/**
 * @DsignSignup
 */
class DsignSignup extends FormErrorMessage(AclMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
      ${layout}
      <style>
      
         :host paper-input[disabled] {

          --paper-input-container-disabled: {
            opacity: 0.7;
          }
        }
      
        .url {
        
            background-color: var(--accent-color);
            color: white;
            padding: 6px;
            font-size: 13px;
            font-weight: bold;
            border-radius: 6px;
            width: max-content;
        }
        
        paper-input,
        paper-autocomplete {
            text-align: left;
        }
        
        #url {
            iron-input {
                text-align: left;
                background-color: red;
            }
        }
      </style>
      <div id="signupUserContainer">
         <iron-form id="signupUser">
            <form method="post">
              <paper-input id="name" name="name" label="{{localize('name')}}" required></paper-input>
              <paper-input id="lastName" name="lastName" label="{{localize('lastName')}}" required></paper-input>
              <paper-input id="email" name="email" label="{{localize('email')}}" required></paper-input>
              <paper-input id="password" type="password" name="password" label="{{localize('password')}}" required></paper-input>
              <paper-input name="confirmPassword" type="password" label="{{localize('repeat-password')}}" required></paper-input>
              <paper-input name="roleId" value="organizationOwner" hidden></paper-input>
            <paper-autocomplete
                id="orgAutocomplete"
                label="{{localize('name-organization')}}"
                text-property="name"
                value-property="name"
                remote-source
                on-autocomplete-change="_defaultChanged"
                on-autocomplete-reset-blur="_removeDefault"
                required>
                    <template slot="autocomplete-custom-template">
                        <paper-item class="account-item" on-tap="_onSelect" role="option" aria-selected="false">
                            <div index="[[index]]">
                                <div class="service-name">[[item.name]]</div>
                            </div>
                        </paper-item>
                    </template>

                    <iron-icon icon="info" slot="suffix"></iron-icon>
              </paper-autocomplete>
              <paper-button on-tap="submitSignupButton">{{localize('signup')}}</paper-button>
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

            services: {
                value: {
                    _config: "config",
                    _notify: "Notify",
                    _localizeService: 'Localize',
                    StorageContainerAggregate: {
                        userStorage: "UserStorage",
                        organizationStorage: "OrganizationStorage"
                    }
                }
            },

            url: {

            },

            userService: {
                readOnly: true
            },

            organizationStorage: {
                readOnly: true
            },

            _config: {
                readOnly: true
            }
        };
    }

    ready() {
        super.ready();
        this.$.signupUser.addEventListener('iron-form-presubmit', this.submitSignup.bind(this));
    }

    /**
     * @param evt
     * @private
     */
    _defaultChanged(evt) {
        if(!this.organizationStorage) {
            return;
        } 
        console.log('test')

        this.organizationStorage
            .getAll({ name: evt.detail })
            .then(
                (data) => {
                    this.$.orgAutocomplete.suggestions(data);
                }
            );
    }

    /**
     * @param {string} url
     * @private
     */
    _getUrl(url) {
        return url.replace(/^https?:\/\//, '').replace(/^http?:\/\//, '');
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

        let userData = this.$.signupUser.serializeForm();

        if (userData.password !== userData.confirmPassword) {
            this.errorMessage(this.$.signupUser, {
                message: "Unprocessable Entity",
                status: 422,
                errors: {
                    confirmPassword: this.localize('password-not-equal')
                }
            });
            return;
        }

        if (!this.$.orgAutocomplete.value) {
            userData.organization = this.$.orgAutocomplete.text
        } else {
            userData.organization = this.$.orgAutocomplete.text == this.$.orgAutocomplete.value.name ? this.$.orgAutocomplete.value._id.$oid:  this.$.orgAutocomplete.text;
        }

       
        this.userStorage.save(userData).then((data) => {
            this._notify.notify(this.localize('signup-ok'));
            this.$.signupUser.reset();
        }).catch((error) => {
            this.errorMessage(this.$.signupUser, error);
        });
    }
}

window.customElements.define('dsign-signup', DsignSignup);