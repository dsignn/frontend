/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { ServiceInjectorMixin } from '@dsign/polymer-mixin/service/injector-mixin';
import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
/**
 * @class DsignLogo
 */
class DsignLogo extends ServiceInjectorMixin(PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
            }
        
            .container {
                height: 64px;
                width: 64px;  
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .logo {
                height: 50px;
                width: 50px;
                border-radius: 50%;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: cover;
            }
        </style>
        <div class="container">
            <div class="logo"></div>
        </div>`;
    }

    static get properties() {
        return {

            services: {
                value: {
                    _config: 'config'
                }
            },

            organization: {
                notify: true
            },

            _config: {
                readOnly: true
            },
        };
    }

    static get observers() {
        return [
            '_observeOrganizationConfig(organization, _config)'
        ];
    }

    _observeOrganizationConfig(organization, _config) {
        if (!organization || !_config) {
            return;
        }

       

        if (organization.logo && organization.logo.src) {
            this.shadowRoot.querySelector('.logo').style.backgroundImage = `url("${organization.logo.src}")`;
            document.head.querySelector('#favicon').href = organization.logo.src;
        } else {
            document.head.querySelector('#favicon').href = `${_config.bucket}/logo.png`;
        }

        if (!!organization["site_url"]) {
            let element = document.createElement('a')
            element.href = organization["site_url"];
            element.target = "_blank";

            element.appendChild(this.shadowRoot.querySelector('div.logo'));

            this.shadowRoot.querySelector('div.container').appendChild(element);
        }
    }
}

window.customElements.define('dsign-logo', DsignLogo);
