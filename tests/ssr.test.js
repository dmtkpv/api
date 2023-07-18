import createAPI from './common/api.js'
import createServer from './common/server.js'

test('SSR', async () => {
    
    const state = {};
    const server = createServer();
    const port = server.address().port;
    const api1 = createAPI({ port, state, ssr: true });
    const test1 = api1.endpoint('test');

    await test1.fetch();
    expect(state.test.data.data.ok).toBe(true);

    const data = state.test.data;
    const api2 = createAPI({ port, state });
    const test2 = api2.endpoint('test');

    expect(test2.data.value === data).toBe(true);

    test2.fetch();
    expect(test2.pending.value).toBe(false);
    await test2.promise.value;
    expect(test2.data.value === data).toBe(true);

    test2.fetch();
    expect(test2.pending.value).toBe(true);
    await test2.promise.value;
    expect(test2.data.value === data).toBe(false);

    server.close();

})
