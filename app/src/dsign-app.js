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
import './dsign-404.js';
import './dsign-icons.js';
import {layout} from '../element/layout/app-layout';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class DsignApp extends PolymerElement {
  static get template() {
    return html`
      ${layout}
      <style>
        :host {
          --app-primary-color: #4285f4;
          --app-secondary-color: black;

          display: block;
        }

        app-header-layout {
          margin-left: 64px;
          visibility: visible;
        }
       

        app-header {
          color: #fff;
          background-color: var(--app-primary-color);
        }
        
        #menuStatic {
          background-color: white; 
          width: 64px;
          position: fixed;
        }
        
        #menuDrawer .icon-wrapper {
            padding-left: 8px;
        }
        
        .icon-wrapper {
          height: 64px;
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
        </app-toolbar>
      </app-header>
      <div>
        <iron-pages id="moduleEntryPoint" selected="[[page]]" attr-for-selected="name" role="main">
          <dsing-404 name="404" root-path="[[rootPath]]timeslot"></dsing-404>
        </iron-pages>
      </div>
    </app-header-layout>
    <app-drawer id="menuDrawer" align="left" swipe-open open>
      <div class="layout vertical center-justified start icon-wrapper" style="padding-left: 8px;"></div>
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
      modules: {
         value: [
           {
             name: 'timeslot'
           },
           {
             name: 'user'
           }
         ]
      }
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)',
      '_loadModuleChanged(modules)'
    ];
  }

  /**
   * @param modules
   * @private
   */
  _loadModuleChanged(modules) {
    modules.forEach(module => {

      this._importIconModule(module);
      this._importEntryPointModule(module)
    });
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
   * @param page
   * @private
   */
  _routePageChanged(page) {

    if (!page) {
      return;
    }

    let search = this.modules.find((element) => {
      return element.name === page;
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

  /**
   * @param module
   * @private
   */
  _importIconModule(module) {
    let path = `./${module.name}/${module.name}-icons.js`;
    import(path).then((data) =>{
      /*
      <div class="layout vertical center-center icon-wrapper">
          <a name="view1" href="[[rootPath]]view1">
            <paper-icon-button icon="my-icons:menu"></paper-icon-button>
          </a>
        </div>
      * */
        let divDrawer = document.createElement('div');
        divDrawer.className = 'layout vertical center-justified start icon-wrapper';

        let paperIcon = document.createElement('paper-icon-button');
        paperIcon.setAttribute('icon', `${module.name}:menu`);

        let a = document.createElement('a');

        a.setAttribute('href', `${this.rootPath}${module.name}`);

        let div = document.createElement('div');
        div.className = "layout vertical center-center icon-wrapper";

        a.appendChild(paperIcon);
        div.appendChild(a);
        divDrawer.appendChild(div.cloneNode( true ));
        this.$.menuStaticSelector.appendChild(div);
        this.$.menuDrawer.appendChild(divDrawer);

      }).catch((error) => {
        console.error(error);
      });
  }

  /**
   * @param module
   * @private
   */
  _importEntryPointModule(module) {
    let path = `./${module.name}/${module.name}-index.js`;
    import(path).then((data) =>{
      let element = document.createElement(`${module.name}-index`);
      element.setAttribute('name', module.name);
      this.$.moduleEntryPoint.appendChild(element);
    }).catch((error) => {
      console.error(error);
    });

  }
}

window.customElements.define('dsign-app', DsignApp);
