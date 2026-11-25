import { APIError, type CollectionConfig } from 'payload';
import { ownerRead, trustedAppend } from '@/features/investment-scenarios/access';
import { savedInputSchema } from '@/features/investment-scenarios/schema';
import { runBodySchema } from '@/features/investment-scenarios/report-schema';

const immutable: Pick<CollectionConfig, 'access' | 'hooks'> = {
  access: { read: ownerRead, create: trustedAppend, update: () => false, delete: () => false },
  hooks: { beforeChange: [async ({ data, operation, req }) => {
    if (operation !== 'create' || await trustedAppend({ req, data }) !== true) throw new APIError('Historia scenariusza jest niezmienna.', 403);
    return data;
  }] },
};
export const ScenarioRevisions: CollectionConfig = {
  slug: 'scenario-revisions', ...immutable, admin: { useAsTitle: 'scenarioKey' },
  indexes: [{ fields: ['owner', 'scenarioKey', 'revision'], unique: true }, { fields: ['owner', 'requestKey'], unique: true }],
  fields: [
    { name: 'owner', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'scenarioKey', type: 'text', required: true, index: true }, { name: 'revision', type: 'number', required: true },
    { name: 'previousRevision', type: 'relationship', relationTo: 'scenario-revisions' },
    { name: 'requestKey', type: 'text', required: true }, { name: 'fingerprint', type: 'text', required: true },
    { name: 'schemaVersion', type: 'number', required: true },
    { name: 'body', type: 'json', required: true, validate: value => savedInputSchema.safeParse(value).success || 'Niepoprawne wejścia scenariusza.' },
  ],
};
export const ScenarioRuns: CollectionConfig = {
  slug: 'scenario-runs', ...immutable,
  indexes: [{ fields: ['owner', 'requestKey'], unique: true }],
  fields: [
    { name: 'owner', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'revision', type: 'relationship', relationTo: 'scenario-revisions', required: true },
    { name: 'requestKey', type: 'text', required: true }, { name: 'fingerprint', type: 'text', required: true },
    { name: 'engineVersion', type: 'text', required: true }, { name: 'body', type: 'json', required: true, validate: value => runBodySchema.safeParse(value).success || 'Niepoprawny zapis wejść lub raportu.' },
  ],
};
