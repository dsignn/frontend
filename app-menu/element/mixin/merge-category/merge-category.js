import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {mergeDeep} from "@dsign/library/src/object/Utils";

/**
 * @type {Function}
 */
export const MergeCategory = (superClass) => {

    return class extends mixinBehaviors([LocalizeMixin], superClass) {

        /**
         * @param value
         * @private
         */
        _mergeCategory(categories) {

            let categoryTranslation = {};
            let languages = this._localizeService.getLanguages();
            for (let index = 0; languages.length > index; index++) {
                categoryTranslation[languages[index]] = {};
            }

            if (typeof categories === 'object' && categories !== null) {
                for (let property1 in categories) {
                    for (let property2 in categories[property1]) {
                        categoryTranslation[property2][property1] = categories[property1][property2];
                    }
                }
            }

            this.resources = mergeDeep(this.resources, categoryTranslation);
        }
    }
};
