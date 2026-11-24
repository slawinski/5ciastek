import * as migration_20261124_172929_mvp_zero from './20261124_172929_mvp_zero';

export const migrations = [
  {
    up: migration_20261124_172929_mvp_zero.up,
    down: migration_20261124_172929_mvp_zero.down,
    name: '20261124_172929_mvp_zero'
  },
];
