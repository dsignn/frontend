import {EventManagerAware} from '@dsign/library/src/event/EventManagerAware.js';

/**
 * @class Auth
 */
export class Auth extends EventManagerAware {

    /**
     * @returns {string}
     */
    static IDENTITY() { return 'identity'; };

    /**
     * @returns {string}
     */
    static LOGIN() { return 'login'; };

    /**
     * @returns {string}
     */
    static LOGOUT() { return 'logout'; };

    /**
     * @returns {string}
     */
    static TOKEN() { return 'token'; };

    /**
     * @param {StorageInterface}
     * @param {object} options
     */
    constructor(storage, options) {

        super();
        options = options ? options : {};

        this.storage = storage;

        /**
         * @type {string}
         */
        this.scope = options.scope;

        /**
         * @type {string}
         */
        this.clientId = options.clientId;

        /**
         * @type {string}
         */
        this.clientSecret = options.clientSecret;

        /**
         * @type {string}
         */
        this.grantType = options.grantType;

        /**
         * @type {null}
         */
        this.token = null;
        if (localStorage.getItem('token')) {
            this._setToken(JSON.parse(localStorage.getItem('token')));
            this.eventManager.emit(Auth.LOGIN(), this.token);
            this.storage.adapter.addHeader('Authorization', this.token['access_token'], 'GET');
        }

        /**
         * @type {null}
         */
        this.identity = null;
    }

    /**
     *
     */
    init() {
        if (this.token) {
            this.loadIdentity();
        }
    }

    /**
     * @param {string} username
     * @param {string} password
     */
    login(username, password) {
        return new Promise( (resolve ,reject) => {
            this.storage.save({
                'username': username,
                'password': password,
                'scope': this.scope,
                'client_secret': this.clientSecret,
                'client_id': this.clientId,
                'grant_type':  this.grantType,
            }).then((response) => {
                this._setToken(response);
                this.eventManager.emit(Auth.LOGIN(), this.token);
                this.storage.adapter.addHeader('Authorization', this.token['access_token'], 'GET');
                localStorage.setItem(Auth.TOKEN(), JSON.stringify(this.token));
                this.loadIdentity();
                resolve(response)
            }).catch((error) => {
                reject(error);
            });
        });
    }
/*
 {
 client_id: "myapp",
 client_secret: "testdrwerewq",
 grant_type: "password",
 password: "suca",
 scope: "basic email",
 username: "antonino.visalli+1@gmail.com"
 }
 */
    /**
     *
     */
    logout() {

        this._setToken(null);
        this.eventManager.emit(Auth.LOGOUT());
        this.storage.adapter.removeHeader('Authorization', 'GET');
        localStorage.removeItem(Auth.TOKEN());
    }

    /**
     * @param token
     * @private
     */
    _setToken(token) {
        this.token = token;
    }

    /**
     * @param identity
     * @private
     */
    _setIdentity(identity) {
        this.identity = identity;
    }

    /**
     *
     */
    loadIdentity() {
        this.storage.get().then((data) => {
            this._setIdentity(data);
            this.eventManager.emit(Auth.IDENTITY(), this.identity);
        }).catch((error) => {
            console.error(error);
        });
    }
}