import {EntityIdentifier} from "@dsign/library/src/storage/entity/EntityIdentifier";
import {OrderItemWrapper} from "./embedded/OrderItemWrapper";

/**
 * @class OrderEntity
 */
export class OrderEntity extends EntityIdentifier { 

    /**
     * Status to check
     *
     * @return {string}
     */
    static get STATUS_CHECK()  { return 'check'; }

    /**
     * Status on queue
     *
     * @return {string}
     */
    static get STATUS_QUEUE()  { return 'queue'; }

    /**
     * Status on preparation
     *
     * @return {string}
     */
    static get STATUS_PREPARATION()  { return 'preparation'; }

    /**
     * Status at table
     *
     * @return {string}
     */
    static get STATUS_DELIVERING()  { return 'delivering'; }
 
    /**
     * Status at table
     *
     * @return {string}
     */
     static get STATUS_CLOSE()  { return 'close'; }

    /**
     * Status at table
     *
     * @return {string}
     */
    static get STATUS_INVALID()  { return 'invalid'; }

    /**
     * State of order
     */
    static get FINITE_STATE_MACHINE() {
        
        let variable = {};

        variable[OrderEntity.STATUS_CHECK] = [
            OrderEntity.STATUS_QUEUE,
            OrderEntity.STATUS_INVALID
        ];

        variable[OrderEntity.STATUS_QUEUE] = [
            OrderEntity.STATUS_PREPARATION
        ];

        variable[OrderEntity.STATUS_PREPARATION] = [
            OrderEntity.STATUS_QUEUE,
            OrderEntity.STATUS_DELIVERING,
            OrderEntity.STATUS_CLOSE
        ];

        variable[OrderEntity.STATUS_DELIVERING] = [
            OrderEntity.STATUS_CLOSE
        ];

        
        return variable;
    }

    constructor() {
        super();

        this.id = null;

        this.name = null;

        this.additionalInfo = {};

        /**
         * @type {Array}
         */
        this.items = [];

        this.status = OrderEntity.STATUS_CHECK;
        
        this.createdAt = null;

        this.lastUpdateAt = null;

        this.organization = {};

        this.currenteSelected = false;
    }

    /**
     * @param {string} key 
     * @param {any} value
     * @returns 
     */
    pushAdditionInfo(key, value) {
        this.additionalInfo[key] = value;
        return this;
    }

    /**
     * 
     * @param {string} id 
     * @param {string} ?status 
     * @returns 
     */
    getTotalItemOrder(id, status) {

        let total = 0;
        for (let cont = 0; this.items.length > cont; cont++) {
            if (id === this.items[cont].ordered._id && (status === undefined || (status !== undefined  && status === this.items[cont].status))) {
                total++;
            }

            if(id === undefined && (status === undefined || (status !== undefined  && status === this.items[cont].status))) {
                total++;
            }
        }
        return total;
    }



    /**
     * @param {string} id 
     */
    getItemOrderPrice(id) {

        let price = {value: 0};
        let itemOrder = this._getItemOrder(id);
        if (!itemOrder || !itemOrder.ordered || !itemOrder.ordered.price) {
            return price;
        }
        
        let total = this.getTotalItemOrder(id);
        price.value = itemOrder.ordered.price.value * total;
         
        // TODO PRICE OBJECT
        return price;
    }

    /**
     * @param {string} id 
     */
    getTotalItemOrderPrice() {
        let orderItems = this.getDistinctItemOrder();
        let price = {value:0};
        let tmpPrice;
        for (let cont = 0; orderItems.length > cont; cont++) {
            tmpPrice = this.getItemOrderPrice(orderItems[cont].ordered._id);
            price.value += tmpPrice.value;
        }

        return price;
    }

    /**
     * @param {string} id 
     * @returns 
     */
    _getItemOrder(id) {
        return this.items.find((element) => {
            return element.ordered._id === id;
        });
    }

    /**
     * @param {object} item 
     * @returns OrderEntity
     */
    addItemOrder(item) {
        this.items.push(new OrderItemWrapper(item));
        return this;
    }

    /**
     * @param {object} item 
     * @returns OrderEntity
     */
    removeItemOrder(item) {
        let index = this.items.findIndex((element) => {
            // TODO get id
            return element.ordered._id === item._id && element.status === OrderItemWrapper.STATUS_TO_DO;;
        });

        if (index > -1) {
            this.items.splice(index, 1);
        }
        return this;
    }

    /**
     * @returns Array
     */
     getDistinctItemOrder() {
        let orders = [];


        for (let cont = 0; this.items.length > cont; cont++) {
            
            let has = orders.find((element) => {
                /**
                 * TODO add getId()
                 */
                return element.ordered._id === this.items[cont].ordered._id;
            });

            if (!has) {
                orders.push(this.items[cont]);
            }
        }

        return orders;
    }
}