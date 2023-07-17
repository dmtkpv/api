import { computed, shallowReactive } from 'vue'
import Axios from 'axios'
import Listeners from './listeners.js'
import Endpoint from './endpoint.js'

export default function ({ endpoints, ...options } = {}) {

    if (!endpoints || typeof endpoints !== 'object') {
        throw new Error('"endpoints" option is required')
    }

    const api = {
        hooks: [],
        requests: shallowReactive([]),
        axios: Axios.create(options),
        endpoints,
    }

    const endpoint = Endpoint(api);
    const listeners = Listeners(api, true);
    const pending = computed(() => api.requests.length > 0);

    function cancel (key) {
        api.requests.forEach(request => (!key || request.key === key) && request.cancel());
        return api;
    }

    return Object.assign(api, listeners, {
        endpoint,
        pending,
        cancel
    });

}