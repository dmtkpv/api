import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createAPI, useAPI } from '../lib/index.js'

test('Multiple api instances', async () => {

    const injections = {};
    const api1 = createAPI({ baseURL: '/api1' });
    const api2 = createAPI({ baseURL: '/api2' });

    const app = createSSRApp({
        template: '<div />',
        setup () {
            injections.api1 = useAPI();
            injections.api2 = useAPI('api2');
        }
    })

    app.use(api1);
    app.use(api2, 'api2');

    await renderToString(app);
    expect(injections.api1.axios.defaults.baseURL).toBe('/api1');
    expect(injections.api2.axios.defaults.baseURL).toBe('/api2');

})




