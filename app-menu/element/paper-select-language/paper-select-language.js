import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";

import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';
import {lang} from "./language.js";

/**
 * @customElement
 * @polymer
 */
export class PaperSelectLanguage extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {

    static get template() {
        return html`
            <style>
               paper-dropdown-menu {
                width: 100%;
               }
               
               :host {
                  --paper-input-container: {
                    --paper-input-container-color: var(--munu-color);
                    --paper-input-container-focus-color: var(--munu-color);
                    --paper-input-container-input-color: var(--munu-color);
                  }
                }
            </style>
            <paper-dropdown-menu id="category" label="{{localize('language')}}" on-iron-select="_selectLanguage">
                <paper-listbox id="listbox" slot="dropdown-content">
                   <dom-repeat id="menu" items="{{languages}}" as="language">
                        <template>
                             <paper-item value="{{language}}">{{localize(language)}}</paper-item>
                        </template>
                    </dom-repeat>
                </paper-listbox>
            </paper-dropdown-menu>
        `;
    }

    static get properties() {
        return {
            services : {
                value : {
                    _localizeService: 'Localize'
                }
            }
        };
    }

    constructor() {
        super();
        this.resources = lang;
    }

    ready() {
        super.ready();
    }
    /**
     * @param evt
     * @private
     */
    _selectLanguage(evt) {
        this._localizeService.setDefaultLang(evt.detail.item.value);
    }

    /**
     * @param {Localize} localizeService
     */
    changedLocalizeService(localizeService) {
        super.changedLocalizeService(localizeService);
        this.languages = this._localizeService.getLanguages();
        for (let cont = 0; this.languages.length > cont; cont++) {
            if (this.languages[cont] === this.language) {
                this.$.listbox.selected = cont;
                break;
            }
        }
    }
}

window.customElements.define('paper-select-language', PaperSelectLanguage);