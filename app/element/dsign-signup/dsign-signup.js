import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import {AclMixin} from "@dsign/polymer-mixin/acl/acl-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {FormErrorMessage} from "../mixin/form-error-message/form-error-message";
import "@polymer/paper-button/paper-button";
import "@fluidnext-polymer/paper-autocomplete/paper-autocomplete";
import "@polymer/paper-input/paper-input";
import "@polymer/iron-form/iron-form";
import {layout} from "../layout/dsing-layout";
import {lang} from './language';
import {Flatten} from './../../src/transform/Flatten';

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
        }
        
        paper-input {
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
              <paper-input name="roleId" value="restaurantOwner" hidden></paper-input>
              <paper-input id="nameOrganization" name="nameOrganization" label="{{localize('name-restaurant')}}" on-value-changed="changeNameRestaurant" required></paper-input>
              <paper-input 
                id="url"
                label="{{localize('url')}}" 
                value="{{url}}"
                always-float-label
                disabled>
                <div class="url" slot="prefix">{{_getUrl(_config.app.basePath)}}menu/</div>
              </paper-input>
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
                    _slugify: "Slugify",
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

            _slugify: {
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
     */
    changeNameRestaurant(evt) {
        if (!this._slugify) {
            return;
        }

        this.url = evt.detail.value ? this._slugify.slugify(evt.detail.value) : '';
    }

    /**
     * @param {string} url
     * @private
     */
    _getUrl(url) {
        return url.replace(/^https?:\/\//,'').replace(/^http?:\/\//,'');
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
            this.errorMessage(this.$.signupUser, error);
        });
    }

    /**
     * @param evt
     * @private
     */
    _searchRestaurant(evt) {

        this.organizationStorage.getAll({name: evt.detail.value.text})
            .then((data) => {
                console.log(evt.detail, this);
                this.$.organization.value = {
                    name: evt.detail.value.text
                };
                evt.detail.target.suggestions(
                    data
                );
            })

    }
}

window.customElements.define('dsign-signup', DsignSignup);