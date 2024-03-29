
/**
 * @class XmlhLocalStorageAdapter
 */

 import { OrderEntity } from '../../../src/module/order/entity/OrderEntity';

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
        return new Promise((resolve, reject) => {
        
            this.xmlhAdapter.get(id).then((respXml) => {
                resolve(respXml);
             }).catch((error) => {
                console.error('errore respXml', error);
                reject(error);
            });;
        });
    }

    /**
     * @param {object} data
     * @return {Promise<any>}
     */
    save(data) {
        if (OrderEntity.STATUS_LOCAL === data.status) {
            return this.localStorageAdapter.save(data);
        } else {
            return new Promise((resolve, reject) => {
                this.xmlhAdapter.save(data).then((respXmlh) => {
                    console.log('salvato remote', respXmlh);
                    this.localStorageAdapter.remove(data).then((respLocalStorageDelete) => {
                        console.log('eliminato local', respLocalStorageDelete);

                        this.localStorageAdapter.save(respXmlh).then((respLocalStoragePost) => {

                            console.log('save local', respLocalStoragePost);
                            resolve(respLocalStoragePost);
                        }).catch((error) => {
                            console.error('Error post local', error);
                            reject(error);
                        });;
                       
                    }).catch((error) => {
                        console.error('Error delete local', error);
                        reject(error);
                    });
    
                }).catch((error) => {
                    console.error('errore respXml', error);
                    reject(error);
                });
            });
        }
    }

    /**
     * @param {object} data
     * @return {Promise<any>}
     */
    update(data) {
        return new Promise((resolve, reject) => {

            this.xmlhAdapter.update(data).then((respXml) => {
                console.log('salva respXml', respXml);

                this.localStorageAdapter.update(respXml).then((respLocalStorage) => {
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
    updateLocal(data) {
        return this.localStorageAdapter.update(data);
    }

    /**
     * @param {*} restaurantId 
     * @returns 
     */
    getCurrentOrder(restaurantId, menuId) {

        return new Promise((resolve, reject) => {
            let search = {
                'restaurantId': restaurantId,
                'menuId': menuId,
                'currenteSelected': true
            };

            this.localStorageAdapter.getAll(search)
                .then((respLocalStorage) => {
                    console.log('res', respLocalStorage);
                      let result = null;
                 
                        if(respLocalStorage.length > 0) {
                            result = respLocalStorage[0];
                        }

                        resolve(result);
                 });
        });
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