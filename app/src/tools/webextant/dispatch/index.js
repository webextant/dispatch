/**
 * 
 * Webextant Dispatch API Wrapper
 * 
 * @file:index.js
 * @description: Provides basic methods to connect to the Webextant Dispatch API
 * @author: Jeremy Bursky <jzbgdev@gmail.com> 
 * @copyright: © 2019 Webextant   
 * 
 */

import axios from 'axios';

class WebextantDispatchAPIWrapper {

    constructor() {}

    _baseURL = 'https://private-a6ab3-dispatch9.apiary-mock.com/';
    
    _httpClient = function(type, resource, payload, callback){
        axios[type](`${this._baseURL}${resource}`, payload)
        .then(response => callback(null, response.data))
        .catch(error => callback(error));
    };

    SearchByTrailerNumber(payload, callback){
        this._httpClient('post', 'trailers', payload, callback)
        
    }
    
    CallTrailersToDock(payload, callback){
        this._httpClient('post', 'calltodock', payload, callback)
    }

    ListAllDocks(payload, callback){
        this._httpClient('get', 'docks', payload, callback)
    }
    
    CallTrailerOutOfDock(payload, callback){
        this._httpClient('post', 'calloutdock', payload, callback)
    }

}

export { WebextantDispatchAPIWrapper as default }