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

        this.getContainer().get('Auth').eventManager.on(Auth.LOGIN, (data) => {
            //console.log('TODO ADD HEADER', data);
            adapter.addHeader('Authorization', `Bearer ${this.getContainer().get('Auth').token.access_token}`);
        });

        this.getContainer().get('Auth').eventManager.on(Auth.LOGOUT, (data) => {
            adapter.removeHeader('Authorization');
        });

        if(this.getContainer().get('Auth') && this.getContainer().get('Auth').token) {
            adapter.addHeader('Authorization', `Bearer ${this.getContainer().get('Auth').token.access_token}`);
        }
    }
}