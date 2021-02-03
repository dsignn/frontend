import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {NotifyMixin} from "@dsign/polymer-mixin/notify/notify-mixin";
import {LocalizeMixin} from "@dsign/polymer-mixin/localize/localize-mixin";
import {Storage} from "@dsign/library/src/storage/Storage";

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

                /**
                 * @type Number
                 */
                dishCount: {
                    value: 0,
                    observer: 'changeDishCount'
                },

                /**
                 *
                 */
                _favoriteService: {
                    readOnly: true
                }
            };
        }


        /**
         * @param menuItem
         */
        initDishCount(menuItem) {
            if(!this._favoriteService) {
                return;
            }

            let favorite = this._favoriteService.getFavorite(menuItem);
            if (favorite) {
                this.dishCount = favorite.totalCount;
            }
        }

        /**
         * @param evt
         */
        updateDishCount(evt) {

            if (evt.data._id !== this.menuItem._id) {
                return;
            }

            switch (evt.name) {
                case Storage.POST_SAVE:
                case Storage.POST_UPDATE:
                    this.dishCount = evt.data.totalCount;
                    break;
                case Storage.POST_REMOVE:
                    this.dishCount = 0;
                    break;
            }
        }

        /**
         * @param dishCount
         */
        changeDishCount(dishCount) {
            if (!dishCount) {
                this.$.badgeMenu.style.visibility = 'hidden';
                return;
            }
            this.$.badgeMenu.style.visibility = 'visible';
        }

        /**
         * @param evt
         */
        addFavorite(evt) {

            if(!this._favoriteService) {
                return;
            }

            this._favoriteService.addFavorite(this.menuItem);

            /*
            if (this._notifyService && this.localize) {
                this._notifyService.notify(this.localize('plate-add'));
            }
            */
        }
    }
};
