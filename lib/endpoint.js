import { computed, reactive } from 'vue'
import createListeners from './listeners.js'
import createTrigger from './trigger.js'

export default function createEndpoint (key, api) {



    // -----------------------
    // Get config constructor
    // -----------------------

    const constructor = key.split('.').reduce((value, key) => {
        return value?.[key] ?? null
    }, api.endpoints)

    if (!constructor) {
        throw new Error(`Missing configuration for "${key}" endpoint`);
    }



    // ---------------------
    // Instance
    // ---------------------

    const endpoint = reactive({

        ...createListeners(),

        key,
        data: null,
        error: null,
        config: null,
        controller: null,
        promise: Promise.resolve(),

        pending: computed(() => {
            return api.active.includes(endpoint);
        }),

        cancel () {
            endpoint.controller?.abort();
            return endpoint.promise;
        },

        async quiet (...args) {

            endpoint.controller = new AbortController();
            endpoint.config = constructor(...args);
            endpoint.config.signal = endpoint.controller.signal;
            api.active.push(endpoint);

            const trigger = createTrigger(api, endpoint);
            return endpoint.promise = Promise.resolve()
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
            return endpoint.quiet(...args).then(() => {
                if (endpoint.error) throw endpoint.error;
                else return endpoint.data;
            })
        }

    })



    // ---------------------
    // Hooks
    // ---------------------

    function onRequest () {
        return api.axios(endpoint.config);
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
    }



    // ---------------------
    // Exports
    // ---------------------

    return endpoint;


}