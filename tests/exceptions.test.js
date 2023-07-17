import { createAPI } from '../lib/index.js'

test('Missing endpoints', async () => {
    expect(() => createAPI()).toThrow(/^"endpoints"/);
})

test('Missing endpoint key', async () => {
    const { endpoint } = createAPI({ endpoints: {} });
    const { fetch } = endpoint('test')
    expect(() => fetch()).toThrow(/^Missing configuration/);
})




