import {StoragePaginationMixin} from "@dsign/polymer-mixin/storage/pagination-mixin";
import {StorageCrudMixin} from "@dsign/polymer-mixin/storage/crud-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import "@polymer/paper-input/paper-input";
import {lang} from './language';

/**
 * @customElement
 * @polymer
 */
class UserMe extends StoragePaginationMixin(StorageCrudMixin(LocalizeMixin(ServiceInjectorMixin(PolymerElement)))) {
    /**
     * @returns {HTMLTemplateElement}
     */
    static get template() {
        return html`
            <style>
            
                .container {
                     @apply --layout-horizontal;
                }
                
                .avatar {
                    margin: 6px;
                   border-radius: 50%;
                   background-color: red;
                   height: 50px;
                   width: 50px;
                   
                }
                
                .name {
                    padding-left: 8px;
                     @apply --layout-vertical;
                     @apply --layout-center-justified;
                }
                
                .name .text {
                    @apply --layout;
                    @apply --layout-start;
                }

                .test {
                 background-color: red;
                }
            </style>
            <div class="container">
                <div class="avatar">
                
                </div>
                <div class="name">
                    <div class="text">
                        <paper-input label="{{localize('name')}}"></paper-input>
                    </div>
                    <div class="text">
                         <paper-input label="{{localize('surname')}}"></paper-input>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * @constructor
     */
    constructor() {
        super();
        this.resources = lang;
    }


    /**
     * @returns {object}
     */
    static get properties () {
        return {
            /**
             * @type object
             */
            services : {
                value : {
                    _localizeService: 'Localize'
                }
            }
        }
    }

}
window.customElements.define('user-me', UserMe);