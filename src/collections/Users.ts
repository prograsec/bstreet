import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name:"username", // here name is referred to as the field name in the database.
      required:true,
      unique:true,
      type:"text",
    }
  ],
}
