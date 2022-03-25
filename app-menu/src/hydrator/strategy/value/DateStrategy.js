/**
 * 
 */
export class DateStrategy {

    // TO DO ADD EXTRACT METHORD
    static get TYPE_TIME() {
        return 'time';
    }

    
    constructor() {
        this.type = DateStrategy.TYPE_TIME;
    }
   
    /**
     * @param {string} property
     * @param data
     * @return {any}
     */
    hydrateValue(property, data) {   
        if (!data) {
            return;
        }
        
        return new Date(data);
    }
    /**
     *
     * @param data
     * @returns {any}
     */
    extractValue(data) {
        if (!data) {
            return;
        }

        let extract = data;
        switch (this.type) {
            case DateStrategy.TYPE_TIME:
                extract = data.getTime();
                break;
        }
        return extract;
    }
}