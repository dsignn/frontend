import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";

/**
 * @type {Function}
 */
export const LocalizeEntityPropriety = (superClass) => {

    return class extends superClass {

        static get properties() {
            return {
                localizeEntityPropriety: {
                    type: Function,
                    computed: '__computelocalizeEntityPropriety(language, resources, formats, _localizeService)'
                }
            };
        }
        /**
         * @param value
         * @private
         */
         __computelocalizeEntityPropriety(language, resources, formats, _localizeService) {

            if (!_localizeService) {
                return;
            }

            return (property) => {
                return property[_localizeService.getDefaultLang()];
            }
        }
    }
};
