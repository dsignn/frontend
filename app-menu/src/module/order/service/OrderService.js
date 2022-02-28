import {EventManagerAware} from "@dsign/library/src/event/EventManagerAware";
/**
 * @class OrderService
 */
export class OrderService extends EventManagerAware { 

    /**
     * Change default order
     *
     * @return {string}
     */
     static get CHANGE_DEFAUL_ORDER()  { return 'change-default-order'; }

    /**
     * Update default order
     *
     * @return {string}
     */
    static get UPDATE_DEFAUL_ORDER()  { return 'update-default-order'; }
    
    /**
     * Load default order
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

        /*
        for (let cont = 0; allOrder.length > cont; cont++) {
            
            allOrder[cont].currenteSelected = false;
            await this.getStorage().update(allOrder[cont]);
        }

        order.currenteSelected = true;
        */
    //    await this.getStorage().update(order);

        this.currentOrder = order;
        this.getEventManager().emit(OrderService.CHANGE_DEFAUL_ORDER, order);

        return this;
    }

    /**

     * @returns
     */
    pollingCurrentOrder() {
        if (this.currentOrder) {
            console.log('CE TANTO UN CAZZO');
            this.storage.get(this.currentOrder.id)
                .then((data) => {
            
                    this.currentOrder = data;
                    this.getEventManager().emit(OrderService.UPDATE_DEFAUL_ORDER, this.currentOrder);
                });
        }
    }

    /**
     * @param {string} restaurantId 
     * @returns 
  
    async loadCurreOrder(restaurantId) {
        let orders = await this.getStorage().getAll({
            'restaurantId': restaurantId
        });

        if (orders > 1) {
            console.warn('too many orders set as default', restaurantId);
            return;
        }

        let order = null;
        if (orders.length > 0) {
            this.currentOrder = orders[0];
            this.getEventManager().emit(OrderService.LOAD_DEFAUL_ORDER, this.currentOrder);
        } 

        return  this.currentOrder;
    }

    */
}