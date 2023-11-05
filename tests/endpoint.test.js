import createAPI from './common/api.js'
import createServer from './common/server.js'

test('Endpopint', async () => {

    const server = createServer();
    const port = server.address().port;
    const api = createAPI({ port });
    const test = api('test');

    expect(test.data).toBe(null);
    expect(test.error).toBe(null);
    expect(test.promise).resolves.toBe(undefined);
    expect(test.pending).toBe(false);

    test.quiet();
    expect(test.pending).toBe(true);

    await test.promise;
    expect(test.pending).toBe(false);
    expect(test.data.data.ok).toBe(true);
    expect(test.error).toBe(null);

    await test.quiet({ error: true });
    expect(test.pending).toBe(false);
    expect(test.data).toBe(null);
    expect(test.error instanceof Error).toBe(true);

    server.close();

})
