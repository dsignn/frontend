/**
 * @class OrderEntity
 */
export class OrderItemWrapper { 


    /**
     * Dish to do
     *
     * @return {string}
     */
    static get STATUS_TO_DO()  { return 'to_do'; }

    /**
     * Dish able to be delivering
     *
     * @return {string}
     */
    static get STATUS_DELIVERED()  { return 'delivered'; }

    /**
     * Dish terminate
     *
     * @return {string}
     */
    static get STATUS_TERMINATE()  { return 'terminate'; }

    constructor(item) {
        /**
         * 
         */
        this.ordered = item;


        this.status = OrderItemWrapper.STATUS_TO_DO;
    }
}