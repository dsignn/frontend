/**
 * Monitor repository
 */
import {ContainerAware} from "@dsign/library/src/container/ContainerAware.js";
import {config} from './config';

export class Repository extends ContainerAware {

    /**
     * @const
     */
    static STORAGE_SERVICE() { return 'MonitorStorage';};

    init() {

        /**
         * Merge config
         */
        this.container.set(
            'config',
            container.get('merge').merge(config, container.get('config'))
        );

        this.loadAcl();
    }

    /**
     * Acl
     */
    loadAcl() {
        this.getContainer().get('Acl').addResource('monitor');
        this.getContainer().get('Acl').allow('admin', 'monitor', 'menu')
    }

}
