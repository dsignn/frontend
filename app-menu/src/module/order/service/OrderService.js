import { EventManagerAware } from "@dsign/library/src/event/EventManagerAware";
import { OrderEntity } from "./../../order/entity/OrderEntity";
/**
 * @class OrderService
 */
export class OrderService extends EventManagerAware {

    /**
     * Change default order
     *
     * @return {string}
     */
    static get CHANGE_DEFAUL_ORDER() { return 'change-default-order'; }

    /**
     * Update default order
     *
     * @return {string}
     */
    static get UPDATE_DEFAUL_ORDER() { return 'update-default-order'; }

    /**
     * Update default order
     *
     * @return {string}
     */
     static get UPDATE_LOCAL_ORDER() { return 'update-local-order'; }

    /**
     * Load default order
     *
     * @return {string}
     */
    static get LOAD_DEFAUL_ORDER() { return 'load-default-order'; }

    /**
     * 
     * @param {StorageInterface} storage 
     */
    constructor(storage) {
        super();

        this.storage = storage;

        this.organization = null;

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

    setOrganization(organization) {
        this.organization = organization;
    }

    /**
     * 
     * @param {OrderEntity} currentOrder 
     * @returns OrderService
     */
    async setCurrentOrder(order) {

        let allOrder = await this.getStorage().getAll(
            { 'restaurantId': this.organization.id }
        );

        for (let cont = 0; allOrder.length > cont; cont++) {

            allOrder[cont].currenteSelected = false;
            this.updateLocalOrder(allOrder[cont])
                .then((updateData) => {
                    console.info('Update all order and disable current');
                }).catch((error) => {
                    console.error('Error when updare local order', error);
                });
        }

        if (order) {
            order.currenteSelected = true;
            await this.storage.adapter.updateLocal(order);
        }
     
        //console.log('CHANGEEEEEEEEEEEEE', order);
        this.currentOrder = order;
        this.getEventManager().emit(OrderService.CHANGE_DEFAUL_ORDER, order);

        return this;
    }

    /**
     * 
     */
    sendOrderToTheKitchen() { 

        if(!this.currentOrder) {
            throw 'No order selected';
        }

        let copy = this.storage.hydrator.hydrate(this.currentOrder);
        let method = 'update';
        switch(this.currentOrder.status) {
            case  OrderEntity.STATUS_LOCAL:
                copy.status = OrderEntity.STATUS_VALIDATING;
                method = 'save';
                break;
            case  OrderEntity.STATUS_CAN_ORDER:
                copy.status = OrderEntity.STATUS_QUEUE;
                break;
            default:
                throw 'Invalid status to send order';
        }

       // console.log('check', this.currentOrder.status, copy.status);
        this.storage[method](copy)
            .then((order) => {

                this.currentOrder = order;
                this.getEventManager().emit(OrderService.UPDATE_DEFAUL_ORDER, this.currentOrder);
            }).catch((error) => {
                this.currentOrder.status = OrderEntity.STATUS_QUEUE;
                console.error('Error after send order to the kitchen', error);
            });
    }

    /**

     * @returns
     */
    pollingCurrentOrder() {
        if (this.currentOrder && this.currentOrder.status !== OrderEntity.STATUS_LOCAL) {

            this.storage.get(this.currentOrder.id)
                .then((data) => {

                    this.currentOrder = data;
                    this.currentOrder.currenteSelected = true;
                    this.updateLocalOrder(data)
                        .then((updateData) => {
                            console.info('Update polling current order');
                        }).catch((error) => {
                            console.error('Polling current order error', error);
                        });
                    this.getEventManager().emit(OrderService.UPDATE_DEFAUL_ORDER, this.currentOrder);
                });
        }
    }

    /**
     * @param {OrderEntity} order 
     * @returns {Promise}
     */
    updateLocalOrder(order) {   
        return new Promise((resolve, reject) => {

            this.storage.adapter.updateLocal(order)
                .then((data) => {
                    this.getEventManager().emit(OrderService.UPDATE_LOCAL_ORDER, data); 
                    resolve(data);
                }).catch((error) => {
                    reject(error);
                });

        });
    }

    /**
     * @param {string} restaurantId 
     * @param {string} menuId 
     * @returns 
     */
    async loadCurreOrder(restaurantId, menuId) {
        
        console.log('MENU ID', menuId);
        let order = await this.getStorage().adapter.getCurrentOrder(restaurantId, menuId);

        if (order) {
            this.currentOrder = this.storage.hydrator.hydrate(order);
        } else {
            this.currentOrder = null;
        }
        this.getEventManager().emit(OrderService.LOAD_DEFAUL_ORDER, this.currentOrder);


        return this.currentOrder;
    }
}