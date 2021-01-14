/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button';

class Dsing404 extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          display: block;

          padding: 10px 20px;
        }
        
        h1 {
            color: var(--app-primary-color);
            margin: 0;
            font-size: 136px;
        }
        
        .container {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }
        
        a {
            text-decoration:none;
        }
        
        @media (max-width: 799px) {
            h1 {
                 font-size: 136px;
            }
        }

        @media (min-width: 800px) and (max-width: 1199px) {
            h1 {
                 font-size: 230px;
            }
        }            

        @media (min-width: 1200px) and (max-width: 1919px) {
            h1 {
                 font-size: 320px;
            }
        }    
        
        @media (min-width: 1920px) {
            h1 {
                 font-size: 400px;
            }
        }
        
      </style>
      
      <div class="container">
          <h1>404</h1>
          <a href="[[rootPath]]">
            <paper-button>home page</paper-button>
          </a>
      </div>
    `;
    }
}

window.customElements.define('dsing-404', Dsing404);
