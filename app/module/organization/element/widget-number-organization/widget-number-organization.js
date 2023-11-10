import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ServiceInjectorMixin } from "@dsign/polymer-mixin/service/injector-mixin";
import { LocalizeMixin } from "@dsign/polymer-mixin/localize/localize-mixin";
import { StorageEntityMixin } from "@dsign/polymer-mixin/storage/entity-mixin";
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-menu-button/paper-menu-button';
import { lang } from './language';
import { RefreshCollectionData } from '../../../../element/mixin/auth/refresh-collection-data';
import { StorageCrudMixin } from '@dsign/polymer-mixin/storage/crud-mixin';

/**
 * @customElement
 * @polymer
 */
class WidgetNumberOrganization extends RefreshCollectionData(StorageCrudMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement)))) {

    static get template() {
        return html`
            <style>
                :host {
                    display: block;
                }

                .content {
                    font-size:8vw;
                    display: flex;
                    align-item: center;
                    justify-content: center;
                }
            </style>
            <div class="content">{{count}}</div>
        `
    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties() {
        return {

            count: {
                notify: true,
                value: null
            },

            itemPerPage: {
                value: 1
            },

            page: {
                value: 1
            },

            services: {
                value: {
                    _authService: "Auth",
                    _localizeService: 'Localize',
                    StorageContainerAggregate: {
                        _storage: "OrganizationStorage"
                    }
                }
            }
        }
    }


    static get observers() {
        return [
            '_changeAuthStorage(_authService, _storage)'
        ]
    }

    /**
     * @return {string}
     */
    getTitle() {
        return this.localize('title');
    }

    /**
     * @return {string}
     */
    getSubTitle() {
        return '';
    }

    /**
      * @private
      */
    getPagedEntities() {

        if (!this._storage) {
            return;
        }

        this._storage.getPaged(this.page, this.itemPerPage, this.filter)
            .then((data) => {
               this.count = data.totalItems;
            });


    }
}
window.customElements.define('widget-number-organization', WidgetNumberOrganization);
