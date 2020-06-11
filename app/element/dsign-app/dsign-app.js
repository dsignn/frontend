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
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-tabs/paper-tabs.js';
import  '../../element/dsign-menu-icon/dsign-menu-icon.js';
import '../dsign-404/dsign-404.js';
import '../../element/dsign-icons/dsign-icons.js';
import '../../element/dsign-login/dsign-login';
import '../../element/dsign-signup/dsign-signup';
import {layout} from '../../element/layout/dsing-layout.js';
import {ServiceInjectorMixin} from '../../src/mixin/service/injector-mixin';
import {AclMixin} from '../../src/mixin/acl/acl-mixin';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class DsignApp extends AclMixin(ServiceInjectorMixin(PolymerElement)) {
  static get template() {
    return html`
      ${layout}
      <style>

        app-header-layout {
          margin-left: 64px;
          visibility: visible;
        }
       
        app-header {
          color: #fff;
          background-color: var(--app-primary-color);
        }
        
        paper-tabs {
            width: 244px;
            border-radius: 3px;
        }
        
        #menuStatic {
          background-color: white; 
          width: 64px;
          position: fixed;
        }
        
        .name-module {
           padding-left: 8px;
        }
        
        .icon-wrapper {
          height: 64px;
          width: 64px;
        }
        
        a.icon {
            color: black;
        }
        
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]"></app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}"></app-route>
     
    <div id="menuStatic">
      <iron-selector id="menuStaticSelector" selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
        <div class="layout vertical center-center icon-wrapper">
          <paper-icon-button icon="dsign:arrow-right" on-tap="tapDrawer"></paper-icon-button>
        </div>
      </iron-selector>
    </div>
    <app-header-layout fullbleed>
      <app-header slot="header" fixed effects="waterfall">
        <app-toolbar>
          <div main-title>Dsing</div>
          <paper-icon-button icon="dsign:face" on-tap="tapAuthDrawer"></paper-icon-button>
        </app-toolbar>
      </app-header>
      <div>
        <iron-pages id="moduleEntryPoint" selected="[[page]]" attr-for-selected="name" role="main">
          <dsing-404 name="404" root-path="[[rootPath]]timeslot"></dsing-404>
        </iron-pages>
      </div>
    </app-header-layout>
    <app-drawer id="menuDrawer" align="left" swipe-open open>
      <div class="layout vertical center-justified start icon-wrapper"></div>
    </app-drawer>
    <app-drawer id="authDrawer" align="right" swipe-open open>
      <div class="layout vertical center-justified start icon-wrapper">
        <template is="dom-if" if="{{isAllowed('application', 'login')}}">
          <paper-button on-tap="logout">logout</paper-button>
        </template>
        <template is="dom-if" if="{{isAllowed('application', 'logout')}}">
          <div style="padding: 6px; padding-top: 12px; height: 100%;">
            <paper-tabs selected="{{authSelected}}" no-slide>
              <paper-tab>LOGIN</paper-tab>
              <paper-tab>SIGNUP</paper-tab>
            </paper-tabs>
            <iron-pages id="authPages" selected="{{authSelected}}" role="main">
              <div>
                <dsign-login></dsign-login>
              </div>
              <div>
                <dsign-signup></dsign-signup>
              </div>
            </iron-pages>
          </div>
        </template>
      </div>
    </app-drawer>`;

  }

  static get properties() {
    return {

      page: {
        type: String,
        reflectToAttribute: true
      },

      routeData: Object,

      subroute: Object,

      authSelected: {
        type: Number,
        value: 0,
        notify: true
      },

      services : {
        value : {
          application:  "Application",
          _aclService: "Acl",
          _authService: "Auth"
        }
      },

      application: {
        observer: '_applicationChanged'
      },

      _authService: {
        readOnly: true
      },
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page, application)'
    ];
  }

  /**
   * @event
   */
  connectedCallback() {
    super.connectedCallback();
    this.updateHeightMenu();
    document.body.onresize = (event) => {
      this.updateHeightMenu();
    }
  }

  /**
   * @param application
   * @private
   */
  _applicationChanged(application) {

    let entryPoint;
    let icon;
    let drawerIcon;
    let divWrap;

    for (let cont = 0 ; application.modules.length > cont; cont++) {

      entryPoint = document.createElement(application.modules[cont].entryPoint.name);
      entryPoint.setAttribute('name', application.modules[cont].name);
      this.$.moduleEntryPoint.appendChild(entryPoint);

      icon =  document.createElement('dsign-module-icon');
      icon.module = application.modules[cont];
      this.$.menuStaticSelector.appendChild(icon);

      drawerIcon = icon.cloneNode(true);
      drawerIcon.module = application.modules[cont];
      drawerIcon.viewText = true;

      this.$.menuDrawer.appendChild(drawerIcon);
    }
  }

  /**
   * @param page
   * @private
   */
  _routePageChanged(page, application) {

    if (!page || !application) {
      return;
    }
    let pages = Array.from(this.$.moduleEntryPoint.childNodes)
    let search = pages.find((element) => {
      return element.getAttribute && element.getAttribute('name') === page;
    });

    if (!search) {
      this.page = '404';
    } else {
      this.page = page;
    }
  }

  /**
   *
   * @param Event event
   */
  tapDrawer(event) {
    this.$.menuDrawer.open();
  }

  /**
   * @param event
   */
  tapAuthDrawer(event) {
    this.$.authDrawer.open();
  }

  /**
   * @param evt
   */
  logout(evt) {
    this._authService.logout();
  }

  /**
   *
   */
  updateHeightMenu() {
    this.$.menuStatic.style.height = `${this._getMaxHeight()}px`;
  }

  /**
   * @returns {number}
   * @private
   */
  _getMaxHeight() {
    let body = document.body,
        html = document.documentElement;

    return Math.max( body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight );
  }
}

window.customElements.define('dsign-app', DsignApp);
