import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "../../../../mixin/service/injector-mixin";
import {LocalizeMixin} from "../../../../mixin/localize/localize-mixin";
import {NotifyMixin} from "../../../../mixin/notify/notify-mixin";
import {StoragePaginationMixin} from "../../../../mixin/storage/pagination-mixin";
import '@polymer/paper-input/paper-input';
import '@fluidnext-polymer/paper-autocomplete/paper-autocomplete';
import '@polymer/iron-form/iron-form';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-tooltip/paper-tooltip';
import '../paper-monitor/paper-monitor';
import {lang} from './language';

/**
 * @class MonitorViewUpsert
 */
class MonitorViewUpsert extends StoragePaginationMixin(NotifyMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement)))) {

    static get template() {
        return html`
        <style>
            #container {
                @apply --layout-horizontal;
                padding: 10px 20px;
            }
            
            #content-left {
                padding-right: 8px;
            }
            
            paper-card {
                width: 100%;
                padding: 10px;
            }
        
            @media (max-width: 900px) {
                #container {
                    @apply --layout-vertical-reverse;
                }
            
                #content-left {
                    @apply --layout-flex;
                }
                
                #content-right {
                    @apply --layout-flex;
                }
            }
                
            @media (min-width: 901px) {
                #container {
                     @apply  --layout-horizontal;
                }
            
                #content-left {
                   @apply --layout-flex-8;
                }
                
                #content-right {
                   @apply --layout-flex-4;
                }
            }
        </style>
        <slot name="header"></slot>
        <div id="container">
            <div id="content-left">
                <iron-form id="formMonitorContainer">
                    <form method="post" action="">
                        <paper-input name="name" label="{{localize('name')}}" value="{{entity.name}}" required></paper-input>
                        <div id="monitorUpdate">
                            <dom-repeat items="{{entity.monitors}}" as="monitor">
                                <template>
                                      <paper-monitor-update entity="{{monitor}}" on-toogle-always-on-top-monitor="_toogleAlwaysOnTop" hidden-always-on-top="{{showAlwaysOnTop}}"></paper-monitor-update>   
                                </template>
                            </dom-repeat>
                        </div>
                        <paper-button on-tap="submitMonitorContainerButton">{{localize(labelAction)}}</paper-button>
                    </form>
                </iron-form>
            </div>
            <div id="content-right">
                <paper-card class="container">
                    <iron-icon id="info" icon="info" class="info"></iron-icon>
                    <paper-tooltip for="info" position="bottom">{{localize('monitor-to-add')}}</paper-tooltip>
                    <iron-form id="formMonitor">
                        <form method="post">
                            <paper-input name="name" label="{{localize('name')}}" required></paper-input>
                            <paper-input name="height" label="{{localize('height')}}" type="number" required></paper-input>
                            <paper-input name="width" label="{{localize('width')}}" type="number" required></paper-input>
                            <paper-input name="offsetX" label="{{localize('offsetX')}}" type="number" required></paper-input>
                            <paper-input name="offsetY" label="{{localize('offsetY')}}" type="number" required></paper-input>
                            <paper-input-points id="points"></paper-input-points>
                            <paper-autocomplete id="parentMonitor" 
                                label="{{localize('father-monitor')}}" 
                                text-property="name" 
                                on-autocomplete-change="_changeMonitor"
                                remote-source>
                            </paper-autocomplete>
                            <div class="layout-horizontal layout-end-justified">
                                <paper-button on-tap="submitMonitorButton">{{localize('add')}}</paper-button>
                            </div>
                        </form>
                    </iron-form>
                </paper-card>
            </div>
        </div>`;
    }
    static get properties() {
        return {

            /**
             * @type Number
             */
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
                    _localizeService: 'Localize',
                    _notifyService: 'Notify'
                }
            },
        };
    }

    constructor() {
        super();
        this.resources = lang;
    }

}

window.customElements.define('monitor-view-upsert', MonitorViewUpsert);