/**
 * Restaurant repository
 */
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
import {MenuEntity} from "./src/entity/MenuEntity";
import {ListBuilder} from "./src/storage/adapter/xmlh/url/ListBuilder"
import {MenuItem} from "./src/entity/embedded/MenuItem";
import {Auth} from "./../../src/authentication/Auth";
import {FormDataEncode} from "@dsign/library/src/data-transform/FormDataEncode";
import {AbstractRepository} from "../../src/AbstractRepository";
import {config} from './config';

/**
 * @class Repository
 */
export class Repository extends AbstractRepository {

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
    static get STORAGE_MENU_SERVICE() { return 'MenuStorage'; };

    /**
     * @return {string}
     * @constructor
     */
    static get STORAGE_UPLOAD_MENU_RESOURCE_SERVICE() { return 'UploadMenuResourceStorage'; };

    /**
     * @return {string}
     * @constructor
     */
    static get STORAGE_UPLOAD_ORGANIZATION_RESOURCE_SERVICE() { return 'UploadOrganizationResourceStorage'; };

    /**
     * @return {string}
     * @constructor
     */
    static get STORAGE_MENU_CATEGORY_SERVICE() { return 'MenuCategoryStorage'; };

    /**
     * @return {string}
     * @constructor
     */
    static get QR_CODE_STORAGE_SERVICE() { return 'QrCodeGeneratorStorage'; };

    /**
     * @return {string}
     * @constructor
     */
    static get ORGANIZATION_ENTITY_SERVICE() { return 'RestaurantEntity'; };

    /**
     * @return {string}
     * @constructor
     */
    static get MENU_ENTITY_SERVICE() { return 'MenuEntity'; };

    /**
     * @return {string}
     * @constructor
     */
    static get ORGANIZATION_HYDRATOR_SERVICE() { return 'OrganizationEntityHydrator'; };


    /**
     * @return {string}
     * @constructor
     */
    static get MENU_HYDRATOR_SERVICE() { return 'MenuEntityHydrator'; };

    /**
     * @return {string}
     * @constructor
     */
    static get MENU_ITEM_HYDRATOR_SERVICE() { return 'MenuItemHydrator'; };


    init() {

        this.initConfig();
        this.initAcl();
        this.initEntity();
        this.initHydrator();
        this.initStorage();
        this.initMenuStorage();
        this.initMenuCategoryStorage();
        this.initUploadMenuResourceStorage();
        this.initUploadRestaurantResourceStorage();
        this.initQrCodeStorage();
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
        this.getContainer().get('Acl').addResource('menu');

        this.getContainer().get('Acl').allow('admin', 'restaurant', 'add');
        this.getContainer().get('Acl').allow('admin', 'restaurant', 'menu');
        this.getContainer().get('Acl').allow('admin', 'menu', 'add');
        this.getContainer().get('Acl').allow('restaurantOwner', 'restaurant', 'menu');
        this.getContainer().get('Acl').allow('restaurantOwner', 'menu', 'add');
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

        this.injectAuthHeader(adapterStorage);

        let storage = new Storage(adapterStorage);
        storage.setHydrator(this.getContainer().get('HydratorContainerAggregate').get(Repository.ORGANIZATION_HYDRATOR_SERVICE));
        this.getContainer().set(Repository.STORAGE_SERVICE, storage);
    }

    /**
     * Storage
     */
    initMenuStorage() {
        let adapterStorage = new XmlhAdapter(
            container.get('config')['rest']['path'],
            container.get('config')['rest']['resources']['menu']['name'],
            new JsonEncode(),
            new JsonDecode(),
            new DefaultBuilder()
        );

        adapterStorage.addHeader(    'Content-Type', 'application/json')
            .addHeader(    'Accept', 'application/json');

        this.injectAuthHeader(adapterStorage);

        let storage = new Storage(adapterStorage);
        storage.setHydrator(this.getContainer().get('HydratorContainerAggregate').get(Repository.MENU_HYDRATOR_SERVICE));
        this.getContainer().set(Repository.STORAGE_MENU_SERVICE, storage);
    }

    /**
     * Storage
     */
    initMenuCategoryStorage() {
        let adapterStorage = new XmlhAdapter(
            container.get('config')['rest']['path'],
            container.get('config')['rest']['resources']['menu-category']['name'],
            new JsonEncode(),
            new JsonDecode(),
            new ListBuilder()
        );

        adapterStorage.addHeader(    'Content-Type', 'application/json')
            .addHeader(    'Accept', 'application/json');

        this.getContainer().set(Repository.STORAGE_MENU_CATEGORY_SERVICE, adapterStorage);
    }

    /**
     * Storage
     */
    initUploadMenuResourceStorage() {

        let adapterStorage = new XmlhAdapter(
            container.get('config')['rest']['path'],
            container.get('config')['rest']['resources']['uploadMenuResource']['name'],
            new FormDataEncode(),
            new JsonDecode(),
            new ListBuilder()
        );

        adapterStorage.addHeader(    'Accept', 'application/json');

        this.injectAuthHeader(adapterStorage);

        let storage = new Storage(adapterStorage);
        storage.setHydrator(this.getContainer().get('HydratorContainerAggregate').get(Repository.MENU_HYDRATOR_SERVICE));
        this.getContainer().set(Repository.STORAGE_UPLOAD_MENU_RESOURCE_SERVICE, storage);
    }


    /**
     * Storage
     */
    initUploadRestaurantResourceStorage() {

        let adapterStorage = new XmlhAdapter(
            container.get('config')['rest']['path'],
            container.get('config')['rest']['resources']['uploadOrganizationResource']['name'],
            new FormDataEncode(),
            new JsonDecode(),
            new ListBuilder()
        );

        adapterStorage.addHeader(    'Accept', 'application/json');

        this.injectAuthHeader(adapterStorage);

        let storage = new Storage(adapterStorage);
        storage.setHydrator(this.getContainer().get('HydratorContainerAggregate').get(Repository.ORGANIZATION_HYDRATOR_SERVICE));
        this.getContainer().set(Repository.STORAGE_UPLOAD_ORGANIZATION_RESOURCE_SERVICE, storage);
    }

    /**
     *
     */
    initQrCodeStorage() {

        let adapterStorage = new XmlhAdapter(
            container.get('config')['rest']['path'],
            container.get('config')['rest']['resources']['rpcQrcode']['name'],
            new JsonEncode(),
            new JsonDecode(),
            new DefaultBuilder()
        );

        adapterStorage.addHeader(    'Content-Type', 'application/json')
            .addHeader(    'Accept', 'application/json');

        let storage = new Storage(adapterStorage);
        storage.setHydrator(this.getContainer().get('HydratorContainerAggregate').get(Repository.ORGANIZATION_HYDRATOR_SERVICE));
        this.getContainer().set(Repository.QR_CODE_STORAGE_SERVICE, storage);
    }
    
    /**
     *
     */
    initEntity() {
        this.getContainer()
            .get('EntityContainerAggregate')
            .set(Repository.ORGANIZATION_ENTITY_SERVICE, new RestaurantEntity());

        this.getContainer()
            .get('EntityContainerAggregate')
            .set(Repository.MENU_ENTITY_SERVICE, new MenuEntity());
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

        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                Repository.MENU_HYDRATOR_SERVICE,
                Repository.getMenuHydrator(this.getContainer().get('EntityContainerAggregate'))
            );

        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                Repository.MENU_ITEM_HYDRATOR_SERVICE,
                Repository.getMenuItemHydrator()
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

    /**
     * @param container
     */
    static getMenuHydrator(container) {

        let strategy = new HydratorStrategy();
        strategy.setHydrator(Repository.getMenuItemHydrator(container));

        let hydrator = new PropertyHydrator();
        hydrator.setTemplateObjectHydration(container.get(Repository.MENU_ENTITY_SERVICE));

        hydrator.addValueStrategy('items', strategy);

        return hydrator;
    }

    /**
     * @returns {PropertyHydrator}
     */
    static getMenuItemHydrator(container) {
        let hydrator = new PropertyHydrator();
        hydrator.setTemplateObjectHydration(new MenuItem());

        return hydrator;
    }
}