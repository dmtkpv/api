### Config
```js
return {
    method: 'GET',
    url: '/login',
    onCancel: () => {},
    onFetch: () => {},
    onError: () => {},
    onSuccess: () => {},
    onComplete: () => {},
}
```

### API
```js
api.pending;
api.cancel();
api.cancel('login');
api.onFetch('login', () => {});
api.onFetch(() => {});
api.onError(() => {});
api.onSuccess(() => {});
api.onCancel(() => {});
api.onComplete(() => {});
api.endpoint('login');
```

### Endpoint
```js
const { 
    data, 
    error,
    pending, 
    promise,
    fetch,
    cancel, 
    onFetch, 
    onError, 
    onSuccess, 
    onComplete,
    onCancel
} = api.endpoint('login');
```

### Off
```js
const off = onSuccess(() => {});
off();
```


### ???
```js
import { useApi } from '@dmtkpv/api'
const { endpoint } = useAPI();
const { data, error } = endpoint('login').fetch();
```

### SSR
```js
const page1 = endpoint('page1').fetch();
await page1.promise.value;

const page2 = endpoint('page2').fetch();
onServerPrefetch(() => page2.promise.value);
```
