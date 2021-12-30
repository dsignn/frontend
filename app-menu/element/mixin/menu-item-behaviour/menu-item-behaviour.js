
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {NotifyMixin} from "@dsign/polymer-mixin/notify/notify-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {Storage} from "@dsign/library/src/storage/Storage";
import {OrderService} from "../../../src/module/order/service/OrderService";
import { OrderEntity } from '../../../src/module/order/entity/OrderEntity';

/**
 * @type {Function}
 */
export const MenuItemBehaviour = (superClass) => {

    return class extends superClass {

        static get properties() {
            return {

                menuItem: { 
                    notify: true,
                    observer: 'menuItemChange'
                },

                hasPrice: {
                    type: Boolean,
                    readOnly: true,
                    notify: true,
                    value: false
                }
            };
        }

        /**
         * @param {object} menuItem
         */
        menuItemChange(menuItem) {
            if (!menuItem) {
                return;
            }

            if (menuItem.status) {
                this._updateStatus(menuItem.status);
            }

            if (!menuItem.price || !menuItem.price.value)  {
                this._setHasPrice(false);
            } else {
                this._setHasPrice(true);
            }
        }

        /**
         * @param {string} status 
         */
        _updateStatus(status) {

            switch (status) {
                case 'available':
                    this.statusLabel = '';
                    this.shadowRoot.querySelector('.triangle').setAttribute('hidden', '');
                    this.shadowRoot.querySelector('.status-dish').setAttribute('hidden', '');
                    this.enableButton(false);
                    break;
                case 'over':
                    this.statusLabel = 'finished';
                    this.shadowRoot.querySelector('.triangle').removeAttribute('hidden');
                    this.shadowRoot.querySelector('.status-dish').removeAttribute('hidden');
                    this.enableButton(true);
                    break;
                case 'not-available':
                    this.statusLabel = 'off-the-menu';
                    this.shadowRoot.querySelector('.triangle').removeAttribute('hidden');
                    this.shadowRoot.querySelector('.status-dish').removeAttribute('hidden');
                    this.enableButton(true);
                    break;
            }
        }

        /**
         * @param {object} price
         * @returns {string}
         * @private
         */
        _computePrice(price) {
            if (!price) {
                return ;
            }
            return price.value;
        }
    }
};
