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
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin.js";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin.js";
import {lang} from './language.js';

/**
 * @class DashboardIndex
 */
class DashboardIndex extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {

  static get template() {
    return html`
      <style>
      
        :host {
            display: block;
            position: relative;
            margin-top: 12px;
        }
      
        .section {
            @apply --layout-horizontal;
            @apply --layout-center-center;      
            position: relative; 
        }
        
        .column {
            @apply --layout-vertical;
        }
        
        .row {
            @apply --layout-horizontal;
        }
                    
        .center {
          @apply --layout-center-center;           
        }
        
        .row.team {
            width: 100%;
           justify-content: space-around;
        } 
        
        .container {
            @apply --layout-horizontal;
            width: 1080px;
            min-height: 400px;
        }
        
        .container.box {
            margin: 140px 12px 12px 12px;
            padding: 12px;
            border: 8px solid #f0cd0a;
            border-radius: 6px;
            flex-direction: column;
            padding-top: 50px;
            z-index: -1;
   
        }
        
        .user_team {
            height: 400px;
            width: 300px;
        }
        
        .user_photo {
            height: 300px;
            width: 300px;
            border-radius: 50%;
            background-color: red;
        }
        
        .user_team .text {
            text-align: center;
        }

        .logo {
            position: absolute;    
            margin-top: -380px;
            height: 300px;
            width: 100%;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: contain;
            background-image: url("../../../../images/android-chrome-384x384.png");
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
          <div class="logo"></div>
          <div class="container box">
            <div class="intro-description center">
                <h2>Dsign Menù</h2>
                <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                </p>
            </div>
          </div>
      </div>
      <div class="section column">
           <h2>Team</h2>
           <div class="row team">
                <div class="user_team">
                    <div class="user_photo"></div>
                    <div class="text">CTO</div>
                    <div class="text">Antonino Visalli</div>
                </div>
                <div  class="user_team">
                    <div class="user_photo"></div>
                    <div class="text">Web Designer</div>
                    <div class="text">Paolo Sartorio</div>
                </div>
                <div  class="user_team">
                    <div class="user_photo"></div>
                    <div class="text">Web Designer</div>
                    <div class="text">Paolo Sartorio</div>
                </div>
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
