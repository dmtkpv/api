export default function (key, hooks) {

    function getFn (event) {
        const index = hooks.findIndex(hook => hook.event === event && (!hook.key || hook.key === key));
        if (index > -1) return hooks.splice(index, 1)[0].fn;
    }

    function call (fn, params) {
        return Promise.resolve().then(() => fn(params));
    }

    function onFetch (config) {
        const fn = getFn('onFetch');
        if (!fn) return Promise.resolve(config);
        return call(fn, config).then(changed => onFetch(changed === undefined ? config : changed)).catch(onError);
    }

    function onSuccess (data) {
        const fn = getFn('onSuccess');
        if (!fn) return Promise.resolve(data);
        return call(fn, data).then(changed => onSuccess(changed === undefined ? data : changed)).catch(onError);
    }

    function onError (error) {
        if (error.name === 'AbortError') return onCancel(error);
        const fn = getFn('onError');
        if (!fn) return Promise.reject(error);
        return call(fn, error).then(onSuccess).catch(changed => onError(changed === undefined ? error : changed));
    }

    function onCancel (error) {
        const fn = getFn('onCancel');
        if (!fn) return Promise.reject(error);
        return call(fn, error).then(onSuccess).catch(changed => onError(changed === undefined ? error : changed));
    }

    function onComplete (endpoint) {
        const fn = getFn('onComplete');
        if (!fn) return;
        call(fn, endpoint).catch(error => console.error(error)).finally(onComplete);
    }

    return {
        onFetch,
        onSuccess,
        onError,
        onCancel,
        onComplete
    }
}