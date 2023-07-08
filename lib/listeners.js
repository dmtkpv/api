export default function (ctx, keyed) {



    // --------------------
    // Listen
    // --------------------

    function listen (event, key, cb) {

        if (keyed === false || cb === undefined) {
            cb = key;
            key = null;
        }

        if (typeof cb !== 'function') {
            throw new Error('Hook callback must be a function')
        }

        const hook = { event, key, cb };

        const off = () => {
            const index = ctx.hooks.indexOf(hook);
            if (index > -1) ctx.hooks.splice(index, 1);
        }

        ctx.hooks.push(hook);
        return Object.assign(off, ctx);

    }



    // --------------------
    // Exports
    // --------------------

    return {

        onFetch (...args) {
            return listen('onFetch', ...args);
        },

        onSuccess (...args) {
            return listen('onSuccess', ...args);
        },

        onError (...args) {
            return listen('onError', ...args);
        },

        onComplete (...args) {
            return listen('onComplete', ...args);
        },

        onCancel (...args) {
            return listen('onCancel', ...args);
        }

    }



}