import { describe, it, expect } from 'vitest';
import { calculateHydration } from './hydration.utils';

describe('calculateHydration', () => {
  it('should calculate correct water for 500g flour at 70% hydration', () => {
    // F=500, H=70
    // S_w = 100 (50f, 50w)
    // T_f = 550
    // T_w_d = 550 * 0.7 = 385
    // W_a = 385 - 50 = 335
    const result = calculateHydration(500, 70);
    expect(result.waterToAdd).toBe(335);
    expect(result.starterWeight).toBe(100);
    expect(result.totalFlour).toBe(550);
  });

  it('should calculate correct water for 1000g flour at 75% hydration', () => {
    // F=1000, H=75
    // S_w = 200 (100f, 100w)
    // T_f = 1100
    // T_w_d = 1100 * 0.75 = 825
    // W_a = 825 - 100 = 725
    const result = calculateHydration(1000, 75);
    expect(result.waterToAdd).toBe(725);
    expect(result.starterWeight).toBe(200);
    expect(result.totalFlour).toBe(1100);
  });

  it('should handle 100% hydration correctly', () => {
    // F=500, H=100
    // S_w = 100 (50f, 50w)
    // T_f = 550
    // T_w_d = 550 * 1.0 = 550
    // W_a = 550 - 50 = 500
    const result = calculateHydration(500, 100);
    expect(result.waterToAdd).toBe(500);
  });
});
