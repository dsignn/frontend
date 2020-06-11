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
        :host {
           display: block;
           width: 100%;
           height: 64px;
        }
        
        #container {
         width: 100%;
        }
        
        .icon-wrapper {
          height: 64px;
          width: 64px;
        }
        
        .not-display {
            display: none;
        }
            
        .display {
            display: flex;
        }
        
        
      </style>
      <template is="dom-if" if="{{isAllowed(module.name, 'menu')}}">
        <div id="container" class="layout horizontal start-justified center">
          <div class="layout vertical center-center icon-wrapper ">
            <a href="{{rootPath}}{{module.name}}">
              <paper-icon-button icon="{{module.icon}}"></paper-icon-button>
            </a>
          </div>   
          <div class$="{{classText}}">
            {{ucFirst(module.name)}}
          </div>
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

      viewText: {
        value:false,
        notify: true,
        observer: 'viewTextChanged',
        reflectToAttribute: true
      },

      module: {
        type: Object,
        notify: true,
        value: {}
      },

      classText: {
        readOnly: true,
        value:'not-display'
      }
    }
  }

  /**
   * @param value
   */
  viewTextChanged(value) {
    let display = 'not-display';
    if (value) {
      display = 'display';
    }
    this._setClassText(display);
  }

  /**
   * @param value
   */
  ucFirst(value) {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}

window.customElements.define('dsign-module-icon', DsignMenuIcon);
