import { computed, shallowReactive } from 'vue'
import Axios from 'axios'
import createState from './state.js'
import createEndpoint from './endpoint.js'
import createListeners from './listeners.js'

export default function createAPI ({ endpoints, state = {}, injectionKey, ...options }) {



    // ---------------------
    // Validation
    // ---------------------

    if (!endpoints || typeof endpoints !== 'object') {
        throw new Error('"endpoints" option is required')
    }



    // ---------------------
    // Instance
    // ---------------------

    const api = {

        ...createListeners(true),

        endpoints,
        axios: Axios.create(options),
        state: createState(state),
        active: shallowReactive([]),

        pending: computed(() => {
            return api.active.length > 0;
        }),

        endpoint (key) {
            return createEndpoint(key, api);
        },

        cancel (key) {
            return Promise.all(api.requests.map(request => (!key || request.key === key) && request.cancel()))
        },

        install (app) {
            app.provide(injectionKey, api);
        }

    }



    // ---------------------
    // Exports
    // ---------------------

    return api;



}