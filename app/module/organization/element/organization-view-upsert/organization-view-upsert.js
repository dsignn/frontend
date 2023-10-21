import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {NotifyMixin} from "@dsign/polymer-mixin/notify/notify-mixin";
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin";
import {Auth} from "../../../../src/authentication/Auth";
import '@polymer/paper-input/paper-input';
import '@fluidnext-polymer/paper-autocomplete/paper-autocomplete';
import '@fluidnext-polymer/paper-chip/paper-chips';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-form/iron-form';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import '@fluidnext-polymer/paper-input-file/paper-input-file';
import '@polymer/paper-tooltip/paper-tooltip';
import {lang} from './language';

/**
 * @customElement
 * @polymer
 */
class OrganizationViewUpsert extends StorageEntityMixin(NotifyMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement)))) {

    static get template() {
        return html`
          
                <style>
                   
                    iron-form {
                        width: 100%;
                    }

                    #container {
                        padding: var(--padding-top-view-list);
                        @apply --layout-horizontal;
                        @apply --layout-wrap;
                    }
                    
                    .form-action {
                        @apply --layout-horizontal;
                        @apply --layout-end-justified;
                    }

                    .text {
                        font-size: 12px;
                    }

                    #copy {
                        height: 35px;
                    }

                    pre {
                        padding: 16px;
                        overflow: auto;
                        font-size: 85%;
                        line-height: 1.45;
                        color: black;
                        background-color: #f6f8fa;
                        border-radius: 6px;
                        white-space: pre-line;
                    }

                    #code {
                        display:none;
                    }

                </style>
                <slot name="header"></slot>
                <div id="container">
                   <iron-form id="formResource">
                        <form method="post">
                            <div>
                                <paper-input id="name" name="name" label="{{localize('name')}}" value="{{entity.name}}" required></paper-input>
                                <div id="code">
                                    <div class="text">
                                        Token &nbsp&nbsp<paper-icon-button id="copy" icon="copy" on-tap="copyFn"></paper-icon-button>
                                    </div>
                                    <pre>{{entity.oauthToken}}</pre>
                                </div>
                            </div>
                            <div>
                                <div class="flex flex-horizontal-end" style="margin-top: 20px;">
                                    <paper-button id="orgToken" on-tap="generateOrganizationToken">{{localize('generate-token')}}</paper-button>
                                    <paper-button on-tap="submitResourceButton">{{localize(labelAction)}}</paper-button>
                                </div>
                            </div>
                        </form>
                    </iron-form>
                </div>
        `;
    }

    static get properties () {
        return {

            /**
             * @type FileEntity
             */
            entity: {
                observer: '_changeEntity',
                value: {}
            },

            _auth: {
                observer: '_changeAuth',
            },

            /**
             * @type string
             */
            labelAction: {
                type: String,
                value: 'save'
            },

            /**
             * @type object
             */
            services : {
                value : {
                    _notifyService : "Notify",
                    _localizeService: "Localize",
                    _auth: "Auth",
                    StorageContainerAggregate : {
                        _storage :"OrganizationStorage"
                    }
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
        this.$.formResource.addEventListener('iron-form-presubmit', this.submitResource.bind(this));
    }

    /**
     * @param newValue
     * @private
     */
    _changeAuth(newValue) {
        if (!newValue) {
            return;
        }

        newValue.eventManager.on(
            Auth.ORGANIZATION_TOKEN,
            (evt) => {
                this.entity.oauthToken = evt.data.access_token;
                this.notifyPath('entity.oauthToken');
                this._hideToken(false);
            }
        );
    }

    /**
     * @param {bool} hide 
     */
    _hideToken(hide) {
      
        if (hide) {
            this.$.orgToken.style.display = 'unset';
            this.$.code.style.display = 'none';
        } else {
            this.$.orgToken.style.display = 'none';
            this.$.code.style.display = 'unset';
        }
    }

    /**
     * @param newValue
     * @private
     */
    _changeEntity(newValue) {
        this.labelAction = 'save';
        if (!newValue) {
            return;
        }

        if (newValue.id) {
            this.labelAction = 'update';
        } 

        this._hideToken(!newValue.oauthToken);
    }

    /**
     * @param evt
     */
    submitResourceButton(evt) {
        this.$.formResource.submit();
    }

    /**
     * @param evt
     */
    submitResource(evt) {
        evt.preventDefault();

        let method = this.getStorageUpsertMethod();

        this._storage[method](this.entity)
            .then((data) => {
                this.notify(this.localize(method === 'save' ? 'notify-save' : 'notify-update'));
            });

    }

    generateOrganizationToken(evt) {
        this._auth.generateToken(
            this.entity.id
        );
    }

    /**
     * @returns {string}
     */
    getStorageUpsertMethod() {
        return this.entity.id ? 'update' : 'save';
    }

    /** */
    copyFn(evt) {      

        const textArea = document.createElement("textarea");
        textArea.value = this.entity.oauthToken;
            
        // Move textarea out of the viewport so it's not visible
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
            
        document.body.prepend(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (error) {
            console.error(error);
        } finally {
            textArea.remove();
        }
    }
}
window.customElements.define('organization-view-upsert', OrganizationViewUpsert);
