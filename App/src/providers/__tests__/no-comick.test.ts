import { describe, it, expect } from 'vitest';
import { CapabilityRouter } from '../../services/CapabilityRouter';
import { Capability } from '../../models/provider.types';
import { MediaType } from '../../models/provider.types';
import * as fs from 'fs';
import * as path from 'path';

describe('ADR-015 Compliance (No Comick)', () => {
  it('never routes to Comick', () => {
    const capabilities = Object.values(Capability);
    const mediaTypes = Object.values(MediaType);

    for (const cap of capabilities) {
      for (const mt of mediaTypes) {
        const route = CapabilityRouter.getRoute(cap, mt);
        expect(route.primary).not.toBe('comick');
        expect(route.secondary).not.toBe('comick');
      }
    }
  });

  it('does not contain comick references in provider source code', () => {
    const providersDir = path.join(__dirname, '..');
    const files = fs.readdirSync(providersDir);
    
    // Check main provider files
    const sourceFiles = files.filter(f => f.endsWith('.ts'));
    for (const file of sourceFiles) {
      const content = fs.readFileSync(path.join(providersDir, file), 'utf-8');
      expect(content.toLowerCase()).not.toContain('comick');
    }
  });
});
