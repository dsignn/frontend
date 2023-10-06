import {ContainerAware} from "@dsign/library/src/container/ContainerAware";
import {Auth} from "./authentication/Auth";

/**
 * @class AbstractRepository
 */
export class AbstractRepository extends ContainerAware {

    /**
     * @param storageAdapter
     */
    injectAuthHeader(storageAdapter) {

        let adapter = storageAdapter;
        //console.log('Sti cazzi', this.getContainer().get('Auth').getToken().access_token);
        this.getContainer().get('Auth').eventManager.on(Auth.LOGIN, (data) => {
            //console.log('Evento', this.getContainer().get('Auth').getToken().access_token);
            adapter.addHeader('Authorization', `Bearer ${this.getContainer().get('Auth').getToken().access_token}`);
        });

        this.getContainer().get('Auth').eventManager.on(Auth.LOGOUT, (data) => {
            adapter.removeHeader('Authorization');
        });

        if(this.getContainer().get('Auth') && this.getContainer().get('Auth').getToken()) {
            //console.log('GIA presente', this.getContainer().get('Auth').getToken().access_token);
            adapter.addHeader('Authorization', `Bearer ${this.getContainer().get('Auth').getToken().access_token}`);
        }
    }
}