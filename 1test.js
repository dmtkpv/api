function setHooks (keyed) {



    // --------------------
    // Listen
    // --------------------

    function listen (type, key, cb) {

        if (keyed === false || cb === undefined) {
            cb = key;
            key = null;
        }

        if (typeof cb !== 'function') {
            throw new Error('Hook callback must be a function')
        }

        const hook = { type, key, cb };

        const off = () => {
            const index = this.hooks.indexOf(hook);
            if (index > -1) this.hooks.splice(index, 1);
        }

        this.hooks.push(hook);
        return Object.assign(off, this);

    }



    // --------------------
    // Exports
    // --------------------

    return {

        hooks: [],

        onFetch (...args) {
            return listen.call(this, 'fetch', ...args);
        },

        onSuccess (...args) {
            return listen.call(this, 'success', ...args);
        },

        onError (...args) {
            return listen.call(this, 'error', ...args);
        },

        onComplete (...args) {
            return listen.call(this, 'complete', ...args);
        },

        onCancel (...args) {
            return listen.call(this, 'cancel', ...args);
        }

    }

}








const endpoint = {

    ...setHooks(true)

};

const hook = endpoint.onSuccess('aa', () => {}).onSuccess(() => {}).onSuccess(() => {})

hook();
console.dir(endpoint);