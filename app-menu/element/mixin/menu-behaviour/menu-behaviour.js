import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { LocalizeMixin } from "@dsign/polymer-mixin/localize/localize-mixin";
import { MenuService } from '../../../src/module/order/service/MenuService';
import { Listener } from '@dsign/library/src/event';

/**
 * @type {Function}
 */
export const MenuBehaviour = (superClass) => {

    return class extends mixinBehaviors([LocalizeMixin], superClass) {

        static get properties() {
            return {

                menu: {
                    notify: true
                },

                _menuService: {
                    readOnly: true,
                    observer: 'changeMenuService'
                }
            };
        }

        topppppppp() {
            
        }


        /**
         * @param {MenuService} service 
         * @returns 
         */
         changeMenuService(service) {
            if (!service) {
                return;
            }

            console.log('ddddd');
            service.getEventManager().on(MenuService.CHANGE_MENU, new Listener((evt) => {
                this.menu = evt.data;
            }));

            this.menu = service.getMenu();
        }
    }
};
