/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button';
/**
 * @class DsignInfo
 */
class DsignInfo extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                bottom: 12px;
                right: 12px;
                z-index: 1;
                display: block;
                position: fixed;
                background-color: var(--dsing-info-background-color, #323232);
                color: var(--dsing-info-color, #f1f1f1);
                min-height: 48px;
                overflow: hidden;
                padding: 8px !important;
                box-sizing: border-box;
                box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
                border-radius: 4px;
                font-size: 14px;
                cursor: default;
                height: fit-content;

                @apply --paper-font-common-base;
            }
            
            #container {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: row;
            }
            
            #content {
                flex-direction: column;
                white-space:pre-wrap;
                display: flex;
                align-items: center;
                padding-left: 8px;
                width: 300px;
                overflow: hidden !important;
                height: min-content;
            }
            
            paper-icon-button {
                -ms-transform: rotate(180deg); 
                -moz-transform: rotate(180deg); 
                -webkit-transform: rotate(180deg); 
                transform: rotate(180deg);
                width: 26px !important;
                height: 26px !important;
                --paper-icon-button : {
                    padding: 1px;
               }  
            }

            .title {
                font-size: 18px;
                padding-bottom: 6px;
            }

            .text {
                font-size: 16px;
            }
            
            @-webkit-keyframes rotate-left { 
                from { 
                    -ms-transform: rotate(0deg); 
                    -moz-transform: rotate(0deg); 
                    -webkit-transform: rotate(0deg); 
                    transform: rotate(0deg); 
                } to { 
                    -ms-transform: rotate(180deg); 
                    -moz-transform: rotate(180deg); 
                    -webkit-transform: rotate(180deg); 
                    transform: rotate(180deg);
                }
            }
            
            @-webkit-keyframes rotate-right { 
               from { 
                    -ms-transform: rotate(180deg); 
                    -moz-transform: rotate(180deg); 
                    -webkit-transform: rotate(180deg); 
                    transform: rotate(180deg); 
               } to { 
                    -ms-transform: rotate(0deg); 
                    -moz-transform: rotate(0deg); 
                    -webkit-transform: rotate(0deg); 
                    transform: rotate(0deg); 
               }
            }  
           
            @-webkit-keyframes close { 
               from { 
                    width: 300px; 
                    padding-left: 8px;
               } to { 
                    width: 0;
                    padding-left: 0;
               }
            }  
            
                       
            @-webkit-keyframes open { 
               from { 
                   width: 0;
                   padding-left: 0;
               } to { 
                   width: 300px; 
                   padding-left: 8px;
               }
            }  
                    
        </style>
        <div id="container">
            <paper-icon-button icon="arrow-left" on-tap="toggle"></paper-icon-button>
            <div id="content">
                <div class="title">Menu fisso {{computePrice(price)}}</div>
                <div class="text">{{text}}</div>
            </div>
        </div>`;
    }

    static get properties() {
        return {

            text: {
                notify: true,
                observer: 'textChanged'
            },

            price: {
                notify: true,
            }
        };
    }


    /**
     * @param evt
     */
    toggle(evt) {

        if (this.shadowRoot.querySelector('paper-icon-button').style.animation &&
            this.shadowRoot.querySelector('paper-icon-button').style.animation.includes('rotate-right')) {
            this.open();
        } else {
            this.close();
        }
    }

    textChanged(value) {
        if (!value) {
            return;
        }

        this.$.content.style.height = `${this.$.content.offsetHeight}px`;
        this.$.content.style.maxHeight = `${this.$.content.offsetHeight}px`;
    }

    /**
     * @param {object} value 
     * @returns 
     */
    computePrice(price) {
        if (Intl) {
            // TODO calculate current from locale??
            let formatter =  Intl.NumberFormat('it-IT', {style: 'currency', currency: 'EUR'});
            price = formatter.format(price.value);
        } else {
            price = price.value + ' ' + price.currency;
        }
        return price
    }

    /**
     *
     */
    close() {
        this.shadowRoot.querySelector('paper-icon-button').style.animation = 'rotate-right 0.8s linear both';
        this.$.content.style.animation = 'close 0.8s linear both';
    }

    /**
     *
     */
    open() {
        this.shadowRoot.querySelector('paper-icon-button').style.animation = 'rotate-left 0.8s linear both';
        this.$.content.style.animation = 'open 0.8s linear both';
    }
}

window.customElements.define('dsign-fixed-menu', DsignInfo);
