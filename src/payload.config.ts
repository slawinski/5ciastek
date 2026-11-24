import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';

if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 32) {
  throw new Error('PAYLOAD_SECRET must contain at least 32 characters.');
}
if (!process.env.DATABASE_URI) throw new Error('DATABASE_URI must name an explicit database.');

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  admin: { user: 'users', importMap: { baseDir: process.cwd() } },
  graphQL: { disable: true },
  db: sqliteAdapter({ client: { url: process.env.DATABASE_URI } }),
  collections: [
    {
      slug: 'users', auth: true,
      admin: { useAsTitle: 'email' },
      fields: [{ name: 'role', type: 'select', required: true, defaultValue: 'baker', options: ['administrator', 'editor', 'baker'] }],
    },
    { slug: 'recipes', access: { create: ({req}) => !!req.user, read: ({req}) => !!req.user, update: ({req}) => !!req.user, delete: ({req}) => !!req.user }, admin: { useAsTitle: 'name' }, fields: [{ name: 'name', type: 'text', required: true }] },
  ],
});
