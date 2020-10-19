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
class DashboardIndex extends ServiceInjectorMixin(PolymerElement) {

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
        
        .space-between {
          @apply --layout-justified;           
        }
        
         .flex-1 {
          flex: 1;
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
        
        .padding-34 {
            padding: 34px;
        }
        
        .container.box {
            margin: 165px 34px 12px 34px;
            padding: 12px;
            border: 8px solid #f0cd0a;
            border-radius: 6px;
            flex-direction: column;
            padding-top: 50px;
            z-index: -1;
            width: 100%;
        }
        
        .team-title {
            text-align: center;
        }
        
        .user_team {
            height: 400px;
            width: 300px;
        }
        
        .user_photo {
            height: 300px;
            width: 300px;
            border-radius: 50%;
            background-image: url("http://placehold.it/300x300/015b63/ffffff");
        }
        
        .user_team .name,
        .user_team .role {
            text-align: center;
        }

        .user_team .name {
            font-size: 18px;
        }

        .user_team .role {
            font-size: 24px;
        }
        
        .card-content .description {
            word-wrap: break-word;
            max-width: 280px;
        }

        .logo {
            position: absolute;    
            height: 300px;
            width: 100%;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: contain;
            background-image: url("../../../../images/android-chrome-384x384.png");
        }
        
        .intro-description {
          @apply --layout-vertical;
          @apply --layout-start-justified;
          flex: 1;
          text-align: center;
          font-size: 18px;
          padding-top: 100px;
        }
        
        .padding-top-30 {
            padding-top: 30px;
        }
        
        .strengths {
            flex-wrap: wrap;
        }
        
        paper-card[strengths] {
            min-width: 300px;
            margin-bottom: 20px;
        }
        
        .card-content {
            padding: 10px;
            text-align: center;
        }
        
        .margin-0 {
            margin: 0;
        }
 
        @media only screen and (max-width: 1000px) {
          .team {
            flex-direction: column;
            align-items: center;
          }
          
          paper-card[strengths] {
            min-width: 400px;
          }
        }
        
        @media only screen and (max-width: 883px) {
           paper-card[strengths] {
                min-width: 300px;
            }
        }
        
        @media only screen and (max-width: 699px) {
          .strengths,
          .example {
            flex-direction: column;
            align-items: center;
          }
        }
        
        @media only screen and (max-width: 400px) {
          .logo  {
            background-size: 80%;
          }
          
          .user_photo {
              height: 200px;
              width: 200px;
              border-radius: 50%;
              background-image: url("http://placehold.it/300x300/015b63/ffffff");
          }
          
          .user_team {
            height: 300px;
            width: 200px;
          }
        }
        
      </style>
    
      <div class="section padding-top-30">
          <div>
              <div class="logo"></div>
          </div>
          <div class="container box">
            <div class="intro-description center start">
                <h2 class="margin-0">Dsign Menù</h2>
                <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                </p>
            </div>
          </div>
      </div>
      <div class="section column">
        <div class="row center">
            <h2>Punti di forza</h2>
        </div>
        <div class="row strengths padding-34 space-between">
            <paper-card strengths image="http://placehold.it/300x150/015b63/ffffff">
                <div class="card-content">
                    <h3>Gratuito</h3>
                      <div class="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</div>
                </div>
            </paper-card>
            <paper-card strengths image="http://placehold.it/300x150/015b63/ffffff">
                <div class="card-content">
                    <h3>Personalizzabile</h3>
                    <div class="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</div>
                </div>
            </paper-card>
            <paper-card strengths image="http://placehold.it/300x150/015b63/ffffff">
                <div class="card-content">
                    <h3>Utile</h3>
                      <div class="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</div>
   
                </div>
            </paper-card>
            <paper-card strengths image="http://placehold.it/300x150/015b63/ffffff">
                <div class="card-content">
                    <h3>Facile</h3>
                      <div class="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</div>
                </div>
            </paper-card>
        </div>
      </div>
      <div class="section column">
         <div class="row center">
            <h2>L'idea</h2>
         </div>
         <div class="row example">
            <div class="column center flex-1 padding-34">
                <img src="http://placehold.it/500x800/015b63/ffffff">
            </div>
            <div class="column center flAx-1 padding-34">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
            </div>
         </div>
      </div>
      <div class="section column">
           <div class="row center">
                <h2 class="team-title">Team</h2>
           </div>
           <div class="row team">
                <div class="user_team">
                    <div class="user_photo"></div>
                    <div class="role">CTO</div>
                    <div class="name">Antonino Visalli</div>
                </div>
                <div  class="user_team">
                    <div class="user_photo"></div>
                    <div class="role">Web Designer</div>
                    <div class="name">Paolo Sartorio</div>
                </div>
                <div  class="user_team">
                    <div class="user_photo"></div>
                    <div class="role">Web Designer</div>
                    <div class="name">Paolo Sartorio</div>
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

