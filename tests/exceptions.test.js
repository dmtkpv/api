import { createAPI } from '../lib/index.js'

test('Missing endpoints', () => {
    expect(() => createAPI()).toThrow();
})

test('Missing endpoint key', () => {
    const { endpoint } = createAPI({ endpoints: {} });
    expect(() => endpoint('test')).toThrow();
})

test('Wrong hook', () => {
    const { endpoint, onSuccess } = createAPI({ endpoints: { test: {} } });
    const { onError } = endpoint('test');
    expect(() => onSuccess()).toThrow();
    expect(() => onSuccess('test')).toThrow();
    expect(() => onError('test', () => {})).toThrow();
})