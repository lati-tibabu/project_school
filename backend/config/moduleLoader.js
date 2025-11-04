const fs = require('fs');
const path = require('path');

class ModuleLoader {
  constructor() {
    this.modules = new Map();
    this.modulesPath = path.join(__dirname, '../modules');
  }

  /**
   * Load all modules from the modules directory
   */
  async loadModules() {
    try {
      // Create modules directory if it doesn't exist
      if (!fs.existsSync(this.modulesPath)) {
        fs.mkdirSync(this.modulesPath, { recursive: true });
        console.log('✓ Modules directory created.');
        return;
      }

      const moduleDirs = fs.readdirSync(this.modulesPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const moduleName of moduleDirs) {
        await this.loadModule(moduleName);
      }

      console.log(`✓ Loaded ${this.modules.size} module(s): ${Array.from(this.modules.keys()).join(', ')}`);
    } catch (error) {
      console.error('✗ Error loading modules:', error.message);
      throw error;
    }
  }

  /**
   * Load a single module
   */
  async loadModule(moduleName) {
    try {
      const modulePath = path.join(this.modulesPath, moduleName);
      const manifestPath = path.join(modulePath, 'manifest.json');

      // Check if manifest exists
      if (!fs.existsSync(manifestPath)) {
        console.warn(`⚠ Module "${moduleName}" missing manifest.json, skipping.`);
        return false;
      }

      // Read manifest
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

      // Validate manifest
      if (!manifest.name || !manifest.version) {
        console.warn(`⚠ Invalid manifest for module "${moduleName}", skipping.`);
        return false;
      }

      // Check if module is enabled
      if (manifest.enabled === false) {
        console.log(`ℹ Module "${moduleName}" is disabled, skipping.`);
        return false;
      }

      // Load module components
      const module = {
        name: manifest.name,
        version: manifest.version,
        description: manifest.description || '',
        models: this.loadModels(modulePath),
        routes: this.loadRoutes(modulePath),
        controllers: this.loadControllers(modulePath),
        manifest
      };

      this.modules.set(moduleName, module);
      console.log(`✓ Loaded module: ${manifest.name} v${manifest.version}`);
      return true;
    } catch (error) {
      console.error(`✗ Error loading module "${moduleName}":`, error.message);
      return false;
    }
  }

  /**
   * Load models from module
   */
  loadModels(modulePath) {
    const modelsPath = path.join(modulePath, 'models');
    const models = {};

    if (fs.existsSync(modelsPath)) {
      const modelFiles = fs.readdirSync(modelsPath)
        .filter(file => file.endsWith('.js'));

      for (const file of modelFiles) {
        const modelName = path.basename(file, '.js');
        models[modelName] = require(path.join(modelsPath, file));
      }
    }

    return models;
  }

  /**
   * Load routes from module
   */
  loadRoutes(modulePath) {
    const routesPath = path.join(modulePath, 'routes');
    const routes = {};

    if (fs.existsSync(routesPath)) {
      const routeFiles = fs.readdirSync(routesPath)
        .filter(file => file.endsWith('.js'));

      for (const file of routeFiles) {
        const routeName = path.basename(file, '.js');
        routes[routeName] = require(path.join(routesPath, file));
      }
    }

    return routes;
  }

  /**
   * Load controllers from module
   */
  loadControllers(modulePath) {
    const controllersPath = path.join(modulePath, 'controllers');
    const controllers = {};

    if (fs.existsSync(controllersPath)) {
      const controllerFiles = fs.readdirSync(controllersPath)
        .filter(file => file.endsWith('.js'));

      for (const file of controllerFiles) {
        const controllerName = path.basename(file, '.js');
        controllers[controllerName] = require(path.join(controllersPath, file));
      }
    }

    return controllers;
  }

  /**
   * Register module routes with Express app
   */
  registerRoutes(app) {
    for (const [moduleName, module] of this.modules) {
      const basePath = module.manifest.basePath || `/${moduleName.toLowerCase()}`;

      for (const [routeName, router] of Object.entries(module.routes)) {
        app.use(basePath, router);
        console.log(`✓ Registered routes for ${moduleName}/${routeName} at ${basePath}`);
      }
    }
  }

  /**
   * Get all loaded modules
   */
  getModules() {
    return Array.from(this.modules.entries()).map(([name, module]) => ({
      name,
      version: module.version,
      description: module.description,
      enabled: module.manifest.enabled !== false
    }));
  }

  /**
   * Get specific module
   */
  getModule(moduleName) {
    return this.modules.get(moduleName);
  }

  /**
   * Unload module (for dynamic module management)
   */
  async unloadModule(moduleName) {
    if (this.modules.has(moduleName)) {
      this.modules.delete(moduleName);
      console.log(`✓ Unloaded module: ${moduleName}`);
      return true;
    }
    return false;
  }
}

module.exports = new ModuleLoader();
