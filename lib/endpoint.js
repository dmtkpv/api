import { computed, ref } from 'vue'
import Listeners from './listeners'
import Trigger from './trigger'

export default function (api) {
    return key => {

        const request = {
            key,
            hooks: [],
            data: ref(null),
            error: ref(null),
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

            const config = api.endpoints[key](...args);
            const hooks = Object.keys(listeners).map(event => event in config && { event, cb: config[event] }).filter(hook => hook)
            const trigger = Trigger(key, [...hooks, ...api.hooks, ...request.hooks]);

            request.controller = new AbortController();
            config.signal = request.controller.signal;
            api.requests.push(request);

            trigger('onFetch', config)
                .then(config => {
                    return trigger(config);
                })
                .then(data => {
                    return trigger('success', data);
                })
                .catch(error => {
                    // trigger('onCancel');
                    return trigger('error', error);
                })
                .finally(data => {
                    return trigger('complete', data);
                })
        }

        return Object.assign(request, listeners, {
            pending,
            cancel,
            fetch
        })

    }
}