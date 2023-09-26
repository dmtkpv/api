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
        controller: null,
        promise: ref(Promise.resolve()),

        pending: computed(() => {
            return api.active.includes(endpoint);
        }),

        cancel () {
            endpoint.controller?.abort();
            return endpoint.promise.value;
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
        },

        fetchAsync (...args) {
            return endpoint.fetch(...args).then(() => {
                if (endpoint.error.value) throw endpoint.error.value;
                else return endpoint.data.value;
            })
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
        endpoint.data.value = data;
        endpoint.error.value = undefined;
    }

    function onError (error) {
        endpoint.data.value = undefined;
        endpoint.error.value = error;
    }

    function onComplete () {
        const index = api.active.indexOf(endpoint);
        if (index > -1) api.active.splice(index, 1);
        if (api.ssr) api.state.put(key, endpoint);
    }



    // ---------------------
    // Exports
    // ---------------------

    return endpoint;


}