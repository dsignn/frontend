/**
 * @type {Function}
 */
export const ItemFavorite = (superClass) => {

    return class extends superClass {

        static get properties() {
            return {
                /**
                 * @type object
                 */
                menuItem: { },

                _favoriteService: {
                    readOnly: true
                },
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
        }
    }
};
