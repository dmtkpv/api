import { inject } from 'vue'
import _createAPI from './api.js'

const injectionKey = Symbol();

export function createAPI (options) {
    return _createAPI({ ...options, injectionKey });
}

export function useAPI () {
    return inject(injectionKey);
}

export function useEndpoint () {

}

export function fetch () {

}