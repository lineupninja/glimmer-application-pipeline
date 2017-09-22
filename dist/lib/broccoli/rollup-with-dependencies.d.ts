import { Project, Tree, TreeEntry, RollupOptions, GlimmerAppOptions } from '../interfaces';
export declare const Rollup: {
    new (inputNode: TreeEntry, options?): Tree;
};
export interface RollupWithDependenciesOptions {
    inputFiles: string[];
    rollup?: RollupOptions;
    project: Project;
    buildConfig: GlimmerAppOptions;
}
declare class RollupWithDependencies extends Rollup {
    private project;
    private buildConfig;
    constructor(inputTree: any, options: RollupWithDependenciesOptions);
    rollupOptions: any;
    inputPaths: any[];
    build(...args: any[]): any;
}
export default RollupWithDependencies;
