import createAPI from './common/api.js'
import createServer from './common/server.js'

test('Pending', async () => {



    // ------------------
    // Endpoints
    // ------------------

    const endpoints = {

        test1 () {
            return {
                url: '/',
                params: {
                    delay: 100
                }
            }
        },

        test2 () {
            return {
                url: '/',
                params: {
                    delay: 100,
                    error: true
                }
            }
        },

        test3 () {
            return {
                url: '/',
                params: {
                    delay: 1000
                }
            }
        }

    }



    // ------------------
    // Test
    // ------------------

    const server = createServer();
    const port = server.address().port;
    const api = createAPI({ endpoints, port });

    const test1 = api.endpoint('test1');
    const test2 = api.endpoint('test2');
    const test3 = api.endpoint('test3');

    expect(test1.pending).toBe(false);
    expect(test2.pending).toBe(false);
    expect(test3.pending).toBe(false);
    expect(api.pending.value).toBe(false);

    test1.quiet();
    test2.quiet();
    test3.quiet();

    expect(test1.pending).toBe(true);
    expect(test2.pending).toBe(true);
    expect(test3.pending).toBe(true);
    expect(api.pending.value).toBe(true);

    await Promise.all([
        test1.promise,
        test2.promise
    ])

    expect(test1.pending).toBe(false);
    expect(test2.pending).toBe(false);
    expect(test3.pending).toBe(true);
    expect(api.pending.value).toBe(true);

    await test3.promise;
    expect(test3.pending).toBe(false);
    expect(api.pending.value).toBe(false);

    test2.quiet();
    expect(test2.pending).toBe(true);
    expect(api.pending.value).toBe(true);

    await test2.promise;
    expect(test2.pending).toBe(false);
    expect(api.pending.value).toBe(false);

    server.close();



})
