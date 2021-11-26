import {EventManagerAware} from "@dsign/library/src/event/EventManagerAware";
/**
 * @class OrderService
 */
export class OrderService extends EventManagerAware { 

    /**
     * Name of the "message" send from sender when play timeslot
     *
     * @return {string}
     */
     static get CHANGE_DEFAUL_ORDER()  { return 'change-default-order'; }
    
    /**
     * Name of the "message" send from sender when play timeslot
     *
     * @return {string}
     */
    static get LOAD_DEFAUL_ORDER()  { return 'load-default-order'; }

    /**
     * 
     * @param {StorageInterface} storage 
     */
    constructor(storage) {
        super();

        this.storage = storage;

        this.currentOrder = null;
    }

    getStorage() {
        return this.storage;
    }

    /** 
     *  @returns OrderEntity|null
     */
    getCurrentOrder() {
        return this.currentOrder;
    }

    /**
     * 
     * @param {OrderEntity} currentOrder 
     * @returns OrderService
     */
     async setCurrentOrder(order) {

        let allOrder = await this.getStorage().getAll(
            {'restaurantId': order.organization.id}
        ); 

        for (let cont = 0; allOrder.length > cont; cont++) {
            
            allOrder[cont].currenteSelected = false;
            await this.getStorage().update(allOrder[cont]);
        }

        order.currenteSelected = true;
        this.currentOrder = order;
        await this.getStorage().update(order);
        this.getEventManager().emit(OrderService.CHANGE_DEFAUL_ORDER, order);

        return this;
    }

    /**
     * @param {string} restaurantId 
     * @returns 
     */
    async loadCurreOrder(restaurantId) {
        let orders = await this.getStorage().getAll({
            'restaurantId': restaurantId,
            'currenteSelected': true
        });

        if (orders > 1) {
            console.warn('too many orders set as default', restaurantId);
            return;
        }

        let order = null;
        if (orders.length > 0) {
            order = orders[0];
            this.getEventManager().emit(OrderService.LOAD_DEFAUL_ORDER, order);
        } 

        return  order;
    }
}