import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {EntityIdentifier} from "@dsign/library/src/storage/entity/EntityIdentifier";

/**
 * @class PaperFilterStorage
 */
export class PaperFilterStorage extends LocalizeMixin(ServiceInjectorMixin(PolymerElement)) {
 
    static get LIST_TAG_NAME() {
        return [
            'PAPER-INPUT',
            'PAPER-AUTOCOMPLETE',
            'PAPER-INPUT-LIST',
            'PAPER-DROPDOWN-MENU',
            'APP-PAPER-DROPDOWN-MENU',
            'DOM-IF'
        ]
    }
    
    static get template() {
        return html`
            <style>

                :host {
                    display: block;
                }

                paper-card {
                    height: 100%;
                    width: 100%;
                    @apply --paper-filter-storage;
                }
  
            </style>

            <paper-card>
                <slot name="filters"></slot>
            </paper-card>
        `
    }

    static get properties() {
        return {

            services : {
                value : { }
            },

            filters: {
                notify: true,
                value: { }
            },

            inputFilters: {
                value: []
            }
        }
    }

    /**
     * @inheritDoc
     */
    connectedCallback () {
        super.connectedCallback();

        let filterNodes = this.querySelector('[slot="filters"]').childNodes;
        filterNodes.forEach(element => {
            if (this._isInputFilter(element)) {
                this._appendChangeEvent(element);
            }
        });
    }

    /**
     * 
     * @param {Element} element 
     */
    _appendChangeEvent(element) {
        this.inputFilters.push(element);
               
        switch (true) {
            case element.tagName === 'DOM-IF':
                element.addEventListener("dom-change", this._changeDomId.bind(this));
                break;
            case element.tagName === 'PAPER-INPUT':
                setTimeout(() => {
                        element.addEventListener("value-changed", this._valueChanged.bind(this));
                    }, 
                    1000
                );
                break;
            case element.tagName === 'PAPER-AUTOCOMPLETE':
                setTimeout(() => {
                        element.addEventListener("autocomplete-selected", this._valueChanged.bind(this));
                        element.addEventListener("autocomplete-reset-blur", this._deselectChange.bind(this));
                    }, 
                    1000
                );
                break;
               
            case element.tagName === 'PAPER-INPUT-LIST':
                setTimeout(() => {
                        element.addEventListener("list-value-changed", this._valueChanged.bind(this));
                    }, 
                    1000
                );
                break;
            case element.tagName === 'PAPER-DROPDOWN-MENU':
            case element.tagName === 'APP-PAPER-DROPDOWN-MENU':
                setTimeout(() => {
                        element.addEventListener("iron-select", this._selectChange.bind(this));
                        element.addEventListener("paper-dropdown-deselect", this._deselectChange.bind(this));
                    }, 
                    1000
                );       
                break;
        }
    }

    /**
     * @param {Event} evt 
     */
    _valueChanged(evt) {
        evt.preventDefault();
        evt.stopImmediatePropagation();
       
        switch(true) {
            case evt.detail.value === '':
                delete this.filters[evt.target.name];
                break;
            case evt.detail.value instanceof EntityIdentifier:
                this.filters[evt.target.name] = evt.detail.value.id
                break;
            case evt.target.getAttribute('direction') !== null:
                this.filters[evt.target.name] = {
                    'direction':  evt.target.getAttribute('direction'), 
                    'value': parseInt(evt.target.value)
                }
                break;
            case Array.isArray(evt.detail.value) && evt.detail.value.length > 0:
                this.filters[evt.target.name] = evt.detail.value
                break;
            case !!evt.detail.value && !Array.isArray(evt.detail.value):
                this.filters[evt.target.name] = evt.detail.value
                break;
            default:
                delete this.filters[evt.target.name];
        }
        
        console.log('VALUE CHANGE', this.filters);
        let event = new CustomEvent('value-changed', {detail: this.filters});

        this.dispatchEvent(event);
    }

    /**
     * @param {*} evt 
     */
    _changeDomId(evt) {
    
        let filterNodes = this.querySelector('[slot="filters"]').childNodes;
   
        filterNodes.forEach(element => {
            
            if (!this._isInputFilter(element)) {
                return;
            }

            var different = true;
            for (let cont = 0; this.inputFilters.length > cont; cont++) {
                if (element === this.inputFilters[cont]) {
                    different = false;
                    break;
                }
            }

            if (different) {
                this._appendChangeEvent(element);
            }
        });
    }

    /**
     * @param {Event} evt 
     */
    _selectChange(evt) {
        evt.preventDefault();
        evt.stopImmediatePropagation();
        this.filters[evt.target.parentElement.name] = evt.detail.item.value;
        this._dispatch();
    }

    _dispatch() {
        let event = new CustomEvent('value-changed', {detail: this.filters});
        this.dispatchEvent(event);
    }

    /**
     * @param {Event} evt 
     */
    _deselectChange(evt) {
        evt.preventDefault();
        evt.stopImmediatePropagation();

        delete this.filters[evt.target.name];

        let event = new CustomEvent('value-deselect', {detail: this.filters});
        this.dispatchEvent(event);
    }

    _isInputFilter (node) {
        return PaperFilterStorage.LIST_TAG_NAME.includes(node.tagName);
    }
}

window.customElements.define('paper-filter-storage', PaperFilterStorage);
