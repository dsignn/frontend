import {PolymerElement, html} from "@polymer/polymer/polymer-element";
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";

/**
 * @class DsignMenuFavorites
 */
class DsignMenuFavorites extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {

    static get template() {
        return html`
    <style> 
    
       :host {
          display: block;
       }
    

          
    </style>
    <paper-card>
        <div id="image" class="header">
          
        </div>
        <div class="content">
             <div class="header-card-title">{{menuItem.name.it}}</div>
        </div>
    </paper-card>
     `;
    }
}

window.customElements.define('dsign-menu-favorites', DsignMenuFavorites);