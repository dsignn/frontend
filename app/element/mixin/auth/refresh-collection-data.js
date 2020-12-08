import {StoragePaginationMixin} from "@dsign/polymer-mixin/storage/pagination-mixin";
import {Listener} from "@dsign/library/src/event/Listener";
import {Storage} from "@dsign/library/src/storage/Storage";

/**
 * @type {Function}
 */
export const RefreshCollectionData = (superClass) => {

    return class extends StoragePaginationMixin(superClass) {

        static get properties() {
            return {
                /**
                 * @type AclInterface
                 */
                _authService : {
                    type: Object,
                    readOnly: true,
                },
            };
        }

        /**
         *
         * @param itemPerPage
         * @param storage
         * @private
         */
        _changeItemPerPage(itemPerPage, storage, authService) {
            if (!itemPerPage || !storage) {
                return;
            }
            console.log('itemPerPage');
            this.getPagedEntities();
        }

        /**
         * @param page
         * @param storage
         * @param authService
         * @private
         */
        _changePage(page, storage, authService) {
            if (!page || !storage || !authService) {
                return;
            }
            console.log('page');
            this.getPagedEntities();
        }


        /**
         *
         * @param _authService
         * @param _storage
         * @private
         */
        _changeAuthStorage(authService, storage) {

            if(!authService || !storage) {
                return;
            }

            if (authService.token) {
         //       console.log('RefreshCollectionData già LOGGATO',  this._storage.adapter.getNameCollection());
                this.getPagedEntities();
                this.listenerCollection = new Listener(this.getPagedEntities.bind(this));
                this._storage.getEventManager().on(Storage.POST_SAVE, this.listenerCollection);
            }

            console.log(authService, storage.adapter.getNameCollection());
            authService.eventManager.on(
                'login',
                (data) => {
           //         console.log('RefreshCollectionData LOGIN');

                    setTimeout(
                        () => {
                            console.log( this._storage, 'WWWWWWWWWWWWWWWWWWWWWW');
                            this.getPagedEntities();
                        },
                        1000
                    );

                    this.listenerCollection = new Listener(this.getPagedEntities.bind(this));
                    this._storage.getEventManager().on(Storage.POST_SAVE, this.listenerCollection);
                }
            );

            authService.eventManager.on(
                'logout',
                (data) => {
         //           console.log('RefreshCollectionData LOGOUT');
                    this.set('entities', []);
                    this._storage.getEventManager().remove(Storage.POST_SAVE, this.listenerCollection);
                }
            );
        }
    }
};
