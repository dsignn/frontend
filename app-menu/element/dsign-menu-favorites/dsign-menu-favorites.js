import {PolymerElement, html} from "@polymer/polymer/polymer-element";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {Storage} from "@dsign/library/src/storage/Storage";
import {Listener} from "@dsign/library/src/event/Listener";
import {OrderBehaviour} from "../mixin/order-behaviour/order-behaviour";
import '@polymer/paper-icon-button/paper-icon-button';
import {lang} from './language';

/**
 * @class DsignMenuFavorites
 */
class DsignMenuFavorites extends OrderBehaviour(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
    <style> 
    
       :host {
          display: block;
       }
       
       paper-card {
          @apply --layout;
          width: 100%;
          height: 60px;
       }
       
       .header {
           height: 100%;
           width: 60px !important;
           background-position: center center ;
           background-repeat: no-repeat;
           background-size: cover;
           position: relative;
           border-right: 2px solid #eeeeee;
       }
       
       .content {
          flex: 1;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
       }
       
       .header-card-content {
          @apply --layout-vertical;
          height: 30px;
          padding-left: 4px;
          padding-right: 4px;
       }
       
       .header-card-title {
          @apply --layout-center-justified;
          @apply --layout-start;
          font-size: 18px;
          line-height: 30px;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: start;
       }
       
       .header-card-action {
          position: relative;
          @apply --layout-horizontal;
          @apply --layout-center;
          @apply --layout-end-justified;
       }
       
       paper-icon-button {

           width: 22px;
           height: 22px;
           border-radius: 50%;
           --paper-icon-button : {
                padding: 0;
           }       
           background-color: var(--munu-background-color);
           color: var(--munu-color);
       }
       
       paper-icon-button[disabled] {
            background-color:#757575;
       }
       
       .count {
          font-weight: 500;
          min-width: 34px;
          text-align: center;
       }
       
       .partial-price {
           @apply --layout;
           @apply --layout-flex;
           @apply --layout-end-justified;
           font-weight: 600;
           font-size: 18px;
       }
       
       #action {
           width: 40px !important;
           @apply --layout;
           @apply --layout-center;
       }
       
       #action paper-icon-button {
           background-color: #FFFFFF;
           color: #000000;
       }
       
       .triangle {
           position: absolute;
           width: 0;
           height: 0;
           font-size: 8px;
           border-top: 56px solid #fc0303;
           border-right: 56px solid transparent;
       }
       
       .status-dish {
          top: 10px;
          right: 26px;
          transform:rotate(315deg);
          -webkit-transform: rotate(315deg);
          -o-transform: rotate(315deg);
          -moz-transform: rotate(315deg);
          -ms-transform: rotate(315deg);
          position: absolute;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
       }
       
       [hidden] {
          visibility: hidden;
       }
    </style>
    <paper-card>
        <div id="image" class="header">
            <div class="triangle"></div>
            <div class="status-dish">{{localize(statusLabel)}}</div>
        </div>
        <div class="content">
             <div class="header-card-content header-card-title">{{_capitalize(menuItem.name.it)}}</div>
             <div class="header-card-content header-card-action">
               
                   <paper-icon-button id="remove" icon="remove" on-tap="removeFavorite"></paper-icon-button>
                   <div class="count"> {{menuItem.totalCount}}</div>
                   <paper-icon-button id="add" icon="add" on-tap="addOneFavorite"></paper-icon-button>
                   <div class="partial-price">{{amount(menuItem)}}</div>
             </div>
        </div>
   
    </paper-card>
     `;
    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties() {
        return {
            services: {
                value: {
                    _config: 'config',
                    _localizeService: 'Localize',
                    _orderService: 'OrderService'
                }
            },

            menuItem: {
                notify: true
            },

            amount: {
                type: Function,
                computed: '__computeAmount(menuItem)'
            },

            statusLabel: {
                notify: true
            },

            _menuStorage: {
                readOnly: true,
                observer: 'changeMenuStorage'
            }
        };
    }


    static get observers() {
        return [
            '_observeMenu(menuItem, _config)',
            '_observeMenuStatus(menuItem.status)'
        ];
    }

    /**
     * @returns {function(*): *}
     * @private
     */
    __computeAmount() {

        return (menuItem) => {

            if (!menuItem) {
                return ;
            }

            let amount = 0
            for(let index = 0; menuItem.totalCount > index; index++) {
                amount = amount + menuItem.price.value;
            }
            return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
        }
    }

    /**
     * @param value
     * @returns {string}
     * @private
     */
    _capitalize(value) {
        return typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : '';
    }

    /**
     * @param status
     */
    _observeMenuStatus(status) {

        if (!status) {
            return;
        }

        switch (status) {
            case 'available':
                this.statusLabel = '';
                this.shadowRoot.querySelector('.triangle').setAttribute('hidden', '');
                this.shadowRoot.querySelector('.status-dish').setAttribute('hidden', '');
                this.shadowRoot.querySelector('.status-dish').style.top = '10px';
                this.shadowRoot.querySelector('.partial-price').style.textDecoration = 'auto';
                this.enableButton(false);
                break;
            case 'over':add
                this.statusLabel = 'finished';
                this.shadowRoot.querySelector('.triangle').removeAttribute('hidden');
                this.shadowRoot.querySelector('.status-dish').removeAttribute('hidden');
                this.shadowRoot.querySelector('.status-dish').style.top = '16px';
                this.shadowRoot.querySelector('.partial-price').style.textDecoration = 'line-through';
                this.enableButton(true);
                break;
            case 'not-available':
                this.statusLabel = 'off-the-menu';
                this.shadowRoot.querySelector('.triangle').removeAttribute('hidden');
                this.shadowRoot.querySelector('.status-dish').removeAttribute('hidden');
                this.shadowRoot.querySelector('.partial-price').style.textDecoration = 'line-through';
                this.enableButton(true);
                break;
        }
    }

    /**
     * @param {Storage} menuStorage
     */
    changeMenuStorage(menuStorage) {
        if (!menuStorage) {
            return;
        }

        this.updateListener = new Listener(function (evt) {
            if (evt.data['_id'] === this.menuItem['_id']) {
                this.menuItem =  null;
                this.notifyPath('menuItem');
                this.menuItem = evt.data;
                this._updateView();
            }
        }.bind(this));

        menuStorage.getEventManager().on(Storage.POST_UPDATE,  this.updateListener);
    }

    /**
     * @private
     */
    _updateView() {
        this.notifyPath('menuItem.currentCount');
        this.notifyPath('menuItem.totalCount');
    }

    /**
     * @param menu
     * @param config
     * @private
     */
    _observeMenu(menu, config) {
        if (!menu || !config) {
            return;
        }

        if (menu.photos && Array.isArray(menu.photos) && menu.photos.length > 0) {
            this.$.image.style.backgroundImage = `url(${menu.photos[0].src})`;
        } else {
            this.$.image.style.backgroundImage = 'url(https://dsign-asset.s3.eu-central-1.amazonaws.com/dish-not-found.png)';
            this.$.image.style.backgroundSize = `cover`;
        }
    }

    /**
     * @param enable
     */
    enableButton(enable) {
        this.$.remove.disabled = enable;
        this.$.add.disabled = enable;
    }
}

window.customElements.define('dsign-menu-favorites', DsignMenuFavorites);