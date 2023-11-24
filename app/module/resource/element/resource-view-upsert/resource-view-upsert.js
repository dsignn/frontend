import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ServiceInjectorMixin } from "@dsign/polymer-mixin/service/injector-mixin";
import { LocalizeMixin } from "@dsign/polymer-mixin/localize/localize-mixin";
import { NotifyMixin } from "@dsign/polymer-mixin/notify/notify-mixin";
import { StorageEntityMixin } from "@dsign/polymer-mixin/storage/entity-mixin";
import { AclMixin } from '@dsign/polymer-mixin/acl/acl-mixin';
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
import { lang } from './language';


/**
 * @customElement
 * @polymer
 */
class ResourceViewUpsert extends StorageEntityMixin(NotifyMixin(AclMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement))))) {

    static get template() {
        return html`
          
                <style>
                    iron-form {
                        width: 100%;
                    }
                    
                    video {
                        outline: none;
                    }
                    
                    .name {
                       @apply --layout-horizontal;
                       @apply --layout-center;
                    }
                    
                     .name paper-input {
                       width: 100%;
                       margin-right: 12px;
                    }
                    
                    #container {
                        padding: var(--padding-top-view-list);
                        @apply --layout-horizontal;
                        @apply --layout-wrap;
                    }
                </style>
                <slot name="header"></slot>
                <div id="container">
                   <iron-form id="formResource">
                        <form method="post">
                            <div>
                                <div class="name">
                                    <paper-input id="name" name="name" label="{{localize('name')}}" value="{{entity.name}}" required></paper-input>
                                    <paper-icon-button on-tap="openViewer" icon="resource:viewer"></paper-icon-button>
                                </div>
                                <template id="domIf" is="dom-if" if="{{isAllowed('resource', 'post')}}">
                                <paper-autocomplete
                                    id="orgAutocomplete"
                                    label="{{localize('name-organization')}}"
                                    text-property="name"
                                    value-property="name"
                                    remote-source
                                    value="{{entity.organizationReference}}"
                                    on-autocomplete-change="_defaultChanged"
                                    required>
                                        <template slot="autocomplete-custom-template">
                                            <paper-item class="account-item" on-tap="_onSelect" role="option" aria-selected="false">
                                                <div index="[[index]]">
                                                    <div class="service-name">[[item.name]]</div>
                                                </div>
                                            </paper-item>
                                        </template>
                    
                                        <iron-icon icon="info" slot="suffix"></iron-icon>
                                </paper-autocomplete>
                            </template>
                                <paper-input-file id="fileUpload" label="{{localize('search-file')}}" accept="image/png, image/jpeg, video/*, audio/*, application/zip, application/pdf"></paper-input-file>
                                <div>
                                    <paper-input id="tag" name="name" label="{{localize('tag')}}" on-keypress="addTag"></paper-input>
                                    <paper-chips id="chips" items="{{entity.tags}}"></paper-chips>
                                </div>
                            </div>
                            <div>
                                <div class="flex flex-horizontal-end" style="margin-top: 20px;">
                                    <paper-button on-tap="submitResourceButton">{{localize(labelAction)}}</paper-button>
                                </div>
                            </div>
                        </form>
                    </iron-form>
                    <paper-dialog id="viewer" entry-animation="scale-up-animation" exit-animation="fade-out-animation">
                        <img>
                    </paper-dialog>
                </div>
        `;
    }

    static get properties() {
        return {

            /**
             * @type FileEntity
             */
            entity: {
                observer: '_changeEntity',
                value: { type: "text/html", tags: [] }
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
                    _notifyService: "Notify",
                    _localizeService: 'Localize',
                    _aclService: "Acl",
                    "HydratorContainerAggregate": {
                        _resourceHydrator: "ResourceEntityHydrator"
                    },
                    StorageContainerAggregate: {
                        _storage: "ResourceStorage",
                        organizationStorage: "OrganizationStorage"
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
     * @param evt
     */
    addTag(evt) {
        if (evt.charCode === 13 && evt.target.value) {
            this.$.chips.add(evt.target.value);
            this.$.tag.value = "";
        }
    }



    /**
     * @param newValue
     * @private
     */
    _changeEntity(newValue, oldValue) {
        this.labelAction = 'save';

        if (oldValue && oldValue.id != newValue.id && newValue.organizationReference && newValue.organizationReference.id) {
      
            this.organizationStorage.get(newValue.organizationReference.id)
                .then((entity) => {
                    this.entity.organizationReference = entity;
                    this.notifyPath('entity.organizationReference');
                    this.shadowRoot.querySelector('#orgAutocomplete').disabled = true;
                });
        } else if(this.shadowRoot.querySelector('#orgAutocomplete')) {
            this.shadowRoot.querySelector('#orgAutocomplete').disabled = false;
        }

        if (!newValue) {
            return;
        }

        if (newValue.id) {
            this.labelAction = 'update';
        }
    }


    /**
     * @param evt
     * @private
     */
    _defaultChanged(evt) {
        if (!this.organizationStorage) {
            return;
        }

        this.organizationStorage
            .getAll({ name: evt.detail.value.text })
            .then(
                (data) => {
                    this.shadowRoot.querySelector('#orgAutocomplete').suggestions(data);
                }
            );
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

        /*
        let template = this.$.fileUpload.files[0] ?
            this.$.fileUpload.files[0] : (method === 'update' ?
                { id: this.entity.id, mime_type: this.entity.mimeType } : null);

        if (this.entity.id) {
            template.id = this.entity.id;
            template.organizationReference = this.entity.organizationReference;
        }
        */

        let entity = this._resourceHydrator.hydrate(this.entity);
       // entity.name = this.$.name.value;
       // entity.tags = this.entity.tags;
    
        if (this.$.fileUpload.files[0]) {
            entity.resourceToImport = this.$.fileUpload.files[0];
        } else if (method === 'save') {
            this.$.fileUpload.errorMessage = 'File obbligatorio';
            this.$.fileUpload.invalid = true;
            return;
        }

        console.log('ppp', entity);
        this._storage[method](entity)
            .then((data) => {

                if (method === 'save') {
                    this.entity = this._storage.getHydrator().hydrate({ type: "text/html" });
                    // TODO spostarlo nel componente
                    this.$.fileUpload.errorMessage = '';
                    this.$.fileUpload.invalid = false;
                    this.$.formResource.reset();
                }

                this.$.fileUpload.reset();
                this.notify(this.localize(method === 'save' ? 'notify-save' : 'notify-update'));
            });

    }

    /**
     * @param evt
     */
    openViewer(evt) {
        this._appendTagOnViewer();
        setTimeout(
            () => {
                this.$.viewer.open();
            },
            300
        )
    }

    /**
     * @private
     */
    _appendTagOnViewer() {
        for (let i = 0; i < this.$.viewer.children.length; i++) {
            this.$.viewer.children[i].remove();
        }

        let element;
        switch (this.entity.mimeType) {
            case 'image/png':
            case 'image/jpeg':
                console.log('DIO CANE :)');
                element = document.createElement('img');
                element.setAttribute('src', this.entity.src + '?cache=' + Date.now());
                break;
            case 'video/mp4':
                element = document.createElement('video');
                element.setAttribute('controls', '');
                element.setAttribute('src', this.entity.src);
                break;

        }

        if (element) {
            this.$.viewer.appendChild(element);
        }

    }

    /**
     * @returns {string}
     */
    getStorageUpsertMethod() {
        return this.entity.id ? 'update' : 'save';
    }
}
window.customElements.define('resource-view-upsert', ResourceViewUpsert);
