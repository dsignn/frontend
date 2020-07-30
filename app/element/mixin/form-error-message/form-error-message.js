import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {Flatten} from "../../../src/transform/Flatten";

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
         * @param errorMessage
         */
        errorMessage(ironForm, errorMessage) {
            let elements = ironForm._getValidatableElements();
            let flattenErrors = this._flatten(errorMessage.errors);

            for (const element of elements) {
                if (flattenErrors[element.getAttribute('name')]) {
                    console.log('HO TROVATO UN ERRORE', element.getAttribute('name'));
                    element.invalid = true;
                    element.errorMessage = flattenErrors[element.getAttribute('name')];
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