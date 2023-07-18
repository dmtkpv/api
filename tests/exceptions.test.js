import { createAPI } from '../lib/index.js'

test('Missing endpoints', async () => {
    expect(() => createAPI()).toThrow(/^"endpoints"/);
})

test('Missing endpoint key', async () => {
    const { endpoint } = createAPI({ endpoints: {} });
    expect(() => endpoint('test')).toThrow(/^Missing configuration/);
})




