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
import '@polymer/paper-card/paper-card.js';
import { LocalizeMixin } from "@dsign/polymer-mixin/localize/localize-mixin";
import { ServiceInjectorMixin } from "@dsign/polymer-mixin/service/injector-mixin";
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-pages/iron-pages';
import './../user-view-list/user-view-list';
import './../user-view-upsert/user-view-upsert'
import './../../../../element/paper-filter-storage/paper-filter-storage'

import { lang } from './language';

class UserIndex extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {
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


           .filter-container {
            display: flex;
            padding-bottom: 6px;
          }

            .filter-container > * { 
                padding-right: 6px !important;
            }
      </style>
    
      <iron-pages id="index" selected="{{selected}}">
          <div id="list"> 
              <user-view-list id="viewList" selected="{{selected}}" entity-selected="{{entitySelected}}">
                   <div slot="header" class="header">
                      <paper-filter-storage id="filterStorage" on-value-changed="_filterChange">
                          <div slot="filters" class="filter-container">
                              <paper-input name="name" label="{{localize('name')}}" ></paper-input>
                              <paper-input name="last_name" label="{{localize('lastName')}}" ></paper-input>
                              <paper-dropdown-menu id="roleId" name="role_id" label="{{localize('role')}}" style="padding:0px">
                                <paper-listbox slot="dropdown-content" class="dropdown-content">
                                    <dom-repeat id="menu" items="{{roles}}" as="role">
                                        <template>
                                            <paper-item value="{{role.value}}">{{localize(role.name)}}</paper-item>
                                        </template>
                                    </dom-repeat>
                                  </paper-listbox>
                              </paper-dropdown-menu>
                            </div>
                      </paper-filter-storage>
                      <paper-icon-button id="iconInsertMonitor" icon="insert" class="circle" on-click="displayAddView"></paper-icon-button>
                      <paper-tooltip for="iconInsertMonitor" position="left">{{localize('user-resource')}}</paper-tooltip>
                   </div>
              </user-view-list>
          </div>
          <div id="insert"> 
              <user-view-upsert>
                  <div slot="header" class="header">
                      <div class="text-content">{{localize('user-resource')}}</div>
                      <paper-icon-button id="iconBackInsert" icon="arrow-back" class="circle" on-click="displayListView"></paper-icon-button>
                      <paper-tooltip for="iconBackInsert" position="left">{{localize('back')}}</paper-tooltip>
                  </div>
              </user-view-upsert>
          </div>
          <div id="update"> 
              <user-view-upsert entity="{{entitySelected}}">
                  <div slot="header" class="header">
                      <div class="text-content">{{localize('user-resource')}}</div>
                      <paper-icon-button id="iconBackUpdate" icon="arrow-back" class="circle" on-click="displayListView"></paper-icon-button>
                      <paper-tooltip for="iconBackUpdate" position="left">{{localize('back')}}</paper-tooltip>
                  </div>
              </user-view-upsert>
          </div>
      </iron-pages>
    `;
  }


  constructor() {
    super();
    this.resources = lang;
  }

  static get properties() {
    return {

      roles: {
        value: [
            { "name": "admin", "value": "admin" },
            { "name": "adminOrg", "value": "organizationOwner" }
        ]
      },

      selected: {
        type: Number,
        value: 0
      },

      /**
       * @type object
       */
      services: {
        value: {
          _localizeService: 'Localize'
        }
      },
    };
  }

  _filterChange(evt) {
    this.$.viewList.filter = JSON.parse(JSON.stringify(evt.detail));
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

window.customElements.define('user-index', UserIndex);
