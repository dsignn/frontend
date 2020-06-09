import {AclMixin} from "../../src/mixin/acl/acl-mixin";
import {ServiceInjectorMixin} from "../../src/mixin/service/injector-mixin";
import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import "@polymer/paper-button/paper-button";
import "@polymer/paper-input/paper-input";
import {layout} from "../layout/dsing-layout";

class DsignLogin extends AclMixin(ServiceInjectorMixin(PolymerElement)) {

    static get template() {
        return html`
      ${layout}
      <style>


      
      </style>
      <paper-input id="username" name="username" label="Username"></paper-input>
      <paper-input id="password" name="password" label="Password"></paper-input>
      <paper-button on-tap="login">login</paper-button>`;

    }

    static get properties() {
        return {

            services : {
                value : {
                    authService: "Auth"
                }
            },

            authService: {
                readOnly: true
            },
        };
    }

    login(evt) {
        this.authService.login(
            this.$.username.value,
            this.$.password.value
        ).then((data) => {
            console.log(data)
        })
            .catch((error) => {
                console.log('ER^RORERERE', error);
            });
    }
}

window.customElements.define('dsign-login', DsignLogin);