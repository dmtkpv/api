function setHooks (keyed) {

    return {

        keyed,
        hooks: [],

        listen (type, key, cb) {

            if (this.keyed === false || cb === undefined) {
                cb = key;
                key = null;
            }

            if (typeof cb !== 'function') {
                throw new Error('Hook callback must be a function')
            }

            const hook = { type, key, cb };

            this.hooks.push(hook);

            const off = () => {
                const index = this.hooks.indexOf(hook);
                if (index > -1) this.hooks.splice(index, 1);
            }

            return Object.assign(off, this);
        },

        onFetch (...args) {
            return this.listen('fetch', ...args);
        },

        onSuccess (...args) {
            return this.listen('success', ...args);
        },

        onError (...args) {
            return this.listen('error', ...args);
        },

        onComplete (...args) {
            return this.listen('complete', ...args);
        },

        onCancel (...args) {
            return this.listen('cancel', ...args);
        }

    }

}


// -----------------------
// Hooks
// -----------------------

class Hooks {

    constructor (keyed) {
        this.keyed = keyed;
        this.hooks = [];
    }

    listen (type, key, cb) {

        if (this.keyed === false || cb === undefined) {
            cb = key;
            key = null;
        }

        if (typeof cb !== 'function') {
            throw new Error('Hook callback must be a function')
        }

        const hook = { type, key, cb };

        this.hooks.push(hook);

        const off = () => {
            const index = this.hooks.indexOf(hook);
            if (index > -1) this.hooks.splice(index, 1);
        }

        return Object.assign(off, this);
    }

    onFetch (...args) {
        return this.listen('fetch', ...args);
    }

    onSuccess (...args) {
        return this.listen('success', ...args);
    }

    onError (...args) {
        return this.listen('error', ...args);
    }

    onComplete (...args) {
        return this.listen('complete', ...args);
    }

    onCancel (...args) {
        return this.listen('cancel', ...args);
    }

}




// -----------------------
// API
// -----------------------

class API extends Hooks {

    constructor() {
        super(true);
    }

}



// -----------------------
// Endpoint
// -----------------------

class Endpoint extends Hooks {

    constructor() {
        super(false);
    }

}



// -----------------------
// Test
// -----------------------

const api = new API();




const endpoint = new Endpoint();

const hook = endpoint.onSuccess(() => {})

// hook();
console.dir(hook.onSuccess);