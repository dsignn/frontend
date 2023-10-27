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
import { LocalizeMixin } from "@dsign/polymer-mixin/localize/localize-mixin.js";
import { AclMixin } from "@dsign/polymer-mixin/acl/acl-mixin";
import { ServiceInjectorMixin } from "@dsign/polymer-mixin/service/injector-mixin.js";
import { lang } from './language.js';
// TODO add to widget load
import { Auth } from "../../../../src/authentication/Auth.js";
import './../device-view-list/device-view-list.js';
//import './../organization-view-upsert/organization-view-upsert';


/**
 * @class DeviceIndex
 */
class DeviceIndex extends LocalizeMixin(AclMixin(ServiceInjectorMixin(PolymerElement))) {

  static get template() {
    return html`
    <style>             
    .header {
      @apply --layout-horizontal;
      @apply --layout-center;
      padding-bottom: 8px;
    }
    
  .text-content {
      font-size: 20px;
      flex: 1;
    }
    
    paper-icon-button.circle {
        @apply --paper-icon-button-action;
    }

    paper-filter-storage {
        flex: 1;
        --paper-filter-storage : {
            padding: 0 8px;
            align-items: center;
            display: flex;
            min-height: 70px;
            width: -webkit-fill-available;
            margin-right: 8px;
        }
    }

    #update {
       display: block;
       width: 96%;
    }
  </style>
  <iron-pages id="index" selected="{{selected}}">
      <div id="list"> 
          <device-view-list selected="{{selected}}" entity-selected="{{entitySelected}}">
              <div slot="header" class="header">
                  <paper-filter-storage id="filterStorage" on-value-changed="_filterChange">
                      <div slot="filters" class="filter-container">
                          <paper-input name="name" label="{{localize('name')}}" ></paper-input>
                      </div>
                  </paper-filter-storage>
                  <paper-icon-button id="iconInsertMonitor" icon="insert" class="circle" on-click="displayAddView"></paper-icon-button>
                  <paper-tooltip for="iconInsertMonitor" position="left">{{localize('insert-resource')}}</paper-tooltip>
                </div>
          </device-view-list>
      </div>
      <div id="insert"> 
          <device-view-upsert>
              <div slot="header" class="header">
                  <div class="text-content">{{localize('insert-resource')}}</div>
                  <paper-icon-button id="iconBackInsert" icon="arrow-back" class="circle" on-click="displayListView"></paper-icon-button>
                  <paper-tooltip for="iconBackInsert" position="left">{{localize('back')}}</paper-tooltip>
              </div>
          </device-view-upsert>
      </div>
      <div id="update"> 
          <device-view-upsert entity="{{entitySelected}}">
              <div slot="header" class="header">
                  <div class="text-content">{{localize('update-resource')}}</div>
                  <paper-icon-button id="iconBackUpdate" icon="arrow-back" class="circle" on-click="displayListView"></paper-icon-button>
                  <paper-tooltip for="iconBackUpdate" position="left">{{localize('back')}}</paper-tooltip>
              </div>
          </device-view-upsert>
      </div>
  </iron-pages>`;
  }

  constructor() {
    super();
    this.resources = lang;
  }

  static get properties() {
    return {

      services: {
        value: {
          _localizeService: 'Localize',
        }
      }
    };
  }

  /**
   * @param evt
   */
  displayAddView(evt) {
    this.selected = 1;
  }

  /**
   * @param evt
   */
  displayListView(evt) {
    this.selected = 0;
  }
}

window.customElements.define('device-index', DeviceIndex);

