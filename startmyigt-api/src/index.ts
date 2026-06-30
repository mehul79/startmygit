import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = { DB: D1Database; AI: Ai }

const app = new Hono<{ Bindings: Bindings }>()
app.use('/*', cors()) // ponytail: wide-open CORS for MVP. Lock to the Pages origin before launch.

// Any uncaught throw (e.g. Workers AI failing) must still return JSON —
// the frontend always calls res.json() on error responses.
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'something went wrong, try again' }, 500)
})

app.get('/', (c) => c.text('startmyigt api'))

export default app
