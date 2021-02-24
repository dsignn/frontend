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
import {ServiceInjectorMixin} from '@dsign/polymer-mixin/service/injector-mixin';
import {AclMixin} from '@dsign/polymer-mixin/acl/acl-mixin';
import {Auth} from "../../src/authentication/Auth";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
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
import '../../element/paper-select-language/paper-select-language';
import {layout} from '../../element/layout/dsing-layout.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class DsignApp extends LocalizeMixin(AclMixin(ServiceInjectorMixin(PolymerElement))) {
  static get template() {
    return html`
      ${layout}
      <style>
      
       paper-select-language {
            max-width: 150px;
       }
       
        app-header-layout {
          /**  margin-left: 64px;*/
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
          top: 0;
          left: 0;
          background-color: white; 
          width: 64px;
          position: fixed;
          display: none;
        }
        
        .content-pages {
           height: 100%;
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
        
        .height-100 {
            height: 100%;
        }
        
        app-drawer#authDrawer {
             --app-drawer-width: 426px;
        }
        
        .auth-container {
            display: block;
            width: 392px;
            height: 100%;
            padding: 6px 12px;
        }
        
        #auth-tab {
            height: 50px;
            width: 100%;
        }
        
        user-me {
            margin-bottom: 20px;
        }
        
        #menuBtn {
            : none;
        }
        
        #menuDrawer {
            --app-drawer-width: 64px;
        }
        
        .user-me-container {
             @apply --layout-horizontal;
             @apply --layout-justified;
        }
        
        @media only screen and (max-width: 499px) {
            app-header-layout {
            overflow-x: hidden;
            }
        }
        
        @media only screen and (max-width: 499px) {
            app-drawer#authDrawer {
             --app-drawer-width: 326px;
            }
            
            .auth-container {
             width: 292px;
            }
        }        
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]"></app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}" query-params="{{query}}"></app-route>
     
      <div id="menuStatic">
        <iron-selector id="menuStaticSelector" selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
        </iron-selector>
      </div>
      <app-header-layout fullbleed>
        <app-header slot="header" fixed effects="waterfall">
          <app-toolbar>
            <paper-icon-button id="menuBtn" icon="menu" on-tap="tapMenuDrawer"></paper-icon-button>
            <div main-title>Dsing</div>
            <paper-icon-button icon="account" on-tap="tapAuthDrawer"></paper-icon-button>
          </app-toolbar>
        </app-header>
        <div class="content-pages">
          <iron-pages id="moduleEntryPoint" selected="[[page]]" attr-for-selected="name" role="main">
            <activation-code root-path="[[rootPath]]" query={{query}} name="activation-code"></activation-code>
            <reset-password query={{query}} name="reset-password"></reset-password>
            <dsing-404 name="404" root-path="[[rootPath]]dashboard"></dsing-404>
          </iron-pages>
        </div>
      </app-header-layout>
      <app-drawer id="menuDrawer" align="left" swipe-open open>
      
      </app-drawer>
      <app-drawer id="authDrawer" align="right" swipe-open open>
        <div class="layout vertical start-aligned icon-wrapper height-100">
          <template is="dom-if" if="{{isAllowed('application', 'login')}}">
            <div class="auth-container">
              <user-me></user-me>
              <div class="user-me-container">
                  <paper-button on-tap="updateUserData">Modifica</paper-button>
                  <paper-button on-tap="logout">logout</paper-button>
              </div>
            </div>
          </template>
          <template is="dom-if" if="{{isAllowed('application', 'logout')}}">
            <div class="auth-container">
              <paper-tabs id="auth-tab" selected="{{authSelected}}" no-slide>
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
        reflectToAttribute: true,
        value: 'dashboard'
      },

      routeData: {
        value: Object
      },

      subroute: {
        value: Object
      },

      query: {
        notify: true
      },

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
        readOnly: true,
        observer: '_authServiceChanged'
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
      this.updateMenuVisibility();
    };
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

      icon = icon.cloneNode(true);
      icon.module = application.modules[cont];
      this.$.menuDrawer.appendChild(icon);
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
  tapMenuDrawer(event) {
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
  hideMenu() {
    this.hideSmallMenu();
    this.hideBigMenu();
  }

  /**
   *
   */
  showMenu() {
    if (window.innerWidth > 700) {
      this.showBigMenu();
      this.hideSmallMenu();
    } else {
      this.showSmallMenu();
      this.hideBigMenu();
    }
  }

  /**
   *
   */
  showBigMenu() {
    this.$.menuStatic.style.display = 'block';
    this.shadowRoot.querySelector('app-header-layout').style.marginLeft = '64px';
    this.shadowRoot.querySelector('app-header').style.left = '64px';
  }

  hideBigMenu() {
    this.$.menuStatic.style.display = 'none';
    this.shadowRoot.querySelector('app-header-layout').style.marginLeft = '0';
    this.shadowRoot.querySelector('app-header').style.left = '0';
  }

  /**
   *
   */
  showSmallMenu() {
    this.$.menuBtn.style.display = 'block'
  }

  /**
   *
   */
  hideSmallMenu() {
    this.$.menuBtn.style.display = 'none'
  }

  /**
   *
   */
  updateMenuVisibility() {
      if (this._authService && this._authService.getIdentity()) {
        this.showMenu();
      }
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

  _authServiceChanged(authService) {
    if (!authService) {
      return;
    }

    authService.eventManager.on(
        Auth.LOGOUT,
        (evt) => {
          this.hideMenu();
          this._redirectRoleView();
        }
    );

    authService.eventManager.on(
        Auth.LOGIN,
        (evt) => {
          this.$.authDrawer.close();
        }
    );

    authService.eventManager.on(
        Auth.IDENTITY,
        (evt) => {
          this.showMenu();
        }
    );

    if (authService.getIdentity()) {
      this.showMenu();
    } else {
      this.hideMenu();
    }
  }

  /**
   * @private
   */
  _redirectRoleView() {
    if (!this._aclService.isAllowed(this._aclService.getRole(), this.page)) {
      window.history.pushState("", "", "");
      this.page = "dashboard";
    }
  }

  /**
   * @param evt
   */
  updateUserData(evt) {
    this.shadowRoot.querySelector('user-me').updateUserData();
  }
}

window.customElements.define('dsign-app', DsignApp);
