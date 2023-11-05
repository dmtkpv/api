import createListeners, { events } from './listeners.js'

export default function createTrigger (api, endpoint) {



    // ---------------------
    // Local listeners
    // ---------------------





    // ---------------------
    // Helpers
    // ---------------------

    const executed = [];
    const local = createListeners();

    events.forEach(event => {
        endpoint.config[event] && local[event](endpoint.config[event])
    });

    async function call (fn, ...args) {
        return fn(...args, endpoint);
    }



    // ---------------------
    // Get hook function
    // ---------------------

    function getFn (event) {

        const hooks = [
            ...api.hooks,
            ...local.hooks,
            ...endpoint.hooks
        ];

        const hook = hooks.find(hook => {
            return hook.event === event && (!hook.key || hook.key === endpoint.key) && !executed.includes(hook);
        })

        if (hook) {
            executed.push(hook);
            return hook.fn;
        }

    }



    // ---------------------
    // Methods
    // ---------------------

    function onFetch () {
        const fn = getFn('onFetch');
        if (!fn) return;
        return call(fn).then(onFetch);
    }

    function onSuccess (data) {
        const fn = getFn('onSuccess');
        if (!fn) return data;
        return call(fn, data).then(result => onSuccess(result === undefined ? data : result)).catch(onError)
    }

    function onError (error) {
        if (error.name === 'CanceledError') return onCancel(error);
        const fn = getFn('onError');
        if (!fn) throw error;
        return call(fn, error).then(result => result === undefined ? onError(error) : onSuccess(result)).catch(onError);
    }

    function onCancel (error) {
        const fn = getFn('onCancel');
        if (!fn) throw error;
        return call(fn, error).then(result => result === undefined ? onCancel(error) : onSuccess(result)).catch(onError);
    }

    function onComplete () {
        const fn = getFn('onComplete');
        if (!fn) return endpoint;
        call(fn, endpoint).catch(error => console.error(error));
        onComplete();
    }



    // ---------------------
    // Exports
    // ---------------------

    return {
        setup,
        onFetch,
        onSuccess,
        onError,
        onCancel,
        onComplete
    }



}