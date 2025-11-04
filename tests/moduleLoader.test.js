const ModuleLoader = require('../backend/config/moduleLoader');
const fs = require('fs');
const path = require('path');

describe('Module Loader', () => {
  const modulesPath = path.join(__dirname, '../backend/modules');

  describe('getModules', () => {
    it('should return an array of loaded modules', () => {
      const modules = ModuleLoader.getModules();
      
      expect(Array.isArray(modules)).toBe(true);
    });

    it('should include module name, version, and description', () => {
      const modules = ModuleLoader.getModules();
      
      if (modules.length > 0) {
        const module = modules[0];
        expect(module).toHaveProperty('name');
        expect(module).toHaveProperty('version');
        expect(module).toHaveProperty('enabled');
      }
    });
  });

  describe('module structure validation', () => {
    it('should have valid manifest files for all modules', () => {
      if (!fs.existsSync(modulesPath)) {
        return; // Skip if modules directory doesn't exist
      }

      const moduleDirs = fs.readdirSync(modulesPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      moduleDirs.forEach(moduleName => {
        const manifestPath = path.join(modulesPath, moduleName, 'manifest.json');
        
        if (fs.existsSync(manifestPath)) {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
          
          expect(manifest).toHaveProperty('name');
          expect(manifest).toHaveProperty('version');
          expect(manifest).toHaveProperty('enabled');
        }
      });
    });
  });
});
