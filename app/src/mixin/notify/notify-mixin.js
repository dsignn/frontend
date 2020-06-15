/**
 * @type {Function}
 */
export const NotifyMixin = (superClass) => {

    return class extends superClass {

        static get properties() {
            return {
                /**
                 * @type Notify
                 */
                _notifyService: {
                    type: Object,
                    readOnly: true,
                    notify: true,
                }
            };
        }

        /**
         * @param notify
         */
        notify(notify) {
            if (!this._notifyService) {
                return;
            }

            this._notifyService.notify(notify);
        }
    }
};
