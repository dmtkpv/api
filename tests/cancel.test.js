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
                },
                onCancel (error) {
                    count++
                    expect(error.checked).toBe(true);
                    throw new Error('cancelled_in_config');
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
        },

        test4 () {
            return {
                url: '/',
                uncanceled: true,
                params: {
                    delay: 1000
                }
            }
        }

    }



    // ------------------
    // Test
    // ------------------

    let count = 0;
    const server = createServer();
    const port = server.address().port;
    const api = createAPI({ endpoints, port });
    const test1 = api('test1');
    const test2 = api('test2');
    const test3 = api('test3');
    const test4 = api('test4');
    let time = Date.now();

    api.onCancel(error => {
        count++
        expect(error.name).toBe('CanceledError');
        error.checked = true;
    })

    test1.onError(error => {
        count++
        expect(error.message).toBe('cancelled_in_config');
    })

    test1.onCancel(() => {
        count++
    })

    test1.quiet();
    await test1.cancel();

    expect(Date.now() - time).toBeLessThan(100);
    expect(test1.pending).toBe(false);
    expect(count).toBe(3);
    expect(test1.error.message).toBe('cancelled_in_config');

    test1.quiet();
    test2.quiet();
    test3.quiet();

    time = Date.now();
    await api.cancel();

    expect(Date.now() - time).toBeLessThan(100);
    expect(api.pending.value).toBe(false);

    test3.quiet();
    await new Promise(resolve => setTimeout(resolve, 100));

    time = Date.now();
    await api.cancel('test3');

    expect(Date.now() - time).toBeLessThan(100);
    expect(test3.pending).toBe(false);
    expect(test3.error.name).toBe('CanceledError');
    expect(count).toBe(9);

    test4.quiet();
    await api.cancel();
    expect(api.pending.value).toBe(true);

    await test4.cancel();
    expect(api.pending.value).toBe(false);

    server.close();

})
