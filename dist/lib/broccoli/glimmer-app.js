'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigLoader = require('broccoli-config-loader');
var ConfigReplace = require('broccoli-config-replace');
var Funnel = require('broccoli-funnel');
var path = require('path');
var fs = require('fs');
var typescript = require('broccoli-typescript-compiler').typescript;
var existsSync = require('exists-sync');
var MergeTrees = require('broccoli-merge-trees');
var ResolutionMapBuilder = require('@glimmer/resolution-map-builder');
var ResolverConfigurationBuilder = require('@glimmer/resolver-configuration-builder');
var BroccoliSource = require('broccoli-source');
var WatchedDir = BroccoliSource.WatchedDir;
var UnwatchedDir = BroccoliSource.UnwatchedDir;
var p = require('ember-cli-preprocess-registry/preprocessors');
var utils = require('ember-build-utilities');
var defaultsDeep = require('lodash.defaultsdeep');
var addonProcessTree = utils.addonProcessTree;
var GlimmerTemplatePrecompiler = utils.GlimmerTemplatePrecompiler;
var resolveLocal = utils.resolveLocal;
var setupRegistry = p.setupRegistry;
var defaultRegistry = p.defaultRegistry;
var preprocessJs = p.preprocessJs;
var preprocessCss = p.preprocessCss;
var writeFile = require('broccoli-file-creator');
var debugTree = require('broccoli-debug').buildDebugCallback('glimmer-app');
var rollup_with_dependencies_1 = require("./rollup-with-dependencies");
var default_module_configuration_1 = require("./default-module-configuration");
var test_entrypoint_builder_1 = require("./test-entrypoint-builder");
exports.AbstractBuild = utils.AbstractBuild;
function maybeDebug(inputTree, name) {
    if (!process.env.GLIMMER_BUILD_DEBUG) {
        return inputTree;
    }
    // preserve `null` trees
    if (!inputTree) {
        return inputTree;
    }
    return debugTree(inputTree, name);
}
function normalizeTreeForType(rawTree, root, defaultPath) {
    var tree;
    if (typeof rawTree === 'string') {
        tree = new WatchedDir(resolveLocal(root, rawTree));
    }
    else if (!rawTree) {
        var path_1 = resolveLocal(root, defaultPath);
        tree = existsSync(path_1) ? new WatchedDir(path_1) : null;
    }
    else {
        tree = rawTree;
    }
    return tree;
}
function addonTreesFor(project, type) {
    return project.addons.reduce(function (sum, addon) {
        if (addon.treeFor) {
            var val = addon.treeFor(type);
            if (val) {
                sum.push(val);
            }
        }
        return sum;
    }, []);
}
var DEFAULT_TS_OPTIONS = {
    tsconfig: {
        compilerOptions: {
            target: "es5",
            module: "es2015",
            inlineSourceMap: true,
            inlineSources: true,
            moduleResolution: "node"
        },
        exclude: [
            'node_modules',
            '**/*.d.ts'
        ]
    }
};
/**
 * GlimmerApp provides an interface to a package (app, engine, or addon)
 * compatible with the module unification layout.
 *
 * @class GlimmerApp
 * @constructor
 * @param {Object} [defaults]
 * @param {Object} [options=Options] Configuration options
 */
var GlimmerApp = (function (_super) {
    __extends(GlimmerApp, _super);
    function GlimmerApp(upstreamDefaults, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var missingProjectMessage = 'You must pass through the default arguments passed into your ember-cli-build.js file when constructing a new GlimmerApp';
        if (arguments.length === 0) {
            throw new Error(missingProjectMessage);
        }
        if (!upstreamDefaults.project) {
            throw new Error(missingProjectMessage);
        }
        var isProduction = process.env.EMBER_ENV === 'production';
        var defaults = defaultsDeep({}, {
            addons: {
                whitelist: null,
                blacklist: null,
            },
            outputPaths: {
                app: {
                    html: 'index.html',
                    js: 'app.js',
                    css: 'app.css'
                }
            },
            rollup: {},
            minifyJS: {
                enabled: isProduction,
                options: {
                    compress: {
                        // this is adversely affects heuristics for IIFE eval
                        negate_iife: false,
                        // limit sequences because of memory issues during parsing
                        sequences: 30
                    },
                    output: {
                        // no difference in size and much easier to debug
                        semicolons: false
                    }
                }
            },
            sourcemaps: {
                enabled: !isProduction
            },
            storeConfigInMeta: null
        }, upstreamDefaults);
        _this = _super.call(this, defaults, options) || this;
        _this.registry = options.registry || defaultRegistry(_this);
        _this.env = process.env.EMBER_ENV || 'development';
        _this.name = _this.project.name();
        _this.rollupOptions = options.rollup;
        setupRegistry(_this);
        _this.trees = _this.buildTrees(options);
        _this.outputPaths = options.outputPaths;
        _this['_notifyAddonIncluded']();
        return _this;
    }
    GlimmerApp.prototype.import = function () {
        throw new Error('app.import is not yet implemented for GlimmerApp');
    };
    GlimmerApp.prototype._configReplacePatterns = function () {
        return [{
                match: /\{\{rootURL\}\}/g,
                replacement: function (config) { return config.rootURL || ''; },
            }, {
                match: /\{\{content-for ['"](.+)["']\}\}/g,
                replacement: this.contentFor.bind(this)
            }];
    };
    GlimmerApp.prototype.buildTrees = function (options) {
        var root = this.project.root;
        var rawSrcTree = options.trees && options.trees.src;
        var srcTree = normalizeTreeForType(rawSrcTree, root, 'src');
        if (srcTree) {
            srcTree = new Funnel(srcTree, {
                destDir: 'src'
            });
            srcTree = addonProcessTree(this.project, 'preprocessTree', 'src', srcTree);
        }
        var rawStylesTree = options.trees && options.trees.styles;
        var stylesTree = normalizeTreeForType(rawStylesTree, root, path.join('src', 'ui', 'styles'));
        if (stylesTree) {
            stylesTree = new Funnel(stylesTree, { destDir: '/src/ui/styles' });
        }
        var rawPublicTree = options.trees && options.trees.public;
        var publicTree = normalizeTreeForType(rawPublicTree, root, 'public');
        var nodeModulesTree = options.trees && options.trees.nodeModules || new UnwatchedDir(resolveLocal(root, 'node_modules'));
        if (nodeModulesTree) {
            nodeModulesTree = new Funnel(nodeModulesTree, {
                destDir: 'node_modules/'
            });
        }
        return {
            src: maybeDebug(srcTree, 'src'),
            styles: maybeDebug(stylesTree, 'styles'),
            public: maybeDebug(publicTree, 'public'),
            nodeModules: nodeModulesTree
        };
    };
    GlimmerApp.prototype.tsOptions = function () {
        var tsconfigPath = resolveLocal(this.project.root, 'tsconfig.json');
        var tsconfig;
        if (existsSync(tsconfigPath)) {
            try {
                tsconfig = require(tsconfigPath);
            }
            catch (err) {
                console.log("Error reading from tsconfig.json");
            }
        }
        else {
            console.log("No tsconfig.json found; falling back to default TypeScript settings.");
        }
        return tsconfig ? { tsconfig: tsconfig } : DEFAULT_TS_OPTIONS;
    };
    GlimmerApp.prototype.javascript = function () {
        var _a = this.trees, src = _a.src, nodeModules = _a.nodeModules;
        var tsConfig = this.tsOptions();
        var glimmerEnv = this.getGlimmerEnvironment();
        var configTree = this.buildConfigTree(src);
        var srcWithoutHBSTree = new Funnel(src, {
            exclude: ['**/*.hbs', '**/*.ts']
        });
        // Compile the TypeScript and Handlebars files into JavaScript
        var compiledHandlebarsTree = this.compiledHandlebarsTree(src, glimmerEnv);
        var combinedConfigAndCompiledHandlebarsTree = new MergeTrees([configTree, compiledHandlebarsTree]);
        // the output tree from typescript only includes the output from .ts -> .js transpilation
        // and no other files from the original source tree
        var transpiledTypescriptTree = this.compiledTypeScriptTree(combinedConfigAndCompiledHandlebarsTree, nodeModules, tsConfig);
        var trees = [srcWithoutHBSTree, transpiledTypescriptTree, configTree];
        if (this.env === 'test') {
            trees.push(new test_entrypoint_builder_1.default(transpiledTypescriptTree));
        }
        // Merge the JavaScript source and generated module map and resolver
        // configuration files together, making sure to overwrite the stub
        // module-map.js and resolver-configuration.js in the source tree with the
        // generated ones.
        transpiledTypescriptTree = new MergeTrees(trees, { overwrite: true });
        return this.processESLastest(transpiledTypescriptTree);
    };
    GlimmerApp.prototype.processESLastest = function (tree) {
        return preprocessJs(tree, '/', this.name, {
            registry: this.registry
        });
    };
    GlimmerApp.prototype.package = function (jsTree, cssTree, publicTree, htmlTree) {
        var missingPackages = [];
        jsTree = this.rollupTree(jsTree);
        var trees = [jsTree, htmlTree];
        if (cssTree) {
            trees.push(cssTree);
        }
        if (publicTree) {
            trees.push(publicTree);
        }
        var appTree = new MergeTrees(trees);
        appTree = this.maybePerformDeprecatedSass(appTree, missingPackages);
        if (missingPackages.length > 0) {
            this.project.ui.writeWarnLine("This project is relying on behaviors provided by @glimmer/application-pipeline that will be removed in future versions. The underlying functionality has now been migrated to be performed by addons in your project.\n\nPlease run the following to resolve this warning:\n\n  " + missingPackages.join('\n  '));
        }
        appTree = addonProcessTree(this.project, 'postprocessTree', 'all', appTree);
        return appTree;
    };
    GlimmerApp.prototype.getGlimmerEnvironment = function () {
        var config = this.project.config(this.project.env);
        return config.GlimmerENV || config.EmberENV;
    };
    GlimmerApp.prototype.testPackage = function () {
        return this.rollupTree(this.javascript(), {
            entry: 'src/utils/test-helpers/test-helper.js',
            dest: 'index.js'
        });
    };
    /**
     * Creates a Broccoli tree representing the compiled Glimmer application.
     *
     * @param options
     */
    GlimmerApp.prototype.toTree = function () {
        if (this.env === 'test') {
            return this.testPackage();
        }
        var jsTree = this.javascript();
        var cssTree = this.cssTree();
        var publicTree = this.publicTree();
        var htmlTree = this.htmlTree();
        return this.package(jsTree, cssTree, publicTree, htmlTree);
    };
    GlimmerApp.prototype.compiledTypeScriptTree = function (srcTree, nodeModulesTree, tsConfig) {
        var inputTrees = new MergeTrees([nodeModulesTree, srcTree]);
        var compiledTypeScriptTree = typescript(inputTrees, tsConfig);
        return maybeDebug(compiledTypeScriptTree, 'typescript-output');
    };
    GlimmerApp.prototype.compiledHandlebarsTree = function (srcTree, glimmerEnv) {
        var compiledHandlebarsTree = new GlimmerTemplatePrecompiler(srcTree, {
            rootName: this.project.pkg.name,
            GlimmerENV: glimmerEnv
        });
        return maybeDebug(compiledHandlebarsTree, 'handlebars-output');
    };
    GlimmerApp.prototype.rollupTree = function (jsTree, options) {
        var rollupOptions = Object.assign({}, this.rollupOptions, {
            format: 'umd',
            entry: 'src/index.js',
            dest: this.outputPaths.app.js,
            sourceMap: this.options.sourcemaps.enabled
        }, options);
        return new rollup_with_dependencies_1.default(maybeDebug(jsTree, 'rollup-input-tree'), {
            inputFiles: ['**/*.js'],
            rollup: rollupOptions,
            project: this.project,
            buildConfig: this.options
        });
    };
    GlimmerApp.prototype.buildConfigTree = function (postTranspiledSrc) {
        // Build the file that maps individual modules onto the resolver's specifier
        // keys.
        var moduleMap = this.buildResolutionMap(postTranspiledSrc);
        // Build the resolver configuration file.
        var resolverConfiguration = this.buildResolverConfiguration();
        var configEnvironment;
        if (this.options.storeConfigInMeta === true) {
            configEnvironment = new MergeTrees([
                writeFile('config/environment.js', "\n          var config;\n          try {\n            var metaName = '" + this.name + "/config/environment';\n            var rawConfig = document.querySelector('meta[name=\"' + metaName + '\"]').getAttribute('content');\n            config = JSON.parse(decodeURIComponent(rawConfig));\n          }\n          catch(err) {\n            throw new Error('Could not read config from meta tag with name \"' + metaName + '\".');\n          }\n\n          export default config;\n        "),
                writeFile('config/environment.d.ts', "declare let config: any; export default config;")
            ]);
        }
        var configTree = this._configTree();
        return debugTree(new MergeTrees([moduleMap, resolverConfiguration, configEnvironment, configTree].filter(Boolean)), 'config:output');
    };
    GlimmerApp.prototype.buildResolutionMap = function (src) {
        return new ResolutionMapBuilder(src, this._configTree(), {
            srcDir: 'src',
            configPath: this._configPath(),
            defaultModulePrefix: this.name,
            defaultModuleConfiguration: default_module_configuration_1.default
        });
    };
    GlimmerApp.prototype.buildResolverConfiguration = function () {
        return new ResolverConfigurationBuilder(this._configTree(), {
            configPath: this._configPath(),
            defaultModulePrefix: this.name,
            defaultModuleConfiguration: default_module_configuration_1.default
        });
    };
    GlimmerApp.prototype.cssTree = function () {
        var styles = this.trees.styles;
        if (styles) {
            var preprocessedCssTree = addonProcessTree(this.project, 'preprocessTree', 'css', styles);
            var compiledCssTree = preprocessCss(preprocessedCssTree, '/src/ui/styles', '/assets', {
                outputPaths: { 'app': this.outputPaths.app.css },
                registry: this.registry
            });
            return addonProcessTree(this.project, 'postprocessTree', 'css', compiledCssTree);
        }
    };
    GlimmerApp.prototype.publicTree = function () {
        var trees = [].concat(addonTreesFor(this.project, 'public'), this.trees.public).filter(Boolean);
        return new MergeTrees(trees, { overwrite: true });
    };
    GlimmerApp.prototype.htmlTree = function () {
        var srcTree = this.trees.src;
        var htmlName = this.outputPaths.app.html;
        var files = [
            'public/index.html'
        ];
        var index = new Funnel(srcTree, {
            files: files,
            getDestinationPath: function (relativePath) {
                if (relativePath === 'public/index.html') {
                    relativePath = htmlName;
                }
                return relativePath;
            },
            annotation: 'Funnel: index.html'
        });
        return new ConfigReplace(index, this._configTree(), {
            configPath: this._configPath(),
            files: [htmlName],
            patterns: this._configReplacePatterns()
        });
    };
    GlimmerApp.prototype.contentFor = function (config, match, type) {
        var content = [];
        switch (type) {
            case 'head':
                this._contentForHead(content, config);
                break;
        }
        content = this.project.addons.reduce(function (content, addon) {
            var addonContent = addon.contentFor ? addon.contentFor(type, config, content) : null;
            if (addonContent) {
                return content.concat(addonContent);
            }
            return content;
        }, content);
        return content.join('\n');
    };
    GlimmerApp.prototype._contentForHead = function (content, config) {
        if (this.options.storeConfigInMeta) {
            content.push('<meta name="' + config.modulePrefix + '/config/environment" ' +
                'content="' + encodeURIComponent(JSON.stringify(config)) + '" />');
        }
    };
    GlimmerApp.prototype._configPath = function () {
        return path.join('config', 'environments', this.env + '.json');
    };
    GlimmerApp.prototype._configTree = function () {
        if (this._cachedConfigTree) {
            return this._cachedConfigTree;
        }
        var configPath = this.project.configPath();
        var configTree = new ConfigLoader(path.dirname(configPath), {
            env: this.env,
            project: this.project
        });
        var namespacedConfigTree = new Funnel(configTree, {
            srcDir: '/',
            destDir: 'config',
            annotation: 'Funnel (config)'
        });
        this._cachedConfigTree = maybeDebug(namespacedConfigTree, 'config-tree');
        return this._cachedConfigTree;
    };
    GlimmerApp.prototype.maybePerformDeprecatedSass = function (appTree, missingPackagesForDeprecationMessage) {
        var stylesPath = path.join(resolveLocal(this.project.root, 'src'), 'ui', 'styles');
        if (fs.existsSync(stylesPath)) {
            var scssPath = path.join(stylesPath, 'app.scss');
            if (fs.existsSync(scssPath) && !this.project.findAddonByName('ember-cli-sass')) {
                missingPackagesForDeprecationMessage.push('ember install ember-cli-sass');
                var compileSass = require('broccoli-sass');
                var scssTree = compileSass([stylesPath], 'app.scss', this.outputPaths.app.css, {
                    annotation: 'Funnel: scss'
                });
                appTree = new Funnel(appTree, { exclude: ['**/*.scss'] });
                appTree = new MergeTrees([appTree, scssTree]);
            }
        }
        return appTree;
    };
    return GlimmerApp;
}(exports.AbstractBuild));
exports.default = GlimmerApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xpbW1lci1hcHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnbGltbWVyLWFwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7OztBQUNiLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3ZELElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3pELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzFDLElBQU0sSUFBSSxHQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUMsVUFBVSxDQUFDO0FBQ3RFLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxQyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUNuRCxJQUFNLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3hFLElBQU0sNEJBQTRCLEdBQUcsT0FBTyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7QUFDeEYsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDbEQsSUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQztBQUM3QyxJQUFNLFlBQVksR0FBRyxjQUFjLENBQUMsWUFBWSxDQUFDO0FBQ2pELElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBQ2pFLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQy9DLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3BELElB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LENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO29CQUM3RSxVQUFVLEVBQUUsY0FBYztpQkFDM0IsQ0FBQyxDQUFDO2dCQUVILE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzFELE9BQU8sR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFFLE9BQU8sRUFBRSxRQUFRLENBQUUsQ0FBQyxDQUFDO1lBQ2xELENBQUM7UUFDSCxDQUFDO1FBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBcmNELENBQXdDLHFCQUFhLEdBcWNwRCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbmNvbnN0IENvbmZpZ0xvYWRlciA9IHJlcXVpcmUoJ2Jyb2Njb2xpLWNvbmZpZy1sb2FkZXInKTtcbmNvbnN0IENvbmZpZ1JlcGxhY2UgPSByZXF1aXJlKCdicm9jY29saS1jb25maWctcmVwbGFjZScpO1xuY29uc3QgRnVubmVsID0gcmVxdWlyZSgnYnJvY2NvbGktZnVubmVsJyk7XG5jb25zdCBwYXRoICA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmNvbnN0IHR5cGVzY3JpcHQgPSByZXF1aXJlKCdicm9jY29saS10eXBlc2NyaXB0LWNvbXBpbGVyJykudHlwZXNjcmlwdDtcbmNvbnN0IGV4aXN0c1N5bmMgPSByZXF1aXJlKCdleGlzdHMtc3luYycpO1xuY29uc3QgTWVyZ2VUcmVlcyA9IHJlcXVpcmUoJ2Jyb2Njb2xpLW1lcmdlLXRyZWVzJyk7XG5jb25zdCBSZXNvbHV0aW9uTWFwQnVpbGRlciA9IHJlcXVpcmUoJ0BnbGltbWVyL3Jlc29sdXRpb24tbWFwLWJ1aWxkZXInKTtcbmNvbnN0IFJlc29sdmVyQ29uZmlndXJhdGlvbkJ1aWxkZXIgPSByZXF1aXJlKCdAZ2xpbW1lci9yZXNvbHZlci1jb25maWd1cmF0aW9uLWJ1aWxkZXInKTtcbmNvbnN0IEJyb2Njb2xpU291cmNlID0gcmVxdWlyZSgnYnJvY2NvbGktc291cmNlJyk7XG5jb25zdCBXYXRjaGVkRGlyID0gQnJvY2NvbGlTb3VyY2UuV2F0Y2hlZERpcjtcbmNvbnN0IFVud2F0Y2hlZERpciA9IEJyb2Njb2xpU291cmNlLlVud2F0Y2hlZERpcjtcbmNvbnN0IHAgPSByZXF1aXJlKCdlbWJlci1jbGktcHJlcHJvY2Vzcy1yZWdpc3RyeS9wcmVwcm9jZXNzb3JzJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJ2VtYmVyLWJ1aWxkLXV0aWxpdGllcycpO1xuY29uc3QgZGVmYXVsdHNEZWVwID0gcmVxdWlyZSgnbG9kYXNoLmRlZmF1bHRzZGVlcCcpO1xuY29uc3QgYWRkb25Qcm9jZXNzVHJlZSA9IHV0aWxzLmFkZG9uUHJvY2Vzc1RyZWU7XG5jb25zdCBHbGltbWVyVGVtcGxhdGVQcmVjb21waWxlciA9IHV0aWxzLkdsaW1tZXJUZW1wbGF0ZVByZWNvbXBpbGVyO1xuY29uc3QgcmVzb2x2ZUxvY2FsID0gdXRpbHMucmVzb2x2ZUxvY2FsO1xuY29uc3Qgc2V0dXBSZWdpc3RyeSA9IHAuc2V0dXBSZWdpc3RyeTtcbmNvbnN0IGRlZmF1bHRSZWdpc3RyeSA9IHAuZGVmYXVsdFJlZ2lzdHJ5O1xuY29uc3QgcHJlcHJvY2Vzc0pzID0gcC5wcmVwcm9jZXNzSnM7XG5jb25zdCBwcmVwcm9jZXNzQ3NzID0gcC5wcmVwcm9jZXNzQ3NzO1xuY29uc3Qgd3JpdGVGaWxlID0gcmVxdWlyZSgnYnJvY2NvbGktZmlsZS1jcmVhdG9yJyk7XG5jb25zdCBkZWJ1Z1RyZWU6IChpbnB1dFRyZWU6IFRyZWUsIG5hbWU6IHN0cmluZykgPT4gVHJlZSA9IHJlcXVpcmUoJ2Jyb2Njb2xpLWRlYnVnJykuYnVpbGREZWJ1Z0NhbGxiYWNrKCdnbGltbWVyLWFwcCcpO1xuXG5pbXBvcnQgUm9sbHVwV2l0aERlcGVuZGVuY2llcyBmcm9tICcuL3JvbGx1cC13aXRoLWRlcGVuZGVuY2llcyc7XG5pbXBvcnQgZGVmYXVsdE1vZHVsZUNvbmZpZ3VyYXRpb24gZnJvbSAnLi9kZWZhdWx0LW1vZHVsZS1jb25maWd1cmF0aW9uJztcbmltcG9ydCB7IFByb2plY3QsIEFkZG9uLCBUcmVlLCBSb2xsdXBPcHRpb25zLCBSZWdpc3RyeSwgR2xpbW1lckFwcE9wdGlvbnMgfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcbmltcG9ydCBUZXN0RW50cnlwb2ludEJ1aWxkZXIgZnJvbSAnLi90ZXN0LWVudHJ5cG9pbnQtYnVpbGRlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWJzdHJhY3RCdWlsZCB7XG4gIF9ub3RpZnlBZGRvbkluY2x1ZGVkKCk6IHZvaWQ7XG4gIHBhY2thZ2UoanNUcmVlOiBUcmVlLCBjc3NUcmVlOiBUcmVlLCBwdWJsaWNUcmVlOiBUcmVlLCBodG1sVHJlZTogVHJlZSk6IFRyZWU7XG59XG5cbmV4cG9ydCBjb25zdCBBYnN0cmFjdEJ1aWxkOiB7IG5ldyhkZWZhdWx0czogRW1iZXJDTElEZWZhdWx0cywgb3B0aW9uczoge30pOiBBYnN0cmFjdEJ1aWxkIH0gPSB1dGlscy5BYnN0cmFjdEJ1aWxkO1xuXG5mdW5jdGlvbiBtYXliZURlYnVnKGlucHV0VHJlZTogVHJlZSB8IG51bGwsIG5hbWU6IHN0cmluZyk6IFRyZWUgfCBudWxsIHtcbiAgaWYgKCFwcm9jZXNzLmVudi5HTElNTUVSX0JVSUxEX0RFQlVHKSB7XG4gICAgcmV0dXJuIGlucHV0VHJlZTtcbiAgfVxuXG4gIC8vIHByZXNlcnZlIGBudWxsYCB0cmVlc1xuICBpZiAoIWlucHV0VHJlZSkge1xuICAgIHJldHVybiBpbnB1dFRyZWU7XG4gIH1cblxuICByZXR1cm4gZGVidWdUcmVlKGlucHV0VHJlZSBhcyBUcmVlLCBuYW1lKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVHJlZUZvclR5cGUocmF3VHJlZTogVHJlZSB8IHN0cmluZywgcm9vdDogc3RyaW5nLCBkZWZhdWx0UGF0aDogc3RyaW5nKTogVHJlZSB7XG4gIGxldCB0cmVlO1xuICBpZiAodHlwZW9mIHJhd1RyZWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdHJlZSA9IG5ldyBXYXRjaGVkRGlyKHJlc29sdmVMb2NhbChyb290LCByYXdUcmVlKSk7XG4gIH0gZWxzZSBpZiAoIXJhd1RyZWUpIHtcbiAgICBsZXQgcGF0aCA9IHJlc29sdmVMb2NhbChyb290LCBkZWZhdWx0UGF0aCk7XG4gICAgdHJlZSA9IGV4aXN0c1N5bmMocGF0aCkgPyBuZXcgV2F0Y2hlZERpcihwYXRoKSA6IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgdHJlZSA9IHJhd1RyZWU7XG4gIH1cblxuICByZXR1cm4gdHJlZTtcbn1cblxuZnVuY3Rpb24gYWRkb25UcmVlc0Zvcihwcm9qZWN0OiBQcm9qZWN0LCB0eXBlOiBzdHJpbmcpOiBUcmVlW10ge1xuICByZXR1cm4gcHJvamVjdC5hZGRvbnMucmVkdWNlKChzdW0sIGFkZG9uKSA9PiB7XG4gICAgaWYgKGFkZG9uLnRyZWVGb3IpIHtcbiAgICAgIGxldCB2YWwgPSBhZGRvbi50cmVlRm9yKHR5cGUpO1xuICAgICAgaWYgKHZhbCkgeyBzdW0ucHVzaCh2YWwpOyB9XG4gICAgfVxuICAgIHJldHVybiBzdW07XG4gIH0sIFtdKTtcbn1cblxuY29uc3QgREVGQVVMVF9UU19PUFRJT05TID0ge1xuICB0c2NvbmZpZzoge1xuICAgIGNvbXBpbGVyT3B0aW9uczoge1xuICAgICAgdGFyZ2V0OiBcImVzNVwiLFxuICAgICAgbW9kdWxlOiBcImVzMjAxNVwiLFxuICAgICAgaW5saW5lU291cmNlTWFwOiB0cnVlLFxuICAgICAgaW5saW5lU291cmNlczogdHJ1ZSxcbiAgICAgIG1vZHVsZVJlc29sdXRpb246IFwibm9kZVwiXG4gICAgfSxcbiAgICBleGNsdWRlOiBbXG4gICAgICAnbm9kZV9tb2R1bGVzJyxcbiAgICAgICcqKi8qLmQudHMnXG4gICAgXVxuICB9XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIEFic3RyYWN0QnVpbGQge1xuICBfbm90aWZ5QWRkb25JbmNsdWRlZCgpOiB2b2lkO1xuICBwYWNrYWdlKGpzVHJlZTogVHJlZSwgY3NzVHJlZTogVHJlZSwgcHVibGljVHJlZTogVHJlZSwgaHRtbFRyZWU6IFRyZWUpOiBUcmVlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE91dHB1dFBhdGhzIHtcbiAgYXBwOiB7XG4gICAgaHRtbDogc3RyaW5nO1xuICAgIGpzOiBzdHJpbmc7XG4gICAgY3NzOiBzdHJpbmc7XG4gIH1cbn1cbmV4cG9ydCBpbnRlcmZhY2UgRW1iZXJDTElEZWZhdWx0cyB7XG4gIHByb2plY3Q6IFByb2plY3Rcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcmVlcyB7XG4gIHNyYzogVHJlZSB8IG51bGw7XG4gIHN0eWxlczogVHJlZSB8IG51bGw7XG4gIHB1YmxpYzogVHJlZSB8IG51bGw7XG4gIG5vZGVNb2R1bGVzOiBUcmVlIHwgbnVsbDtcbn1cblxuLyoqXG4gKiBHbGltbWVyQXBwIHByb3ZpZGVzIGFuIGludGVyZmFjZSB0byBhIHBhY2thZ2UgKGFwcCwgZW5naW5lLCBvciBhZGRvbilcbiAqIGNvbXBhdGlibGUgd2l0aCB0aGUgbW9kdWxlIHVuaWZpY2F0aW9uIGxheW91dC5cbiAqXG4gKiBAY2xhc3MgR2xpbW1lckFwcFxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gW2RlZmF1bHRzXVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPU9wdGlvbnNdIENvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHbGltbWVyQXBwIGV4dGVuZHMgQWJzdHJhY3RCdWlsZCB7XG4gIHB1YmxpYyBwcm9qZWN0OiBQcm9qZWN0O1xuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICBwdWJsaWMgZW52OiAncHJvZHVjdGlvbicgfCAnZGV2ZWxvcG1lbnQnIHwgJ3Rlc3QnO1xuICBwcml2YXRlIHJlZ2lzdHJ5OiBSZWdpc3RyeTtcbiAgcHJpdmF0ZSBvdXRwdXRQYXRoczogT3V0cHV0UGF0aHM7XG4gIHByaXZhdGUgcm9sbHVwT3B0aW9uczogUm9sbHVwT3B0aW9ucztcbiAgcHJvdGVjdGVkIG9wdGlvbnM6IEdsaW1tZXJBcHBPcHRpb25zO1xuXG4gIHByb3RlY3RlZCB0cmVlczogVHJlZXM7XG5cbiAgY29uc3RydWN0b3IodXBzdHJlYW1EZWZhdWx0czogRW1iZXJDTElEZWZhdWx0cywgb3B0aW9uczogR2xpbW1lckFwcE9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBtaXNzaW5nUHJvamVjdE1lc3NhZ2UgPSAnWW91IG11c3QgcGFzcyB0aHJvdWdoIHRoZSBkZWZhdWx0IGFyZ3VtZW50cyBwYXNzZWQgaW50byB5b3VyIGVtYmVyLWNsaS1idWlsZC5qcyBmaWxlIHdoZW4gY29uc3RydWN0aW5nIGEgbmV3IEdsaW1tZXJBcHAnO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWlzc2luZ1Byb2plY3RNZXNzYWdlKTtcbiAgICB9XG5cbiAgICBpZiAoIXVwc3RyZWFtRGVmYXVsdHMucHJvamVjdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1pc3NpbmdQcm9qZWN0TWVzc2FnZSk7XG4gICAgfVxuXG4gICAgbGV0IGlzUHJvZHVjdGlvbiA9IHByb2Nlc3MuZW52LkVNQkVSX0VOViA9PT0gJ3Byb2R1Y3Rpb24nO1xuXG4gICAgbGV0IGRlZmF1bHRzID0gZGVmYXVsdHNEZWVwKHt9LCB7XG4gICAgICBhZGRvbnM6IHtcbiAgICAgICAgd2hpdGVsaXN0OiBudWxsIGFzIHN0cmluZ1tdIHwgbnVsbCxcbiAgICAgICAgYmxhY2tsaXN0OiBudWxsIGFzIHN0cmluZ1tdIHwgbnVsbCxcbiAgICAgIH0sXG4gICAgICBvdXRwdXRQYXRoczoge1xuICAgICAgICBhcHA6IHtcbiAgICAgICAgICBodG1sOiAnaW5kZXguaHRtbCcsXG4gICAgICAgICAganM6ICdhcHAuanMnLFxuICAgICAgICAgIGNzczogJ2FwcC5jc3MnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICByb2xsdXA6IHsgfSxcbiAgICAgIG1pbmlmeUpTOiB7XG4gICAgICAgIGVuYWJsZWQ6IGlzUHJvZHVjdGlvbixcblxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgYWR2ZXJzZWx5IGFmZmVjdHMgaGV1cmlzdGljcyBmb3IgSUlGRSBldmFsXG4gICAgICAgICAgICBuZWdhdGVfaWlmZTogZmFsc2UsXG4gICAgICAgICAgICAvLyBsaW1pdCBzZXF1ZW5jZXMgYmVjYXVzZSBvZiBtZW1vcnkgaXNzdWVzIGR1cmluZyBwYXJzaW5nXG4gICAgICAgICAgICBzZXF1ZW5jZXM6IDMwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgIC8vIG5vIGRpZmZlcmVuY2UgaW4gc2l6ZSBhbmQgbXVjaCBlYXNpZXIgdG8gZGVidWdcbiAgICAgICAgICAgIHNlbWljb2xvbnM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc291cmNlbWFwczoge1xuICAgICAgICBlbmFibGVkOiAhaXNQcm9kdWN0aW9uXG4gICAgICB9LFxuICAgICAgc3RvcmVDb25maWdJbk1ldGE6IG51bGxcbiAgICB9LCB1cHN0cmVhbURlZmF1bHRzKTtcblxuICAgIHN1cGVyKGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMucmVnaXN0cnkgPSBvcHRpb25zLnJlZ2lzdHJ5IHx8IGRlZmF1bHRSZWdpc3RyeSh0aGlzKTtcblxuICAgIHRoaXMuZW52ID0gcHJvY2Vzcy5lbnYuRU1CRVJfRU5WIHx8ICdkZXZlbG9wbWVudCc7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5wcm9qZWN0Lm5hbWUoKTtcblxuICAgIHRoaXMucm9sbHVwT3B0aW9ucyA9IG9wdGlvbnMucm9sbHVwO1xuXG4gICAgc2V0dXBSZWdpc3RyeSh0aGlzKTtcblxuICAgIHRoaXMudHJlZXMgPSB0aGlzLmJ1aWxkVHJlZXMob3B0aW9ucyk7XG4gICAgdGhpcy5vdXRwdXRQYXRocyA9IG9wdGlvbnMub3V0cHV0UGF0aHMgYXMgT3V0cHV0UGF0aHM7XG5cbiAgICB0aGlzWydfbm90aWZ5QWRkb25JbmNsdWRlZCddKCk7XG4gIH1cblxuICBwdWJsaWMgaW1wb3J0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignYXBwLmltcG9ydCBpcyBub3QgeWV0IGltcGxlbWVudGVkIGZvciBHbGltbWVyQXBwJyk7XG4gIH1cblxuICBwcml2YXRlIF9jb25maWdSZXBsYWNlUGF0dGVybnMoKSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICBtYXRjaDogL1xce1xce3Jvb3RVUkxcXH1cXH0vZyxcbiAgICAgIHJlcGxhY2VtZW50OiAoY29uZmlnKSA9PiBjb25maWcucm9vdFVSTCB8fCAnJyxcbiAgICB9LCB7XG4gICAgICBtYXRjaDogL1xce1xce2NvbnRlbnQtZm9yIFsnXCJdKC4rKVtcIiddXFx9XFx9L2csXG4gICAgICByZXBsYWNlbWVudDogdGhpcy5jb250ZW50Rm9yLmJpbmQodGhpcylcbiAgICB9XTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRUcmVlcyhvcHRpb25zOiBHbGltbWVyQXBwT3B0aW9ucyk6IFRyZWVzIHtcbiAgICBsZXQgeyBwcm9qZWN0OiB7IHJvb3QgfSB9ID0gdGhpcztcblxuICAgIGxldCByYXdTcmNUcmVlID0gb3B0aW9ucy50cmVlcyAmJiBvcHRpb25zLnRyZWVzLnNyYztcbiAgICBsZXQgc3JjVHJlZTogVHJlZSB8IG51bGwgPSBub3JtYWxpemVUcmVlRm9yVHlwZShyYXdTcmNUcmVlLCByb290LCAnc3JjJyk7XG5cbiAgICBpZiAoc3JjVHJlZSkge1xuICAgICAgc3JjVHJlZSA9IG5ldyBGdW5uZWwoc3JjVHJlZSwge1xuICAgICAgICBkZXN0RGlyOiAnc3JjJ1xuICAgICAgfSk7XG5cbiAgICAgIHNyY1RyZWUgPSBhZGRvblByb2Nlc3NUcmVlKHRoaXMucHJvamVjdCwgJ3ByZXByb2Nlc3NUcmVlJywgJ3NyYycsIHNyY1RyZWUpO1xuICAgIH1cblxuICAgIGxldCByYXdTdHlsZXNUcmVlID0gb3B0aW9ucy50cmVlcyAmJiBvcHRpb25zLnRyZWVzLnN0eWxlcztcbiAgICBsZXQgc3R5bGVzVHJlZTogVHJlZSB8IG51bGwgPSBub3JtYWxpemVUcmVlRm9yVHlwZShyYXdTdHlsZXNUcmVlLCByb290LCBwYXRoLmpvaW4oJ3NyYycsICd1aScsICdzdHlsZXMnKSk7XG5cbiAgICBpZiAoc3R5bGVzVHJlZSkge1xuICAgICAgc3R5bGVzVHJlZSA9IG5ldyBGdW5uZWwoc3R5bGVzVHJlZSwgeyBkZXN0RGlyOiAnL3NyYy91aS9zdHlsZXMnIH0pO1xuICAgIH1cblxuICAgIGxldCByYXdQdWJsaWNUcmVlID0gb3B0aW9ucy50cmVlcyAmJiBvcHRpb25zLnRyZWVzLnB1YmxpYztcbiAgICBsZXQgcHVibGljVHJlZTogVHJlZSB8IG51bGwgPSBub3JtYWxpemVUcmVlRm9yVHlwZShyYXdQdWJsaWNUcmVlLCByb290LCAncHVibGljJyk7XG5cbiAgICBsZXQgbm9kZU1vZHVsZXNUcmVlID0gb3B0aW9ucy50cmVlcyAmJiBvcHRpb25zLnRyZWVzLm5vZGVNb2R1bGVzIHx8IG5ldyBVbndhdGNoZWREaXIocmVzb2x2ZUxvY2FsKHJvb3QsICdub2RlX21vZHVsZXMnKSk7XG5cbiAgICBpZiAobm9kZU1vZHVsZXNUcmVlKSB7XG4gICAgICBub2RlTW9kdWxlc1RyZWUgPSBuZXcgRnVubmVsKG5vZGVNb2R1bGVzVHJlZSwge1xuICAgICAgICBkZXN0RGlyOiAnbm9kZV9tb2R1bGVzLydcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzcmM6IG1heWJlRGVidWcoc3JjVHJlZSwgJ3NyYycpLFxuICAgICAgc3R5bGVzOiBtYXliZURlYnVnKHN0eWxlc1RyZWUsICdzdHlsZXMnKSxcbiAgICAgIHB1YmxpYzogbWF5YmVEZWJ1ZyhwdWJsaWNUcmVlLCAncHVibGljJyksXG4gICAgICBub2RlTW9kdWxlczogbm9kZU1vZHVsZXNUcmVlXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0c09wdGlvbnMoKSB7XG4gICAgbGV0IHRzY29uZmlnUGF0aCA9IHJlc29sdmVMb2NhbCh0aGlzLnByb2plY3Qucm9vdCwgJ3RzY29uZmlnLmpzb24nKTtcbiAgICBsZXQgdHNjb25maWc7XG5cbiAgICBpZiAoZXhpc3RzU3luYyh0c2NvbmZpZ1BhdGgpKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0c2NvbmZpZyA9IHJlcXVpcmUodHNjb25maWdQYXRoKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIHJlYWRpbmcgZnJvbSB0c2NvbmZpZy5qc29uXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcIk5vIHRzY29uZmlnLmpzb24gZm91bmQ7IGZhbGxpbmcgYmFjayB0byBkZWZhdWx0IFR5cGVTY3JpcHQgc2V0dGluZ3MuXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB0c2NvbmZpZyA/IHsgdHNjb25maWcgfSA6IERFRkFVTFRfVFNfT1BUSU9OUztcbiAgfVxuXG4gIHByaXZhdGUgamF2YXNjcmlwdCgpIHtcbiAgICBsZXQgeyBzcmMsIG5vZGVNb2R1bGVzIH0gPSB0aGlzLnRyZWVzO1xuICAgIGxldCB0c0NvbmZpZyA9IHRoaXMudHNPcHRpb25zKCk7XG4gICAgbGV0IGdsaW1tZXJFbnYgPSB0aGlzLmdldEdsaW1tZXJFbnZpcm9ubWVudCgpO1xuICAgIGxldCBjb25maWdUcmVlID0gdGhpcy5idWlsZENvbmZpZ1RyZWUoc3JjKTtcbiAgICBsZXQgc3JjV2l0aG91dEhCU1RyZWUgPSBuZXcgRnVubmVsKHNyYywge1xuICAgICAgZXhjbHVkZTogWycqKi8qLmhicycsICcqKi8qLnRzJ11cbiAgICB9KTtcblxuICAgIC8vIENvbXBpbGUgdGhlIFR5cGVTY3JpcHQgYW5kIEhhbmRsZWJhcnMgZmlsZXMgaW50byBKYXZhU2NyaXB0XG4gICAgbGV0IGNvbXBpbGVkSGFuZGxlYmFyc1RyZWUgPSB0aGlzLmNvbXBpbGVkSGFuZGxlYmFyc1RyZWUoc3JjLCBnbGltbWVyRW52KTtcbiAgICBsZXQgY29tYmluZWRDb25maWdBbmRDb21waWxlZEhhbmRsZWJhcnNUcmVlID0gbmV3IE1lcmdlVHJlZXMoW2NvbmZpZ1RyZWUsIGNvbXBpbGVkSGFuZGxlYmFyc1RyZWVdKTtcblxuICAgIC8vIHRoZSBvdXRwdXQgdHJlZSBmcm9tIHR5cGVzY3JpcHQgb25seSBpbmNsdWRlcyB0aGUgb3V0cHV0IGZyb20gLnRzIC0+IC5qcyB0cmFuc3BpbGF0aW9uXG4gICAgLy8gYW5kIG5vIG90aGVyIGZpbGVzIGZyb20gdGhlIG9yaWdpbmFsIHNvdXJjZSB0cmVlXG4gICAgbGV0IHRyYW5zcGlsZWRUeXBlc2NyaXB0VHJlZSA9IHRoaXMuY29tcGlsZWRUeXBlU2NyaXB0VHJlZShjb21iaW5lZENvbmZpZ0FuZENvbXBpbGVkSGFuZGxlYmFyc1RyZWUsIG5vZGVNb2R1bGVzLCB0c0NvbmZpZyk7XG5cbiAgICBsZXQgdHJlZXMgPSBbc3JjV2l0aG91dEhCU1RyZWUsIHRyYW5zcGlsZWRUeXBlc2NyaXB0VHJlZSwgY29uZmlnVHJlZV07XG4gICAgaWYgKHRoaXMuZW52ID09PSAndGVzdCcpIHtcbiAgICAgIHRyZWVzLnB1c2gobmV3IFRlc3RFbnRyeXBvaW50QnVpbGRlcih0cmFuc3BpbGVkVHlwZXNjcmlwdFRyZWUpKTtcbiAgICB9XG5cbiAgICAvLyBNZXJnZSB0aGUgSmF2YVNjcmlwdCBzb3VyY2UgYW5kIGdlbmVyYXRlZCBtb2R1bGUgbWFwIGFuZCByZXNvbHZlclxuICAgIC8vIGNvbmZpZ3VyYXRpb24gZmlsZXMgdG9nZXRoZXIsIG1ha2luZyBzdXJlIHRvIG92ZXJ3cml0ZSB0aGUgc3R1YlxuICAgIC8vIG1vZHVsZS1tYXAuanMgYW5kIHJlc29sdmVyLWNvbmZpZ3VyYXRpb24uanMgaW4gdGhlIHNvdXJjZSB0cmVlIHdpdGggdGhlXG4gICAgLy8gZ2VuZXJhdGVkIG9uZXMuXG4gICAgdHJhbnNwaWxlZFR5cGVzY3JpcHRUcmVlID0gbmV3IE1lcmdlVHJlZXModHJlZXMsIHsgb3ZlcndyaXRlOiB0cnVlIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMucHJvY2Vzc0VTTGFzdGVzdCh0cmFuc3BpbGVkVHlwZXNjcmlwdFRyZWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcm9jZXNzRVNMYXN0ZXN0KHRyZWU6IFRyZWUpOiBUcmVlIHtcbiAgICByZXR1cm4gcHJlcHJvY2Vzc0pzKHRyZWUsICcvJywgdGhpcy5uYW1lLCB7XG4gICAgICByZWdpc3RyeTogdGhpcy5yZWdpc3RyeVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHBhY2thZ2UoanNUcmVlLCBjc3NUcmVlLCBwdWJsaWNUcmVlLCBodG1sVHJlZSk6IFRyZWUge1xuICAgIGxldCBtaXNzaW5nUGFja2FnZXMgPSBbXTtcbiAgICBqc1RyZWUgPSB0aGlzLnJvbGx1cFRyZWUoanNUcmVlKTtcbiAgICBsZXQgdHJlZXMgPSBbanNUcmVlLCBodG1sVHJlZV07XG4gICAgaWYgKGNzc1RyZWUpIHtcbiAgICAgIHRyZWVzLnB1c2goY3NzVHJlZSk7XG4gICAgfVxuICAgIGlmIChwdWJsaWNUcmVlKSB7XG4gICAgICB0cmVlcy5wdXNoKHB1YmxpY1RyZWUpO1xuICAgIH1cblxuICAgIGxldCBhcHBUcmVlID0gbmV3IE1lcmdlVHJlZXModHJlZXMpO1xuXG4gICAgYXBwVHJlZSA9IHRoaXMubWF5YmVQZXJmb3JtRGVwcmVjYXRlZFNhc3MoYXBwVHJlZSwgbWlzc2luZ1BhY2thZ2VzKTtcblxuICAgIGlmIChtaXNzaW5nUGFja2FnZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5wcm9qZWN0LnVpLndyaXRlV2FybkxpbmUoXG5gVGhpcyBwcm9qZWN0IGlzIHJlbHlpbmcgb24gYmVoYXZpb3JzIHByb3ZpZGVkIGJ5IEBnbGltbWVyL2FwcGxpY2F0aW9uLXBpcGVsaW5lIHRoYXQgd2lsbCBiZSByZW1vdmVkIGluIGZ1dHVyZSB2ZXJzaW9ucy4gVGhlIHVuZGVybHlpbmcgZnVuY3Rpb25hbGl0eSBoYXMgbm93IGJlZW4gbWlncmF0ZWQgdG8gYmUgcGVyZm9ybWVkIGJ5IGFkZG9ucyBpbiB5b3VyIHByb2plY3QuXG5cblBsZWFzZSBydW4gdGhlIGZvbGxvd2luZyB0byByZXNvbHZlIHRoaXMgd2FybmluZzpcblxuICAke21pc3NpbmdQYWNrYWdlcy5qb2luKCdcXG4gICcpfWApO1xuICAgIH1cblxuICAgIGFwcFRyZWUgPSBhZGRvblByb2Nlc3NUcmVlKHRoaXMucHJvamVjdCwgJ3Bvc3Rwcm9jZXNzVHJlZScsICdhbGwnLCBhcHBUcmVlKTtcbiAgICByZXR1cm4gYXBwVHJlZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRHbGltbWVyRW52aXJvbm1lbnQoKTogYW55IHtcbiAgICBsZXQgY29uZmlnID0gdGhpcy5wcm9qZWN0LmNvbmZpZyh0aGlzLnByb2plY3QuZW52KTtcblxuICAgIHJldHVybiBjb25maWcuR2xpbW1lckVOViB8fCBjb25maWcuRW1iZXJFTlY7XG4gIH1cblxuICBwcml2YXRlIHRlc3RQYWNrYWdlKCk6IFRyZWUge1xuICAgIHJldHVybiB0aGlzLnJvbGx1cFRyZWUodGhpcy5qYXZhc2NyaXB0KCksIHtcbiAgICAgIGVudHJ5OiAnc3JjL3V0aWxzL3Rlc3QtaGVscGVycy90ZXN0LWhlbHBlci5qcycsXG4gICAgICBkZXN0OiAnaW5kZXguanMnXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIEJyb2Njb2xpIHRyZWUgcmVwcmVzZW50aW5nIHRoZSBjb21waWxlZCBHbGltbWVyIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgKi9cbiAgcHVibGljIHRvVHJlZSgpIHtcbiAgICBpZiAodGhpcy5lbnYgPT09ICd0ZXN0Jykge1xuICAgICAgcmV0dXJuIHRoaXMudGVzdFBhY2thZ2UoKTtcbiAgICB9XG5cbiAgICBsZXQganNUcmVlID0gdGhpcy5qYXZhc2NyaXB0KCk7XG4gICAgbGV0IGNzc1RyZWUgPSB0aGlzLmNzc1RyZWUoKTtcbiAgICBsZXQgcHVibGljVHJlZSA9IHRoaXMucHVibGljVHJlZSgpO1xuICAgIGxldCBodG1sVHJlZSA9IHRoaXMuaHRtbFRyZWUoKTtcblxuICAgIHJldHVybiB0aGlzLnBhY2thZ2UoanNUcmVlLCBjc3NUcmVlLCBwdWJsaWNUcmVlLCBodG1sVHJlZSk7XG4gIH1cblxuICBwcml2YXRlIGNvbXBpbGVkVHlwZVNjcmlwdFRyZWUoc3JjVHJlZTogVHJlZSwgbm9kZU1vZHVsZXNUcmVlOiBUcmVlLCB0c0NvbmZpZzoge30pOiBUcmVlIHtcbiAgICBsZXQgaW5wdXRUcmVlcyA9IG5ldyBNZXJnZVRyZWVzKFtub2RlTW9kdWxlc1RyZWUsIHNyY1RyZWVdKTtcblxuICAgIGxldCBjb21waWxlZFR5cGVTY3JpcHRUcmVlID0gdHlwZXNjcmlwdChpbnB1dFRyZWVzLCB0c0NvbmZpZyk7XG5cbiAgICByZXR1cm4gbWF5YmVEZWJ1Zyhjb21waWxlZFR5cGVTY3JpcHRUcmVlLCAndHlwZXNjcmlwdC1vdXRwdXQnKTtcbiAgfVxuXG4gIHByaXZhdGUgY29tcGlsZWRIYW5kbGViYXJzVHJlZShzcmNUcmVlLCBnbGltbWVyRW52KSB7XG4gICAgbGV0IGNvbXBpbGVkSGFuZGxlYmFyc1RyZWUgPSBuZXcgR2xpbW1lclRlbXBsYXRlUHJlY29tcGlsZXIoc3JjVHJlZSwge1xuICAgICAgcm9vdE5hbWU6IHRoaXMucHJvamVjdC5wa2cubmFtZSxcbiAgICAgIEdsaW1tZXJFTlY6IGdsaW1tZXJFbnZcbiAgICB9KTtcblxuICAgIHJldHVybiBtYXliZURlYnVnKGNvbXBpbGVkSGFuZGxlYmFyc1RyZWUsICdoYW5kbGViYXJzLW91dHB1dCcpO1xuICB9XG5cbiAgcHJpdmF0ZSByb2xsdXBUcmVlKGpzVHJlZSwgb3B0aW9ucz8pIHtcbiAgICBsZXQgcm9sbHVwT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucm9sbHVwT3B0aW9ucywge1xuICAgICAgZm9ybWF0OiAndW1kJyxcbiAgICAgIGVudHJ5OiAnc3JjL2luZGV4LmpzJyxcbiAgICAgIGRlc3Q6IHRoaXMub3V0cHV0UGF0aHMuYXBwLmpzLFxuICAgICAgc291cmNlTWFwOiB0aGlzLm9wdGlvbnMuc291cmNlbWFwcy5lbmFibGVkXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4gbmV3IFJvbGx1cFdpdGhEZXBlbmRlbmNpZXMobWF5YmVEZWJ1Zyhqc1RyZWUsICdyb2xsdXAtaW5wdXQtdHJlZScpLCB7XG4gICAgICBpbnB1dEZpbGVzOiBbJyoqLyouanMnXSxcbiAgICAgIHJvbGx1cDogcm9sbHVwT3B0aW9ucyxcbiAgICAgIHByb2plY3Q6IHRoaXMucHJvamVjdCxcbiAgICAgIGJ1aWxkQ29uZmlnOiB0aGlzLm9wdGlvbnNcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRDb25maWdUcmVlKHBvc3RUcmFuc3BpbGVkU3JjKSB7XG4gICAgLy8gQnVpbGQgdGhlIGZpbGUgdGhhdCBtYXBzIGluZGl2aWR1YWwgbW9kdWxlcyBvbnRvIHRoZSByZXNvbHZlcidzIHNwZWNpZmllclxuICAgIC8vIGtleXMuXG4gICAgY29uc3QgbW9kdWxlTWFwID0gdGhpcy5idWlsZFJlc29sdXRpb25NYXAocG9zdFRyYW5zcGlsZWRTcmMpO1xuXG4gICAgLy8gQnVpbGQgdGhlIHJlc29sdmVyIGNvbmZpZ3VyYXRpb24gZmlsZS5cbiAgICBjb25zdCByZXNvbHZlckNvbmZpZ3VyYXRpb24gPSB0aGlzLmJ1aWxkUmVzb2x2ZXJDb25maWd1cmF0aW9uKCk7XG5cbiAgICBsZXQgY29uZmlnRW52aXJvbm1lbnQ7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zdG9yZUNvbmZpZ0luTWV0YSA9PT0gdHJ1ZSkge1xuICAgICAgY29uZmlnRW52aXJvbm1lbnQgPSBuZXcgTWVyZ2VUcmVlcyhbXG4gICAgICAgIHdyaXRlRmlsZSgnY29uZmlnL2Vudmlyb25tZW50LmpzJywgYFxuICAgICAgICAgIHZhciBjb25maWc7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBtZXRhTmFtZSA9ICcke3RoaXMubmFtZX0vY29uZmlnL2Vudmlyb25tZW50JztcbiAgICAgICAgICAgIHZhciByYXdDb25maWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCInICsgbWV0YU5hbWUgKyAnXCJdJykuZ2V0QXR0cmlidXRlKCdjb250ZW50Jyk7XG4gICAgICAgICAgICBjb25maWcgPSBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudChyYXdDb25maWcpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCByZWFkIGNvbmZpZyBmcm9tIG1ldGEgdGFnIHdpdGggbmFtZSBcIicgKyBtZXRhTmFtZSArICdcIi4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBleHBvcnQgZGVmYXVsdCBjb25maWc7XG4gICAgICAgIGApLFxuICAgICAgICB3cml0ZUZpbGUoJ2NvbmZpZy9lbnZpcm9ubWVudC5kLnRzJywgYGRlY2xhcmUgbGV0IGNvbmZpZzogYW55OyBleHBvcnQgZGVmYXVsdCBjb25maWc7YClcbiAgICAgIF0pO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbmZpZ1RyZWUgPSB0aGlzLl9jb25maWdUcmVlKCk7XG5cbiAgICByZXR1cm4gZGVidWdUcmVlKG5ldyBNZXJnZVRyZWVzKFttb2R1bGVNYXAsIHJlc29sdmVyQ29uZmlndXJhdGlvbiwgY29uZmlnRW52aXJvbm1lbnQsIGNvbmZpZ1RyZWVdLmZpbHRlcihCb29sZWFuKSksICdjb25maWc6b3V0cHV0Jyk7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkUmVzb2x1dGlvbk1hcChzcmMpIHtcbiAgICByZXR1cm4gbmV3IFJlc29sdXRpb25NYXBCdWlsZGVyKHNyYywgdGhpcy5fY29uZmlnVHJlZSgpLCB7XG4gICAgICBzcmNEaXI6ICdzcmMnLFxuICAgICAgY29uZmlnUGF0aDogdGhpcy5fY29uZmlnUGF0aCgpLFxuICAgICAgZGVmYXVsdE1vZHVsZVByZWZpeDogdGhpcy5uYW1lLFxuICAgICAgZGVmYXVsdE1vZHVsZUNvbmZpZ3VyYXRpb25cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRSZXNvbHZlckNvbmZpZ3VyYXRpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNvbHZlckNvbmZpZ3VyYXRpb25CdWlsZGVyKHRoaXMuX2NvbmZpZ1RyZWUoKSwge1xuICAgICAgY29uZmlnUGF0aDogdGhpcy5fY29uZmlnUGF0aCgpLFxuICAgICAgZGVmYXVsdE1vZHVsZVByZWZpeDogdGhpcy5uYW1lLFxuICAgICAgZGVmYXVsdE1vZHVsZUNvbmZpZ3VyYXRpb25cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY3NzVHJlZSgpOiBUcmVlIHtcbiAgICBsZXQgeyBzdHlsZXMgfSA9IHRoaXMudHJlZXM7XG5cbiAgICBpZiAoc3R5bGVzKSB7XG4gICAgICBsZXQgcHJlcHJvY2Vzc2VkQ3NzVHJlZSA9IGFkZG9uUHJvY2Vzc1RyZWUodGhpcy5wcm9qZWN0LCAncHJlcHJvY2Vzc1RyZWUnLCAnY3NzJywgc3R5bGVzKTtcblxuICAgICAgbGV0IGNvbXBpbGVkQ3NzVHJlZSA9IHByZXByb2Nlc3NDc3MocHJlcHJvY2Vzc2VkQ3NzVHJlZSwgJy9zcmMvdWkvc3R5bGVzJywgJy9hc3NldHMnLCB7XG4gICAgICAgIG91dHB1dFBhdGhzOiB7ICdhcHAnOiB0aGlzLm91dHB1dFBhdGhzLmFwcC5jc3MgfSxcbiAgICAgICAgcmVnaXN0cnk6IHRoaXMucmVnaXN0cnlcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gYWRkb25Qcm9jZXNzVHJlZSh0aGlzLnByb2plY3QsICdwb3N0cHJvY2Vzc1RyZWUnLCAnY3NzJywgY29tcGlsZWRDc3NUcmVlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHB1YmxpY1RyZWUoKSB7XG4gICAgbGV0IHRyZWVzID0gW10uY29uY2F0KFxuICAgICAgYWRkb25UcmVlc0Zvcih0aGlzLnByb2plY3QsICdwdWJsaWMnKSxcbiAgICAgIHRoaXMudHJlZXMucHVibGljLFxuICAgICkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIG5ldyBNZXJnZVRyZWVzKHRyZWVzLCB7IG92ZXJ3cml0ZTogdHJ1ZSB9KTtcbiAgfVxuXG4gIHB1YmxpYyBodG1sVHJlZSgpIHtcbiAgICBsZXQgc3JjVHJlZSA9IHRoaXMudHJlZXMuc3JjO1xuXG4gICAgY29uc3QgaHRtbE5hbWUgPSB0aGlzLm91dHB1dFBhdGhzLmFwcC5odG1sO1xuICAgIGNvbnN0IGZpbGVzID0gW1xuICAgICAgJ3B1YmxpYy9pbmRleC5odG1sJ1xuICAgIF07XG5cbiAgICBjb25zdCBpbmRleCA9IG5ldyBGdW5uZWwoc3JjVHJlZSwge1xuICAgICAgZmlsZXMsXG4gICAgICBnZXREZXN0aW5hdGlvblBhdGgocmVsYXRpdmVQYXRoKSB7XG4gICAgICAgIGlmIChyZWxhdGl2ZVBhdGggPT09ICdwdWJsaWMvaW5kZXguaHRtbCcpIHtcbiAgICAgICAgICByZWxhdGl2ZVBhdGggPSBodG1sTmFtZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVsYXRpdmVQYXRoO1xuICAgICAgfSxcbiAgICAgIGFubm90YXRpb246ICdGdW5uZWw6IGluZGV4Lmh0bWwnXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IENvbmZpZ1JlcGxhY2UoaW5kZXgsIHRoaXMuX2NvbmZpZ1RyZWUoKSwge1xuICAgICAgY29uZmlnUGF0aDogdGhpcy5fY29uZmlnUGF0aCgpLFxuICAgICAgZmlsZXM6IFsgaHRtbE5hbWUgXSxcbiAgICAgIHBhdHRlcm5zOiB0aGlzLl9jb25maWdSZXBsYWNlUGF0dGVybnMoKVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjb250ZW50Rm9yKGNvbmZpZywgbWF0Y2g6IFJlZ0V4cCwgdHlwZTogc3RyaW5nKSB7XG4gICAgbGV0IGNvbnRlbnQ6IHN0cmluZ1tdID0gW107XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2hlYWQnOlxuICAgICAgICB0aGlzLl9jb250ZW50Rm9ySGVhZChjb250ZW50LCBjb25maWcpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjb250ZW50ID0gPHN0cmluZ1tdPnRoaXMucHJvamVjdC5hZGRvbnMucmVkdWNlKGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZ1tdLCBhZGRvbjogQWRkb24pOiBzdHJpbmdbXSB7XG4gICAgICB2YXIgYWRkb25Db250ZW50ID0gYWRkb24uY29udGVudEZvciA/IGFkZG9uLmNvbnRlbnRGb3IodHlwZSwgY29uZmlnLCBjb250ZW50KSA6IG51bGw7XG4gICAgICBpZiAoYWRkb25Db250ZW50KSB7XG4gICAgICAgIHJldHVybiBjb250ZW50LmNvbmNhdChhZGRvbkNvbnRlbnQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9LCBjb250ZW50KTtcblxuICAgIHJldHVybiBjb250ZW50LmpvaW4oJ1xcbicpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb250ZW50Rm9ySGVhZChjb250ZW50OiBzdHJpbmdbXSwgY29uZmlnKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zdG9yZUNvbmZpZ0luTWV0YSkge1xuICAgICAgY29udGVudC5wdXNoKCc8bWV0YSBuYW1lPVwiJyArIGNvbmZpZy5tb2R1bGVQcmVmaXggKyAnL2NvbmZpZy9lbnZpcm9ubWVudFwiICcgK1xuICAgICAgICAgICAgICAgICAgICdjb250ZW50PVwiJyArIGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjb25maWcpKSArICdcIiAvPicpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfY29uZmlnUGF0aCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBwYXRoLmpvaW4oJ2NvbmZpZycsICdlbnZpcm9ubWVudHMnLCB0aGlzLmVudiArICcuanNvbicpO1xuICB9XG5cbiAgX2NhY2hlZENvbmZpZ1RyZWU6IGFueTtcblxuICBwcm90ZWN0ZWQgX2NvbmZpZ1RyZWUoKSB7XG4gICAgaWYgKHRoaXMuX2NhY2hlZENvbmZpZ1RyZWUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jYWNoZWRDb25maWdUcmVlO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbmZpZ1BhdGggPSB0aGlzLnByb2plY3QuY29uZmlnUGF0aCgpO1xuICAgIGNvbnN0IGNvbmZpZ1RyZWUgPSBuZXcgQ29uZmlnTG9hZGVyKHBhdGguZGlybmFtZShjb25maWdQYXRoKSwge1xuICAgICAgZW52OiB0aGlzLmVudixcbiAgICAgIHByb2plY3Q6IHRoaXMucHJvamVjdFxuICAgIH0pO1xuXG4gICAgbGV0IG5hbWVzcGFjZWRDb25maWdUcmVlID0gbmV3IEZ1bm5lbChjb25maWdUcmVlLCB7XG4gICAgICBzcmNEaXI6ICcvJyxcbiAgICAgIGRlc3REaXI6ICdjb25maWcnLFxuICAgICAgYW5ub3RhdGlvbjogJ0Z1bm5lbCAoY29uZmlnKSdcbiAgICB9KTtcblxuICAgIHRoaXMuX2NhY2hlZENvbmZpZ1RyZWUgPSBtYXliZURlYnVnKG5hbWVzcGFjZWRDb25maWdUcmVlLCAnY29uZmlnLXRyZWUnKTtcblxuICAgIHJldHVybiB0aGlzLl9jYWNoZWRDb25maWdUcmVlO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXliZVBlcmZvcm1EZXByZWNhdGVkU2FzcyhhcHBUcmVlLCBtaXNzaW5nUGFja2FnZXNGb3JEZXByZWNhdGlvbk1lc3NhZ2UpIHtcbiAgICBsZXQgc3R5bGVzUGF0aCA9IHBhdGguam9pbihyZXNvbHZlTG9jYWwodGhpcy5wcm9qZWN0LnJvb3QsICdzcmMnKSwgJ3VpJywgJ3N0eWxlcycpO1xuXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoc3R5bGVzUGF0aCkpIHtcbiAgICAgIGxldCBzY3NzUGF0aCA9IHBhdGguam9pbihzdHlsZXNQYXRoLCAnYXBwLnNjc3MnKTtcblxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoc2Nzc1BhdGgpICYmICF0aGlzLnByb2plY3QuZmluZEFkZG9uQnlOYW1lKCdlbWJlci1jbGktc2FzcycpKSB7XG4gICAgICAgIG1pc3NpbmdQYWNrYWdlc0ZvckRlcHJlY2F0aW9uTWVzc2FnZS5wdXNoKCdlbWJlciBpbnN0YWxsIGVtYmVyLWNsaS1zYXNzJyk7XG5cbiAgICAgICAgY29uc3QgY29tcGlsZVNhc3MgPSByZXF1aXJlKCdicm9jY29saS1zYXNzJyk7XG5cbiAgICAgICAgbGV0IHNjc3NUcmVlID0gY29tcGlsZVNhc3MoW3N0eWxlc1BhdGhdLCAnYXBwLnNjc3MnLCB0aGlzLm91dHB1dFBhdGhzLmFwcC5jc3MsIHtcbiAgICAgICAgICBhbm5vdGF0aW9uOiAnRnVubmVsOiBzY3NzJ1xuICAgICAgICB9KTtcblxuICAgICAgICBhcHBUcmVlID0gbmV3IEZ1bm5lbChhcHBUcmVlLCB7IGV4Y2x1ZGU6IFsnKiovKi5zY3NzJ10gfSk7XG4gICAgICAgIGFwcFRyZWUgPSBuZXcgTWVyZ2VUcmVlcyhbIGFwcFRyZWUsIHNjc3NUcmVlIF0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhcHBUcmVlO1xuICB9XG59XG4iXX0=