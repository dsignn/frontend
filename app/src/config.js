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
        moduleRelativePath: 'module'
    },
    modules:  [
        {
            "title": "Dashboard",
            "name": "dashboard",
            "icon": "dashboard:menu",
            "entryPoint": {
                name: "dashboard-index",
                path: {
                    directory: 'element/dashboard-index',
                    nameFile: 'dashboard-index',
                    extension: 'js'
                }
            },
            "configEntryPoint": "repository.js",
            "autoloads": [

            ],
            "autoloadsWs": [
                {
                    "name": "dashboard-icons",
                    "path":  {
                        directory: 'element/dashboard-icons',
                        nameFile: 'dashboard-icons',
                        extension: 'js'
                    }
                }
            ]
        },
        {
            "title": "Monitor",
            "name": "monitor",
            "icon": "monitor:menu",
            "entryPoint": {
                "name": "monitor-index",
                "path": {
                    directory: 'element/monitor-index',
                    nameFile: 'monitor-index',
                    extension: 'js'
                }
            },
            "configEntryPoint": "repository.js",
            "autoloads": [
                {
                    "name": "MonitorEntity",
                    "path": {
                        directory: 'src/entity',
                        nameFile: 'MonitorEntity',
                        extension: 'js'
                    }
                },
                {
                    "name": "MonitorContainerEntity",
                    "path": {
                        directory: 'src/entity',
                        nameFile: 'MonitorContainerEntity',
                        extension: 'js'
                    }
                }
            ],
            "autoloadsWs": [
                {
                    "name": "monitor-icons",
                    "path": {
                        directory: 'element/monitor-icons',
                        nameFile: 'monitor-icons',
                        extension: 'js'
                    }
                }
            ]
        },
        {
            "title": "Resource",
            "name": "resource",
            "icon": "resource:menu",
            "entryPoint": {
                "name": "resource-index",
                "path": {
                    directory: 'element/resource-index',
                    nameFile: 'resource-index',
                    extension: 'js'
                }
            },
            "configEntryPoint": "repository.js",
            "autoloads": [],
            "autoloadsWs": [
                {
                    "name": "resource-icons",
                    "path":  {
                        directory: 'element/resource-icons',
                        nameFile: 'resource-icons',
                        extension: 'js'
                    }
                }
            ]
        },
        {
            "title": "Timeslot",
            "name": "timeslot",
            "icon": "timeslot:menu",
            "entryPoint": {
                "name": "timeslot-index",
                "path":  {
                    directory: 'element/timeslot-index',
                    nameFile: 'timeslot-index',
                    extension: 'js'
                }
            },
            "configEntryPoint": "repository.js",
            "autoloads": [],
            "autoloadsWs": [
                {
                    "name": "timeslot-icons",
                    "path": {
                        directory: 'element/timeslot-icons',
                        nameFile: 'timeslot-icons',
                        extension: 'js'
                    }
                }
            ]
        },
        {
            "title": "User",
            "name": "user",
            "icon": "user:menu",
            "entryPoint": {
                "name": "user-index",
                "path": {
                    directory: 'element/user-index',
                    nameFile: 'user-index',
                    extension: 'js'
                }
            },
            "configEntryPoint": "repository.js",
            "autoloads": [],
            "autoloadsWs": [
                {
                    "name": "user-icons",
                    "path":  {
                        directory: 'element/user-icons',
                        nameFile: 'user-icons',
                        extension: 'js'
                    }
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

