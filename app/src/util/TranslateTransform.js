/**
 * @class TranslateTransform
 */
export class TranslateTransform {

    /**
     * @param data
     */
    static entityFormatToElementFormat(data) {
        let translate = {};
        for (const property in data) {

            for (const lang in data[property]) {
                if (!translate[lang]) {
                    translate[lang] = {};
                }
                translate[lang][property] = data[property][lang];
            }
        }
        return translate;
    }

    /**
     * @param properties
     * @param obj
     */
    static extractProperties(properties, obj) {

        let data = {};
        let find;
        for (const property in obj) {
            find = properties.find((element) => {
                return element === property;
            });

            if (find !== undefined) {
                data[property] = obj[property];
            }
        }
        return data;
    }
}