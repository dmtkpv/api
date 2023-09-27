import createAPI from './common/api.js'
import createServer from './common/server.js'

test('Hooks 1', async () => {



    // ------------------
    // Helpers
    // ------------------

    let time = 0;
    let count = 0;

    function wait (time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    function tick () {
        time = Date.now();
    }

    function ticked () {
        return Date.now() - time;
    }



    // ------------------
    // Endpoints
    // ------------------

    const endpoints = {

        test (params) {
            return {
                url: '/',
                params,
                onFetch (config) {
                    expect(++count).toBe(3);
                    expect(config.url).toBe('/test');
                    return { ...config, url: '/' }
                },
                onSuccess (data) {
                    expect(++count).toBe(9);
                    expect(data.suc1).toBe(true);
                    data.suc1 = false;
                },
                onError (error) {
                    expect(++count).toBe(12);
                    expect(error).toBe('string');
                },
                onComplete () {
                    expect(++count).toBe(16);
                    expect(ticked()).toBeLessThan(100);
                }
            }
        }

    }



    // ------------------
    // Globals
    // ------------------

    const server = createServer();
    const port = server.address().port;
    const api = createAPI({ endpoints, port });
    const test = api.endpoint('test');



    // ------------------
    // API hooks
    // ------------------

    api.onFetch(() => {
        expect(++count).toBe(1);
    })

    api.onFetch('test', config => {
        expect(++count).toBe(2);
        config.url = '/test'
    })

    api.onFetch('test1', () => {
        count++
    })

    api.onSuccess(() => {
        expect(++count).toBe(6);
    })

    api.onSuccess('test', data => {
        expect(++count).toBe(7);
        throw new Error('err1');
    })

    api.onSuccess('test1', () => {
        count++
    })

    api.onError(error => {
        expect(++count).toBe(8);
        expect(error.message).toBe('err1');
        return { suc1: true }
    })

    api.onError('test', error => {
        expect(++count).toBe(11);
        expect(error.message).toBe('err2');
        expect(ticked()).toBeGreaterThanOrEqual(100);
        throw 'string'
    })

    api.onError('test1', () => {
        count++
    })

    api.onComplete(endpoint => {
        expect(++count).toBe(14);
        expect(ticked()).toBeGreaterThanOrEqual(100);
        expect(endpoint.data.suc2).toBe(true);
    })

    api.onComplete('test', async () => {
        expect(++count).toBe(15);
        tick();
        await wait(100);
    })

    api.onComplete('test1', () => {
        count++
    })



    // ------------------
    // Endpoint hooks
    // ------------------

    test.onFetch(async config => {
        expect(++count).toBe(4);
        expect(config.url).toBe('/');
        tick();
        await wait(100);
    })

    test.onFetch(() => {
        expect(++count).toBe(5);
        expect(ticked()).toBeGreaterThanOrEqual(100);
    })

    test.onSuccess(async data => {
        expect(++count).toBe(10);
        expect(data.suc1).toBe(false);
        tick();
        await wait(100);
        throw new Error('err2');
    })

    test.onError(async error => {
        expect(++count).toBe(13);
        expect(error).toBe('string');
        tick();
        await wait(100);
        return { suc2: true };
    })

    test.onComplete(() => {
        expect(++count).toBe(17);
    })



    // ------------------
    // Test
    // ------------------

    await test.fetch();
    if (test.error) throw test.error;
    expect(count).toBe(17);
    expect(test.data.suc2).toBe(true);
    server.close();



})
