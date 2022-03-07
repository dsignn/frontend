import {EventManagerAware} from "@dsign/library/src/event/EventManagerAware";
import {OrderEntity} from "./../../order/entity/OrderEntity";
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

        for (let cont = 0; allOrder.length > cont; cont++) {
            
            allOrder[cont].currenteSelected = false;
            this.storage.adapter.updateLocal(allOrder[cont])
                        .then((updateData) => {
                            console.log('update  for disable');
                        }).catch((error) => {
                            console.error('ERROR for disable', error);
                        });
        }

        order.currenteSelected = true;
        await this.storage.adapter.updateLocal(order);

        this.currentOrder = order;
        this.getEventManager().emit(OrderService.CHANGE_DEFAUL_ORDER, order);

        return this;
    }

    /**

     * @returns
     */
    pollingCurrentOrder() {
        if (this.currentOrder) {
      
            this.storage.get(this.currentOrder.id)
                .then((data) => {
            
                    this.currentOrder = data;
                    this.currentOrder.currenteSelected = true;
                    this.storage.adapter.updateLocal(data)
                        .then((updateData) => {
                            //console.log('update local');
                        }).catch((error) => {
                            //console.error('ERROR', error);
                        });
                    this.getEventManager().emit(OrderService.UPDATE_DEFAUL_ORDER, this.currentOrder);
                });
        }
    }

    /**
     * @param {string} restaurantId 
     * @returns 
     */
    async loadCurreOrder(restaurantId) {
        let order = await this.getStorage().adapter.getCurrentOrder({
            'restaurantId': restaurantId
        });

        if (order) {
            this.currentOrder = this.storage.hydrator.hydrate(order);
            this.getEventManager().emit(OrderService.LOAD_DEFAUL_ORDER, this.currentOrder);
        } 

        return this.currentOrder;
    }
}