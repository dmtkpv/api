# @dmtkpv/api
Composition-based HTTP client for Vue
```
npm install @dmtkpv/api
```

## Endpoints

A (deep) object of methods. Method must return a [request config](https://axios-http.com/docs/req_config).
Hooks serve as an additional option:
- onCancel
- onFetch
- onError
- onSuccess
- onComplete

`uncanceled: true` prevents request from aborting when `api.cancel()` called.

Example:

```js
const enpoints = {
    
    auth: {

        login (email, password) {
            return {
                uncanceled: true,
                method: 'POST',
                data: { email, password },
                onSuccess (data) {
                    console.log('login', data)
                }
            }
        }
        
    }    

}
```


## createAPI
Accepts the same options as [`axios.create()`](https://axios-http.com/docs/instance) and `endpoints`

```js
import { createApp } from 'vue'
import { createAPI } from '@dmtkpv/api'
import endpoints from './config/enpoints.js'
import App from './main.vue'

const app = createApp(App);

const api = createAPI({
    baseURL: 'http://example.com',
    endpoints
})

app.use(api);
app.mount('body');
```

## API properties
### `api.pending`
Computed property indicating whether there are pending requests

## API methods
### `api.cancel([key])`

`api.cancel()` - cancels all pending requests  
`api.cancel('login')` - cancels pending requests with key `login`

## Hooks

Hooks can be used on `api` instance:

```js
api.onFetch(() => {})
api.onFetch('login', () => {})
```

On `endpoint` instance:
```js
api('login').onFetch(() => {})
```

Inside `endpoint` configuration:
```js
{
    method: 'GET',
    url: '/',
    onFetch () {}
}
```

Hook callback can return a promise
```js
api.onFetch('login', async () => {
    console.log(endpoint.key) // login
})
```

Hook returns `off` function
```js
const off = onSuccess(() => {});
off();
```



### `api.onFetch([key], function (endpoint) {})`
Executes before the request is sent. 

Examples:
```js
api.onFetch(endpoint => {
    endpoint.config.params ??= {}
    endpoint.config.params.language = 'en'
})

api.onFetch('private', async ({ config }) => {
    const token = await api('token').fetch()
    config.headers ??= {}
    config.headers['Authorization'] = `Bearer ${token}`
})
```

### `api.onError([key], function (error, endpoint) {})`

Example:
```js
api.onError(error => {
    return { ok: true }
})

api.onError(error => {
    throw new Error('')
})

api.onError(error => {
    console.log('error')
})
```

### `api.onSuccess([key], function (data, endpoint) {})`
### `api.onComplete([key], function (endpoint) {})`

### Endpoint
```js
const { 
    data, 
    error,
    pending, 
    promise,
    quiet,
    fetch,
    cancel, 
    onFetch, 
    onError, 
    onSuccess, 
    onComplete,
    onCancel
} = api.endpoint('login');
```
