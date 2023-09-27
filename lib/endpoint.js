import { computed, reactive, markRaw } from 'vue'
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

    const endpoint = reactive({

        ...createListeners(),
        ...api.state.get(key),

        key,
        response: null,
        controller: null,
        promise: Promise.resolve(),

        pending: computed(() => {
            return api.active.includes(endpoint);
        }),

        cancel () {
            endpoint.controller?.abort();
            return endpoint.promise;
        },

        async quite (...args) {
            if (api.state.has(key)) return api.state.del(key);
            const config = api.endpoints[key](...args);
            const trigger = createTrigger(api, endpoint, config);
            return endpoint.promise = onFetch(config)
                .then(trigger.onFetch)
                .then(onRequest)
                .then(trigger.onSuccess)
                .catch(trigger.onError)
                .then(onSuccess)
                .catch(onError)
                .then(onComplete)
                .then(trigger.onComplete)
        },

        fetch (...args) {
            return endpoint.quite(...args).then(() => {
                if (endpoint.error) throw endpoint.error;
                else return endpoint.data;
            })
        }

    })



    // ---------------------
    // Hooks
    // ---------------------

    async function onFetch (config) {
        endpoint.controller = new AbortController();
        config.signal = endpoint.controller.signal;
        api.active.push(endpoint);
        return config;
    }

    function onRequest (config) {
        const request = api.axios(config);
        const set = response => endpoint.response = markRaw(response);
        request.then(set).catch(set);
        return request;
    }

    function onSuccess (data) {
        endpoint.data = data;
        endpoint.error = undefined;
    }

    function onError (error) {
        endpoint.data = undefined;
        endpoint.error = error;
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