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

                restaurant: {

                },

                /**
                 * @type object
                 */
                menuItem: { },

                /**
                 * @type Number
                 */
                dishCount: {
                    value: 0
                },

                /**
                 * @type Storage
                 */
                _menuStorage: {
                    readOnly: true
                }
            };
        }


        /**
         * @param menuItem
         */
        initDishCount(menuItem) {
            if(!this._menuStorage) {
                return;
            }

            this._menuStorage.get(menuItem._id)
                .then((data) => {
                    if (!data) {
                        return;
                    }

                    this.dishCount = data.totalCount;
                });
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
         * @param evt
         */
        addFavorite(evt) {

            if(!this._menuStorage || !this.menuItem || !this.restaurant) {
                return;
            }

            this._menuStorage.get(this.menuItem._id)
                .then((data) => {
                    let method = 'update';
                    if (!data) {
                        data = JSON.parse(JSON.stringify(this.menuItem));
                        data.totalCount = 1;
                        data.restaurantId = this.restaurant._id;
                        method = 'save';
                    } else {
                        data.totalCount = data.totalCount + 1;
                    }

                    this._menuStorage[method](data);
                })
                .catch((error) => {
                    console.error(error)
                });
        }

        /**
         * @param evt
         */
        addOneFavorite(evt) {
            if (!this._menuStorage || !this.menuItem) {
                return;
            }

            this.menuItem.totalCount = this.menuItem.totalCount + 1;
            this._menuStorage.update(this.menuItem);
        }

        /**
         * @param evt
         */
        removeFavorite(evt) {
            if(!this._menuStorage || !this.menuItem) {
                return;
            }

            this._menuStorage.get(this.menuItem._id)
                .then((data) => {
                    if (!data) {
                        return;
                    }

                    let method = 'delete';
                    if(data.totalCount > 1) {
                        data.totalCount = data.totalCount - 1;
                        method = 'update';
                    }

                    this._menuStorage[method](data);
                })
                .catch((error) => {
                    console.error(error)
                });
        }
    }
};
