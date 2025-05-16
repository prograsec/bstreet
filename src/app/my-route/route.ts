import configPromise from '@payload-config' //Loads your Payload configuration (probably exported as a Promise or object).
import { getPayload } from 'payload' //Brings in the function to start Payload manually in a custom context (like Next API routes or scripts).

export const GET = async () => {
  const payload = await getPayload({
    config: configPromise,
  })

/* Starts Payload CMS using your local config (including MongoDB settings, collection schemas, auth rules, etc.).
Now payload gives you access to methods like: payload.find()
payload.create()
payload.update()
payload.delete() */


  const data = await payload.find({
    collection: 'users',
  })

  return Response.json(data)
}
