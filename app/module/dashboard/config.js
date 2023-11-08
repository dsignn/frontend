/**
 * Config
 */
export const config = {
    rest: {
        resources: {
            dashboard: {
                name: "dashboard"
            }
        }
    },
    dashboard: {
        entityService: 'WidgetEntity',
        hydratorService:  'WidgetEntityHydrator',
        storage: {
            name: 'WidgetStorage',
            adapter: {
                namespace: 'dsing',
                collection: 'widget'
            }
        }
    }
}