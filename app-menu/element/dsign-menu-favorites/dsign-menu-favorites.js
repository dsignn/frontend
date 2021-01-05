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
          width: 100%;
          height: 50px;
          display: flex;
       }
       
       .header {
           height: 100%;
           width: 50px;
           background-image: url(https://via.placeholder.com/150);
           background-position: center center ;
           background-repeat: no-repeat;
           background-size: cover;
           position: relative;
       }
       
       .content {
          flex: 1;
       }
       
       .header-card-content {
          height: 25px;
          display: flex;
          flex-direction: column;
          padding-left: 6px;
          padding-right: 6px;
       }
       
       .header-card-title {
          justify-content: center;
          align-items: flex-start;
       }
       
       .header-card-action {
           align-items: center;
           justify-content: flex-end;
           flex-direction: row;
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
          display: flex;
          flex: 1;
       }
       
       #action {
           display: flex;
           align-items: center;
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
            console.log('EVENTO', evt.data, this.menuItem.id);
            if (evt.data.id === this.menuItem.id) {
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
        this._updateView();
        this._favoriteService.upsertFavorite(this.menuItem);
        this._checkAction();
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
            this.menuItem.totalCount--;
            this._updateView();
            this._favoriteService.upsertFavorite(this.menuItem);
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
}

window.customElements.define('dsign-menu-favorites', DsignMenuFavorites);