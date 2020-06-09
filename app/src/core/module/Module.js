import { WebComponent } from "../webcomponent/WebComponent";
/**
 * @class
 * Module
 */
export class Module {
    constructor() {
        /**
         * @type string
         */
        this.id = null;
        /**
         * @type string
         */
        this.icon = '';
        /**
         * @type string
         */
        this.name = '';
        /**
         *
         * @type {WebComponent}
         */
        this.entryPoint = new WebComponent();
        /**
         * @type {string}
         */
        this.configEntryPoint = '';
        /**
         * @type string
         */
        this.label = '';
        /**
         * @type Array<string>
         */
        this.autoloads = [];
        /**
         * @type Array<string>
         */
        this.autoloadsWs = [];
    }
    /**
     * @return {string}
     */
    getId() {
        return this.id;
    }
    /**
     * @param {string} id
     * @return {Module}
     */
    setId(id) {
        this.id = id;
        return this;
    }
    /**
     * @return {string}
     */
    getName() {
        return this.name;
    }
    /**
     * @param {string} name
     * @return {Module}
     */
    setName(name) {
        this.name = name;
        return this;
    }
    /**
     * @return {string}
     */
    getIcon() {
        return this.icon;
    }
    /**
     * @param {string} icon
     * @return {Module}
     */
    setIcon(icon) {
        this.icon = icon;
        return this;
    }
    /**
     * @return {string}
     */
    getConfigEntryPoint() {
        return this.configEntryPoint;
    }
    /**
     * @param {string} configEntryPoint
     * @return {Module}
     */
    setConfigEntryPoint(configEntryPoint) {
        this.configEntryPoint = configEntryPoint;
        return this;
    }
    /**
     * @return {Array<string>}
     */
    getAutoloads() {
        return this.autoloads;
    }
    /**
     */
    setAutoloads(autoloads) {
        this.autoloads = autoloads;
    }
    /**
     * @return {Array<WebComponent>}
     */
    getAutoloadsWs() {
        return this.autoloadsWs;
    }
    /**
     * @param {Array<WebComponent>} autoloadsWs
     */
    setAutoloadsWs(autoloadsWs) {
        this.autoloadsWs = autoloadsWs;
    }
    /**
     * @return {WebComponent}
     */
    getEntryPoint() {
        return this.entryPoint;
    }
    /**
     * @param {WebComponent} entryPoint
     * @return {this}
     */
    setEntryPoint(entryPoint) {
        this.entryPoint = entryPoint;
        return this;
    }
}