/**
 * Timeslot repository
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
import {Injector} from "./src/entity/embedded/Injector"
import {TimeslotEntity} from "./src/entity/TimeslotEntity";
import {Repository as ResourceRepository} from "./../resource/repository";
import {Repository as MonitorRepository} from "./../monitor/repository";

/**
 * @class Repository
 */
export class Repository extends ContainerAware {

    /**
     * @return {string}
     * @constructor
     */
    static get COLLECTION() { return 'timeslot'; };

    /**
     * @return {string}
     * @constructor
     */
    static get STORAGE_SERVICE() { return 'TimeslotStorage'; };

    /**
     * @return {string}
     * @constructor
     */
    static get TIMESLOT_ENTITY_SERVICE() { return 'TimeslotEntity'; };

    /**
     * @return {string}
     * @constructor
     */
    static get TIMESLOT_HYDRATOR_SERVICE() { return 'TimeslotEntityHydrator'; };

    init() {

        this.loadConfig();
        this.loadAcl();
        this.initEntity();
        this.initHydrator();
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

        let storage = new Storage(adapterStorage);
        storage.setHydrator(this.getContainer().get('HydratorContainerAggregate').get(Repository.TIMESLOT_HYDRATOR_SERVICE));
        this.getContainer().set(Repository.STORAGE_SERVICE, storage);
    }


    /**
     *
     */
    initEntity() {
        this.getContainer()
            .get('EntityContainerAggregate')
            .set(Repository.TIMESLOT_ENTITY_SERVICE, new TimeslotEntity());
    }

    /**
     *
     */
    initHydrator() {

        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                Repository.TIMESLOT_HYDRATOR_SERVICE,
                Repository.getTimeslotHydrator(this.getContainer().get('EntityContainerAggregate'))
            );
    }

    /**
     * @param container
     */
    static getTimeslotHydrator(container) {

        let hydrator = new PropertyHydrator();
        hydrator.setTemplateObjectHydration(container.get(Repository.TIMESLOT_ENTITY_SERVICE));

        /**
         * Resource strategy

        let resourceStrategy = new HydratorStrategy();
        resourceStrategy.setHydrator(ResourceRepository.getResourceHydrator(container));

        /**
         * Monitor strategy

        let monitorStrategy = new HydratorStrategy();
        monitorStrategy.setHydrator(MonitorRepository.getMonitorContainerReferenceHydrator(container));

        /**
         * Timeslot bind strategy

        let bindTimeslotStrategy = new HydratorStrategy();
        bindTimeslotStrategy.setHydrator(Repository.getTimeslotReferenceHydrator(container));

        /**
         * Timeslot bind strategy

        let injectorDataStrategy = new HydratorStrategy();
        injectorDataStrategy.setHydrator(Repository.getInjectorHydrator(container));
*/

        hydrator
            //.addValueStrategy('resources', resourceStrategy)
       //     .addValueStrategy('monitorContainerReference', monitorStrategy)
       //     .addValueStrategy('binds', bindTimeslotStrategy)
            .addValueStrategy('currentTime', new NumberStrategy())
            .addValueStrategy('duration', new NumberStrategy())
       //     .addValueStrategy('dataReferences', injectorDataStrategy)
            .addValueStrategy('enableAudio', new HybridStrategy(HybridStrategy.BOOLEAN_TYPE, HybridStrategy.NUMBER_TYPE));

        hydrator.enableHydrateProperty('id')
            .enableHydrateProperty('_id')
            .enableHydrateProperty('name')
            .enableHydrateProperty('status')
            .enableHydrateProperty('binds')
            .enableHydrateProperty('currentTime')
            .enableHydrateProperty('duration')
            .enableHydrateProperty('enableAudio')
            .enableHydrateProperty('context')
            .enableHydrateProperty('monitorContainerReference')
            .enableHydrateProperty('resources')
            .enableHydrateProperty('dataReferences')
            .enableHydrateProperty('tags')
            .enableHydrateProperty('rotation')
            .enableHydrateProperty('filters');

        hydrator.enableExtractProperty('id')
            .enableHydrateProperty('_id')
            .enableExtractProperty('name')
            .enableExtractProperty('status')
            .enableExtractProperty('binds')
            .enableExtractProperty('currentTime')
            .enableExtractProperty('duration')
            .enableExtractProperty('enableAudio')
            .enableExtractProperty('context')
            .enableExtractProperty('monitorContainerReference')
            .enableExtractProperty('resources')
            .enableExtractProperty('dataReferences')
            .enableExtractProperty('tags')
            .enableExtractProperty('rotation')
            .enableExtractProperty('filters');

        return hydrator;
    }

    /**
     * @param container
     * @return {PropertyHydrator}
     */
    static getTimeslotReferenceHydrator(container) {

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

    /**
     * @param container
     * @return {*}
     */
    static getInjectorHydrator(container) {

        let hydrator = new PropertyHydrator();
        hydrator.setTemplateObjectHydration(new Injector());

        hydrator.enableHydrateProperty('name')
            .enableHydrateProperty('data');


        hydrator.enableExtractProperty('name')
            .enableExtractProperty('data');

        return hydrator;
    }
}