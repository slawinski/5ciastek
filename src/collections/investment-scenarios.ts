import { APIError, type CollectionConfig } from 'payload';
import { ownerRead, trustedAppend } from '@/features/investment-scenarios/access';
import { versionedSavedInputSchema, versionedRunBodySchema } from '@/features/investment-scenarios/versioned';

const immutable: Pick<CollectionConfig, 'access' | 'hooks'> = {
  access: { read: ownerRead, create: trustedAppend, update: () => false, delete: () => false },
  hooks: { beforeChange: [async ({ data, operation, req }) => {
    if (operation !== 'create' || await trustedAppend({ req, data }) !== true) throw new APIError('Historia scenariusza jest niezmienna.', 403);
    if ('schemaVersion' in data && versionedSavedInputSchema.parse(data.body).input.schemaVersion !== data.schemaVersion) throw new APIError('Niezgodna wersja koperty wejść.', 400);
    if ('engineVersion' in data && versionedRunBodySchema.parse(data.body).output.engineVersion !== data.engineVersion) throw new APIError('Niezgodna wersja koperty wyniku.', 400);
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
    { name: 'body', type: 'json', required: true, validate: value => versionedSavedInputSchema.safeParse(value).success || 'Niepoprawne wejścia scenariusza.' },
  ],
};
export const ScenarioRuns: CollectionConfig = {
  slug: 'scenario-runs', ...immutable,
  indexes: [{ fields: ['owner', 'requestKey'], unique: true }],
  fields: [
    { name: 'owner', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'revision', type: 'relationship', relationTo: 'scenario-revisions', required: true },
    { name: 'requestKey', type: 'text', required: true }, { name: 'fingerprint', type: 'text', required: true },
    { name: 'engineVersion', type: 'text', required: true }, { name: 'body', type: 'json', required: true, validate: value => versionedRunBodySchema.safeParse(value).success || 'Niepoprawny zapis wejść lub raportu.' },
  ],
};
