/**
 * Dashboard repository
 */
import {ContainerAware} from "@dsign/library/src/container/ContainerAware.js";
import {config} from './config';

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
        this.getContainer().get('Acl').addResource('dashboard');
        this.getContainer().get('Acl').allow('admin', 'dashboard', 'menu');
        this.getContainer().get('Acl').allow('guest', 'dashboard', 'menu');
    }
}