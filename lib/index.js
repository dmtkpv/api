import { inject } from 'vue'
import _createAPI from './api.js'

const injectionKey = Symbol();

export function createAPI (options) {
    return _createAPI({ ...options, injectionKey });
}

export function useAPI () {
    return inject(injectionKey);
}

export function useEndpoint (key) {
    return useAPI().endpoint(key);
}

export function fetch (key, ...args) {
    const endpoint = useEndpoint(key);
    endpoint.fetch(...args);
    return endpoint;
}