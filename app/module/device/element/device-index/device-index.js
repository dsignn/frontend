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


/**
 * @class PlaylistIndex
 */
class PlaylistIndex extends LocalizeMixin(AclMixin(ServiceInjectorMixin(PolymerElement))) {

  static get template() {
    return html`
      <style>
      

        
      </style>
    playlist`;
  }

  constructor() {
    super();
    this.resources = lang;
  }

  connectedCallback() {
    super.connectedCallback();
    this.initReviewDiv();
  }


  static get properties() {
    return {

      services: {
        value: {
          _notify: "Notify",
          _localizeService: 'Localize',
          _aclService: "Acl",
          _authService: "Auth",
          _config: "config"
        }
      },

      _authService: {
        observer: 'changeAuthService'
      },

      _config: {

      },

      restaurants: {
        value: [],
      }
    };
  }

  /**
   * @param next
   * @private
   */
  _updateDot(next) {
    let dots = this.shadowRoot.querySelectorAll('.navigation span');
    for (let index = 0; dots.length > index; index++) {
      dots[index].classList.remove('active');
      if (index === next) {
        dots[index].classList.add('active');
      }
    }
  }

  prevReview() {
    let elements = this.shadowRoot.querySelectorAll('.review');
    let current = this._getCurrentActiveReviewIndex(elements);
    let next = current === 0 ? elements.length - 1 : current - 1;

    this._updateDot(next);

    setTimeout(
      () => {
        elements[next].style.display = 'none';
        elements[next].style.right = '-1500px';
      },
      10
    );

    setTimeout(
      () => {
        elements[next].style.display = 'block';
      },
      50
    );

    setTimeout(
      () => {
        elements[current].style.right = '1500px';
        elements[current].classList.remove('active');
        elements[next].style.right = '0';
        elements[next].classList.add('active');
      },
      100
    );
  };

  /**
   * @param authService
   */
  changeAuthService(authService) {
    if (!authService) {
      return;
    }

    authService.eventManager.on(
      Auth.LOGIN,
      (evt) => {
        this.style.backgroundColor = '#eeeeee'
      }
    );

    authService.eventManager.on(
      Auth.LOGOUT,
      (evt) => {
        this.style.backgroundColor = '#ffffff'
      }
    );

    authService.eventManager.on(
      Auth.IDENTITY,
      (evt) => {
        this.style.backgroundColor = '#eeeeee'
      }
    );

    if (authService.getIdentity()) {
      this.style.backgroundColor = '#eeeeee'
    }
  }


  
  /**
   *
   */
  initReviewDiv() {
    let elements = this.shadowRoot.querySelectorAll('.review');
    for (let index = 0; index < elements.length; index++) {
      if (!elements[index].classList.contains('active')) {
        elements[index].style.right = '1200px';
      } else {
        elements[index].style.right = '0';
      }
    }
  }

  /**
   * @param evt
   */
  openLogin(evt) {
    let drawer = document.querySelector('dsign-app').shadowRoot.querySelector('#authDrawer');
    drawer.querySelector('paper-tabs').selected = 1;
    drawer.open();
  }

  /**
   * @param {CustomEvent} evt 
   */
  openIndoor(evt) {
    window.open(`${this._config.app.menuPath}/${evt.target.parentElement.restaurant.normalize_name}`, "_blank")
  }

  /**
   * @param {CustomEvent} evt 
   */
  openDelivery(evt) {
    window.open(`${this._config.app.menuPath}/${evt.target.parentElement.restaurant.normalize_name}?delivery`, "_blank")
  }

}

window.customElements.define('playlist-index', PlaylistIndex);

