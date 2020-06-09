/**
 * Dashboard666666666666666666666666666666666666666666 repository
 */
import {ContainerAware} from "@dsign/library/src/container/ContainerAware.js";
import {config} from './config';

export class Repository extends ContainerAware {

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
        this.getContainer().get('Acl').addResource('dashboard');
        this.getContainer().get('Acl').allow('admin', 'dashboard', 'menu')
    }
}