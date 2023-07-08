import { createApi } from '@dmtkpv/api'
import createApp from '@dmtkpv/ssr/createApp'
import createRouter from '@dmtkpv/ssr/createRouter'
import App from './index.vue'



// --------------------
// Endpoints
// --------------------

const endpoints = {

    countries () {
        return {
            method: 'GET',
            url: '/countries',
            onFetch () {

            }
        }
    }

}



// --------------------
// Launch
// --------------------

export default createApp(App, app => {
    const router = createRouter({ routes: [] })
    const api = createApi({ endpoints, baseURL: '/api' });
    app.use(api);
    app.use(router);
    app.mount('body');
})