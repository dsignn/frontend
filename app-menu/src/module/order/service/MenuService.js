import { EventManagerAware } from "@dsign/library/src/event/EventManagerAware";

/**
 * @class OrderService
 */
export class MenuService extends EventManagerAware {

    /**
     * Change default order
     *
     * @return {string}
     */
    static get CHANGE_MENU() { return 'change-mane'; }

    /**
     * 
     * @param {StorageInterface} storage 
     */
    constructor() {
        super();

        this.menu = null;
    }

    /** 
     * @param {object} menu 
     * @returns MenuService
     */
    setMenu(menu) {

        this.menu = menu;
        this.getEventManager().emit(MenuService.CHANGE_MENU, this.menu);
        return this;
    }

    /** 
     * @returns Menu
     */
    getMenu() {
        return this.menu;
    }
}