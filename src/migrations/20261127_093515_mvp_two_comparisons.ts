import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`scenario_comparisons\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`owner_id\` integer NOT NULL,
  	\`comparison_key\` text NOT NULL,
  	\`request_key\` text NOT NULL,
  	\`schema_version\` numeric NOT NULL,
  	\`fingerprint\` text NOT NULL,
  	\`manifest\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`scenario_comparisons_owner_idx\` ON \`scenario_comparisons\` (\`owner_id\`);`)
  await db.run(sql`CREATE INDEX \`scenario_comparisons_updated_at_idx\` ON \`scenario_comparisons\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`scenario_comparisons_created_at_idx\` ON \`scenario_comparisons\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`owner_requestKey_2_idx\` ON \`scenario_comparisons\` (\`owner_id\`,\`request_key\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`comparisonKey_idx\` ON \`scenario_comparisons\` (\`comparison_key\`);`)
  await db.run(sql`CREATE TABLE \`scenario_comparisons_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`scenario_runs_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`scenario_comparisons\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`scenario_runs_id\`) REFERENCES \`scenario_runs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`scenario_comparisons_rels_order_idx\` ON \`scenario_comparisons_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`scenario_comparisons_rels_parent_idx\` ON \`scenario_comparisons_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`scenario_comparisons_rels_path_idx\` ON \`scenario_comparisons_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`scenario_comparisons_rels_scenario_runs_id_idx\` ON \`scenario_comparisons_rels\` (\`scenario_runs_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`scenario_comparisons_id\` integer REFERENCES scenario_comparisons(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_scenario_comparisons_id_idx\` ON \`payload_locked_documents_rels\` (\`scenario_comparisons_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`scenario_comparisons\`;`)
  await db.run(sql`DROP TABLE \`scenario_comparisons_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`ingredients_id\` integer,
  	\`recipes_id\` integer,
  	\`publications_id\` integer,
  	\`scenario_revisions_id\` integer,
  	\`scenario_runs_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`ingredients_id\`) REFERENCES \`ingredients\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`recipes_id\`) REFERENCES \`recipes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`publications_id\`) REFERENCES \`publications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`scenario_revisions_id\`) REFERENCES \`scenario_revisions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`scenario_runs_id\`) REFERENCES \`scenario_runs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "ingredients_id", "recipes_id", "publications_id", "scenario_revisions_id", "scenario_runs_id") SELECT "id", "order", "parent_id", "path", "users_id", "ingredients_id", "recipes_id", "publications_id", "scenario_revisions_id", "scenario_runs_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_ingredients_id_idx\` ON \`payload_locked_documents_rels\` (\`ingredients_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_recipes_id_idx\` ON \`payload_locked_documents_rels\` (\`recipes_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_publications_id_idx\` ON \`payload_locked_documents_rels\` (\`publications_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_scenario_revisions_id_idx\` ON \`payload_locked_documents_rels\` (\`scenario_revisions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_scenario_runs_id_idx\` ON \`payload_locked_documents_rels\` (\`scenario_runs_id\`);`)
}
