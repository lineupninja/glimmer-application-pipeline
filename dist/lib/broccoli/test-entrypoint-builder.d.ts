import { Tree, TreeEntry } from '../interfaces';
export declare const Plugin: {
    new (inputNode: TreeEntry[], options?): Tree;
};
export default class TestEntrypointBuilder extends Plugin {
    options: {};
    constructor(testTree: any, options?: {});
    build(): void;
}
