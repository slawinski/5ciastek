import type { Access, CollectionConfig, PayloadRequest } from 'payload';
import { ValidationError } from 'payload';
import { ZodError } from 'zod';
import { freezeRecipe } from '@/features/recipes/publication';
import { draftSchema, massSchema, snapshotSchema } from '@/features/recipes/schema';

export const administrator = ({ req }: { req: Pick<PayloadRequest, 'user'> }) => req.user?.role === 'administrator';
export const editor = ({ req }: { req: Pick<PayloadRequest, 'user'> }) => ['administrator', 'editor'].includes(req.user?.role ?? '');
export const publicationsRead: Access = ({ req }) => {
  if (!req.user) return false;
  return ['administrator', 'editor'].includes(req.user.role) ? true : { audience: { equals: 'bakers' } };
};
const validMass = (value: string | null | undefined) => !value || massSchema.safeParse(value).success || 'Podaj dodatnią masę w g, maksymalnie 3 miejsca po przecinku.';

export const Users: CollectionConfig = {
  slug: 'users', auth: { maxLoginAttempts: 5, lockTime: 600000, tokenExpiration: 7200 },
  admin: { useAsTitle: 'email' },
  access: {
    create: administrator, delete: administrator, admin: editor,
    read: ({ req }) => req.user?.role === 'administrator' ? true : req.user ? { id: { equals: req.user.id } } : false,
    update: ({ req }) => req.user?.role === 'administrator' ? true : req.user ? { id: { equals: req.user.id } } : false,
  },
  hooks: { beforeChange: [async ({ data, req, operation }) => {
    if (operation === 'create') {
      const existing = await req.payload.count({ collection: 'users', req, overrideAccess: true });
      if (!existing.totalDocs) data.role = 'administrator';
    }
    return data;
  }] },
  fields: [{ name: 'role', label: 'Rola', type: 'select', defaultValue: 'baker', required: true,
    options: ['administrator', 'editor', 'baker'], access: { create: administrator, update: administrator } }],
};

export const Ingredients: CollectionConfig = {
  slug: 'ingredients', labels: { singular: 'Surowiec', plural: 'Surowce' }, admin: { useAsTitle: 'name' },
  access: { create: editor, read: editor, update: editor, delete: () => false },
  fields: [
    { name: 'name', label: 'Nazwa', type: 'text', required: true },
    { name: 'kind', label: 'Klasyfikacja', type: 'select', required: true, defaultValue: 'unknown', options: ['flour', 'water', 'salt', 'starter', 'other', 'unknown'] },
    { name: 'flourType', label: 'Rodzaj mąki', type: 'text' },
    { name: 'compositionKnown', label: 'Znana kompozycja zakwasu', type: 'checkbox', defaultValue: false },
    { name: 'composition', label: 'Kompozycja wzorcowej masy zakwasu', type: 'group', fields: [
      { name: 'waterGrams', label: 'Woda (g)', type: 'text', validate: validMass },
      { name: 'flours', label: 'Mąki', type: 'array', fields: [
        { name: 'flourType', label: 'Rodzaj mąki', type: 'text', required: true },
        { name: 'grams', label: 'Masa (g)', type: 'text', required: true, validate: validMass },
      ] },
    ] },
  ],
};

export const Recipes: CollectionConfig = {
  slug: 'recipes', labels: { singular: 'Receptura', plural: 'Receptury' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'publicationNumber', 'updatedAt'] },
  access: { create: editor, read: editor, update: editor, delete: () => false },
  hooks: {
    beforeChange: [async ({ data, originalDoc, req }) => {
      const merged = { ...originalDoc, ...data };
      if (!data.publishNow) return data;
      if (!['administrator', 'editor'].includes(req.user?.role ?? '')) throw new Error('Brak prawa publikacji.');
      const ingredients = await Promise.all((merged.ingredients ?? []).map(async (row: { ingredient: number | { id: number }; mass: string }) => {
        const id = typeof row.ingredient === 'number' ? row.ingredient : row.ingredient.id;
        const source = await req.payload.findByID({ collection: 'ingredients', id, req, user: req.user, overrideAccess: false, depth: 0 });
        return { mass: row.mass, ingredient: { ...source, composition: source.compositionKnown ? source.composition : null } };
      }));
      try {
        req.context.recipeSnapshot = freezeRecipe(draftSchema.parse({ ...merged, ingredients }));
      } catch (error) {
        const errors = error instanceof ZodError
          ? error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message }))
          : [{ path: 'portionGrams', message: error instanceof Error ? error.message : 'Niepoprawna receptura.' }];
        throw new ValidationError({ collection: 'recipes', errors });
      }
      data.publicationNumber = (originalDoc?.publicationNumber ?? 0) + 1;
      data.publishNow = false;
      return data;
    }],
    afterChange: [async ({ doc, req }) => {
      if (!req.context.recipeSnapshot) return doc;
      const snapshot = snapshotSchema.parse(req.context.recipeSnapshot);
      delete req.context.recipeSnapshot;
      await req.payload.create({ collection: 'publications', req, overrideAccess: true,
        context: { publicationFromRecipe: true },
        data: { recipe: doc.id, version: doc.publicationNumber, versionKey: `${doc.id}:${doc.publicationNumber}`, audience: doc.audience, snapshot } });
      return doc;
    }],
  },
  fields: [
    { name: 'name', label: 'Nazwa', type: 'text', required: true },
    { name: 'code', label: 'Kod', type: 'text' },
    { name: 'audience', label: 'Odbiorcy publikacji', type: 'select', defaultValue: 'bakers', required: true, options: [{ label: 'Piekarze', value: 'bakers' }, { label: 'Tylko redakcja', value: 'editors' }] },
    { name: 'standalone', label: 'Pełna samodzielna receptura (nie same dodatki)', type: 'checkbox', defaultValue: true },
    { name: 'yield', label: 'Uzysk (szt.)', type: 'number', min: 1, validate: (value: number | null | undefined) => value == null || Number.isSafeInteger(value) || 'Uzysk musi być całkowity.' },
    { name: 'portionGrams', label: 'Pomocnicza masa porcji ciasta (g)', type: 'text', validate: validMass },
    { name: 'description', label: 'Opis', type: 'textarea' },
    { name: 'ingredients', label: 'Składniki do odważenia', type: 'array', fields: [
      { name: 'ingredient', label: 'Surowiec', type: 'relationship', relationTo: 'ingredients', required: true },
      { name: 'mass', label: 'Masa bazowa (g)', type: 'text', validate: validMass },
    ] },
    { name: 'process', label: 'Etapy procesu (kolejność zapisana)', type: 'array', fields: [{ name: 'instruction', label: 'Instrukcja, orientacyjny czas i temperatura', type: 'textarea', required: true }] },
    { name: 'publicationNumber', label: 'Ostatnia wersja publikacji', type: 'number', defaultValue: 0, admin: { readOnly: true }, access: { create: () => false, update: () => false } },
    { name: 'publishNow', label: 'Opublikuj nową niezmienną wersję przy zapisie', type: 'checkbox', defaultValue: false },
  ],
};

export const Publications: CollectionConfig = {
  slug: 'publications', labels: { singular: 'Opublikowana wersja', plural: 'Historia publikacji' },
  admin: { useAsTitle: 'versionKey', defaultColumns: ['versionKey', 'recipe', 'createdAt'] },
  access: { create: () => false, update: () => false, delete: () => false, read: publicationsRead },
  hooks: { beforeChange: [({ data, req, operation }) => {
    if (operation !== 'create' || !req.context.publicationFromRecipe) throw new Error('Opublikowane wersje są niezmienne.');
    return data;
  }] },
  fields: [
    { name: 'recipe', label: 'Receptura', type: 'relationship', relationTo: 'recipes', required: true },
    { name: 'version', label: 'Wersja', type: 'number', required: true },
    { name: 'versionKey', label: 'Receptura:wersja', type: 'text', required: true, unique: true },
    { name: 'audience', type: 'select', required: true, options: ['bakers', 'editors'] },
    { name: 'snapshot', label: 'Zamrożona receptura (g)', type: 'json', required: true },
  ],
};
