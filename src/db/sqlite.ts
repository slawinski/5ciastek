import { randomUUID } from 'node:crypto';
import { createClient } from '@libsql/client';
import { sqliteAdapter, type SQLiteAdapter } from '@payloadcms/db-sqlite';
import { drizzle } from 'drizzle-orm/libsql';

export function durableSQLiteAdapter(args: Parameters<typeof sqliteAdapter>[0]) {
  if (!args.client.url.startsWith('file:')) throw new Error('The durable SQLite adapter requires a local file: database.');
  const base = sqliteAdapter(args);
  return { ...base, init: (options: Parameters<typeof base.init>[0]) => {
    const adapter = base.init(options);
    if (!args.transactionOptions) return adapter;

    adapter.beginTransaction = async () => {
      await adapter.initializing;
      // Keep this connection attached to its client so close() also disposes native
      // statements after a failed BEGIN/COMMIT. libSQL's transaction() detaches it.
      const client = createClient(args.client);
      try {
        await client.execute('BEGIN IMMEDIATE');
        const id = randomUUID();
        adapter.sessions[id] = {
          // Payload's session type hardcodes a relational schema. All session SQL
          // here uses the same schema and dedicated connection inside this BEGIN.
          db: drizzle(client, { schema: adapter.schema, logger: args.logger }) as unknown as SQLiteAdapter['sessions'][string]['db'],
          resolve: async () => {
            // executeMultiple uses exec, not a prepared COMMIT statement, and
            // rolls back on failure. execute() leaves a failed statement pending.
            try { await client.executeMultiple('COMMIT'); } finally { client.close(); }
          },
          reject: async () => {
            try { await client.executeMultiple('ROLLBACK'); } finally { client.close(); }
          },
        };
        return id;
      } catch (error) {
        client.close();
        throw error;
      }
    };
    adapter.commitTransaction = async incomingID => {
      const id = await incomingID;
      if (id == null) return;
      const session = adapter.sessions[id];
      delete adapter.sessions[id];
      await session?.resolve();
    };
    return adapter;
  } };
}
