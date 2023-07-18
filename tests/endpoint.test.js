import createAPI from './common/api.js'
import createServer from './common/server.js'

test('Endpopint', async () => {

    const server = createServer();
    const api = createAPI();
    const { fetch, data, error, pending, promise } = api.endpoint('test');

    expect(data.value).toBe(undefined);
    expect(error.value).toBe(undefined);
    expect(promise.value).resolves.toBe(undefined);
    expect(pending.value).toBe(false);

    fetch();
    expect(pending.value).toBe(true);

    await promise.value;
    expect(pending.value).toBe(false);
    expect(data.value.data.ok).toBe(true);
    expect(error.value).toBe(null);

    await fetch({ error: true });
    expect(pending.value).toBe(false);
    expect(data.value).toBe(null);
    expect(error.value instanceof Error).toBe(true);

    server.close();

})
