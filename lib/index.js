import { inject } from 'vue'
import API from './api.js'

const injectionKey = Symbol();

function createInstall (api) {
    return (app, key) => app.provide(key ?? injectionKey, api);
}

export function createAPI (options) {
    const api = API(options);
    const install = createInstall(api);
    return { ...api, install }
}

export function useAPI (key) {
    return inject(key ?? injectionKey);
}