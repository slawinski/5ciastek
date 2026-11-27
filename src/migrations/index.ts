import * as migration_20261124_172929_mvp_zero from './20261124_172929_mvp_zero';
import * as migration_20261125_155445_mvp_one from './20261125_155445_mvp_one';
import * as migration_20261127_093515_mvp_two_comparisons from './20261127_093515_mvp_two_comparisons';

export const migrations = [
  {
    up: migration_20261124_172929_mvp_zero.up,
    down: migration_20261124_172929_mvp_zero.down,
    name: '20261124_172929_mvp_zero',
  },
  {
    up: migration_20261125_155445_mvp_one.up,
    down: migration_20261125_155445_mvp_one.down,
    name: '20261125_155445_mvp_one',
  },
  {
    up: migration_20261127_093515_mvp_two_comparisons.up,
    down: migration_20261127_093515_mvp_two_comparisons.down,
    name: '20261127_093515_mvp_two_comparisons'
  },
];
