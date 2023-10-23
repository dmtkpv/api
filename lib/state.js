import { ref } from 'vue'

export default function createState (state) {



    // ---------------------
    // Storage
    // ---------------------

    const KEY = '__API__'
    state[KEY] ??= {}



    // ---------------------
    // Helpers
    // ---------------------

    function valueToError (value) {
        if (!value?.message) return value;
        return Object.keys(value).reduce((error, key) => {
            error[key] = value[key];
            return error;
        }, new Error())
    }

    function errorToValue (error) {
        if (!(error instanceof Error)) return error;
        return Object.getOwnPropertyNames(error).reduce((value, key) => {
            value[key] = error[key];
            return value;
        }, {})
    }



    // ---------------------
    // Exports
    // ---------------------

    return {

        get (key) {
            const data = state[KEY][key]?.data;
            const error = valueToError(state[KEY][key]?.error);
            return { data, error }
        },

        put (key, { data, error }) {
            state[KEY][key] ??= {};
            state[KEY][key].data = data;
            state[KEY][key].error = errorToValue(error);
        },

        has (key) {
            return !!state[KEY][key];
        },

        del (key) {
            delete state[KEY][key];
        }

    }



}