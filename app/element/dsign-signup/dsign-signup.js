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

      </style>
      <iron-form id="signupUser">
        <form method="post">
          <paper-input id="username" name="email" label="{{localize('email')}}" ></paper-input>
          <paper-input id="password" type="password" name="password" label="{{localize('password')}}"></paper-input>
          <paper-input name="confirmPassword" type="password" label="{{localize('repeat-password')}}"></paper-input>
          <paper-button on-tap="submitSignupButton">Signup</paper-button>
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
                    StorageContainerAggregate: {
                        userStorage: "UserStorage"
                    }
                }
            },
            userService: {
                readOnly: true
            },
        };
    }

    ready() {
        super.ready();
        this.$.signupUser.addEventListener('iron-form-presubmit', this.submitSignup.bind(this));
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

        console.log('testeeeeeeeeeeeeeeeee')

        this.userStorage.save(
            this.$.signupUser.serializeForm()
        ).then((data) => {
            this._notify.notify(this.localize('signup-ok'));
            this.$.signupUser.reset();
        }).catch((error) => {
           console.log('ERROR', error);
        });


    }
}

window.customElements.define('dsign-signup', DsignSignup);