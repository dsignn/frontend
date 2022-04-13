import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { LocalizeMixin } from "@dsign/polymer-mixin/localize/localize-mixin";
import { MenuBehaviour } from '../menu-behaviour/menu-behaviour';

/**
 * @type {Function}
 */
export const MenuItemBehaviour = (superClass) => {

    return class extends mixinBehaviors([LocalizeMixin, MenuBehaviour], superClass) {

        static get properties() {
            return {

                menu: {
                    notify: true,
                    observer: 'changeMenu'
                },

                menuItem: {
                    notify: true,
                    observer: 'menuItemChange'
                },

                enablePrice: {
                    type: Boolean,
                    readOnly: true,
                    notify: true,
                    value: false,
                    observer: 'changeEnablePrice'
                },

                formatPrice: {
                    type: Function,
                    computed: '__computePrice(language, price)'
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
         * @param {string} language
         * @param {object} price
         * @returns {string}
         * @private
         */
        __computePrice(language) {
            if (!language) {
                return;
            }

            return (price) => {

                let value = 0;

                if (!price) {
                    return value;
                }

                if (Intl) {
                    // TODO calculate current from locale??
                    let formatter =  Intl.NumberFormat('it-IT', {style: 'currency', currency: 'EUR'});
                    value = formatter.format(price.value);
                } else {
                    value = price.value + ' ' + price.currency;
                }
                return value
            }
        }

        /**
         * @param {object} menu 
         * @returns 
         */
        changeMenu(menu) {
            if (!menu) {
                return;
            }

            if (menu.fixed_menu) {
                //console.log('Abilita menu fisso', menu.fixed_menu.enable, this);
                this._setEnablePrice(!menu.fixed_menu.enable);
            }

        }

        /**
         * @param {bool} enablePrice 
         */
        changeEnablePrice(enablePrice) {
            //console.log('Visualizza menu', enablePrice);
            if (this.$.price) {
                this.$.price.style.display = enablePrice ?  'flex' : 'none';
            }
        }
    }
};
