/**
 * Timeslot repository
 */
import {ContainerAware} from "@dsign/library/src/container/ContainerAware.js";
import {config} from './config';
import {XmlhAdapter} from "@dsign/library/src/storage/adapter/xmlh/XmlhAdapter";
import {JsonEncode} from "@dsign/library/src/data-transform/JsonEncode";
import {JsonDecode} from "@dsign/library/src/data-transform/JsonDecode";
import {DefaultBuilder} from "@dsign/library/src/storage/adapter/xmlh/url/DefaultBuilder";
import {Storage} from "@dsign/library/src/storage/Storage";

/**
 * @class Repository
 */
export class Repository extends ContainerAware {

    /**
     * @const
     */
    static STORAGE_SERVICE() { return 'TimeslotStorage';};

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
        this.getContainer().get('Acl').addResource('timeslot');
        this.getContainer().get('Acl').allow('admin', 'timeslot', 'menu')
    }

    /**
     * Storage
     */
    loadStorage() {
        let adapterStorage = new XmlhAdapter(
            container.get('config')['rest']['path'],
            container.get('config')['rest']['resources']['timeslot']['name'],
            new JsonEncode(),
            new JsonDecode(),
            new DefaultBuilder()
        );

        adapterStorage.addHeader(    'Content-Type', 'application/json')
            .addHeader(    'Accept', 'application/json');

        this.getContainer().set(Repository.STORAGE_SERVICE(), new Storage(adapterStorage));
    }
}