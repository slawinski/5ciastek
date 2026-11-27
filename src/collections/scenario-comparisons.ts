import { APIError, type CollectionConfig } from 'payload';
import { ownerRead, trustedAppend } from '@/features/investment-scenarios/access';
import { comparisonManifestSchema } from '@/features/investment-scenarios/comparison';
import { assertManifestIdentity, readPinnedRun } from '@/features/investment-scenarios/comparison-service';

export const ScenarioComparisons: CollectionConfig = {
  slug: 'scenario-comparisons', admin: { useAsTitle: 'comparisonKey' },
  access: { read: ownerRead, create: trustedAppend, update: () => false, delete: () => false },
  indexes: [{ fields: ['owner', 'requestKey'], unique: true }, { fields: ['comparisonKey'], unique: true }],
  hooks: { beforeChange: [async ({ data, operation, req }) => {
    if (operation !== 'create' || await trustedAppend({ req, data }) !== true) throw new APIError('Porównanie jest niezmienne.', 403);
    const manifest = comparisonManifestSchema.parse(data.manifest);
    if (data.schemaVersion !== 1) throw new APIError('Niepoprawna wersja porównania.', 400);
    const runs = await Promise.all(manifest.selections.map(row => readPinnedRun(req.payload, { req, user: req.user, overrideAccess: false, depth: 0 }, row.runId)));
    assertManifestIdentity(manifest, runs, data.fingerprint, data.runs);
    return data;
  }] },
  fields: [
    { name: 'owner', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'comparisonKey', type: 'text', required: true }, { name: 'requestKey', type: 'text', required: true },
    { name: 'schemaVersion', type: 'number', required: true }, { name: 'fingerprint', type: 'text', required: true },
    { name: 'runs', type: 'relationship', relationTo: 'scenario-runs', hasMany: true, required: true },
    { name: 'manifest', type: 'json', required: true, validate: value => comparisonManifestSchema.safeParse(value).success || 'Niepoprawny wybór przebiegów.' },
  ],
};
