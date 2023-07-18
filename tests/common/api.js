import { createAPI } from '../../lib/index.js'

export default function ({ port = 49099, endpoints, ...options } = {}) {

    return createAPI({
        baseURL: `http://localhost:${port}`,
        endpoints: {
            test: params => ({ url: '/', params }),
            ...endpoints
        },
        ...options
    })

}