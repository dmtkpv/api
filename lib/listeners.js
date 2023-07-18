import { getCurrentInstance, onUnmounted } from 'vue'

export const events = [
    'onFetch',
    'onSuccess',
    'onError',
    'onComplete',
    'onCancel',
]

export default function createListeners (keyed) {



    // ---------------------
    // Instance
    // ---------------------

    const listeners = {
        hooks: []
    }

    events.forEach(event => {
        listeners[event] = listen.bind(null, event);
    })



    // ---------------------
    // Listen
    // ---------------------

    function listen (event, key, fn) {

        if (keyed === false || fn === undefined) {
            fn = key;
            key = null;
        }

        if (typeof fn !== 'function') {
            throw new Error('Hook callback must be a function')
        }

        const hook = { event, key, fn };
        listeners.hooks.push(hook);

        function off () {
            const index = listeners.hooks.indexOf(hook);
            if (index > -1) listeners.hooks.splice(index, 1);
        }

        if (getCurrentInstance()) {
            onUnmounted(off);
        }

        return off;

    }



    // --------------------
    // Exports
    // --------------------

    return listeners



}