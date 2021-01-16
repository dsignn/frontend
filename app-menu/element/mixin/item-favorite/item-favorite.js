import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {NotifyMixin} from "@dsign/polymer-mixin/notify/notify-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";

/**
 * @type {Function}
 */
export const ItemFavorite = (superClass) => {

    return class extends mixinBehaviors([NotifyMixin, LocalizeMixin], superClass) {

        static get properties() {
            return {
                /**
                 * @type object
                 */
                menuItem: { },

                _favoriteService: {
                    readOnly: true
                }
            };
        }

        /**
         * @param evt
         */
        addFavorite(evt) {

            if(!this._favoriteService) {
                console.error('_menuStorage not found');
                return;
            }

            this._favoriteService.addFavorite(this.menuItem);

            if (this._notifyService && this.localize) {
                this._notifyService.notify(this.localize('plate-add'));
            }
        }
    }
};
