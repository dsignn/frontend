/**
 * Restaurant repository
 */
import {ContainerAware} from "@dsign/library/src/container/ContainerAware.js";
import {config} from './config';
import {XmlhAdapter} from "@dsign/library/src/storage/adapter/xmlh/XmlhAdapter";
import {JsonEncode} from "@dsign/library/src/data-transform/JsonEncode";
import {JsonDecode} from "@dsign/library/src/data-transform/JsonDecode";
import {DefaultBuilder} from "@dsign/library/src/storage/adapter/xmlh/url/DefaultBuilder";
import {PropertyHydrator} from "@dsign/library/src/hydrator/index";
import {
    HybridStrategy,
    HydratorStrategy,
    MongoIdStrategy,
    NumberStrategy
} from "@dsign/library/src/hydrator/strategy/value/index";
import {MapProprertyStrategy} from "@dsign/library/src/hydrator/strategy/proprerty/index";
import {Storage} from "@dsign/library/src/storage/Storage";
import {RestaurantEntity} from "./src/entity/RestaurantEntity";

/**
 * @class Repository
 */
export class Repository extends ContainerAware {

    /**
     * @return {string}
     * @constructor
     */
    static get COLLECTION() { return 'organization'; };

    /**
     * @return {string}
     * @constructor
     */
    static get STORAGE_SERVICE() { return 'OrganizationStorage'; };

    /**
     * @return {string}
     * @constructor
     */
    static get ORGANIZATION_ENTITY_SERVICE() { return 'RestaurantEntity'; };

    /**
     * @return {string}
     * @constructor
     */
    static get ORGANIZATION_HYDRATOR_SERVICE() { return 'OrganizationEntityHydrator'; };


    init() {

        this.initConfig();
        this.initAcl();
        this.initEntity();
        this.initHydrator();
        this.initStorage();
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
     * Acl
     */
    initAcl() {
        this.getContainer().get('Acl').addResource('restaurant');
        this.getContainer().get('Acl').allow('admin', 'restaurant', 'menu')
    }

    /**
     * Storage
     */
    initStorage() {
        let adapterStorage = new XmlhAdapter(
            container.get('config')['rest']['path'],
            container.get('config')['rest']['resources']['restaurant']['name'],
            new JsonEncode(),
            new JsonDecode(),
            new DefaultBuilder()
        );

        adapterStorage.addHeader(    'Content-Type', 'application/json')
            .addHeader(    'Accept', 'application/json');

        let storage = new Storage(adapterStorage);
        storage.setHydrator(this.getContainer().get('HydratorContainerAggregate').get(Repository.ORGANIZATION_HYDRATOR_SERVICE));
        this.getContainer().set(Repository.STORAGE_SERVICE, storage);
    }
    
    /**
     *
     */
    initEntity() {
        this.getContainer()
            .get('EntityContainerAggregate')
            .set(Repository.ORGANIZATION_ENTITY_SERVICE, new RestaurantEntity());
    }

    /**
     *
     */
    initHydrator() {

        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                Repository.ORGANIZATION_HYDRATOR_SERVICE,
                Repository.getRestaurantHydrator(this.getContainer().get('EntityContainerAggregate'))
            );
    }

    /**
     * @param container
     */
    static getRestaurantHydrator(container) {

        let hydrator = new PropertyHydrator();
        hydrator.setTemplateObjectHydration(container.get(Repository.ORGANIZATION_ENTITY_SERVICE));


        return hydrator;
    }
}