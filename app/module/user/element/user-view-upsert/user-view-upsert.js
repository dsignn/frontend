import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ServiceInjectorMixin } from "@dsign/polymer-mixin/service/injector-mixin";
import { LocalizeMixin } from "@dsign/polymer-mixin/localize/localize-mixin";
import { StorageEntityMixin } from "@dsign/polymer-mixin/storage/entity-mixin";
import {FormErrorMessage} from "../../../../element/mixin/form-error-message/form-error-message";
import "@fluidnext-polymer/paper-pagination/paper-pagination";
import "@fluidnext-polymer/paper-pagination/icons/paper-pagination-icons";
import '@polymer/iron-form/iron-form';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-input/paper-input';
import { lang } from './language';


/**
 * @customElement
 * @polymer
 */
class UserViewUpsert extends FormErrorMessage(StorageEntityMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement)))) {

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

                paper-button.status { 
                    background-color: green;
                    color: white;
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
                        <paper-input name="name" label="{{localize('name')}}" value="{{entity.name}}" required></paper-input>
                        <paper-input name="lastName" label="{{localize('lastName')}}" value="{{entity.lastName}}" required></paper-input>
                        <div>
                            <paper-dropdown-menu label="{{localize('role')}}" value="{{entity.roleId}}" required>
                                <paper-listbox slot="dropdown-content">
                                    <paper-item value="organizationOwner">organizationOwner</paper-item>
                                    <paper-item value="admin">admin</paper-item>
                                </paper-listbox>
                            </paper-dropdown-menu>
                            <paper-button class="status" disabled>{{localize(entity.status)}}</paper-button>
                        </div>
                        <paper-input name="email" label="{{localize('email')}}" value="{{entity.email}}" required></paper-input>
                        <paper-autocomplete
                            id="widgetAutocomplete"
                            label="{{localize('nameOrganization')}}"
                            text-property="name"
                            value-property="name"
                            on-autocomplete-selected="_selectWidget"
                            on-autocomplete-change="_searchOrganization"
                            on-autocomplete-reset-blur="_clearWidget"
                            remote-source>
                            <template slot="autocomplete-custom-template">
                            
                                <paper-item class="account-item" on-tap="_onSelect" role="option" aria-selected="false">
                                    <div index="[[index]]">
                                        <div class="service-name">[[item.name]]</div>
                                        <div class="service-description">[[item.description]]</div>
                                    </div>
                                    <paper-ripple></paper-ripple>
                                </paper-item>
                            </template>
                        </paper-autocomplete>
                        <paper-chips id="bindChips" items="{{entity.organizations}}" text-property="name"></paper-chips>                          
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

    static get properties() {
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
            services: {
                value: {
                    _notify: "Notify",
                    _localizeService: 'Localize',
                    StorageContainerAggregate: {
                        _storage: "UserStorage",
                        _organizationStorage: "OrganizationStorage"
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

    _searchOrganization(evt) {

        this._organizationStorage.getAll({name: evt.detail.value.text})
            .then(
                (data) => {
                    evt.detail.target.suggestions(data);
                }
            );
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
            }).catch((error) => {
                this.errorMessage(this.$.formUser, error);
            });;

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
 
        if (newValue.organizations && Array.isArray(newValue.organizations) && newValue.organizations.length > 0 ) {

            let promises = [];

            for (let cont = 0; newValue.organizations.length > cont; cont++) {
                promises.push(this._organizationStorage.get( newValue.organizations[cont].id));
            }

            Promise.all(promises).then((organizations) => {
                //console.log('PORCO DIO', organizations);
                for (let cont = 0; newValue.organizations.length > cont; cont++) { 
                    let found = organizations.find((element) => {
                        return newValue.organizations[cont].id === element.id
                    });

                    newValue.organizations[cont] = found;
                }

                this.$.bindChips.shadowRoot.querySelector('dom-repeat').render();
            });
        }
     
        console.log(newValue, this._organizationStorage)
        
    }
}
window.customElements.define('user-view-upsert', UserViewUpsert);
