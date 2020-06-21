/**
 * Config
 */
export const config = {
    localize: {
        defaultLanguage: "it",
        languages: [
            "it",
            "en"
        ]
    },
    app: {
        basePath: 'http://127.0.0.1:8081/',
        moduleRelativePath: 'src/module'
    },
    modules:  [
        {
            "title": "Dashboard",
            "name": "dashboard",
            "icon": "dashboard:menu",
            "entryPoint": {
                "name": "dashboard-index",
                "path": "element/dashboard-index/dashboard-index.js"
            },
            "configEntryPoint": "repository.js",
            "autoloads": [

            ],
            "autoloadsWs": [
                {
                    "name": "dashboard-icons",
                    "path": "element/dashboard-icons/dashboard-icons.js"
                }
            ]
        },
        {
            "title": "Monitor",
            "name": "monitor",
            "icon": "monitor:menu",
            "entryPoint": {
                "name": "monitor-index",
                "path": "element/monitor-index/monitor-index.js"
            },
            "configEntryPoint": "repository.js",
            "autoloads": [
                {
                    "name": "MonitorEntity",
                    "path": "src/entity/MonitorEntity.js"
                },
                {
                    "name": "MonitorContainerEntity",
                    "path": "src/entity/MonitorContainerEntity.js"
                }
            ],
            "autoloadsWs": [
                {
                    "name": "monitor-icons",
                    "path": "element/monitor-icons/monitor-icons.js"
                }
            ]
        },
        {
            "title": "Resource",
            "name": "resource",
            "icon": "resource:menu",
            "entryPoint": {
                "name": "resource-index",
                "path": "element/resource-index/resource-index.js"
            },
            "configEntryPoint": "repository.js",
            "autoloads": [],
            "autoloadsWs": [
                {
                    "name": "resource-icons",
                    "path": "element/resource-icons/resource-icons.js"
                }
            ]
        },
        {
            "title": "Timeslot",
            "name": "timeslot",
            "icon": "timeslot:menu",
            "entryPoint": {
                "name": "timeslot-index",
                "path": "element/timeslot-index/timeslot-index.js"
            },
            "configEntryPoint": "repository.js",
            "autoloads": [],
            "autoloadsWs": [
                {
                    "name": "timeslot-icons",
                    "path": "element/timeslot-icons/timeslot-icons.js"
                }
            ]
        },
        {
            "title": "User",
            "name": "user",
            "icon": "user:menu",
            "entryPoint": {
                "name": "user-index",
                "path": "element/user-index/user-index.js"
            },
            "configEntryPoint": "repository.js",
            "autoloads": [],
            "autoloadsWs": [
                {
                    "name": "user-icons",
                    "path": "element/user-icons/user-icons.js"
                }
            ]
        }
    ],
    "rest": {
        "path" : "http://127.0.0.150",
        resources: {
            auth: {
                name: "access-token",
                options: {
                    scope: 'basic email',
                    clientId: 'myapp',
                    clientSecret: 'testdrwerewq',
                    grantType: 'password'
                }
            }
        }
    }
};

