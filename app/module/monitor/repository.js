/**
 * Monitor repository
 */
import {ContainerAware} from "@dsign/library/src/container/ContainerAware.js";
import {config} from './config';
import {XmlhAdapter} from "@dsign/library/src/storage/adapter/xmlh/XmlhAdapter";
import {JsonEncode} from "@dsign/library/src/data-transform/JsonEncode";
import {JsonDecode} from "@dsign/library/src/data-transform/JsonDecode";
import {DefaultBuilder} from "@dsign/library/src/storage/adapter/xmlh/url/DefaultBuilder";
import {Storage} from "@dsign/library/src/storage/Storage";
import {PropertyHydrator} from "@dsign/library/src/hydrator/PropertyHydrator";
import {HydratorStrategy} from "@dsign/library/src/hydrator/strategy/value/HydratorStrategy";
import {HybridStrategy} from "@dsign/library/src/hydrator/strategy/value/HybridStrategy";
import {NumberStrategy} from "@dsign/library/src/hydrator/strategy/value/NumberStrategy";
import {MapPropertyStrategy} from "@dsign/library/src/hydrator/strategy/proprerty/MapPropertyStrategy";

/**
 * @class Repository
 */
export class Repository extends ContainerAware {

    /**
     * @return {string}
     * @constructor
     */
    static get MONITOR_CONTAINER_HYDRATOR_SERVICE() { return 'MonitorContaninerEntityHydrator'; };

    /**
     * @return {string}
     * @constructor
     */
    static get MONITOR_HYDRATOR_SERVICE() { return 'MonitorEntityHydrator'; };

    /**
     * @const
     */
    static get STORAGE_SERVICE() { return 'MonitorStorage';};

    /**
     * @return {string}
     * @constructor
     */
    static get MONITOR_CONTAINER_ENTITY_SERVICE() { return 'MonitorContainerEntity'; };

    /**
     * @return {string}
     * @constructor
     */
    static get MONITOR_ENTITY_SERVICE() { return 'MonitorEntity'; };

    /**
     *
     */
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
        this.getContainer().get('Acl').addResource('monitor');
        this.getContainer().get('Acl').allow('admin', 'monitor', 'menu')
    }

    /**
     * Storage
     */
    initStorage() {
        let adapterStorage = new XmlhAdapter(
            container.get('config')['rest']['path'],
            container.get('config')['rest']['resources']['monitor']['name'],
            new JsonEncode(),
            new JsonDecode(),
            new DefaultBuilder()
        );

        adapterStorage.addHeader(    'Content-Type', 'application/json')
            .addHeader(    'Accept', 'application/json');

        let storage = new Storage(adapterStorage);
        storage.setHydrator(this.getContainer().get('HydratorContainerAggregate')
            .get(Repository.MONITOR_CONTAINER_HYDRATOR_SERVICE)
        );

        this.getContainer().set(Repository.STORAGE_SERVICE, storage);
    }

    /**
     *
     */
    initEntity() {
        this.getContainer()
            .get('EntityContainerAggregate')
            .set(Repository.MONITOR_CONTAINER_ENTITY_SERVICE, new MonitorContainerEntity());

        this.getContainer()
            .get('EntityContainerAggregate')
            .set(Repository.MONITOR_ENTITY_SERVICE, new MonitorEntity());
    }

    /**
     *
     */
    initHydrator() {

        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                Repository.MONITOR_CONTAINER_HYDRATOR_SERVICE,
                Repository.getMonitorContainerEntityHydrator(this.getContainer().get('EntityContainerAggregate'))
            );

        this.getContainer()
            .get('HydratorContainerAggregate')
            .set(
                Repository.MONITOR_HYDRATOR_SERVICE,
                Repository.getMonitorEntityHydrator(this.getContainer().get('EntityContainerAggregate'))
            )
    }

    /**
     * @param {ContainerAggregate} container
     */
    static getMonitorContainerEntityHydrator(container) {

        let hydrator = new PropertyHydrator(
            container.get(Repository.MONITOR_CONTAINER_ENTITY_SERVICE)
        );

        let strategy = new HydratorStrategy();
        strategy.setHydrator(Repository.getMonitorEntityHydrator(container));

        hydrator.addPropertyStrategy('id', new MapPropertyStrategy('id', '_id'))
            .addPropertyStrategy('_id', new MapPropertyStrategy('id', '_id'));

        hydrator.addValueStrategy('monitors', strategy)
            .addValueStrategy('enable', new HybridStrategy(HybridStrategy.BOOLEAN_TYPE, HybridStrategy.NUMBER_TYPE));

        hydrator.enableExtractProperty('id')
            .enableExtractProperty('_id')
            .enableExtractProperty('name')
            .enableExtractProperty('enable')
            .enableExtractProperty('monitors');

        hydrator.enableHydrateProperty('id')

            .enableHydrateProperty('_id')
            .enableHydrateProperty('name')
            .enableHydrateProperty('enable')
            .enableHydrateProperty('monitors');

        return hydrator;
    }

    /**
     * @param {ContainerAggregate} container
     */
    static getMonitorEntityHydrator(container) {

        let hydrator = new PropertyHydrator(
            container.get(Repository.MONITOR_ENTITY_SERVICE)
        );

        let strategy = new HydratorStrategy();
        strategy.setHydrator(hydrator);

        hydrator.addValueStrategy('monitors', strategy)
            .addValueStrategy('polygonPoints', new HydratorStrategy(Repository.getPointHydrator(container)))
            .addValueStrategy('defaultTimeslotReference', new HydratorStrategy(Repository.getTimeslotReferenceHydrator(container)))
            .addValueStrategy('offsetX', new NumberStrategy())
            .addValueStrategy('offsetY', new NumberStrategy())
            .addValueStrategy('height', new NumberStrategy())
            .addValueStrategy('width', new NumberStrategy());

        hydrator.enableExtractProperty('id')
            .enableExtractProperty('name')
            .enableExtractProperty('offsetX')
            .enableExtractProperty('offsetY')
            .enableExtractProperty('height')
            .enableExtractProperty('width')
            .enableExtractProperty('backgroundColor')
            .enableExtractProperty('polygonPoints')
            .enableExtractProperty('monitors')
            .enableExtractProperty('alwaysOnTop')
            .enableExtractProperty('defaultTimeslotReference');


        hydrator.enableHydrateProperty('id')
            .enableHydrateProperty('name')
            .enableHydrateProperty('offsetX')
            .enableHydrateProperty('offsetY')
            .enableHydrateProperty('height')
            .enableHydrateProperty('width')
            .enableHydrateProperty('backgroundColor')
            .enableHydrateProperty('polygonPoints')
            .enableHydrateProperty('monitors')
            .enableHydrateProperty('alwaysOnTop')
            .enableHydrateProperty('defaultTimeslotReference');

        return hydrator;
    }

    /**
     * @param container
     * @return {PropertyHydrator}
     */
    static getPointHydrator(container) {

        let hydrator = new PropertyHydrator();

        hydrator.addValueStrategy('x', new NumberStrategy())
            .addValueStrategy('y', new NumberStrategy());

        hydrator.enableHydrateProperty('x')
            .enableHydrateProperty('y');

        hydrator.enableExtractProperty('x')
            .enableExtractProperty('y');

        return hydrator;
    }

    /**
     * @param container
     * @return {PropertyHydrator}
     */
    static getMonitorContainerReferenceHydrator(container) {

        let hydrator = new PropertyHydrator();
        hydrator.setTemplateObjectHydration(container.get('EntityNestedReference'));

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
}
