import { NotifyMixin } from "@dsign/polymer-mixin/notify/notify-mixin";
import { LocalizeMixin } from "@dsign/polymer-mixin/localize/localize-mixin";
import { Storage } from "@dsign/library/src/storage/Storage";
import { OrderService } from "../../../src/module/order/service/OrderService";
import { OrderEntity } from '../../../src/module/order/entity/OrderEntity';
import { MenuBehaviour } from "../menu-behaviour/menu-behaviour";

/**
 * @type {Function}
 */
export const OrderBehaviour = (superClass) => {

    return class extends MenuBehaviour(NotifyMixin(LocalizeMixin(superClass))) {

        static get properties() {
            return {

                currentOrder: {
                    observer: '_currentOrderChanged'
                },

                updateView: {
                    value: (new Date).getTime()
                },

                disableOrder: {
                    notify: true,
                    value: false
                },

                /**
                 * @type Storage
                 */
                _orderService: {
                    readOnly: true,
                    observer: '_orderServiceChanged'
                },

                showOrder: {
                    value: true,
                    notify: true,
                    observer: '_showOrderChanged'
                },

                getNameItemOrder: {
                    type: Function,
                    computed: '__computedItemOrderName(language)'
                },

                getTotalOrder: {
                    type: Function,
                    computed: '__computedTotalItemOrderCount(updateView, currentOrder)'
                },

                getTotalItemOrder: {
                    type: Function,
                    computed: '__computedItemOrderCount(updateView, currentOrder)'
                },

                getOrderItemPrice: {
                    type: Function,
                    computed: '__computedOrderItemPrice(updateView, currentOrder)'
                },

                getTotalOrderItemPrice: {
                    type: Function,
                    computed: '__computedTotalOrderItemPrice(updateView, currentOrder)'
                }
            };
        }


        /**
         * @param {string} language 
         * @returns 
         */
        __computedItemOrderName(language) {

            return function () {
                var itemOrder = arguments[0];
                return itemOrder.name[this._localizeService.getDefaultLang()];
            }
        }

        /**
         * @param {string}} updateView
         * @param {object} currentOrder 
         * @returns 
         */
        __computedTotalItemOrderCount(updateView, currentOrder) {
            return function () {
                if (!this.currentOrder) {
                    return 0;
                }

                return this.currentOrder.getTotalItemOrder();
            }
        }


        /**
         * @param {string}} updateView
         * @param {object} currentOrder 
         * @returns 
         */
        __computedItemOrderCount(updateView, currentOrder) {

            return function () {
                var itemOrder = arguments[0];

                if (!this.currentOrder) {
                    if (this.$.badgeMenu) {
                        this.$.badgeMenu.style.visibility = 'hidden';
                    }
                    return;
                }

                let total = this.currentOrder.getTotalItemOrder(itemOrder._id, arguments.length > 1 ? arguments[1] : undefined);

                if (this.$.badgeMenu) {
                    if (total) {
                        this.$.badgeMenu.style.visibility = 'visible';

                    } else {
                        this.$.badgeMenu.style.visibility = 'hidden';
                    }
                }

                return total;
            }
        }

        /**
         * 
         * @param {string} updateView 
         * @param {object} currentOrder 
         */
        __computedOrderItemPrice(updateView, currentOrder) {
            return function () {
                var itemOrder = arguments[0];
                if (!this.currentOrder) {
                    return;
                }

                let price = this.currentOrder.getItemOrderPrice(itemOrder._id);
                try {
                    // TODO cofigurable
                    let formatter = Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
                    return formatter.format(price.value);
                } catch (e) {
                    return price.value + ' €';
                }
            }
        }

        __computedTotalOrderItemPrice(updateView, currentOrder) {
            return function () {

                if (!this.currentOrder) {
                    return;
                }

                let price = this.currentOrder.getTotalItemOrderPrice();

                try {
                    // TODO cofigurable
                    let formatter = Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
                    return formatter.format(price.value);
                } catch (e) {
                    return price.value + ' €';
                }
            }
        }

        /**
         * @param {OrderService} service 
         */
        _orderServiceChanged(service) {

            service.getEventManager().on(OrderService.LOAD_DEFAUL_ORDER, (evt) => {
                this.currentOrder = evt.data;
            });

            service.getEventManager().on(OrderService.CHANGE_DEFAUL_ORDER, (evt) => {
                this.currentOrder = evt.data;
            });

            service.getEventManager().on(OrderService.UPDATE_DEFAUL_ORDER, (evt) => {
                this.currentOrder = evt.data;
            })

            this.currentOrder = service.getCurrentOrder();
        }

        /**
         * @param {OrderEntity} order 
         */
        _currentOrderChanged(order) {
            this.disableOrder = !this.canOrder();
        }

        /**
         * @param {CustomEvent} evt 
         * @returns 
         */
        addItemOrder(evt) {

            let itemOrderTarget = evt.target.itemOrder;

            if (!itemOrderTarget) {
                console.error('Attach event on element without item order setted');
                return;
            }

            this.currentOrder.addItemOrder(itemOrderTarget);

            this._orderService.updateLocalOrder(this.currentOrder);
        }

        /**
         * @param {CustomEvent} evt 
         * @returns 
         */
        removeItemOrder(evt) {
            let itemOrderTarget = evt.target.itemOrder;

            if (!itemOrderTarget) {
                console.error('Attach event on element without item order setted');
                return;
            }

            this.currentOrder.removeItemOrder(itemOrderTarget);

            this._orderService.updateLocalOrder(this.currentOrder)
                .then((data) => {
                    this.updateView = (new Date).getTime();
                }).catch((error) => {
                    console.error(error)
                });

        }

        /**
         * @returns bool
         */
        canOrder() {
            let can = false;

            if (!this.currentOrder) {
                return can;
            }

            switch (this.currentOrder.status) {
                case OrderEntity.STATUS_CAN_ORDER:
                case OrderEntity.STATUS_LOCAL:
                    can = true;
                    break;
            }

            return can;
        }

        /**
         * @param {CustomEvent} evt 
         * @returns 
         */
        _updateViewOrder(evt) {
            if (!this.currentOrder) {
                return;
            }

            this.updateView = (new Date).getTime();
        }

        /**
         * @param value
         * @private
         */
        _showOrderChanged(value) {

            if (!this.$.action) {
                return;
            }

            if (value) {
                this.$.action.style.display = 'block';
            } else {
                this.$.action.style.display = 'none';
            }
        }
    }
};
