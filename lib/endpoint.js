import { computed, ref } from 'vue'
import Listeners from './listeners.js'
import Trigger from './trigger.js'

export default function (api) {
    return key => {

        const request = {
            key,
            hooks: [],
            data: ref(null),
            error: ref(null),
            promise: ref(null),
            controller: null
        }

        const listeners = Listeners(request);

        const pending = computed(() => {
            return api.requests.includes(request);
        })

        function cancel () {
            request.controller?.abort();
            return request;
        }

        function fetch (...args) {

            const fn = api.endpoints[key];
            if (!fn) throw new Error(`Missing configuration for "${key}" endpoint`)

            const config = fn(...args);
            const hooks = Object.keys(listeners).map(event => event in config && { event, cb: config[event] }).filter(hook => hook)
            const trigger = Trigger(key, [...hooks, ...api.hooks, ...request.hooks]); // !!!!

            request.controller = new AbortController();
            config.signal = request.controller.signal;
            api.requests.push(request);

            request.promise.value = trigger.onFetch(config)
                .then(config => {
                    return api.axios(config);
                })
                .then(data => {
                    return trigger.onSuccess(data);
                })
                .catch(error => {
                    return trigger.onError(error);
                })
                .then(data => {
                    request.data.value = data;
                    request.error.value = null;
                })
                .catch(error => {
                    request.data.value = null;
                    request.error.value = error;
                })
                .finally(() => {
                    const index = api.requests.indexOf(request);
                    if (index > -1) api.requests.splice(index, 1);
                    trigger.onComplete(request);
                })

            return request;
        }

        return Object.assign(request, listeners, {
            pending,
            cancel,
            fetch
        })

    }
}