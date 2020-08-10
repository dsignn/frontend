/**
 * @class ListBuilder
 */
export class ListBuilder {

    /**
     *
     * @inheritDoc
     */
    buildUrl(rootPath, nameResource, method, id, data) {
        let url = `${rootPath}/${nameResource}`;
        url = id && id !== 'all'? `${url}/${id}` : url;
        return url;
    }
}