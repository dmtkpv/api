import express from 'express';
import createSSR from '@dmtkpv/ssr/createSSR';

const port = 8888;
const app = express();
const ssr = await createSSR();

app.use(ssr.middlewares);

app.get('/api/countries', (req, res) => {
    res.json([
        { code: 'UA', name: 'Ukraine' },
        { code: 'RU', name: 'Russia' },
        { code: 'IT', name: 'Italy' },
    ])
})

app.get('/*', (req, res, next) => {
    ssr.render(req.originalUrl).then(html => res.send(html)).catch(next)
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})



