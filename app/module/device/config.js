/**
 * Config
 */ 
export const config = {
    rest: {
        resources: {
            device: {
                name: "device"
            }
        }
    },
    'device': {
        'storage': {
            'name': 'DeviceStorage',
            'hydrator': 'DeviceEntityHydrator',
            'entity': 'DeviceEntity'
        }
    }
}