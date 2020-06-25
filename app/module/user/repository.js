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

/**
 * @class Repository
 */
export class Repository extends ContainerAware {

    /**
     * @const
     */
    static STORAGE_SERVICE() { return 'UserStorage';};

    init() {

        this.loadConfig();
        this.loadAcl();
        this.loadStorage();
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
        this.getContainer().get('Acl').addResource('user');
        this.getContainer().get('Acl').allow('admin', 'user', 'menu')
    }

    /**
     * Storage
     */
    loadStorage() {
        let adapterStorage = new XmlhAdapter(
            container.get('config')['rest']['path'],
            container.get('config')['rest']['resources']['user']['name'],
            new JsonEncode(),
            new JsonDecode(),
            new DefaultBuilder()
        );

        adapterStorage.addHeader(    'Content-Type', 'application/json')
            .addHeader(    'Accept', 'application/json');

        this.getContainer().set(Repository.STORAGE_SERVICE(), new Storage(adapterStorage));
    }
}