import { withPayload } from '@payloadcms/next/withPayload';

export default withPayload({ typescript: { tsconfigPath: process.env.NEXT_SPIKE === '1' ? 'tsconfig.spike.json' : 'tsconfig.json' } });
