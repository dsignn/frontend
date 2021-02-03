import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {Flatten} from "../../../src/transform/Flatten";
import {beforeNextRender} from "@polymer/polymer/lib/utils/render-status";

/**
 *
 * @type {Function}
 */
export const FormErrorMessage = (superClass) => {

    return class extends LocalizeMixin(superClass)  {

        static get properties() {
            return {
                /**
                 * @type Localize
                 */
                _flattenService: {
                    readOnly: true,
                    value: new Flatten()
                }
            };
        }

        /**
         * @param ironForm
         * @returns {[]}
         */
        getFormData(ironForm) {

            let nodes = ironForm._form.querySelectorAll('*');
            let data = {};
            this._findElementSubmittable(nodes, data);

            return data;
        }

        /**
         *
         * @param nodes
         * @param data
         * @returns {*}
         * @private
         */
        _findElementSubmittable(nodes, data) {

            for (let index = 0; index < nodes.length; index++) {

                switch (true) {
                    case nodes[index].getAttribute('skip') !== null:
                        continue;
                    case this._isSubmittable(nodes[index]) === true:
                        data[nodes[index].name] = nodes[index].value;
                        break;
                    case !nodes[index].shadowRoot !== true:
                        Object.assign(
                            data,
                            this._findElementSubmittable(nodes[index].shadowRoot.querySelectorAll('*'), data)
                        );
                        break;
                }
            }

            return data
        }

        /**
         * @param node
         * @returns {boolean}
         * @private
         */
        _isSubmittable(node) {
            return !!(!node.disabled && typeof node.validate === 'function');
        }

        /**
         * @param ironForm
         * @param errorMessage
         */
        errorMessage(ironForm, errorMessage) {
            let elements = ironForm._getValidatableElements();
            let flattenErrors = this._flatten(errorMessage.errors);

            for (const element of elements) {
                if (flattenErrors[element.getAttribute('name')]) {
                    // TODO split the localize error message to the api
                    console.log('HO TROVATO UN ERRORE', element.getAttribute('name'), flattenErrors);
                    element.invalid = true;

                    let error = flattenErrors[element.getAttribute('name')];
                    if(this.localize && this.localize(error)) {
                        error = this.localize(error)
                    }
                    element.errorMessage = error;
                }
            }
        }

        /**
         * @param error
         * @returns {*}
         * @private
         */
        _flatten(error) {
            let flatten = this._flattenService.flatten(error);

            for (let key in flatten) {
                let endIndex = key.lastIndexOf("[");
                if (endIndex != -1) {
                    flatten[key.substring(0, endIndex)] = flatten[key];
                    delete flatten[key];
                }
            }

            return flatten;
        }
    }
};