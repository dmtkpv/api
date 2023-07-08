import { inject } from 'vue'
import API from './api'

const injectionKey = Symbol();

export function createApi (options) {
    const api = API(options);
    const install = app => app.provide(injectionKey, api);
    return { ...api, install }
}

export function useApi () {
    return inject(injectionKey);
}