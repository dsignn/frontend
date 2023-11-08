/**
 * Dashboard repository
 */
import { ContainerAware } from "@dsign/library/src/container/ContainerAware.js";
import { WidgetEntity } from "./src/entity/WidgetEntity.js";
import { PropertyHydrator } from "@dsign/library/src/hydrator/PropertyHydrator.js";
import {LocalStorageAdapter} from "@dsign/library/src/storage/adapter/local-storage/LocalStorageAdapter";
import {Storage} from "@dsign/library/src/storage/Storage";
import {MongoIdGenerator} from "@dsign/library/src/storage/util/MongoIdGenerator";
import { config } from './config.js';

export class Repository extends ContainerAware {

    init() {

        /**
         * Merge config
         */
        this.loadConfig();
        this.loadAcl();
        this.initEntity();
        this.initHydrator();
        this.initStorage()
    }

    /**
     * @returns Object
     */
    _getModuleConfig() {
        return this.getContainer().get('config')['dashboard'];
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
        this.getContainer().get('Acl').allow('organizationOwner', 'dashboard', 'menu');
        this.getContainer().get('Acl').allow('guest', 'dashboard', 'menu');
        this.getContainer().get('Acl').allow('guest', 'dashboard', 'index-view');
        this.getContainer().get('Acl').allow('admin', 'dashboard', 'index-logged');
        this.getContainer().get('Acl').allow('organizationOwner', 'dashboard', 'index-logged');
    }

    initEntity() {
        this.getContainer().get('EntityContainerAggregate')
            .set(this._getModuleConfig().entityService, new WidgetEntity()
        );
    }

    /**
    *
    */
    initHydrator() {

        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(this._getModuleConfig().hydratorService, Repository.getWidgetEntityHydrator(this.getContainer())
        );
    }

    /**
     *
     */
    initStorage() {

        const adapter = new LocalStorageAdapter(
            this._getModuleConfig().storage.adapter.namespace,
            this._getModuleConfig().storage.adapter.collection
        );

        adapter.setIdentifier('id');

        const storage = new Storage(adapter);
        storage.setHydrator(
            this.getContainer().get('HydratorContainerAggregate').get(this._getModuleConfig().hydratorService)
        );

        storage.getEventManager().on(
            Storage.BEFORE_SAVE,
            (evt) => {
                let mongoIdGen = new MongoIdGenerator();
                evt.data.id = mongoIdGen.generateId();
            }
        );

        this.getContainer().get('StorageContainerAggregate').set(
            this._getModuleConfig().storage.name,
            storage
        );

    }

    /**
     * @param {ContainerAggregate} container
     */
    static getWidgetEntityHydrator(container) {

        let hydrator = new PropertyHydrator(
            container.get('EntityContainerAggregate').get(
                'WidgetEntity'
            )
        );

        hydrator.enableExtractProperty('id')
            .enableExtractProperty('col')
            .enableExtractProperty('row')
            .enableExtractProperty('height')
            .enableExtractProperty('width')
            .enableExtractProperty('wc')
            .enableExtractProperty('data');

        hydrator.enableHydrateProperty('id')
            .enableHydrateProperty('col')
            .enableHydrateProperty('row')
            .enableHydrateProperty('height')
            .enableHydrateProperty('width')
            .enableHydrateProperty('wc')
            .enableHydrateProperty('data');

        return hydrator;
    }
}