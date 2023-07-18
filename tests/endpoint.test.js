import express from 'express'
import { createAPI } from '../lib/index.js'

test('Endpopint', async () => {



    // ------------------
    // Endpoints
    // ------------------

    const endpoints = {
        test: params => ({ url: '/test', params })
    }



    // ------------------
    // Globals
    // ------------------

    const port = 49099;
    const app = express();
    const server = app.listen(port);
    const api = createAPI({ baseURL: `http://localhost:${port}`, endpoints })



    // ------------------
    // Route
    // ------------------

    app.get('/test', (req, res) => {
        if (req.query.error) res.status(500).send();
        else res.send({ ok: true })
    })



    // ------------------
    // Test
    // ------------------



    const { fetch, data, error, promise } = api.endpoint('test');

    const res = await fetch();
    console.log(res)
    // await promise.value;
    //
    // console.log(data.value);
    // console.log(error.value);

    // console.log()


    //
    // expect(data.value).toBe(null);
    // expect(error.value).toBe(null);
    // expect(promise.value).toBe(null);
    // expect(pending.value).toBe(false);
    //
    // fetch();
    // expect(pending.value).toBe(true);
    //
    // await promise.value;
    // expect(pending.value).toBe(false);
    // expect(data.value.data.ok).toBe(true);
    // expect(error.value).toBe(null);
    //
    // fetch({ error: true });
    // expect(pending.value).toBe(true);
    //
    // await promise.value;
    // expect(pending.value).toBe(false);
    // expect(data.value).toBe(null);
    // expect(error.value instanceof Error).toBe(true);

    server.close();

})
