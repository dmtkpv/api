import { createAPI } from '../lib/index.js'

test('Missing endpoints', () => {
    expect(() => createAPI()).toThrow();
})

test('Missing endpoint key', () => {
    const api = createAPI({ endpoints: {} });
    expect(() => api('test')).toThrow();
})

test('Wrong hook', () => {
    const api = createAPI({ endpoints: { test: {} } });
    const test = api('test');
    expect(() => api.onSuccess()).toThrow();
    expect(() => api.onSuccess('test')).toThrow();
    expect(() => test.onError('test', () => {})).toThrow();
})