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
         * @param authService
         * @private
         */
        _changeItemPerPage(itemPerPage, storage, authService) {
            if (!itemPerPage || !storage) {
                return;
            }
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
            this.getPagedEntities();
        }


        /**
         *
         * @param authService
         * @param storage
         * @private
         */
        _changeAuthStorage(authService, storage) {

            if(!authService || !storage) {
                return;
            }

            if (authService.token) {

                this.getPagedEntities();
                this.listenerCollection = new Listener(this.getPagedEntities.bind(this));
                this._storage.getEventManager().on(Storage.POST_SAVE, this.listenerCollection);
            }

            authService.eventManager.on(
                'login',
                (data) => {
                    setTimeout(
                        () => {
                            this.getPagedEntities();
                        },
                        10
                    );
    
                    this.listenerCollection = new Listener(this.getPagedEntities.bind(this));
                    this._storage.getEventManager().on(Storage.POST_SAVE, this.listenerCollection);
                }
            );

            authService.eventManager.on(
                'logout',
                (data) => {
                    this.set('entities', []);
                    this._storage.getEventManager().remove(Storage.POST_SAVE, this.listenerCollection);
                }
            );
        }
    }
};
