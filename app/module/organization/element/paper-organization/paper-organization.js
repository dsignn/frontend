import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {StorageEntityMixin} from "@dsign/polymer-mixin/storage/entity-mixin";
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-menu-button/paper-menu-button';
import {lang} from './language';

/**
 * @customElement
 * @polymer
 */
class PaperOrganization extends StorageEntityMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement))) {

    static get template() {
        return html`
            <style >
                paper-card {
                    @apply --layout-horizontal;
                    @apply --application-paper-card;
                    margin-right: 4px;
                    margin-bottom: 4px;
                }
                
                #leftSection {
                    width: 80px;
                    min-height: 120px;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    @apply --application-paper-card-left-content;
                }
                
                #fastAction {
                    border-right: 1px solid var(--divider-color);
                }
                
                #fastAction .action {
                    height: 30px;
                    @apply --layout;
                    @apply --layout-center
                    @apply --layout-center-justified;
                }
                
                #rightSection {
                    @apply --layout-horizontal;
                    @apply --layout-flex;
                }
                
                          
                #content {
                    @apply --layout-flex;
                    padding: 4px;
                    word-break: break-all;
                    overflow: hidden;
                }  
                   
                paper-menu-button {
                    padding: 0;
                }
                
                .name {
                    overflow: hidden;
                    height: 20px;
                }
                
                .dimension, 
                .size,
                .video {
                    padding-top: 4px;
                    font-size: 14px;
                    font-style: italic;
                }
                
                .imgBackground {
                    background-image: url("../../module/resource/element/paper-resource/img/image.jpeg") !important;
                }
    
                .videoBackground {
                    background-image: url("../../module/resource/element/paper-resource/img/video.jpeg") !important;
                }
    
                .webBackground {
                    background-image: url("../../module/resource/element/paper-resource/img/web.jpeg") !important;
                }
    
                .audioBackground {
                    background-image: url("../../module/resource/element/paper-resource/img/audio.jpeg") !important;
                }

    
            </style>
            <paper-card>
                <div id="leftSection"></div>
                <div id="fastAction">
                    <div class="action">
                        <paper-icon-button id="previewButton" icon="resource:preview" on-tap="_openPreview"></paper-icon-button>
                        <paper-tooltip for="previewButton" position="right">{{localize('preview-resource')}}</paper-tooltip>
                    </div>
                </div>
                <div id="rightSection">
                    <div id="content">
                        <div class="name">{{entity.name}}</div>
                        <div class="size">
                            <div>{{size}} {{sizeLabel}}</div>
                        </div>
                        <template is="dom-if" if="{{entity.dimension.height}}">
                            <div class="dimension">{{entity.dimension.width}} px {{entity.dimension.height}} px</div>
                        </template>
                        <template is="dom-if" if="{{entity.fps}}">
                            <div class="video">{{entity.fps}} fps</div>
                        </template>
                    </div>
                    <div id="crud">
                        <paper-menu-button ignore-select horizontal-align="right">
                            <paper-icon-button icon="v-menu" slot="dropdown-trigger" alt="multi menu"></paper-icon-button>
                            <paper-listbox slot="dropdown-content" multi>
                                <paper-item on-click="_update">{{localize('modify')}}</paper-item>
                                <paper-item  on-click="_delete">{{localize('delete')}}</paper-item>
                            </paper-listbox>
                        </paper-menu-button>
                    </div>
                </div>
            </paper-card>
            <paper-dialog id="previewDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_closePreview">
                <div class="title">Preview</div>
                <paper-dialog-scrollable>
                   <div id="contentPreview"></div>
                </paper-dialog-scrollable>
            </paper-dialog>
        `
    }

    constructor() {
        super();
        this.resources = lang;
    }

    static get properties () {
        return {


            /**
             * @type FileEntity
             */
            entity: {
               
            },

            /**
             * @type true
             */
            autoUpdateEntity: {
                value: true
            },

            /**
             * @type object
             */
            services : {
                value : {
                    _localizeService: 'Localize',
                    _resourceService : "ResourceService",
                    StorageContainerAggregate: {
                        "_storage":"OrganizationStorage"
                    }
                }
            },

            /**
             * @type StorageInterface
             */
            _storage: {
                type: Object,
                readOnly: true
            },

            /**
             * @type ResourceService
             */
            _resourceService: {
                type: Object,
                readOnly: true
            }
        }
    }

    /**
     * @param evt
     * @private
     */
    _update(evt) {
        this.dispatchEvent(new CustomEvent('update', {detail: this.entity}));
    }

    /**
     * @param evt
     * @private
     */
    _delete(evt) {
        this.dispatchEvent(new CustomEvent('delete', {detail: this.entity}));
    }
}
window.customElements.define('paper-organization', PaperOrganization);