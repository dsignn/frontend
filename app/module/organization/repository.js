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
import { OrganizationEntity } from "./src/entity/OrganizationEntity";
import { JsonEncode } from "@dsign/library/src/data-transform/JsonEncode.js";

export class Repository extends AbstractRepository {


    /**
     * @return {string}
     * @constructor
     */
    static get STORAGE_SERVICE() { return 'OrganizationStorage'; };

    /**
     * @return {string}
     * @constructor
     */
    static get ORGANIZATION_HYDRATOR_SERVICE() { return 'OrganizationEntityHydrator'; };

    /**
     * @return {string}
     * @constructor
     */
    static get ORGANIZATION_ENTITY_SERVICE() { return 'OrganizationEntity'; };

    init() {

        /**
         * Merge config
         */
        this.loadConfig();
        this.loadAcl();
        this.initOrganizationHydrator();
        this.initEntity();
        this.initStorage()
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
        this.getContainer().get('Acl').addResource('organization');
        this.getContainer().get('Acl').allow('admin', 'organization', 'menu');
    }

    initEntity() {
        this.getContainer().get('EntityContainerAggregate')
            .set(Repository.ORGANIZATION_ENTITY_SERVICE, new OrganizationEntity());
    }

    initOrganizationHydrator() {
        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                Repository.ORGANIZATION_HYDRATOR_SERVICE,
                Repository.getOrganizationHydrator(this.getContainer().get('EntityContainerAggregate'))
            );
    }

    /**
     * Storage
     */
    initStorage() {
        let adapterStorage = new XmlhAdapter(
            container.get('config')['rest']['path'],
            container.get('config')['rest']['resources']['organization']['name'],
            new JsonEncode(),
            new JsonDecode(),
            new DefaultBuilder()
        );


        adapterStorage.addHeader('Content-Type', 'application/json')
            .addHeader('Accept', 'application/json');

        this.injectAuthHeader(adapterStorage);

        let storage = new Storage(adapterStorage);
        storage.setHydrator(this.getContainer().get('HydratorContainerAggregate').get(Repository.ORGANIZATION_HYDRATOR_SERVICE));

        this.getContainer().set(Repository.STORAGE_SERVICE, storage);
    }

    /**
     * @param container
     */
    static getOrganizationHydrator(container) {

        let hydrator = new PropertyHydrator(container.get(Repository.ORGANIZATION_ENTITY_SERVICE));


        hydrator.enableHydrateProperty('id')
            .enableHydrateProperty('_id')
            .enableHydrateProperty('name')
            ;

        hydrator.enableExtractProperty('id')
            .enableExtractProperty('_id')
            .enableExtractProperty('name')
            ;

        return hydrator;
    }
}