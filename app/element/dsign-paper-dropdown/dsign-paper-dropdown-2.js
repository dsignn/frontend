/**
 @license
 Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at
 http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
 http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
 found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
 part of the polymer project is also subject to an additional IP rights grant
 found at http://polymer.github.io/PATENTS.txt
 */
import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-styles/default-theme.js';
import './paper-dropdown-menu-icons.js';
import './paper-dropdown-menu-shared-styles.js';

import {IronButtonState} from '@polymer/iron-behaviors/iron-button-state.js';
import {IronControlState} from '@polymer/iron-behaviors/iron-control-state.js';
import {IronFormElementBehavior} from '@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import {IronValidatableBehavior} from '@polymer/iron-validatable-behavior/iron-validatable-behavior.js';
import {ServiceInjectorMixin} from "@dsign/polymer-mixin/service/injector-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {LegacyElementMixin} from '@polymer/polymer/lib/legacy/legacy-element-mixin.js';
import {Polymer} from '@polymer/polymer/lib/legacy/polymer-fn.js';
import {dom} from '@polymer/polymer/lib/legacy/polymer.dom.js';
import * as gestures from '@polymer/polymer/lib/utils/gestures.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import {wrap} from '@polymer/polymer/lib/utils/wrap.js';

// LegacyElementMixin dedupes and this is the base class for elements created
// with the `Polymer` function, so this is only a cache lookup.
// https://github.com/Polymer/polymer/blob/640bc80ac7177b761d46b2fa9c455c318f2b85c6/lib/legacy/class.js#L533-L534
const LegacyPolymerElementBase = LegacyElementMixin(HTMLElement);

/**
 Material design: [Dropdown
 menus](https://www.google.com/design/spec/components/buttons.html#buttons-dropdown-buttons)

 `paper-dropdown-menu` is similar to a native browser select element.
 `paper-dropdown-menu` works with selectable content. The currently selected
 item is displayed in the control. If no item is selected, the `label` is
 displayed instead.

 Example:

 <paper-dropdown-menu label="Your favourite pastry">
 <paper-listbox slot="dropdown-content">
 <paper-item>Croissant</paper-item>
 <paper-item>Donut</paper-item>
 <paper-item>Financier</paper-item>
 <paper-item>Madeleine</paper-item>
 </paper-listbox>
 </paper-dropdown-menu>

 This example renders a dropdown menu with 4 options.

 The child element with the slot `dropdown-content` is used as the dropdown
 menu. This can be a [`paper-listbox`](paper-listbox), or any other or
 element that acts like an [`iron-selector`](iron-selector).

 Specifically, the menu child must fire an
 [`iron-select`](iron-selector#event-iron-select) event when one of its
 children is selected, and an
 [`iron-deselect`](iron-selector#event-iron-deselect) event when a child is
 deselected. The selected or deselected item must be passed as the event's
 `detail.item` property.

 Applications can listen for the `iron-select` and `iron-deselect` events
 to react when options are selected and deselected.

 ### Styling

 The following custom properties and mixins are also available for styling:

 Custom property | Description | Default
 ----------------|-------------|----------
 `--paper-dropdown-menu` | A mixin that is applied to the element host | `{}`
 `--paper-dropdown-menu-disabled` | A mixin that is applied to the element host when disabled | `{}`
 `--paper-dropdown-menu-ripple` | A mixin that is applied to the internal ripple | `{}`
 `--paper-dropdown-menu-button` | A mixin that is applied to the internal menu button | `{}`
 `--paper-dropdown-menu-input` | A mixin that is applied to the internal paper input | `{}`
 `--paper-dropdown-menu-icon` | A mixin that is applied to the internal icon | `{}`

 You can also use any of the `paper-input-container` and `paper-menu-button`
 style mixins and custom properties to style the internal input and menu button
 respectively.

 @element paper-dropdown-menu
 @demo demo/index.html
 */

class Mock { }


Polymer({
    /** @override */
    _template: html`
    <style include="paper-dropdown-menu-shared-styles"></style>

    <paper-menu-button id="menuButton" vertical-align="[[verticalAlign]]" horizontal-align="[[horizontalAlign]]" dynamic-align="[[dynamicAlign]]" vertical-offset="[[_computeMenuVerticalOffset(noLabelFloat, verticalOffset)]]" disabled="[[disabled]]" no-animations="[[noAnimations]]" on-iron-select="_onIronSelect" on-iron-deselect="_onIronDeselect" opened="{{opened}}" close-on-activate allow-outside-scroll="[[allowOutsideScroll]]" restore-focus-on-close="[[restoreFocusOnClose]]">
      <!-- support hybrid mode: user might be using paper-menu-button 1.x which distributes via <content> -->
      <div class="dropdown-trigger" slot="dropdown-trigger">
        <paper-ripple></paper-ripple>
        <!-- paper-input has type="text" for a11y, do not remove -->
        <paper-input id="input" type="text" invalid="[[invalid]]" readonly disabled="[[disabled]]" value="[[valueToView]]" placeholder="[[placeholder]]" error-message="[[errorMessage]]" always-float-label="[[alwaysFloatLabel]]" no-label-float="[[noLabelFloat]]" label="[[label]]" input-role="button" input-aria-haspopup="listbox" autocomplete="off">
          <!-- support hybrid mode: user might be using paper-input 1.x which distributes via <content> -->
          <iron-icon icon="paper-dropdown-menu:arrow-drop-down" suffix slot="suffix"></iron-icon>
        </paper-input>
      </div>
      <slot id="content" name="dropdown-content" slot="dropdown-content"></slot>
    </paper-menu-button>
`,

    is: 'dsign-paper-dropdown',

    behaviors: [
        IronButtonState,
        IronControlState,
        IronFormElementBehavior,
        IronValidatableBehavior,
        new (ServiceInjectorMixin(Mock))(),
        new (LocalizeMixin(Mock))(),
    ],

    properties: {
        /**
         * The derived "label" of the currently selected item. This value
         * is the `label` property on the selected item if set, or else the
         * trimmed text content of the selected item.
         */
        selectedItemLabel: {type: String, notify: true, readOnly: true},

        /**
         * The last selected item. An item is selected if the dropdown menu has
         * a child with slot `dropdown-content`, and that child triggers an
         * `iron-select` event with the selected `item` in the `detail`.
         *
         * @type {?Object}
         */
        selectedItem: {type: Object, notify: true, readOnly: true},

        /**
         * The value for this element that will be used when submitting in
         * a form. It reflects the value of `selectedItemLabel`. If set directly,
         * it will not update the `selectedItemLabel` value.
         */
        value: {
            type: String,
            notify: true,
        },

        valueToView: {
            type: String,
            notify: true,
        },

        /**
         * The label for the dropdown.
         */
        label: {type: String},

        /**
         * The placeholder for the dropdown.
         */
        placeholder: {type: String},

        /**
         * The error message to display when invalid.
         */
        errorMessage: {type: String},

        /**
         * True if the dropdown is open. Otherwise, false.
         */
        opened:
            {type: Boolean, notify: true, value: false, observer: '_openedChanged'},

        /**
         * By default, the dropdown will constrain scrolling on the page
         * to itself when opened.
         * Set to true in order to prevent scroll from being constrained
         * to the dropdown when it opens.
         */
        allowOutsideScroll: {type: Boolean, value: false},

        /**
         * Set to true to disable the floating label. Bind this to the
         * `<paper-input-container>`'s `noLabelFloat` property.
         */
        noLabelFloat: {type: Boolean, value: false, reflectToAttribute: true},

        /**
         * Set to true to always float the label. Bind this to the
         * `<paper-input-container>`'s `alwaysFloatLabel` property.
         */
        alwaysFloatLabel: {type: Boolean, value: false},

        /**
         * Set to true to disable animations when opening and closing the
         * dropdown.
         */
        noAnimations: {type: Boolean, value: false},

        /**
         * The orientation against which to align the menu dropdown
         * horizontally relative to the dropdown trigger.
         */
        horizontalAlign: {type: String, value: 'right'},

        /**
         * The orientation against which to align the menu dropdown
         * vertically relative to the dropdown trigger.
         */
        verticalAlign: {type: String, value: 'top'},

        /**
         * Overrides the vertical offset computed in
         * _computeMenuVerticalOffset.
         */
        verticalOffset: Number,

        /**
         * If true, the `horizontalAlign` and `verticalAlign` properties will
         * be considered preferences instead of strict requirements when
         * positioning the dropdown and may be changed if doing so reduces
         * the area of the dropdown falling outside of `fitInto`.
         */
        dynamicAlign: {type: Boolean},

        /**
         * Whether focus should be restored to the dropdown when the menu closes.
         */
        restoreFocusOnClose: {type: Boolean, value: true},


        /**
         * @type object
         */
        services: {
            value: {
                _localizeService: 'Localize',
            }
        },
    },

    listeners: {'tap': '_onTap'},

    /**
     * @type {!Object}
     */
    keyBindings: {'up down': 'open', 'esc': 'close'},

    observers: ['_selectedItemChanged(selectedItem)'],

    /**
     * Override `_attachDom` so that we can pass `delegatesFocus`. The overridden
     * implementation of `_attachDom` specifically skips the steps performed here
     * if the node already hosts a shadow root:
     * https://github.com/Polymer/polymer/blob/640bc80ac7177b761d46b2fa9c455c318f2b85c6/lib/mixins/element-mixin.js#L691-L694
     * @override
     */
    _attachDom(dom) {
        const wrappedThis = wrap(this);
        wrappedThis.attachShadow({
            mode: 'open',
            delegatesFocus: true,
            shadyUpgradeFragment: dom,
        });
        wrappedThis.shadowRoot.appendChild(dom);
        return LegacyPolymerElementBase.prototype._attachDom.call(this, dom);
    },

    /** @override */
    focus() {
        // When using Shady DOM and in browsers that don't support
        // `delegatesFocus`, attempting to focus this element with the browser's
        // native `HTMLElement#focus` will cause focus to be lost because this
        // element isn't focusable in those situations. To work around this, the
        // element in the shadow root that this element intends to delegate focus
        // to is manually focused instead.
        this.$.input._focusableElement.focus();
    },

    /** @override */
    attached: function () {
        // NOTE(cdata): Due to timing, a preselected value in a `IronSelectable`
        // child will cause an `iron-select` event to fire while the element is
        // still in a `DocumentFragment`. This has the effect of causing
        // handlers not to fire. So, we double check this value on attached:
        var contentElement = this.contentElement;
        if (contentElement && contentElement.selectedItem) {
            this._setSelectedItem(contentElement.selectedItem);
        }
    },

    /**
     * The content element that is contained by the dropdown menu, if any.
     */
    get contentElement() {
        // Polymer 2.x returns slot.assignedNodes which can contain text nodes.
        var nodes = dom(this.$.content).getDistributedNodes();
        for (var i = 0, l = nodes.length; i < l; i++) {
            if (nodes[i].nodeType === Node.ELEMENT_NODE) {
                return nodes[i];
            }
        }
    },

    /**
     * Show the dropdown content.
     */
    open: function () {
        this.$.menuButton.open();
    },

    /**
     * Hide the dropdown content.
     */
    close: function () {
        this.$.menuButton.close();
    },

    /**
     * A handler that is called when `iron-select` is fired.
     *
     * @param {CustomEvent} event An `iron-select` event.
     */
    _onIronSelect: function (event) {
        this._setSelectedItem(event.detail.item);
    },

    /**
     * A handler that is called when `iron-deselect` is fired.
     *
     * @param {CustomEvent} event An `iron-deselect` event.
     */
    _onIronDeselect: function (event) {
        this._setSelectedItem(null);
    },

    /**
     * A handler that is called when the dropdown is tapped.
     *
     * @param {CustomEvent} event A tap event.
     */
    _onTap: function (event) {
        if (gestures.findOriginalTarget(event) === this) {
            this.open();
        }
    },

    /**
     * Compute the label for the dropdown given a selected item.
     *
     * @param {Element} selectedItem A selected Element item, with an
     * optional `label` property.
     */
    _selectedItemChanged: function (selectedItem) {

        let value = '';
        let valueToView = '';
        if(!selectedItem) {
            return;
        }

        switch (true) {
            case !selectedItem !== true && !selectedItem.getAttribute('value') !== true:
               // console.log('value', selectedItem.getAttribute('value'));
                value = selectedItem.getAttribute('value');
                break;
            case !selectedItem !== true && !selectedItem.getAttribute('label') !== true:
             //   console.log('label', selectedItem.getAttribute('label'));
                value = selectedItem.getAttribute('label');
                break;
            default:
                value = selectedItem.textContent.trim();
                break;
        }

        this.value = value;
        this.valueToView = selectedItem.textContent.trim();
        this._setSelectedItemLabel(value);
    },

    /**
     * Compute the vertical offset of the menu based on the value of
     * `noLabelFloat`.
     *
     * @param {boolean} noLabelFloat True if the label should not float
     * @param {number=} opt_verticalOffset Optional offset from the user
     * above the input, otherwise false.
     */
    _computeMenuVerticalOffset: function (noLabelFloat, opt_verticalOffset) {
        // Override offset if it's passed from the user.
        if (opt_verticalOffset) {
            return opt_verticalOffset;
        }

        // NOTE(cdata): These numbers are somewhat magical because they are
        // derived from the metrics of elements internal to `paper-input`'s
        // template. The metrics will change depending on whether or not the
        // input has a floating label.
        return noLabelFloat ? -4 : 8;
    },

    /**
     * Returns false if the element is required and does not have a selection,
     * and true otherwise.
     * @param {*=} _value Ignored.
     * @return {boolean} true if `required` is false, or if `required` is true
     * and the element has a valid selection.
     */
    _getValidity: function (_value) {
        return this.disabled || !this.required || (this.required && !!this.value);
    },

    _openedChanged: function () {
        var openState = this.opened ? 'true' : 'false';
        var e = this.contentElement;
        if (e) {
            e.setAttribute('aria-expanded', openState);
        }
    }
});
