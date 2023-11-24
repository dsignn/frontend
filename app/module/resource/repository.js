/**
 * Reosuroce repository
 */
import { config } from './config';
import { XmlhAdapter } from "@dsign/library/src/storage/adapter/xmlh/XmlhAdapter";
import { JsonEncode } from "@dsign/library/src/data-transform/JsonEncode";
import { JsonDecode } from "@dsign/library/src/data-transform/JsonDecode";
import { FormDataEncode } from "@dsign/library/src/data-transform/FormDataEncode";
import { DefaultBuilder } from "@dsign/library/src/storage/adapter/xmlh/url/DefaultBuilder";
import { Storage } from "@dsign/library/src/storage/Storage";
import { AggregatePropertyHydrator, PropertyHydrator } from "@dsign/library/src/hydrator/index";
import { HydratorStrategy, MongoIdStrategy } from "@dsign/library/src/hydrator/strategy/value/index";
import { MapProprertyStrategy } from "@dsign/library/src/hydrator/strategy/proprerty/index";
import { FileEntity } from "./src/entity/FileEntity";
import { AudioEntity } from "./src/entity/AudioEntity";
import { VideoEntity } from "./src/entity/VideoEntity";
import { ImageEntity } from "./src/entity/ImageEntity";
import { PathGeneric } from "@dsign/library/src/path/PathGeneric";
import { AbstractRepository } from "../../src/AbstractRepository";

/**
 * @class Repository
 */
export class Repository extends AbstractRepository {

    /**
     * @return {string}
     * @constructor
     */
    static get STORAGE_SERVICE() { return 'ResourceStorage'; };

    /**
     * @return {string}
     * @constructor
     */
    static get FILE_ENTITY_SERVICE() { return 'FileEntity'; };

    /**
     * @return {string}
     * @constructor
     */
    static get IMAGE_ENTITY_SERVICE() { return 'ImageEntity'; };

    /**
     * @return {string}
     * @constructor
     */
    static get VIDEO_ENTITY_SERVICE() { return 'VideoEntity'; };

    /**
     * @return {string}
     * @constructor
     */
    static get AUDIO_ENTITY_SERVICE() { return 'AudioEntity'; };

    /**
     * @return {string}
     * @constructor
     */
    static get FILE_HYDRATOR_SERVICE() { return 'FileEntityHydrator'; };

    /**
     * @return {string}
     * @constructor
     */
    static get IMAGE_HYDRATOR_SERVICE() { return 'ImageEntityHydrator'; };

    /**
     * @return {string}
     * @constructor
     */
    static get VIDEO_HYDRATOR_SERVICE() { return 'VideoEntityHydrator'; };

    /**
     * @return {string}
     * @constructor
     */
    static get AUDIO_HYDRATOR_SERVICE() { return 'AudioEntityHydrator'; };

    /**
     * @return {string}
     * @constructor
     */
    static get RESOURCE_HYDRATOR_SERVICE() { return 'ResourceEntityHydrator'; };
    /**
     * @const
     */
    static get STORAGE_SERVICE() { return 'ResourceStorage'; };

    init() {

        this.loadConfig();
        this.initAcl();
        this.initEntity();
        this.initHydrator();
        this.initStorage();
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
    initAcl() {
        this.getContainer().get('Acl').addResource('resource');
        this.getContainer().get('Acl').allow('admin', 'resource', 'menu');
        this.getContainer().get('Acl').allow('admin', 'resource', 'post');
        this.getContainer().get('Acl').allow('organizationOwner', 'resource', 'menu');
        this.getContainer().get('Acl').allow('admin', 'resource', 'search-organization');
    }

    /**
     * Storage
     */
    initStorage() {
        let adapterStorage = new XmlhAdapter(
            container.get('config')['rest']['path'],
            container.get('config')['rest']['resources']['resource']['name'],
            new FormDataEncode(),
            new JsonDecode(),
            new DefaultBuilder()
        );

        adapterStorage.setUpdateMethod('POST');

        adapterStorage.addHeader('Accept', 'application/json');

        this.injectAuthHeader(adapterStorage);

        let storage = new Storage(adapterStorage);
        storage.setHydrator(this.getContainer().get('HydratorContainerAggregate').get(Repository.RESOURCE_HYDRATOR_SERVICE));

        this.getContainer().set(Repository.STORAGE_SERVICE, storage);
    }

    /**
     *
     */
    initEntity() {
        this.getContainer()
            .get('EntityContainerAggregate')
            .set(Repository.FILE_ENTITY_SERVICE, new FileEntity());

        this.getContainer()
            .get('EntityContainerAggregate')
            .set(Repository.VIDEO_ENTITY_SERVICE, new VideoEntity());

        this.getContainer()
            .get('EntityContainerAggregate')
            .set(Repository.AUDIO_ENTITY_SERVICE, new AudioEntity());

        this.getContainer()
            .get('EntityContainerAggregate')
            .set(Repository.IMAGE_ENTITY_SERVICE, new ImageEntity());

    }

    /**
     *
     */
    initHydrator() {
        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                Repository.FILE_HYDRATOR_SERVICE,
                Repository.getFileEntityHydrator(this.getContainer().get('EntityContainerAggregate'))
            );

        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                Repository.AUDIO_HYDRATOR_SERVICE,
                Repository.getAudioEntityHydrator(this.getContainer().get('EntityContainerAggregate'))
            );

        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                Repository.VIDEO_HYDRATOR_SERVICE,
                Repository.getVideoEntityHydrator(this.getContainer().get('EntityContainerAggregate'))
            );

        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                Repository.IMAGE_HYDRATOR_SERVICE,
                Repository.getImageEntityHydrator(this.getContainer().get('EntityContainerAggregate'))
            );

        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                Repository.RESOURCE_HYDRATOR_SERVICE,
                Repository.getResourceHydrator(this.getContainer().get('EntityContainerAggregate'))
            );
    }

    /**
     * @param container
     */
    static getResourceHydrator(container) {

        let hydrator = new AggregatePropertyHydrator(['mime_type', 'type', 'mimeType']);

        hydrator.addHydratorMap(
            Repository.getImageEntityHydrator(container),
            ['image/jpeg', 'image/png']
        ).addHydratorMap(
            Repository.getVideoEntityHydrator(container),
            ['video/mp4', 'video/webm']
        ).addHydratorMap(
            Repository.getWebComponentEntityHydrator(container),
            ['application/zip', 'text/html', 'application/javascript', 'application/pdf']
        ).addHydratorMap(
            Repository.getAudioEntityHydrator(container),
            ['audio/mp3', 'audio/ogg']
        );

        return hydrator;
    }

    /**
     * @param container
     */
    static getFileEntityHydrator(container) {

        let hydrator = new PropertyHydrator(container.get(Repository.FILE_ENTITY_SERVICE));

        let pathHydratorStrategy = new HydratorStrategy();
        pathHydratorStrategy.setHydrator(Repository.getPathHydrator(container));

        hydrator.addValueStrategy('path', pathHydratorStrategy);
        hydrator.addPropertyStrategy('resourceToImport', new MapProprertyStrategy('resourceToImport', 'file'));

        hydrator.enableHydrateProperty('id')
            .enableHydrateProperty('_id')
            .enableHydrateProperty('name')
            .enableHydrateProperty('resourceToImport')
            .enableHydrateProperty('size')
            .enableHydrateProperty('mimeType')
            .enableHydrateProperty('src')
            .enableHydrateProperty('path')
            .enableHydrateProperty('organizationReference')
            .enableHydrateProperty('tags');

        hydrator.enableExtractProperty('id')
            .enableExtractProperty('_id')
            .enableExtractProperty('name')
            //.enableExtractProperty('size')
            .enableExtractProperty('resourceToImport')
            //.enableExtractProperty('mimeType')
            //.enableExtractProperty('src')
            //.enableExtractProperty('path')
            .enableExtractProperty('organizationReference')
            .enableExtractProperty('tags');

        return hydrator;
    }

    /**
     * @param container
     * @return AbstractHydrator
     */
    static getVideoEntityHydrator(container) {

        let hydrator = Repository.getFileEntityHydrator(container);
        hydrator.setTemplateObjectHydration(container.get(Repository.VIDEO_ENTITY_SERVICE));

        hydrator.enableHydrateProperty('fps')
            .enableHydrateProperty('duration')
            .enableHydrateProperty('dimension')
            .enableHydrateProperty('aspectRation');
/*
        hydrator.enableExtractProperty('fps')
            .enableExtractProperty('duration')
            .enableExtractProperty('dimension')
            .enableExtractProperty('aspectRation');
*/
        return hydrator;
    }

    /**
     * @param container
     * @return AbstractHydrator
     */
    static getImageEntityHydrator(container) {

        let hydrator = Repository.getFileEntityHydrator(container);
        hydrator.setTemplateObjectHydration(container.get(Repository.IMAGE_ENTITY_SERVICE));

        hydrator.enableHydrateProperty('dimension');

        hydrator.enableExtractProperty('dimension');

        return hydrator;
    }

    /**
     * @param container
     * @return AbstractHydrator
     */
    static getWebComponentEntityHydrator(container) {

        let hydrator = Repository.getFileEntityHydrator(container);

        hydrator.enableHydrateProperty('wcName');

        hydrator.enableExtractProperty('wcName');

        return hydrator;
    }


    /**
     * @param container
     * @return AbstractHydrator
     */
    static getAudioEntityHydrator(container) {

        let hydrator = Repository.getFileEntityHydrator(container);
        hydrator.setTemplateObjectHydration(container.get(Repository.AUDIO_ENTITY_SERVICE));

        hydrator.enableHydrateProperty('duration');

        hydrator.enableExtractProperty('duration');

        return hydrator;
    }

    /**
     * @param container
     * @return {PropertyHydrator}
     */
    static getPathHydrator(container) {

        let hydrator = new PropertyHydrator(new PathGeneric());

        hydrator.enableHydrateProperty('directory')
            .enableHydrateProperty('nameFile')
            .enableHydrateProperty('extension');

        hydrator.enableExtractProperty('directory')
            .enableExtractProperty('nameFile')
            .enableExtractProperty('extension');

        return hydrator;
    }

    /**
     * @param container
     * @return {PropertyHydrator}
     */
    static getResourceReferenceHydrator(container) {

        let hydrator = new PropertyHydrator();
        hydrator.setTemplateObjectHydration(container.get('EntityReference'));

        hydrator.enableHydrateProperty('id')
            .enableHydrateProperty('collection')
            .enableHydrateProperty('name');


        hydrator.enableExtractProperty('id')
            .enableExtractProperty('collection')
            .enableExtractProperty('name');

        return hydrator;
    }
}