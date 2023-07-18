import { ref } from 'vue'

export default function createState (state) {



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
            const data = ref(state[key]?.data);
            const error = ref(valueToError(state[key]?.error));
            return { data, error }
        },

        put (key, { data, error }) {
            state[key].data = data.value;
            state[key].error = errorToValue(error.value);
        },

        has (key) {
            return !!state[key];
        },

        del (key) {
            delete state[key];
        }

    }



}