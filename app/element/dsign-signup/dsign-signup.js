import {AclMixin} from "../../src/mixin/acl/acl-mixin";
import {ServiceInjectorMixin} from "../../src/mixin/service/injector-mixin";
import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import "@polymer/paper-button/paper-button";
import "@polymer/paper-input/paper-input";
import {layout} from "../layout/dsing-layout";

class DsignSignup extends AclMixin(ServiceInjectorMixin(PolymerElement)) {

    static get template() {
        return html`
      ${layout}
      <style>

      </style>
      <paper-input id="username" name="username" label="Username"></paper-input>
      <paper-input id="password" name="password" label="Password"></paper-input>
      <paper-input name="confirmPassword" label="Password"></paper-input>
      <paper-button on-tap="signup">Signup</paper-button>`;

    }

    static get properties() {
        return {

            services : {
                value : {
                    userStorage: "UserStorage"
                }
            },

            userService: {
                readOnly: true
            },
        };
    }

    signup(evt) {
        this.userStorage.save(
            {
                "email": this.$.username.value,
                "password": this.$.password.value,
            }
        ).then((data) => {
            console.log(data)
        })
            .catch((error) => {
                console.log('ER^RORERERE', error);
            });
    }
}

window.customElements.define('dsign-signup', DsignSignup);