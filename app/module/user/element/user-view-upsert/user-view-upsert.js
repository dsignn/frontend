import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin";
import "@fluidnext-polymer/paper-pagination/paper-pagination";
import "@fluidnext-polymer/paper-pagination/icons/paper-pagination-icons";
import '@polymer/iron-form/iron-form';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-input/paper-input';
import {lang} from './language';


/**
 * @customElement
 * @polymer
 */
class UserViewUpsert extends StorageEntityMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {

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
                
                @media (max-width: 500px) {
                    paper-resource {
                        flex-basis: 100%;
                    }
                }
    
                @media (min-width: 501px) and (max-width: 900px) {
                    paper-resource {
                        flex-basis: 50%;
                    }
                }
    
                @media (min-width: 901px) and (max-width: 1200px) {
                    paper-resource {
                        flex-basis: 33.3%;
                    }
                }
    
                @media (min-width: 1201px) and (max-width: 1500px) {
                    paper-resource {
                        flex-basis: 25%;
                    }
                }
    
                @media (min-width: 1501px) and (max-width: 1919px) {
                    paper-resource {
                        flex-basis: 20%;
                    }
                }
    
                @media (min-width: 1920px) {
                    paper-resource {
                        flex-basis: 16.6%;
                    }
                }
            </style>
            <slot name="header"></slot>
            <div id="container">
                <iron-form id="formUser">
                     <form method="post">
                        <paper-input id="name" name="name" label="{{localize('name')}}" value="{{entity.name}}" required></paper-input>
                        <paper-input id="name" name="lastName" label="{{localize('lastName')}}" value="{{entity.lastName}}" required></paper-input>
                        <paper-input id="name" name="email" label="{{localize('email')}}" value="{{entity.email}}" required></paper-input>
                        <paper-input type="password" id="password" name="password" label="{{localize('password')}}" value="{{entity.password}}" required></paper-input>
                        <paper-input type="password" id="repeatPassword" name="repeatPassword" label="{{localize('repeatPassword')}}" required></paper-input>
                        <paper-dropdown-menu label="{{localize('role')}}" value="{{entity.roleId}}">
                          <paper-listbox slot="dropdown-content">
                            <paper-item>guest</paper-item>
                            <paper-item>admin</paper-item>
                          </paper-listbox>
                        </paper-dropdown-menu>
                        <div>{{entity.status}}</div>
                        <div>
                            <div class="form-action" style="margin-top: 20px;">
                                <paper-button on-tap="submitUsertButton">{{localize(labelAction)}}</paper-button>
                            </div>
                        </div>
                     </form>
                </iron-form>
            </div>
            `;
    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties () {
        return {

            /**
             * @type TimeslotEntity
             */
            entity: {
                observer: '_changeEntity',
                value: {}
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
                    _notify : "Notify",
                    _localizeService: 'Localize',
                    "StorageContainerAggregate": {
                        _storage: "UserStorage"
                    }
                }
            }
        };
    }

    ready() {
        super.ready();
        this.$.formUser.addEventListener('iron-form-presubmit', this.submitUser.bind(this));
    }

    /**
     * @param evt
     */
    submitUsertButton(evt) {
        this.$.formUser.submit();
    }

    /**
     * @param evt
     */
    submitUser(evt) {
        evt.preventDefault();

        let method = this.getStorageUpsertMethod();
        this._storage[method](this.entity)
            .then((data) => {

                if (method === 'save') {

                    // TODO pass to entity manager
                    this.entity = this._storage.getHydrator().hydrate({});
                    this.$.formUser.reset();
                }

                this._notify.notify(this.localize(method === 'save' ? 'notify-save' : 'notify-update'));
            });

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
    }
}
window.customElements.define('user-view-upsert', UserViewUpsert);
