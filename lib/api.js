import { computed, shallowReactive } from 'vue'
import Axios from 'axios'
import Listeners from './listeners'
import Endpoint from './endpoint'

export default function ({ endpoints, ...options }) {

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