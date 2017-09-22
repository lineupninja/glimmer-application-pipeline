import { Project, Tree, GlimmerAppOptions } from '../interfaces';
export interface AbstractBuild {
    _notifyAddonIncluded(): void;
    package(jsTree: Tree, cssTree: Tree, publicTree: Tree, htmlTree: Tree): Tree;
}
export declare const AbstractBuild: {
    new (defaults: EmberCLIDefaults, options: {}): AbstractBuild;
};
export interface AbstractBuild {
    _notifyAddonIncluded(): void;
    package(jsTree: Tree, cssTree: Tree, publicTree: Tree, htmlTree: Tree): Tree;
}
export interface OutputPaths {
    app: {
        html: string;
        js: string;
        css: string;
    };
}
export interface EmberCLIDefaults {
    project: Project;
}
export interface Trees {
    src: Tree | null;
    styles: Tree | null;
    public: Tree | null;
    nodeModules: Tree | null;
}
/**
 * GlimmerApp provides an interface to a package (app, engine, or addon)
 * compatible with the module unification layout.
 *
 * @class GlimmerApp
 * @constructor
 * @param {Object} [defaults]
 * @param {Object} [options=Options] Configuration options
 */
export default class GlimmerApp extends AbstractBuild {
    project: Project;
    name: string;
    env: 'production' | 'development' | 'test';
    private registry;
    private outputPaths;
    private rollupOptions;
    protected options: GlimmerAppOptions;
    protected trees: Trees;
    constructor(upstreamDefaults: EmberCLIDefaults, options?: GlimmerAppOptions);
    import(): void;
    private _configReplacePatterns();
    private buildTrees(options);
    private tsOptions();
    private javascript();
    private processESLastest(tree);
    package(jsTree: any, cssTree: any, publicTree: any, htmlTree: any): Tree;
    getGlimmerEnvironment(): any;
    private testPackage();
    /**
     * Creates a Broccoli tree representing the compiled Glimmer application.
     *
     * @param options
     */
    toTree(): Tree;
    private compiledTypeScriptTree(srcTree, nodeModulesTree, tsConfig);
    private compiledHandlebarsTree(srcTree, glimmerEnv);
    private rollupTree(jsTree, options?);
    private buildConfigTree(postTranspiledSrc);
    private buildResolutionMap(src);
    private buildResolverConfiguration();
    private cssTree();
    private publicTree();
    htmlTree(): any;
    private contentFor(config, match, type);
    protected _contentForHead(content: string[], config: any): void;
    protected _configPath(): string;
    _cachedConfigTree: any;
    protected _configTree(): any;
    private maybePerformDeprecatedSass(appTree, missingPackagesForDeprecationMessage);
}
