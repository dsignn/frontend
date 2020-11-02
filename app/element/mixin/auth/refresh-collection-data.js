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
                }
            };
        }

        /**
         *
         * @param _authService
         * @param _storage
         * @private
         */
        _changeAuthStorage(_authService, _storage) {

            if(!_authService || !_storage) {
                return;
            }

            if (_authService.token) {
                console.log('MI OSNO ACCORTO DI ESSERE LOGGATOd');
                this.getPagedEntities();
            }

            _authService.eventManager.on(
                'login',
                (data) => {
                    console.log('DIO CAN LOGIN');

                    setTimeout(
                        () => {
                            this.getPagedEntities();
                        },
                        500
                    );

                    this.listenerCollection = new Listener(this.getPagedEntities.bind(this));
                    this._storage.getEventManager().on(Storage.POST_SAVE, this.listenerCollection);
                }
            );

            _authService.eventManager.on(
                'logout',
                (data) => {
                    console.log('DIO CAN OOUT');
                    this.set('entities', []);
                    this._storage.getEventManager().remove(Storage.POST_SAVE, this.listenerCollection);
                }
            );
        }
    }
};
