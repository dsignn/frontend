/**
 * Dashboard repository
 */
import { ContainerAware } from "@dsign/library/src/container/ContainerAware.js";
import { XmlhAdapter } from "@dsign/library/src/storage/adapter/xmlh/XmlhAdapter";
import { JsonDecode } from "@dsign/library/src/data-transform/JsonDecode";
import { JsonEncode } from "@dsign/library/src/data-transform/JsonEncode.js";
import { DefaultBuilder } from "@dsign/library/src/storage/adapter/xmlh/url/DefaultBuilder";
import { Storage } from "@dsign/library/src/storage/Storage";
import { PropertyHydrator } from "@dsign/library/src/hydrator/PropertyHydrator.js";
import { HydratorStrategy } from "@dsign/library/src/hydrator/strategy/value/HydratorStrategy.js";
import { HybridStrategy } from "@dsign/library/src/hydrator/strategy/value/HybridStrategy.js";
import { MapProprertyStrategy } from "@dsign/library/src/hydrator/strategy/proprerty/MapHydratorStrategy.js";
import { AbstractRepository } from "../../src/AbstractRepository";
import { PlaylistEntity } from "./src/entity/PlaylistEntity.js"
import { config } from './config.js';


export class Repository extends AbstractRepository {

    init() {

        /**
         * Merge config
         */
        this.loadConfig();
        this.initEntity();
        this.initHydrator();
        this.initStorage();
        this.initAcl();

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
        this.getContainer().get('Acl').addResource('playlist');
        this.getContainer().get('Acl').allow('admin', 'playlist', 'menu');
        this.getContainer().get('Acl').allow('organizationOwner', 'playlist', 'menu');
    }

    initEntity() {
        this.getContainer().get('EntityContainerAggregate')
            .set('PlaylistEntity', new PlaylistEntity());
    }

    /**
     *
     */
    initHydrator() {
        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                'PlaylistHydrator',
                Repository.getPlaylistEntityHydrator(this.getContainer())
            );
    }

    /**
     * Storage
     */
    initStorage() {
        let adapterStorage = new XmlhAdapter(
            container.get('config')['rest']['path'],
            container.get('config')['rest']['resources']['playlist']['name'],
            new JsonEncode(),
            new JsonDecode(),
            new DefaultBuilder()
        );


        adapterStorage.addHeader('Content-Type', 'application/json')
            .addHeader('Accept', 'application/json');

        this.injectAuthHeader(adapterStorage);

        let storage = new Storage(adapterStorage);
        storage.setHydrator(this.getContainer().get('HydratorContainerAggregate').get('PlaylistHydrator'));

        this.getContainer().set('PlaylistStorage', storage);
    }

    /**
     * @param {ContainerAggregate} container
     */
    static getPlaylistEntityHydrator(container) {
        let hydrator = new PropertyHydrator(
            container.get('EntityContainerAggregate').get(
                'PlaylistEntity'
            )
        );

        let monitorStrategy = new HydratorStrategy();
        monitorStrategy.setHydrator(Repository.getMonitorReferenceHydrator(container));

        let resourceStrategy = new HydratorStrategy();
        resourceStrategy.setHydrator(Repository.getResourceReferenceHydrator(container));

        let playlistStrategy = new HydratorStrategy();
        playlistStrategy.setHydrator(Repository.getPlaylistReferenceHydrator(container));

        hydrator
            .addPropertyStrategy('_id', new MapProprertyStrategy('id', 'id'));

        hydrator.addValueStrategy('resources', resourceStrategy)
            .addValueStrategy('monitorContainerReference', monitorStrategy)
            .addValueStrategy('binds', playlistStrategy)
            .addValueStrategy('enableAudio', new HybridStrategy(HybridStrategy.BOOLEAN_TYPE, HybridStrategy.NUMBER_TYPE));

        hydrator.enableExtractProperty('id')
            .enableExtractProperty('_id')
            .enableExtractProperty('name')
            .enableExtractProperty('status')
            .enableExtractProperty('context')
            .enableExtractProperty('adjust')
            .enableExtractProperty('monitorContainerReference')
            .enableExtractProperty('rotation')
            .enableExtractProperty('enableAudio')
            .enableExtractProperty('currentIndex')
            .enableExtractProperty('binds')
            .enableExtractProperty('resources');

        hydrator.enableHydrateProperty('id')
            .enableHydrateProperty('_id')
            .enableHydrateProperty('name')
            .enableHydrateProperty('status')
            .enableHydrateProperty('context')
            .enableHydrateProperty('adjust')
            .enableHydrateProperty('monitorContainerReference')
            .enableHydrateProperty('rotation')
            .enableHydrateProperty('enableAudio')
            .enableHydrateProperty('currentIndex')
            .enableHydrateProperty('binds')
            .enableHydrateProperty('resources');

        return hydrator;
    }

    /**
     * @param container
     * @return {PropertyHydrator}
     */
    static getMonitorReferenceHydrator(container) {

        let hydrator = new PropertyHydrator(
            container.get('EntityContainerAggregate').get(
                container.get('EntityContainerAggregate').get('EntityNestedReference')
            )
        );

        hydrator.enableHydrateProperty('id')
            .enableHydrateProperty('collection')
            .enableHydrateProperty('name')
            .enableHydrateProperty('parentId');

        hydrator.enableExtractProperty('id')
            .enableExtractProperty('collection')
            .enableExtractProperty('name')
            .enableExtractProperty('parentId');

        return hydrator;
    }

    /**
     * @param container
     * @return {PropertyHydrator}
     */
    static getResourceReferenceHydrator(container) {

        let hydrator = new PropertyHydrator(
            container.get('EntityContainerAggregate').get(
                container.get('EntityContainerAggregate').get('EntityReference')
            )
        );

        hydrator.enableHydrateProperty('id')
            .enableHydrateProperty('name')
            .enableHydrateProperty('currentTime');

        hydrator.enableExtractProperty('id')
            .enableExtractProperty('name')
            .enableExtractProperty('currentTime');

        return hydrator;
    }

    /**
     * @param container
     * @return {PropertyHydrator}
     */
    static getPlaylistReferenceHydrator(container) {

        let hydrator = new PropertyHydrator();
        hydrator.setTemplateObjectHydration(
            container.get('EntityContainerAggregate').get('EntityReference')
        );

        hydrator.enableHydrateProperty('id')
            .enableHydrateProperty('collection')
            .enableHydrateProperty('name');

        hydrator.enableExtractProperty('id')
            .enableExtractProperty('collection')
            .enableExtractProperty('name');

        return hydrator;
    }
}