import { computed, ref } from 'vue'
import createListeners from './listeners.js'
import createTrigger from './trigger.js'

export default function createEndpoint (key, api) {



    // ---------------------
    // Validation
    // ---------------------

    if (!api.endpoints[key]) {
        throw new Error(`Missing configuration for "${key}" endpoint`);
    }



    // ---------------------
    // Instance
    // ---------------------

    const endpoint = {

        ...createListeners(),
        ...api.state.get(key),

        key,
        promise: ref(null),
        controller: null,

        pending: computed(() => {
            return api.active.includes(endpoint);
        }),

        cancel () {
            endpoint.controller?.abort();
        },

        async fetch (...args) {
            if (api.state.has(key)) return api.state.del(key);
            const config = api.endpoints[key](...args);
            const trigger = createTrigger(api, endpoint, config);
            return endpoint.promise.value = onFetch(config)
                .then(trigger.onFetch)
                .then(api.axios)
                .then(trigger.onSuccess)
                .catch(trigger.onError)
                .then(onSuccess)
                .catch(onError)
                .then(onComplete)
                .then(trigger.onComplete)
        }

    }



    // ---------------------
    // Hooks
    // ---------------------

    async function onFetch (config) {
        endpoint.controller = new AbortController();
        config.signal = endpoint.controller.signal;
        api.active.push(endpoint);
        return config;
    }

    function onSuccess (data) {
        endpoint.data = data;
        endpoint.error = null;
    }

    function onError (error) {
        endpoint.data = null;
        endpoint.error = error;
    }

    function onComplete () {
        const index = api.active.indexOf(endpoint);
        if (index > -1) api.active.splice(index, 1);
        if (import.meta.env.SSR) api.state.put(key, endpoint);
    }



    // ---------------------
    // Exports
    // ---------------------

    return endpoint;


}