/**
 * User repository
 */
import {ContainerAware} from "@dsign/library/src/container/ContainerAware.js";
import {config} from './config';
import {Storage} from "@dsign/library/src/storage/Storage";
import {XmlhAdapter} from "@dsign/library/src/storage/adapter/xmlh/XmlhAdapter";
import {JsonDecode} from "@dsign/library/src/data-transform/JsonDecode";
import {DefaultBuilder} from "@dsign/library/src/storage/adapter/xmlh/url/DefaultBuilder";
import {JsonEncode} from "@dsign/library/src/data-transform/JsonEncode";
import {PropertyHydrator} from "@dsign/library/src/hydrator";
import {UserEntity} from "./src/entity/UserEntity";

/**
 * @class Repository
 */
export class Repository extends ContainerAware {

    /**
     * @const
     */
    static STORAGE_SERVICE() { return 'UserStorage'; };

    /**
     *
     * @const
     */
    static USER_HYDRATOR_SERVICE() { return 'UserEntityHydrator'}

    init() {

        this.initConfig();
        this.initAcl();
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
        this.getContainer().get('Acl').addResource('user');
        this.getContainer().get('Acl').allow('admin', 'user', 'menu')
    }

    /**
     * Storage
     */
    initStorage() {
        let adapterStorage = new XmlhAdapter(
            container.get('config')['rest']['path'],
            container.get('config')['rest']['resources']['user']['name'],
            new JsonEncode(),
            new JsonDecode(),
            new DefaultBuilder()
        );

        adapterStorage.addHeader('Content-Type', 'application/json')
            .addHeader('Accept', 'application/json');

        let storage = new Storage(adapterStorage);
        storage.setHydrator(this.getContainer().get('HydratorContainerAggregate').get(Repository.USER_HYDRATOR_SERVICE()));
        this.getContainer().set(Repository.STORAGE_SERVICE(), storage);
    }

    /**
     *
     */
    initHydrator() {

        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                Repository.USER_HYDRATOR_SERVICE(),
                Repository.getUserHydrator(this.getContainer().get('EntityContainerAggregate'))
            );
    }

    /**
     * @param container
     * @return {*}
     */
    static getUserHydrator(container) {

        let hydrator = new PropertyHydrator();
        hydrator.setTemplateObjectHydration(new UserEntity());

        return hydrator;
    }
}