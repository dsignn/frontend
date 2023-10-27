/**
 * Dashboard repository
 */
 import { XmlhAdapter } from "@dsign/library/src/storage/adapter/xmlh/XmlhAdapter";
 import { JsonDecode } from "@dsign/library/src/data-transform/JsonDecode";
 import { DefaultBuilder } from "@dsign/library/src/storage/adapter/xmlh/url/DefaultBuilder";
 import { Storage } from "@dsign/library/src/storage/Storage";
 import { PropertyHydrator } from "@dsign/library/src/hydrator/index";
 import { config } from './config.js';
 import { AbstractRepository } from "../../src/AbstractRepository";
 import { DeviceEntity } from "./src/entity/DeviceEntity.js";
 import { JsonEncode } from "@dsign/library/src/data-transform/JsonEncode.js";

export class Repository extends AbstractRepository {

    init() {

        /**
         * Merge config
         */
        this.initConfig();
        this.initEntity();
        this.initHydrator();
        this.initStorage();
        this.initAcl();
    }

    /**
     * Merge config
     */
    initConfig() {
        this.container.set(
            'config',
            this.getContainer().get('merge').merge(config, this.getContainer().get('config'))
        );
    }

    /**
     * @returns Object
     */
    _getModuleConfig() {
        return  this.getContainer().get('config')['device'];
    }


    initEntity() {
        this.getContainer().get('EntityContainerAggregate')
            .set(this._getModuleConfig().storage.entity, new DeviceEntity());
    }

    /**
     * Hydrator
     */
    initHydrator() {
        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                this._getModuleConfig().storage.hydrator,
                Repository.getDeviceHydrator(this.getContainer())
            );
    }

    /**
     * Storage
     */
    initStorage() {
        let adapterStorage = new XmlhAdapter(
            container.get('config')['rest']['path'],
            container.get('config')['rest']['resources']['device']['name'],
            new JsonEncode(),
            new JsonDecode(),
            new DefaultBuilder()
        );


        adapterStorage.addHeader('Content-Type', 'application/json')
            .addHeader('Accept', 'application/json');

        this.injectAuthHeader(adapterStorage);

        let storage = new Storage(adapterStorage);
        
        storage.setHydrator(this.getContainer().get('HydratorContainerAggregate')
            .get(this._getModuleConfig().storage.hydrator)
        );

        this.getContainer().set(this._getModuleConfig().storage.name, storage);
    }

    /**
     * @param container
     */
    static getDeviceHydrator(container) {

        let hydrator = new PropertyHydrator(
            container.get('EntityContainerAggregate').get('DeviceEntity')
        );

        return hydrator;
    }

    /**
     * Acl
     */
    initAcl() {
        this.getContainer().get('Acl').addResource('device');
        this.getContainer().get('Acl').allow('admin', 'device', 'menu');
        this.getContainer().get('Acl').allow('organizationOwner', 'device', 'menu');
    }
}