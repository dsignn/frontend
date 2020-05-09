/**
 *
 */
export class RestStorageAdapter {

    /**
     * @param url
     * @param path
     */
    constructor(url, path) {
        this.url = url;
        this.nameCollection = path;
    }

    /**
     * @param params
     */
    generateUrl(params) {
        return `${this.url}/${this.nameCollection}`;
    }

    /**
     * @returns string
     */
    getNameCollection() {
        return this.nameCollection;
    }

    /**
     * @param id
     * @param params
     */
    get(id, params) {

    }

    /**
     * @param data
     * @param params
     */
    save(data, params) {

    }
}