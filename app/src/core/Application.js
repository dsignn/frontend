import { EventManagerAware } from "@dsign/library/src/event/EventManagerAware.js";
/**
 * @class
 * Application
 */
export class Application extends EventManagerAware {

    /**
     * @returns {string}
     */
    static BOOTSTRAP_MODULE() { return 'bootstrap-module'; };

    /**
     * @returns {string}
     */
    static LOAD_MODULE() { return 'laod-module'; };

    /**
     *
     */
    constructor() {
        super();

        /**
         * @type {Array}
         */
        this.modules = [];

        /**
         * @type {Array}
         */
        this.widgets = [];
    }

    /**
     * @param {Array<Module>} modules
     * @param {ContainerInterface} container
     */
    async loadModules(modules, container) {
        // Load module
        for (let cont = 0; modules.length > cont; cont++) {
            await this._loadModule(modules[cont], container);
        }
        // Load widget
        for (let cont = 0; this.widgets.length > cont; cont++) {
            await this.loadWidget(this.widgets[cont]);
        }

        this.getEventManager().emit(Application.BOOTSTRAP_MODULE, this.modules);
        return this.modules;
    }

    /**
     * @param {Module} module
     * @param {ContainerInterface} container
     * @return {Promise<Module>}
     * @private
     */
    async _loadModule(module, container) {

        this.modules.push(module);
        /**
         * to run absolute path on windows, for polymer cli script c:/ !== /c:/ when use import
         */
        let configModule;
        let configModuleClass;
        let wcEntryPoint;
        let wcComponentPath;
        console.groupCollapsed(`Load Module ${module.getName()}`);
        /**
         * Load entry point module
         */
        if (customElements && customElements.get(module.getEntryPoint().getName()) === undefined) {
            wcEntryPoint = `${this.getModulePath()}/${module.getName()}/${module.getEntryPoint().getPath()}`;
            console.log(wcEntryPoint);
            try {
                await import(wcEntryPoint);
                console.log(`Load entry point module "${module.getEntryPoint().getName()}" store in ${wcEntryPoint}`, module);
            }
            catch (err) {
                console.error(`Failed to load entry point module store in ${wcEntryPoint}`, err);
            }
        }

        if (module.getAutoloads().length > 0) {
            for (let cont = 0; module.getAutoloads().length > cont; cont++) {
              //  autoloadRequire = i(`${this.getModulePath()}${module.getName()}/${this.path.normalize(module.getAutoloads()[cont])}`);
              //  window[autoloadRequire.name] = autoloadRequire;
            }
        }

        if (module.getAutoloadsWs().length > 0) {
            for (let cont = 0; module.getAutoloadsWs().length > cont; cont++) {
                if (customElements.get(module.getAutoloadsWs()[cont].getName()) === undefined) {
                    wcComponentPath = `${this.getModulePath()}/${module.getName()}/${module.getAutoloadsWs()[cont].getPath()}`;
                    console.log(wcComponentPath);
                    try {
                        let wcComponent = await import(wcComponentPath);
                        console.log(`Load web component store in  "${module.getAutoloadsWs()[cont].getPath()}" store in ${module.getAutoloadsWs()[cont].getName()}`, wcComponent);
                    }
                    catch (err) {
                        console.error(`Failed to load autoloads store in ${module.getAutoloadsWs()[cont].getPath()}`, err);
                    }
                }
            }
        }

        if (module.getConfigEntryPoint()) {
            let configModulePath = `${this.getModulePath()}/${module.getName()}/${module.getConfigEntryPoint()}`;

            configModule = await import(configModulePath);
            configModuleClass = new configModule.Repository();
            configModuleClass.setContainer(container);
            configModuleClass.init();
        }
        console.groupEnd();
        return module;
    }

    /**
     *
     * @param {Widget} widget
     * @return {Promise<void>}
     */
    async loadWidget(widget) {
        console.groupCollapsed(`Load Widget ${widget.getName()}`);
        let path;
        if (widget.getWc() && customElements.get(widget.getWc()) === undefined) {
            path = `${this.basePath}module/${widget.getSrc().getPath()}`;
            try {
                await import(path);
                console.log(`Load entry point module "${widget.getWc()}" store in ${path}`, widget);
            }
            catch (err) {
                console.error(`Failed to load entry point module store in ${path}`, err);
            }
        }
        if (widget.getWcData() && customElements.get(widget.getWcData()) === undefined) {
            path = `${this.basePath}module/${widget.getSrcData().getPath()}`;
            try {
                await import(path);
                console.log(`Load entry point module "${widget.getWcData()}" store in ${path}`, widget);
            }
            catch (err) {
                console.error(`Failed to load entry point module store in ${path}`, err);
            }
        }
        console.groupEnd();
    }

    /**
     * @return {string}
     */
    getBasePath() {
        return this.basePath;
    }

    /**
     * @param {string} basePath
     * @return {Application}
     */
    setBasePath(basePath) {
        this.basePath = basePath;
        return this;
    }

    /**
     * @param {Widget} widget
     * @return {Application}
     */
    addWidget(widget) {
        this.widgets.push(widget);
        return this;
    }

    /**
     * @param {string} nameWs
     * @return {Application}
     */
    removeWidget(nameWs) {
        for (let cont = 0; this.widgets.length > cont; cont++) {
            if (this.widgets[cont].getWc() === nameWs) {
                this.widgets.splice(cont, 1);
                break;
            }
        }
        return this;
    }

    /**
     * @param {Array<Widget>} widgets
     * @return {this}
     */
    setWidgets(widgets) {
        this.widgets = widgets;
        return this;
    }

    /**
     * @return {Array<Widget>}
     */
    getWidgets() {
        return this.widgets;
    }

    /**
     * @return {string}
     */
    getResourcePath() {
        return this.resourcePath;
    }

    /**
     * @param {string} resourcePath
     * @return {Application}
     */
    setResourcePath(resourcePath) {
        this.resourcePath = resourcePath;
        return this;
    }

    /**
     * @return {string}
     */
    getModulePath() {
        return this.modulePath;
    }

    /**
     * @param {string} modulePath
     * @return {Application}
     */
    setModulePath(modulePath) {
        this.modulePath = modulePath;
        return this;
    }

    /**
     * @return {string}
     */
    getStoragePath() {
        return this.storagePath;
    }

    /**
     * @param {string} storagePath
     * @return {Application}
     */
    setStoragePath(storagePath) {
        this.storagePath = storagePath;
        return this;
    }

    /**
     * @param {Module} module
     * @return {Application}
     */
    addModule(module) {
        this.modules.push(module);
        return this;
    }

    /**
     * @return {Array<Module>}
     */
    getModules() {
        return this.modules;
    }

    /**
     * @param {string} id
     * @return Application
     */
    removeModule(id) {
        for (let cont = 0; this.modules.length > cont; cont) {
            if (this.modules[cont].getId() === id) {
                this.modules.splice(cont, 1);
                break;
            }
        }
        return this;
    }
}
