import {PolymerElement, html} from "@polymer/polymer/polymer-element";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {Storage} from "@dsign/library/src/storage/Storage";
import '@polymer/paper-icon-button/paper-icon-button';
import {lang} from './language';
import {Listener} from "@dsign/library/src/event/Listener";

/**
 * @class DsignMenuFavorites
 */
class DsignMenuFavorites extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {

    static get template() {
        return html`
    <style> 
    
       :host {
          display: block;
       }
       
       paper-card {
          @apply --layout;
          width: 100%;
          height: 50px;
       }
       
       .header {
           height: 100%;
           width: 50px !important;
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
          height: 25px;
          padding-left: 6px;
          padding-right: 6px;
       }
       
       .header-card-title {
          @apply --layout-center-justified;
          @apply --layout-start;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: start;
       }
       
       .header-card-action {
          @apply --layout-horizontal;
          @apply --layout-center;
          @apply --layout-end-justified;
       }
       
       paper-icon-button {
           margin-left: 4px;
           width: 20px;
           height: 20px;
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
          @apply --layout;
          @apply --layout-flex;
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
          
    </style>
    <paper-card>
        <div id="image" class="header">
          
        </div>
        <div class="content">
             <div class="header-card-content header-card-title">{{_capitalize(menuItem.name.it)}}</div>
             <div class="header-card-content header-card-action">
                   <div class="count">
                     {{menuItem.currentCount}} / {{menuItem.totalCount}}
                   </div>
                   <paper-icon-button id="remove" icon="remove" on-tap="_remove"></paper-icon-button>
                   <paper-icon-button id="add" icon="add" on-tap="_add"></paper-icon-button>
                  
             </div>
        </div>
        <div id="action">
            <paper-menu-button id="paperAction" ignore-select horizontal-align="right">
                <paper-icon-button icon="v-menu" slot="dropdown-trigger" alt="multi menu"></paper-icon-button>
                <paper-listbox slot="dropdown-content" multi>
                    <paper-item on-click="_removeOne">{{localize('remove-one-item')}}</paper-item>
                    <paper-item  on-click="_delete">{{localize('delete')}}</paper-item>
                </paper-listbox>
            </paper-menu-button>
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
                    _favoriteService: 'FavoriteService',
                    _localizeService: 'Localize',
                }
            },

            _favoriteService: {
                observer: 'changeFavoriteService'
            },

            menuItem: {
                notify: true,
                observer: 'changeMenuItem'
            },
        };
    }


    static get observers() {
        return [
            '_observeMenu(menuItem, _config)'
        ];
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
     * @param service
     */
    changeFavoriteService(service) {
        if (!service) {
            return;
        }

        this.updateListener = new Listener(function (evt) {
            if (evt.data['_id'] === this.menuItem['_id']) {
                this.menuItem = evt.data;
                this._updateView();
                this._checkAction();
            }
        }.bind(this));

        service.getEventManager().on(Storage.BEFORE_UPDATE,  this.updateListener);
    }

    /**
     *
     */
    changeMenuItem(menuItem) {
        if (!menuItem) {
            return;
        }

        this._checkAction();
    }

    /**
     * @param evt
     * @private
     */
    _remove(evt) {
        this.menuItem.currentCount--;
        this._favoriteService.upsertFavorite(this.menuItem);
    }

    /**
     * @param evt
     * @private
     */
    _removeOne(evt) {
        if (this.menuItem.totalCount === 1) {
            this._favoriteService.deleteFavorite(this.menuItem).then(() => {
                this.remove();
            });
        } else {

            this._updateView();
            this._favoriteService.removeFavorite(this.menuItem);
            this._checkAction();
            this.$.paperAction.close();
        }
    }

    /**
     * @param evt
     * @private
     */
    _delete(evt) {
        this._favoriteService.deleteFavorite(this.menuItem).then(() => {
            this.remove();
        });
    }

    /**
     * @param evt
     * @private
     */
    _add(evt) {
        this.menuItem.currentCount++;
        this._updateView();
        this._favoriteService.upsertFavorite(this.menuItem);
        this._checkAction();
    }

    /**
     * @private
     */
    _updateView() {
        this.notifyPath('menuItem.currentCount');
        this.notifyPath('menuItem.totalCount');
    }

    /**
     * @private
     */
    _checkAction() {
        if (!this.menuItem.currentCount) {
            this.$.remove.disabled = true;
        } else {
            this.$.remove.disabled = false;
        }

        if (this.menuItem.totalCount > this.menuItem.currentCount ) {
            this.$.add.disabled = false;
        } else {
            this.$.add.disabled = true;
        }
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
}

window.customElements.define('dsign-menu-favorites', DsignMenuFavorites);