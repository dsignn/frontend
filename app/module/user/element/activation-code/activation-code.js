import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import {AclMixin} from "@dsign/polymer-mixin/acl/acl-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import "@polymer/paper-button/paper-button";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-spinner/paper-spinner";
import "@polymer/iron-form/iron-form";
import {lang} from './language';

/**
 * @ActivationCode
 */
class ActivationCode extends LocalizeMixin(AclMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
      <style>
        #activationCodeContainer {
            padding: 6px;
            @apply --layout-vertical;
            @apply --layout-center;
        }
        
        h2 {
            text-align: center;
        }
        
        #activationCode {
            max-width: 1024px;
            width: 100%;
        }
        
        .error {
            color: red;
        }
        
        #ko, #ok {
            display: none;
        }
        
        [center] {
            text-align: center;
        }
        
      </style>
      <div id="activationCodeContainer">
        <div id="activationCode">
            <div id="load"><paper-spinner></paper-spinner></div>
            <div id="ok">
                <h2>{{localize('activation-code')}}</h2>
                <div center>{{localize('activation-code-text')}}</div>
            </div>
            <div id="ko">
                <h2 class="error">{{localize('error')}}</h2>
                <div center>{{localize(errorMessage)}}</div>
            </div>
        </div>
      </div>`;

    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties() {
        return {

            query: {
                notify: true

            },

            services: {
                value: {
                    _notify: "Notify",
                    _localizeService: 'Localize',
                    StorageContainerAggregate: {
                        activationCodeStorage: "ActivationCodeStorage"
                    }
                }
            },

            activationCodeStorage: {
                readOnly: true
            },
        };
    }

    static get observers() {
        return [
            'updateActivationCode(activationCodeStorage, query)'
        ]
    }


    /**
     *
     * @param activationCodeStorage
     * @param query
     */
    updateActivationCode(activationCodeStorage, query) {

        if (!activationCodeStorage || !query) {
            return;
        }

        if (query && query.token) {

            this.activationCodeStorage.save({
                token: query.token
            }).then((data) => {
                this.$.load.style.display = "none";
                this.$.ok.style.display = "block";
                this._notify.notify(this.localize('activation-code-ok'));

            }).catch((error) => {
                this.$.load.style.display = "none";
                this.$.ko.style.display = "block";
                this.errorMessage = 'not-found';
            });
        }
    }

}

window.customElements.define('activation-code', ActivationCode);