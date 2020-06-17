import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "../../../../mixin/service/injector-mixin";
import {LocalizeMixin} from "../../../../mixin/localize/localize-mixin";
import {NotifyMixin} from "../../../../mixin/notify/notify-mixin";
import {StorageEntityMixin} from "../../../../mixin/storage/entity-mixin";
import {MongoIdGenerator} from "@dsign/library/src/storage/util/MongoIdGenerator";
import '@polymer/paper-input/paper-input';
import '@fluidnext-polymer/paper-autocomplete/paper-autocomplete';
import '@polymer/iron-form/iron-form';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-tooltip/paper-tooltip';
import '../paper-monitor/paper-monitor';
import '../../element/paper-monitor-update/paper-monitor-update';
import '../../../../../element/paper-input-points/paper-input-points';
import {lang} from './language';

/**
 * @class MonitorViewUpsert
 */
class MonitorViewUpsert extends StorageEntityMixin(NotifyMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement)))) {

    static get template() {
        return html`
        <style>
        
            #monitorUpdate {
                margin-bottom: 10px;
            }
        
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
                    _notifyService: 'Notify',
                    "HydratorContainerAggregate" : {
                        _monitorHydrator : "MonitorEntityHydrator"
                    },
                    StorageContainerAggregate : {
                        _storage :"MonitorStorage"
                    }
                }
            },
        };
    }

    constructor() {
        super();
        this.resources = lang;
    }

    ready() {
        super.ready();
        this.$.formMonitor.addEventListener('iron-form-presubmit', this.submitMonitor.bind(this));
        this.$.formMonitorContainer.addEventListener('iron-form-presubmit', this.submitMonitorContainer.bind(this));
        this.addEventListener('remove-monitor', this.removeMonitor.bind(this), true)
    }

    /**
     * @param {CustomEvent} evt
     */
    submitMonitorContainerButton(evt) {
        this.$.formMonitorContainer.submit();
    }

    /**
     * @param evt
     */
    submitMonitorContainer(evt) {
        let method = this.getStorageUpsertMethod();
        this._storage[method](this.entity)
            .then((data) => {

                if (method === 'save') {
                    this.entity = this._storage.getHydrator().hydrate({});
                    this.$.formMonitorContainer.reset();
                }

                this.notify(this.localize(method === 'save' ? 'notify-save' : 'notify-update'));
            });
    }

    /**
     * @param {CustomEvent} evt
     */
    submitMonitorButton(evt) {
        this.$.formMonitor.submit();
    }

    /**
     * @param {CustomEvent} evt
     */
    submitMonitor(evt) {
        evt.preventDefault();
        let obj = this.$.formMonitor.serializeForm();
        obj['polygonPoints'] = this.$.points.value ? this.$.points.value : [];
        let monitor = this._monitorHydrator.hydrate(obj);

        monitor.setId(MongoIdGenerator.statcGenerateId());

        // TODO nested monitor
        if (this.$.parentMonitor.value) {

            this.$.parentMonitor.value.addMonitor(monitor);
            let element = MonitorViewUpsert.searchPaperMonitorUpdate(this, this.$.parentMonitor.value.id);
            element.notifyPath('entity.monitors.splice');

        } else {
            this.entity.addMonitor(monitor);
            this.notifyPath('entity.monitors.splice')
        }
        this.$.parentMonitor.clear();
        this.$.points.clear();
        this.$.formMonitor.reset();
    }

    /**
     * @param {CustomEvent} evt
     * @private
     */
    _changeMonitor(evt) {

        // TODO remove when fix paper autocomplete
        if (!evt.detail.text) {
            return;
        }

        let monitors = this.entity.getMonitors({nested:true});
        let filter = monitors.filter(
            element => {
                return element.name.search(new RegExp(evt.detail.text, 'i')) > -1;
            }
        );

        evt.detail.target.suggestions(
            filter
        );
    }

    /**
     * @param {CustomEvent} evt
     */
    removeMonitor(evt) {

        let parentMonitor = this.entity.getParent(evt.detail.id);
        this.entity.removeMonitor(evt.detail);
        if (parentMonitor) {
            let element = MonitorViewUpsert.searchPaperMonitorUpdate(this, parentMonitor.id);
            element.notifyPath('entity.monitors.splice');
        } else {
            this.notifyPath('entity.monitors.splice')
        }
    }

    /**
     * @param node
     * @param id
     * @return {*}
     * @private
     */
    static searchPaperMonitorUpdate(node, id) {
        let list = node.shadowRoot.querySelectorAll('paper-monitor-update');
        let found = null;
        for (let cont = 0; list.length > cont; cont++) {

            if (list[cont].identifier === id) {
                found = list[cont];
                break;
            } else {
                found = found || MonitorViewUpsert.searchPaperMonitorUpdate(list[cont], id);
            }
        }
        return found;
    }

}

window.customElements.define('monitor-view-upsert', MonitorViewUpsert);