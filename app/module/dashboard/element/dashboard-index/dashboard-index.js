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
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {lang} from './language';

/**
 * @class DashboardIndex
 */
class DashboardIndex extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {

  static get template() {
    return html`
      <style>
        .section {
            @apply --layout-horizontal;
            @apply --layout-center-center;           
        }
        
        .container {
            @apply --layout-horizontal;
            width: 1080px;
            min-height: 400px;
        }
        
        .center {
          @apply --layout-center-center;           
        }
        
        .logo {
            flex: 1;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: contain;
            background-image: url("../../../../images/android-chrome-512x512.png");
        }
        
        .intro-description {
          @apply --layout-vertical;
          flex: 1;
          text-align: center;
          font-size: 18px;
        }
        
        .padding-top-30 {
            padding-top: 30px;
        }
        
      </style>
      <div class="section padding-top-30">
          <div class="container">
            <div class="logo"></div>
            <div class="intro-description center">
                <h2>Dsign Menù</h2>
                <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                </p>
            </div>
          </div>
      </div>
      <div class="section">
          <div class="container center">
            <h2>Team</h2>
          </div>
      </div>`;
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
        }
      }
    };
  }
}

window.customElements.define('dashboard-index', DashboardIndex);
