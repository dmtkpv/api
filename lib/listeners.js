export default function (ctx, keyed) {



    // --------------------
    // Listen
    // --------------------

    function listen (event, key, fn) {

        if (keyed === false || fn === undefined) {
            fn = key;
            key = null;
        }

        if (typeof fn !== 'function') {
            throw new Error('Hook callback must be a function')
        }

        const hook = { event, key, fn };

        const off = () => {
            const index = ctx.hooks.indexOf(hook);
            if (index > -1) ctx.hooks.splice(index, 1);
        }

        ctx.hooks.push(hook);
        return Object.assign(off, ctx);

        // onUnmounted

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