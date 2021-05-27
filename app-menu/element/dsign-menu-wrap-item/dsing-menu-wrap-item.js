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
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-card/paper-card';
import '@polymer/neon-animation/neon-animation';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-button/paper-button';
import '../../element/dsign-menu-item-image/dsign-menu-item-image';
import '../../element/dsign-menu-item-compress/dsign-menu-item-compress';

/**
 * @class DsignMenuWrapItem
 */
class DsignMenuWrapItem extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {

    static get template() {
        return html`
          <style>
            .container {
                @apply --menu-wrap-container;
            }
            
          </style>
          <div id="container" class="container"></div>
        `;
    }

    static get properties() {
        return {
            type: {

            },

            item: {

            },

            restaurant: {
                notify: true
            },

            categories: {
                notify: true,
                observer: '_categoriesChanged',
            },

            hide: {
                value: false,
                observer: '_hideChanged',
            },

            showOrder: {
                notify: true,
                observer: '_showOrderChanged',
            }
        };
    }

    static get observers() {
        return [
            'changeItem(type, item, showOrder)',
            '_showOrderChanged(type, showOrder)'
        ]
    }

    /**
     * @param hide
     * @private
     */
    _hideChanged(hide) {

        switch (hide) {
            case true:
                this.style.display = 'none';
                break;
            case false:
                this.style.display = 'block';
                break;
            default:
                this.style.display = 'block';
        }
    }

    changeItem(type, item, showOrder) {
        if (!type || !item || showOrder === null) {
            return;
        }

        let element = document.createElement(type);
        element.menuItem = item;
        element.restaurant = this.restaurant;
        element.showOrder = showOrder;
        this.$.container.appendChild(element);
    }

    _categoriesChanged(value) {

        if (!value) {
            return;
        }

        let ele = this.shadowRoot.querySelector(this.type);
        if (ele) {
            ele.categories = value;
        }
    }

    _showOrderChanged(type, showOrder) {

        if (!type || !showOrder) {
            return
        }
        let ele = this.shadowRoot.querySelector(type);
        if (ele) {
            ele.showOrder = showOrder;
        }
    }
}

window.customElements.define('dsign-menu-wrap-item', DsignMenuWrapItem);