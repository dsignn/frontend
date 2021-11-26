/**
 * Order repository
 */
import {config} from './config';
import {XmlhAdapter} from "@dsign/library/src/storage/adapter/xmlh/XmlhAdapter";
import {JsonEncode} from "@dsign/library/src/data-transform/JsonEncode";
import {JsonDecode} from "@dsign/library/src/data-transform/JsonDecode";
import {FormDataEncode} from "@dsign/library/src/data-transform/FormDataEncode";
import {DefaultBuilder} from "@dsign/library/src/storage/adapter/xmlh/url/DefaultBuilder";
import {Storage} from "@dsign/library/src/storage/Storage";
import {AggregatePropertyHydrator, PropertyHydrator} from "@dsign/library/src/hydrator/index";
import {HydratorStrategy, MongoIdStrategy} from "@dsign/library/src/hydrator/strategy/value/index";
import {MapProprertyStrategy} from "@dsign/library/src/hydrator/strategy/proprerty/index";
import {PathGeneric} from "@dsign/library/src/path/PathGeneric";
import {OrderEntity} from "./src/entity/OrderEntity";
import {AbstractRepository} from "../../src/AbstractRepository";

/**
 * @class Repository
 */
export class Repository extends AbstractRepository {

    /**
     * @return {string}
     * @constructor
     */
    static get ORDER_ENTITY_SERVICE() { return 'OrderEntity'; };

    /**
     * @return {string}
     * @constructor
     */
    static get ORDER_HYDRATOR_SERVICE() { return 'OrderHydrator'; };


    /**
     * @return {string}
     * @constructor
     */
     static get STORAGE_ORDER_SERVICE() { return 'OrderStorage'; };


    
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
        this.getContainer().get('Acl').addResource('order');
        this.getContainer().get('Acl').allow('admin', 'order', 'menu');
        this.getContainer().get('Acl').allow('restaurantOwner', 'order', 'menu');
    }

    /**
     * Storage
     */
    initStorage() {
        let adapterStorage = new XmlhAdapter(
            container.get('config')['rest']['path'],
            container.get('config')['rest']['resources']['order']['name'],
            new FormDataEncode(),
            new JsonDecode(),
            new DefaultBuilder()
        );

        adapterStorage.addHeader('Accept', 'application/json');

        this.injectAuthHeader(adapterStorage);

        let storage = new Storage(adapterStorage);
        storage.setHydrator(this.getContainer().get('HydratorContainerAggregate').get(Repository.ORDER_HYDRATOR_SERVICE));

        this.getContainer().set(Repository.STORAGE_ORDER_SERVICE, storage);
    }

    /**
     *
     */
    initEntity() {
        this.getContainer()
            .get('EntityContainerAggregate')
            .set(Repository.ORDER_ENTITY_SERVICE, new OrderEntity());
    }

    /**
     *
     */
    initHydrator() {
        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                Repository.ORDER_HYDRATOR_SERVICE,
                Repository.getOrderEntityHydrator(this.getContainer().get('EntityContainerAggregate'))
            );

    }

    /**
     * @param container
     */
    static getOrderEntityHydrator(container) {

        let hydrator = new PropertyHydrator(container.get(Repository.ORDER_ENTITY_SERVICE));

        return hydrator;
    }
}