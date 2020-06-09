/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import {layout} from '../../element/layout/dsing-layout.js';
import {ServiceInjectorMixin} from '../../src/mixin/service/injector-mixin';
import {AclMixin} from "../../src/mixin/acl/acl-mixin";

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class DsignMenuIcon extends AclMixin(ServiceInjectorMixin(PolymerElement)) {

  static get template() {
    return html`
      ${layout}
      <style>
      
        .icon-wrapper {
          height: 64px
        }
        
      </style>
      <template is="dom-if" if="{{isAllowed(module.name, 'menu')}}">
        <div class="layout horizontal center-center icon-wrapper">
          <a href="{{rootPath}}{{module.name}}">
            <paper-icon-button icon="{{module.icon}}"></paper-icon-button>
          </a>
        </div>
      </template>`;


  }

  static get properties() {
    return {
      services : {
        value : {
          _aclService: "Acl"
        }
      },

      module: {
        type: Object,
        notify: true,
        value: {}
      }
    }
  }
}

window.customElements.define('dsign-module-icon', DsignMenuIcon);
