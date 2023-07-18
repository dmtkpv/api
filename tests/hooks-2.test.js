import createAPI from './common/api.js'
import createServer from './common/server.js'

test('Hooks', async () => {

    const server = createServer();
    const port = server.address().port;
    const api = createAPI({ port });
    const test = api.endpoint('test');

    api.onFetch(() => {
        throw new Error('err');
    })

    test.onError(error => {
        expect(error.message).toBe('err');
        return { success: true }
    })

    await test.fetch();
    expect(test.data.value.success).toBe(true);
    server.close();

})
