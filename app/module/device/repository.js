/**
 * Dashboard repository
 */
import {ContainerAware} from "@dsign/library/src/container/ContainerAware.js";
import {config} from './config.js';

export class Repository extends ContainerAware {

    init() {

        /**
         * Merge config
         */
        this.loadConfig();
        this.loadAcl();
    }

    /**
     * Merge config
     */
    loadConfig() {
        this.container.set(
            'config',
            this.getContainer().get('merge').merge(config, this.getContainer().get('config'))
        );
    }

    /**
     * Acl
     */
    loadAcl() {
        this.getContainer().get('Acl').addResource('device');
        this.getContainer().get('Acl').allow('admin', 'device', 'menu');
        this.getContainer().get('Acl').allow('organizationOwner', 'device', 'menu');
    }
}