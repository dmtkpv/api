import express from 'express'

export default function ({ port = 49099 } = {}) {

    const app = express();

    app.get('/', (req, res) => {
        setTimeout(() => {
            if (req.query.error) res.status(500).send();
            else res.send({ ok: true })
        }, req.query.delay)
    })

    return app.listen(port);

}