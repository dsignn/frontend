
/**
 * @class XmlhLocalStorageAdapter
 */
export class XmlhLocalStorageAdapter { 
 
    constructor(xmlhAdapter, localStorageAdapter) {
        this.xmlhAdapter = xmlhAdapter;
        this.localStorageAdapter = localStorageAdapter;
    }

    /**
     * @return {string}
     */
    getNameCollection() {}

    /**
     * @param {string} id
     * @return {Promise<any>}
     */
    get(id) {
        return this.localStorageAdapter.get(id);
    }

    /**
     * @param {object} data
     * @return {Promise<any>}
     */
    save(data) {
        return new Promise((resolve, reject) => {

            this.xmlhAdapter.save(data).then((respXml) => {
                console.log('salva respXml', respXml);

                this.localStorageAdapter.save(respXml).then((respLocalStorage) => {
                    console.log('salva respLocalStorage', respLocalStorage);
                    resolve(respLocalStorage);
                }).catch((error) => {
                    console.error('errore respLocalStorage', error);
                    reject(error);
                });

            }).catch((error) => {
                console.error('errore respXml', error);
                reject(error);
            });
        });
    }

    /**
     * @param {object} data
     * @return {Promise<any>}
     */
    update(data) {
        return this.localStorageAdapter.update(data);
    }
    /**
     * @param {object} data
     * @return {Promise<any>}
     */
    remove(data) {
        return this.localStorageAdapter.remove(data);
    }

    /**
     * @param {object} filter
     * @return {Promise<any>}
     */
    getAll(filter) {
        return this.localStorageAdapter.getAll(filter);
    }

    /**
     * @param {number} page
     * @param {number} itemCount
     * @param {object} filter
     * @return {Promise<Pagination>}
     */
    getPaged(page, itemCount, filter) {
        return this.localStorageAdapter.getPaged(page, itemCount, filter);
    }
}