import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['src/payload-types.ts', 'src/routeTree.gen.ts'] },
  ...tseslint.configs.recommended,
  { rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], '@typescript-eslint/no-explicit-any': 'error' } },
);
