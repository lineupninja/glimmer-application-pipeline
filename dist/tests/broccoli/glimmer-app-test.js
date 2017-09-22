'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require('path');
var broccoli_test_helper_1 = require("broccoli-test-helper");
var MockCLI = require('ember-cli/tests/helpers/mock-cli');
var Project = require('ember-cli/lib/models/project');
var stew = require('broccoli-stew');
var stripIndent = require('common-tags').stripIndent;
var glimmer_app_1 = require("../../lib/broccoli/glimmer-app");
var expect = require('../helpers/chai').expect;
describe('glimmer-app', function () {
    this.timeout(15000);
    var input;
    var ORIGINAL_EMBER_ENV = process.env.EMBER_ENV;
    beforeEach(function () {
        return broccoli_test_helper_1.createTempDir().then(function (tempDir) { return (input = tempDir); });
    });
    afterEach(function () {
        if (ORIGINAL_EMBER_ENV) {
            process.env.EMBER_ENV = ORIGINAL_EMBER_ENV;
        }
        else {
            delete process.env.EMBER_ENV;
        }
        return input.dispose();
    });
    function createApp(options, addons) {
        if (options === void 0) { options = {}; }
        if (addons === void 0) { addons = []; }
        var pkg = { name: 'glimmer-app-test' };
        var cli = new MockCLI();
        var project = new Project(input.path(), pkg, cli.ui, cli);
        project.initializeAddons();
        project.addons = project.addons.concat(addons);
        return new glimmer_app_1.default({
            project: project
        }, options);
    }
    describe('constructor', function () {
        it('throws an error if no arguments are provided', function () {
            expect(function () {
                var AnyGlimmerApp = glimmer_app_1.default;
                new AnyGlimmerApp();
            }).to.throw(/must pass through the default arguments/);
        });
        it('throws an error if project is not passed through', function () {
            expect(function () {
                var AnyGlimmerApp = glimmer_app_1.default;
                new AnyGlimmerApp({});
            }).to.throw(/must pass through the default arguments/);
        });
        describe('env', function () {
            beforeEach(function () {
                delete process.env.EMBER_ENV;
            });
            it('sets an `env`', function () {
                var app = createApp();
                expect(app.env).to.be.defined;
            });
            it('sets an `env` to `development` if process.env.EMBER_ENV is undefined', function () {
                var app = createApp();
                expect(app.env).to.equal('development');
            });
            it('sets an `env` to process.env.EMBER_ENV if present', function () {
                process.env.EMBER_ENV = 'test';
                var app = createApp();
                expect(app.env).to.equal('test');
            });
        });
    });
    describe('buildTree', function () {
        it('invokes preprocessTree on addons that are present', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'src': {
                                    'ui': {
                                        'index.html': 'src',
                                    },
                                },
                                'config': {},
                            });
                            app = createApp({}, [
                                {
                                    name: 'awesome-reverser',
                                    preprocessTree: function (type, tree) {
                                        return stew.map(tree, function (contents) { return contents.split('').reverse().join(''); });
                                    }
                                }
                            ]);
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app['trees'].src)];
                        case 1:
                            output = _a.sent();
                            expect(output.read()).to.deep.equal({
                                'src': {
                                    'ui': {
                                        'index.html': 'crs',
                                    }
                                }
                            });
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('publicTree', function () {
        it('includes any files in `public/` in the project', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'public': {
                                    'hi.txt': 'hi hi'
                                },
                                'config': {},
                            });
                            app = createApp();
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app['publicTree']())];
                        case 1:
                            output = _a.sent();
                            expect(output.read()).to.deep.equal({
                                'hi.txt': 'hi hi'
                            });
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('includes treeFor("public") from addons', function () {
            return __awaiter(this, void 0, void 0, function () {
                var addonPublic, app, output;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'public': {
                                    'hi.txt': 'hi hi'
                                },
                                'config': {},
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.createTempDir()];
                        case 1:
                            addonPublic = _a.sent();
                            addonPublic.write({
                                'bye.txt': 'bye bye'
                            });
                            app = createApp({}, [
                                {
                                    name: 'thing-with-public',
                                    treeFor: function (type) {
                                        return addonPublic.path();
                                    }
                                }
                            ]);
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app['publicTree']())];
                        case 2:
                            output = _a.sent();
                            expect(output.read()).to.deep.equal({
                                'hi.txt': 'hi hi',
                                'bye.txt': 'bye bye',
                            });
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('htmlTree', function () {
        it('emits index.html', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'app': {},
                                'src': {
                                    'ui': {
                                        'index.html': 'src',
                                    },
                                },
                                'config': {},
                            });
                            app = createApp();
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.htmlTree())];
                        case 1:
                            output = _a.sent();
                            expect(output.read()).to.deep.equal({
                                'index.html': 'src',
                            });
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('updates rootURL from config', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            input.write({
                                'app': {},
                                'src': {
                                    'ui': {
                                        'index.html': (_a = ["\n              <body>\n               <head>\n                 <script src=\"{{rootURL}}bar.js\"></script>\n               </head>\n              </body>"], _a.raw = ["\n              <body>\n               <head>\n                 <script src=\"{{rootURL}}bar.js\"></script>\n               </head>\n              </body>"], stripIndent(_a)),
                                    },
                                },
                                'config': {
                                    'environment.js': "\n            module.exports = function() {\n              return { rootURL: '/foo/' };\n            };"
                                },
                            });
                            app = createApp();
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.htmlTree())];
                        case 1:
                            output = _c.sent();
                            expect(output.read()).to.deep.equal({
                                'index.html': (_b = ["\n              <body>\n               <head>\n                 <script src=\"/foo/bar.js\"></script>\n               </head>\n              </body>"], _b.raw = ["\n              <body>\n               <head>\n                 <script src=\"/foo/bar.js\"></script>\n               </head>\n              </body>"], stripIndent(_b))
                            });
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('allows passing custom `src` tree', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'app': {},
                                'derp': {
                                    'ui': {
                                        'index.html': 'derp'
                                    }
                                },
                                'src': {
                                    'ui': {
                                        'index.html': 'src',
                                    },
                                },
                                'config': {},
                            });
                            app = createApp({
                                trees: {
                                    src: 'derp'
                                }
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.htmlTree())];
                        case 1:
                            output = _a.sent();
                            expect(output.read()).to.deep.equal({
                                'index.html': 'derp',
                            });
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('allows passing custom outputPaths', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'app': {},
                                'src': {
                                    'ui': {
                                        'index.html': 'src',
                                    },
                                },
                                'config': {},
                            });
                            app = createApp({
                                outputPaths: {
                                    app: { html: 'foo.html' }
                                }
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.htmlTree())];
                        case 1:
                            output = _a.sent();
                            expect(output.read()).to.deep.equal({
                                'foo.html': 'src',
                            });
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('cssTree', function () {
        it('allows passing custom `styles` tree', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output, actual;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'app': {},
                                'derp': {
                                    'ui': {
                                        'styles': {
                                            'app.css': 'derp'
                                        }
                                    }
                                },
                                'src': {
                                    'index.ts': '',
                                    'ui': {
                                        'index.html': 'src'
                                    },
                                },
                                'config': {},
                            });
                            app = createApp({
                                trees: {
                                    styles: 'derp/ui/styles',
                                    nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                }
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                        case 1:
                            output = _a.sent();
                            actual = output.read();
                            expect(actual['app.css']).to.equal('derp');
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('does not generate app.css without styles', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output, actual;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'app': {},
                                'src': {
                                    'index.ts': '',
                                    'ui': {
                                        'index.html': 'src',
                                    },
                                },
                                'config': {},
                            });
                            app = createApp({
                                trees: {
                                    nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                }
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                        case 1:
                            output = _a.sent();
                            actual = output.read();
                            expect(actual['app.css']).to.be.undefined;
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('compiles sass', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output, actual, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            input.write({
                                'app': {},
                                'src': {
                                    'index.ts': '',
                                    'ui': {
                                        'index.html': '',
                                        'styles': {
                                            'app.scss': (_a = ["\n                $font-stack: Helvetica, sans-serif;\n                $primary-color: #333;\n\n                body { font: 100% $font-stack; color: $primary-color; }\n              "], _a.raw = ["\n                $font-stack: Helvetica, sans-serif;\n                $primary-color: #333;\n\n                body { font: 100% $font-stack; color: $primary-color; }\n              "], stripIndent(_a)),
                                        },
                                    }
                                },
                                'config': {},
                            });
                            app = createApp({
                                trees: {
                                    nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                }
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                        case 1:
                            output = _b.sent();
                            actual = output.read();
                            expect(actual['app.css']).to.equal("body {\n  font: 100% Helvetica, sans-serif;\n  color: #333; }\n");
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('passes through css', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output, actual;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'app': {},
                                'src': {
                                    'index.ts': '',
                                    'ui': {
                                        'index.html': '',
                                        'styles': {
                                            'app.css': "body { color: #333; }"
                                        },
                                    }
                                },
                                'config': {},
                            });
                            app = createApp({
                                trees: {
                                    nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                }
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                        case 1:
                            output = _a.sent();
                            actual = output.read();
                            expect(actual['app.css']).to.equal("body { color: #333; }");
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('respects outputPaths.app.css with plain css', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output, actual;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'app': {},
                                'src': {
                                    'index.ts': '',
                                    'ui': {
                                        'index.html': '',
                                        'styles': {
                                            'app.css': "body { color: #333; }"
                                        },
                                    }
                                },
                                'config': {},
                            });
                            app = createApp({
                                trees: {
                                    nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                },
                                outputPaths: {
                                    app: {
                                        css: 'foo-bar.css'
                                    }
                                }
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                        case 1:
                            output = _a.sent();
                            actual = output.read();
                            expect(actual['foo-bar.css']).to.equal("body { color: #333; }");
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('respects outputPaths.app.css with sass', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output, actual, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            input.write({
                                'app': {},
                                'src': {
                                    'index.ts': '',
                                    'ui': {
                                        'index.html': '',
                                        'styles': {
                                            'app.scss': (_a = ["\n                $font-stack: Helvetica, sans-serif;\n                $primary-color: #333;\n\n                body { font: 100% $font-stack; color: $primary-color; }\n              "], _a.raw = ["\n                $font-stack: Helvetica, sans-serif;\n                $primary-color: #333;\n\n                body { font: 100% $font-stack; color: $primary-color; }\n              "], stripIndent(_a)),
                                        },
                                    }
                                },
                                'config': {},
                            });
                            app = createApp({
                                trees: {
                                    nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                },
                                outputPaths: {
                                    app: {
                                        css: 'foo-bar.css'
                                    }
                                }
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                        case 1:
                            output = _b.sent();
                            actual = output.read();
                            expect(actual['foo-bar.css']).to.equal("body {\n  font: 100% Helvetica, sans-serif;\n  color: #333; }\n");
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('testPackage', function () {
        var ORIGINAL_EMBER_ENV = process.env.EMBER_ENV;
        beforeEach(function () {
            process.env.EMBER_ENV = 'test';
        });
        afterEach(function () {
            process.env.EMBER_ENV = ORIGINAL_EMBER_ENV;
        });
        var tsconfigContents = (_a = ["\n      {\n        \"compilerOptions\": {\n          \"target\": \"es6\",\n          \"module\": \"es2015\",\n          \"inlineSourceMap\": true,\n          \"inlineSources\": true,\n          \"moduleResolution\": \"node\",\n          \"experimentalDecorators\": true\n        },\n        \"exclude\": [\n          \"node_modules\",\n          \"tmp\",\n          \"dist\"\n        ]\n      }\n    "], _a.raw = ["\n      {\n        \"compilerOptions\": {\n          \"target\": \"es6\",\n          \"module\": \"es2015\",\n          \"inlineSourceMap\": true,\n          \"inlineSources\": true,\n          \"moduleResolution\": \"node\",\n          \"experimentalDecorators\": true\n        },\n        \"exclude\": [\n          \"node_modules\",\n          \"tmp\",\n          \"dist\"\n        ]\n      }\n    "], stripIndent(_a));
        it('builds test files along with src files', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output, actual;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'src': {
                                    'index.ts': 'console.log("foo");',
                                    'ui': {
                                        'components': {
                                            'foo-bar': {
                                                'template.d.ts': 'export default {};',
                                                'template.hbs': "<div>Hello!</div>",
                                                'component.ts': 'console.log("qux"); export default class FooBar {}',
                                                'component-test.ts': 'import template from "./template"; import FooBar from "./component"; console.log(template); console.log(FooBar);'
                                            }
                                        }
                                    },
                                    'utils': {
                                        'test-helpers': {
                                            'test-helper.ts': 'import "../../../tests"'
                                        }
                                    }
                                },
                                'config': {},
                                'tsconfig.json': tsconfigContents
                            });
                            app = createApp({
                                trees: {
                                    nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                }
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                        case 1:
                            output = _a.sent();
                            actual = output.read();
                            expect(app.env).to.eq('test');
                            expect(actual['index.js'], 'builds src').to.include('console.log("qux")');
                            expect(actual['index.js'], 'builds tests').to.include('console.log(FooBar)');
                            expect(actual['index.js'], 'builds module map which includes the compiled templates').to.include('Hello!');
                            return [2 /*return*/];
                    }
                });
            });
        });
        var _a;
    });
    describe('toTree', function () {
        var tsconfigContents = (_a = ["\n      {\n        \"compilerOptions\": {\n          \"target\": \"es6\",\n          \"module\": \"es2015\",\n          \"inlineSourceMap\": true,\n          \"inlineSources\": true,\n          \"moduleResolution\": \"node\",\n          \"experimentalDecorators\": true\n        },\n        \"exclude\": [\n          \"node_modules\",\n          \"tmp\",\n          \"dist\"\n        ]\n      }\n    "], _a.raw = ["\n      {\n        \"compilerOptions\": {\n          \"target\": \"es6\",\n          \"module\": \"es2015\",\n          \"inlineSourceMap\": true,\n          \"inlineSources\": true,\n          \"moduleResolution\": \"node\",\n          \"experimentalDecorators\": true\n        },\n        \"exclude\": [\n          \"node_modules\",\n          \"tmp\",\n          \"dist\"\n        ]\n      }\n    "], stripIndent(_a));
        it('transpiles templates', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output, actual;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'src': {
                                    'index.ts': 'import template from "./ui/components/foo-bar"; console.log(template);',
                                    'ui': {
                                        'index.html': 'src',
                                        'components': {
                                            'foo-bar.hbs': "<div>Hello!</div>"
                                        },
                                    }
                                },
                                'config': {},
                                'tsconfig.json': tsconfigContents
                            });
                            app = createApp({
                                trees: {
                                    nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                }
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                        case 1:
                            output = _a.sent();
                            actual = output.read();
                            expect(actual['index.html']).to.equal('src');
                            expect(actual['app.js']).to.include('Hello!');
                            return [2 /*return*/];
                    }
                });
            });
        });
        describe('allows userland babel plugins', function () {
            function reverser() {
                return {
                    name: "ast-transform",
                    visitor: {
                        StringLiteral: function (path) {
                            path.node.value = path.node.value.split('').reverse().join('');
                        }
                    }
                };
            }
            it('runs user-land plugins', function () {
                return __awaiter(this, void 0, void 0, function () {
                    var app, output, actual;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                input.write({
                                    'src': {
                                        'index.ts': 'console.log(\'olleh\');',
                                        'ui': {
                                            'index.html': 'src'
                                        }
                                    },
                                    'config': {},
                                    'tsconfig.json': tsconfigContents
                                });
                                app = createApp({
                                    babel: {
                                        plugins: [
                                            [reverser]
                                        ]
                                    },
                                    trees: {
                                        nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                    }
                                });
                                return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                            case 1:
                                output = _a.sent();
                                actual = output.read();
                                expect(actual['index.html']).to.equal('src');
                                expect(actual['app.js']).to.include('hello');
                                return [2 /*return*/];
                        }
                    });
                });
            });
        });
        describe('babel-plugin-debug-macros', function () {
            it('replaces @glimmer/env imports', function () {
                return __awaiter(this, void 0, void 0, function () {
                    var app, output, actual;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                input.write({
                                    'src': {
                                        'index.ts': 'import { DEBUG } from "@glimmer/env"; console.log(DEBUG);',
                                        'ui': {
                                            'index.html': 'src'
                                        }
                                    },
                                    'config': {},
                                    'tsconfig.json': tsconfigContents
                                });
                                app = createApp({
                                    trees: {
                                        nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                    }
                                });
                                return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                            case 1:
                                output = _a.sent();
                                actual = output.read();
                                expect(actual['index.html']).to.equal('src');
                                expect(actual['app.js']).to.include('console.log(true)');
                                return [2 /*return*/];
                        }
                    });
                });
            });
            it('rewrites @glimmer/debug imports', function () {
                return __awaiter(this, void 0, void 0, function () {
                    var app, output, actual;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                input.write({
                                    'src': {
                                        'index.ts': 'import { assert } from "@glimmer/debug"; assert(true, "some message for debug");',
                                        'ui': {
                                            'index.html': 'src'
                                        }
                                    },
                                    'config': {},
                                    'tsconfig.json': tsconfigContents
                                });
                                app = createApp({
                                    trees: {
                                        nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                    }
                                });
                                return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                            case 1:
                                output = _a.sent();
                                actual = output.read();
                                expect(actual['index.html']).to.equal('src');
                                expect(actual['app.js']).to.include('true && console.assert(true');
                                return [2 /*return*/];
                        }
                    });
                });
            });
            it('removes @glimmer/debug imports in production builds', function () {
                return __awaiter(this, void 0, void 0, function () {
                    var app, output, actual, outputFiles, appFile;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                process.env.EMBER_ENV = 'production';
                                input.write({
                                    'src': {
                                        'index.ts': 'import { assert } from "@glimmer/debug"; assert(true, "some message for debug");',
                                        'ui': {
                                            'index.html': 'src'
                                        }
                                    },
                                    'config': {},
                                    'tsconfig.json': tsconfigContents
                                });
                                app = createApp({
                                    trees: {
                                        nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                    }
                                });
                                return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                            case 1:
                                output = _a.sent();
                                actual = output.read();
                                expect(actual['index.html']).to.equal('src');
                                outputFiles = Object.keys(actual);
                                appFile = outputFiles.find(function (fileName) { return fileName.startsWith('app'); });
                                expect(actual[appFile]).to.include('false && console.assert(true');
                                return [2 /*return*/];
                        }
                    });
                });
            });
        });
        it('builds a module map', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output, actual;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'src': {
                                    'index.ts': 'import moduleMap from "../config/module-map"; console.log(moduleMap);',
                                    'ui': {
                                        'index.html': 'src',
                                        'components': {
                                            'foo-bar': {
                                                'template.hbs': "<div>Hello!</div>"
                                            }
                                        },
                                    }
                                },
                                'config': {},
                                'tsconfig.json': tsconfigContents
                            });
                            app = createApp({
                                trees: {
                                    nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                }
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                        case 1:
                            output = _a.sent();
                            actual = output.read();
                            expect(actual['index.html']).to.equal('src');
                            expect(actual['app.js']).to.include('template:/glimmer-app-test/components/foo-bar');
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('includes resolver config', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output, actual;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'src': {
                                    'index.ts': 'import resolverConfig from "../config/resolver-configuration"; console.log(resolverConfig);',
                                    'ui': {
                                        'index.html': 'src'
                                    }
                                },
                                'config': {},
                                'tsconfig.json': tsconfigContents
                            });
                            app = createApp({
                                trees: {
                                    nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                }
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                        case 1:
                            output = _a.sent();
                            actual = output.read();
                            // it would be much better to confirm the full expected resolver config
                            // but rollup actually reformats the code so it doesn't match a simple
                            // JSON.stringify'ied version of the defaultModuleConfiguration
                            expect(actual['app.js']).to.include('glimmer-app-test');
                            expect(actual['app.js']).to.include('definitiveCollection');
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('honors outputPaths.app.js', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output, actual;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'src': {
                                    'index.ts': '',
                                    'ui': {
                                        'index.html': 'src'
                                    }
                                },
                                'config': {},
                                'tsconfig.json': tsconfigContents
                            });
                            app = createApp({
                                trees: {
                                    nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                },
                                outputPaths: {
                                    app: {
                                        js: 'foo-bar-file.js'
                                    }
                                }
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                        case 1:
                            output = _a.sent();
                            actual = output.read();
                            expect(actual['foo-bar-file.js']).to.be.defined;
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('allows specifying rollup options', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output, actual;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'src': {
                                    'index.ts': 'console.log("NOW YOU SEE ME");',
                                    'ui': {
                                        'index.html': 'src'
                                    }
                                },
                                'config': {},
                                'tsconfig.json': tsconfigContents
                            });
                            app = createApp({
                                trees: {
                                    nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                },
                                rollup: {
                                    plugins: [
                                        {
                                            name: 'test-replacement',
                                            transform: function (code, id) {
                                                return code.replace('NOW YOU SEE ME', 'NOW YOU DON\'T');
                                            }
                                        }
                                    ]
                                }
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                        case 1:
                            output = _a.sent();
                            actual = output.read();
                            expect(actual['app.js']).to.include('NOW YOU DON\'T');
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('allows passing custom Broccoli nodes', function () {
            return __awaiter(this, void 0, void 0, function () {
                var app, output, actual;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input.write({
                                'src': {
                                    'index.ts': '',
                                    'ui': {
                                        'index.html': 'src'
                                    }
                                },
                                'config': {},
                                'tsconfig.json': tsconfigContents
                            });
                            app = createApp({
                                trees: {
                                    src: stew.log(path.join(input.path(), 'src')),
                                    nodeModules: path.join(__dirname, '..', '..', '..', 'node_modules')
                                },
                            });
                            return [4 /*yield*/, broccoli_test_helper_1.buildOutput(app.toTree())];
                        case 1:
                            output = _a.sent();
                            actual = output.read();
                            expect(actual['app.js']).to.be.defined;
                            return [2 /*return*/];
                    }
                });
            });
        });
        describe('`getGlimmerEnvironment`', function () {
            it('returns application options from `config/environment.js` if it is specified via `GlimmerENV`', function () {
                input.write({
                    'app': {},
                    'src': {
                        'ui': {
                            'index.html': 'src',
                        },
                    },
                    'config': {
                        'environment.js': "\n            module.exports = function() {\n              return { GlimmerENV: { FEATURES: {} } };\n            };"
                    },
                });
                var app = createApp();
                expect(app.getGlimmerEnvironment()).to.deep.equal({ FEATURES: {} });
            });
            it('returns application options from `config/environment.js` if it is specified via `EmberENV`', function () {
                input.write({
                    'app': {},
                    'src': {
                        'ui': {
                            'index.html': 'src',
                        },
                    },
                    'config': {
                        'environment.js': "\n            module.exports = function() {\n              return { EmberENV: { FEATURES: {} } };\n            };"
                    },
                });
                var app = createApp();
                expect(app.getGlimmerEnvironment()).to.deep.equal({ FEATURES: {} });
            });
        });
        var _a;
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xpbW1lci1hcHAtdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdsaW1tZXItYXBwLXRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRWIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTdCLDZEQUEyRTtBQUUzRSxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsa0NBQWtDLENBQUMsQ0FBQztBQUM1RCxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUN4RCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFOUIsSUFBQSxnREFBVyxDQUE0QjtBQUUvQyw4REFBd0Q7QUFHeEQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsTUFBTSxDQUFDO0FBRWpELFFBQVEsQ0FBQyxhQUFhLEVBQUU7SUFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVwQixJQUFJLEtBQWMsQ0FBQztJQUVuQixJQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0lBRWpELFVBQVUsQ0FBQztRQUNULE1BQU0sQ0FBQyxvQ0FBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTyxJQUFJLE9BQUEsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEVBQWpCLENBQWlCLENBQUMsQ0FBQztJQUM1RCxDQUFDLENBQUMsQ0FBQztJQUVILFNBQVMsQ0FBQztRQUNSLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQztRQUM3QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixPQUFPLE9BQU8sQ0FB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KTtcblxuaW1wb3J0IHsgYnVpbGRPdXRwdXQsIGNyZWF0ZVRlbXBEaXIsIFRlbXBEaXIgfSBmcm9tICdicm9jY29saS10ZXN0LWhlbHBlcic7XG5cbmNvbnN0IE1vY2tDTEkgPSByZXF1aXJlKCdlbWJlci1jbGkvdGVzdHMvaGVscGVycy9tb2NrLWNsaScpO1xuY29uc3QgUHJvamVjdCA9IHJlcXVpcmUoJ2VtYmVyLWNsaS9saWIvbW9kZWxzL3Byb2plY3QnKTtcbmNvbnN0IHN0ZXcgPSByZXF1aXJlKCdicm9jY29saS1zdGV3Jyk7XG5cbmNvbnN0IHsgc3RyaXBJbmRlbnQgfSA9IHJlcXVpcmUoJ2NvbW1vbi10YWdzJyk7XG5cbmltcG9ydCBHbGltbWVyQXBwIGZyb20gJy4uLy4uL2xpYi9icm9jY29saS9nbGltbWVyLWFwcCc7XG5pbXBvcnQgeyBHbGltbWVyQXBwT3B0aW9ucyB9IGZyb20gJy4uLy4uL2xpYi9pbnRlcmZhY2VzJztcblxuY29uc3QgZXhwZWN0ID0gcmVxdWlyZSgnLi4vaGVscGVycy9jaGFpJykuZXhwZWN0O1xuXG5kZXNjcmliZSgnZ2xpbW1lci1hcHAnLCBmdW5jdGlvbigpIHtcbiAgdGhpcy50aW1lb3V0KDE1MDAwKTtcblxuICBsZXQgaW5wdXQ6IFRlbXBEaXI7XG5cbiAgY29uc3QgT1JJR0lOQUxfRU1CRVJfRU5WID0gcHJvY2Vzcy5lbnYuRU1CRVJfRU5WO1xuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNyZWF0ZVRlbXBEaXIoKS50aGVuKHRlbXBEaXIgPT4gKGlucHV0ID0gdGVtcERpcikpO1xuICB9KTtcblxuICBhZnRlckVhY2goZnVuY3Rpb24oKSB7XG4gICAgaWYgKE9SSUdJTkFMX0VNQkVSX0VOVikge1xuICAgICAgcHJvY2Vzcy5lbnYuRU1CRVJfRU5WID0gT1JJR0lOQUxfRU1CRVJfRU5WO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgcHJvY2Vzcy5lbnYuRU1CRVJfRU5WO1xuICAgIH1cblxuICAgIHJldHVybiBpbnB1dC5kaXNwb3NlKCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFwcChvcHRpb25zOiBHbGltbWVyQXBwT3B0aW9ucyA9IHt9LCBhZGRvbnMgPSBbXSk6IEdsaW1tZXJBcHAge1xuICAgIGxldCBwa2cgPSB7IG5hbWU6ICdnbGltbWVyLWFwcC10ZXN0JyB9O1xuXG4gICAgbGV0IGNsaSA9IG5ldyBNb2NrQ0xJKCk7XG4gICAgbGV0IHByb2plY3QgPSBuZXcgUHJvamVjdChpbnB1dC5wYXRoKCksIHBrZywgY2xpLnVpLCBjbGkpO1xuICAgIHByb2plY3QuaW5pdGlhbGl6ZUFkZG9ucygpO1xuICAgIHByb2plY3QuYWRkb25zID0gcHJvamVjdC5hZGRvbnMuY29uY2F0KGFkZG9ucyk7XG5cbiAgICByZXR1cm4gbmV3IEdsaW1tZXJBcHAoe1xuICAgICAgcHJvamVjdFxuICAgIH0sIG9wdGlvbnMpO1xuICB9XG5cbiAgZGVzY3JpYmUoJ2NvbnN0cnVjdG9yJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Rocm93cyBhbiBlcnJvciBpZiBubyBhcmd1bWVudHMgYXJlIHByb3ZpZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBBbnlHbGltbWVyQXBwID0gR2xpbW1lckFwcCBhcyBhbnk7XG4gICAgICAgIG5ldyBBbnlHbGltbWVyQXBwKCk7XG4gICAgICB9KS50by50aHJvdygvbXVzdCBwYXNzIHRocm91Z2ggdGhlIGRlZmF1bHQgYXJndW1lbnRzLylcbiAgICB9KTtcblxuICAgIGl0KCd0aHJvd3MgYW4gZXJyb3IgaWYgcHJvamVjdCBpcyBub3QgcGFzc2VkIHRocm91Z2gnLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IEFueUdsaW1tZXJBcHAgPSBHbGltbWVyQXBwIGFzIGFueTtcbiAgICAgICAgbmV3IEFueUdsaW1tZXJBcHAoe30pO1xuICAgICAgfSkudG8udGhyb3coL211c3QgcGFzcyB0aHJvdWdoIHRoZSBkZWZhdWx0IGFyZ3VtZW50cy8pXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZW52JywgZnVuY3Rpb24oKSB7XG4gICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBkZWxldGUgcHJvY2Vzcy5lbnYuRU1CRVJfRU5WO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzZXRzIGFuIGBlbnZgJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoKTtcblxuICAgICAgICBleHBlY3QoYXBwLmVudikudG8uYmUuZGVmaW5lZDtcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzZXRzIGFuIGBlbnZgIHRvIGBkZXZlbG9wbWVudGAgaWYgcHJvY2Vzcy5lbnYuRU1CRVJfRU5WIGlzIHVuZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgYXBwID0gY3JlYXRlQXBwKCk7XG5cbiAgICAgICAgZXhwZWN0KGFwcC5lbnYpLnRvLmVxdWFsKCdkZXZlbG9wbWVudCcpO1xuICAgICAgfSlcblxuICAgICAgaXQoJ3NldHMgYW4gYGVudmAgdG8gcHJvY2Vzcy5lbnYuRU1CRVJfRU5WIGlmIHByZXNlbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcHJvY2Vzcy5lbnYuRU1CRVJfRU5WID0gJ3Rlc3QnO1xuXG4gICAgICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoKTtcblxuICAgICAgICBleHBlY3QoYXBwLmVudikudG8uZXF1YWwoJ3Rlc3QnKTtcbiAgICAgIH0pXG4gICAgfSlcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2J1aWxkVHJlZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdpbnZva2VzIHByZXByb2Nlc3NUcmVlIG9uIGFkZG9ucyB0aGF0IGFyZSBwcmVzZW50JywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBpbnB1dC53cml0ZSh7XG4gICAgICAgICdzcmMnOiB7XG4gICAgICAgICAgJ3VpJzoge1xuICAgICAgICAgICAgJ2luZGV4Lmh0bWwnOiAnc3JjJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnY29uZmlnJzoge30sXG4gICAgICB9KTtcblxuICAgICAgbGV0IGFwcCA9IGNyZWF0ZUFwcCh7fSwgW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ2F3ZXNvbWUtcmV2ZXJzZXInLFxuICAgICAgICAgIHByZXByb2Nlc3NUcmVlKHR5cGUsIHRyZWUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGV3Lm1hcCh0cmVlLCAoY29udGVudHMpID0+IGNvbnRlbnRzLnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICAgIGxldCBvdXRwdXQgPSBhd2FpdCBidWlsZE91dHB1dChhcHBbJ3RyZWVzJ10uc3JjKTtcblxuICAgICAgZXhwZWN0KG91dHB1dC5yZWFkKCkpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICAnc3JjJzoge1xuICAgICAgICAgICd1aSc6IHtcbiAgICAgICAgICAgICdpbmRleC5odG1sJzogJ2NycycsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3B1YmxpY1RyZWUnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnaW5jbHVkZXMgYW55IGZpbGVzIGluIGBwdWJsaWMvYCBpbiB0aGUgcHJvamVjdCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgaW5wdXQud3JpdGUoe1xuICAgICAgICAncHVibGljJzoge1xuICAgICAgICAgICdoaS50eHQnOiAnaGkgaGknXG4gICAgICAgIH0sXG4gICAgICAgICdjb25maWcnOiB7fSxcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgYXBwID0gY3JlYXRlQXBwKCk7XG4gICAgICBsZXQgb3V0cHV0ID0gYXdhaXQgYnVpbGRPdXRwdXQoYXBwWydwdWJsaWNUcmVlJ10oKSk7XG5cbiAgICAgIGV4cGVjdChvdXRwdXQucmVhZCgpKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgJ2hpLnR4dCc6ICdoaSBoaSdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2luY2x1ZGVzIHRyZWVGb3IoXCJwdWJsaWNcIikgZnJvbSBhZGRvbnMnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGlucHV0LndyaXRlKHtcbiAgICAgICAgJ3B1YmxpYyc6IHtcbiAgICAgICAgICAnaGkudHh0JzogJ2hpIGhpJ1xuICAgICAgICB9LFxuICAgICAgICAnY29uZmlnJzoge30sXG4gICAgICB9KTtcblxuICAgICAgbGV0IGFkZG9uUHVibGljID0gYXdhaXQgY3JlYXRlVGVtcERpcigpO1xuXG4gICAgICBhZGRvblB1YmxpYy53cml0ZSh7XG4gICAgICAgICdieWUudHh0JzogJ2J5ZSBieWUnXG4gICAgICB9KTtcblxuICAgICAgbGV0IGFwcCA9IGNyZWF0ZUFwcCh7fSwgW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ3RoaW5nLXdpdGgtcHVibGljJyxcbiAgICAgICAgICB0cmVlRm9yKHR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBhZGRvblB1YmxpYy5wYXRoKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgICAgbGV0IG91dHB1dCA9IGF3YWl0IGJ1aWxkT3V0cHV0KGFwcFsncHVibGljVHJlZSddKCkpO1xuXG4gICAgICBleHBlY3Qob3V0cHV0LnJlYWQoKSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgICdoaS50eHQnOiAnaGkgaGknLFxuICAgICAgICAnYnllLnR4dCc6ICdieWUgYnllJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaHRtbFRyZWUnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnZW1pdHMgaW5kZXguaHRtbCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlucHV0LndyaXRlKHtcbiAgICAgICAgJ2FwcCc6IHt9LFxuICAgICAgICAnc3JjJzoge1xuICAgICAgICAgICd1aSc6IHtcbiAgICAgICAgICAgICdpbmRleC5odG1sJzogJ3NyYycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbmZpZyc6IHt9LFxuICAgICAgfSk7XG5cbiAgICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoKTtcbiAgICAgIGxldCBvdXRwdXQgPSBhd2FpdCBidWlsZE91dHB1dChhcHAuaHRtbFRyZWUoKSk7XG5cbiAgICAgIGV4cGVjdChvdXRwdXQucmVhZCgpKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgJ2luZGV4Lmh0bWwnOiAnc3JjJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3VwZGF0ZXMgcm9vdFVSTCBmcm9tIGNvbmZpZycsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlucHV0LndyaXRlKHtcbiAgICAgICAgJ2FwcCc6IHt9LFxuICAgICAgICAnc3JjJzoge1xuICAgICAgICAgICd1aSc6IHtcbiAgICAgICAgICAgICdpbmRleC5odG1sJzogc3RyaXBJbmRlbnRgXG4gICAgICAgICAgICAgIDxib2R5PlxuICAgICAgICAgICAgICAgPGhlYWQ+XG4gICAgICAgICAgICAgICAgIDxzY3JpcHQgc3JjPVwie3tyb290VVJMfX1iYXIuanNcIj48L3NjcmlwdD5cbiAgICAgICAgICAgICAgIDwvaGVhZD5cbiAgICAgICAgICAgICAgPC9ib2R5PmAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAnZW52aXJvbm1lbnQuanMnOiBgXG4gICAgICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4geyByb290VVJMOiAnL2Zvby8nIH07XG4gICAgICAgICAgICB9O2BcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgYXBwID0gY3JlYXRlQXBwKCkgYXMgYW55O1xuICAgICAgbGV0IG91dHB1dCA9IGF3YWl0IGJ1aWxkT3V0cHV0KGFwcC5odG1sVHJlZSgpKTtcblxuICAgICAgZXhwZWN0KG91dHB1dC5yZWFkKCkpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICAnaW5kZXguaHRtbCc6IHN0cmlwSW5kZW50YFxuICAgICAgICAgICAgICA8Ym9keT5cbiAgICAgICAgICAgICAgIDxoZWFkPlxuICAgICAgICAgICAgICAgICA8c2NyaXB0IHNyYz1cIi9mb28vYmFyLmpzXCI+PC9zY3JpcHQ+XG4gICAgICAgICAgICAgICA8L2hlYWQ+XG4gICAgICAgICAgICAgIDwvYm9keT5gXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdhbGxvd3MgcGFzc2luZyBjdXN0b20gYHNyY2AgdHJlZScsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlucHV0LndyaXRlKHtcbiAgICAgICAgJ2FwcCc6IHt9LFxuICAgICAgICAnZGVycCc6IHtcbiAgICAgICAgICAndWknOiB7XG4gICAgICAgICAgICAnaW5kZXguaHRtbCc6ICdkZXJwJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ3NyYyc6IHtcbiAgICAgICAgICAndWknOiB7XG4gICAgICAgICAgICAnaW5kZXguaHRtbCc6ICdzcmMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdjb25maWcnOiB7fSxcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgYXBwID0gY3JlYXRlQXBwKHtcbiAgICAgICAgdHJlZXM6IHtcbiAgICAgICAgICBzcmM6ICdkZXJwJ1xuICAgICAgICB9XG4gICAgICB9KSBhcyBhbnk7XG5cbiAgICAgIGxldCBvdXRwdXQgPSBhd2FpdCBidWlsZE91dHB1dChhcHAuaHRtbFRyZWUoKSk7XG5cbiAgICAgIGV4cGVjdChvdXRwdXQucmVhZCgpKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgJ2luZGV4Lmh0bWwnOiAnZGVycCcsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdhbGxvd3MgcGFzc2luZyBjdXN0b20gb3V0cHV0UGF0aHMnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGlucHV0LndyaXRlKHtcbiAgICAgICAgJ2FwcCc6IHt9LFxuICAgICAgICAnc3JjJzoge1xuICAgICAgICAgICd1aSc6IHtcbiAgICAgICAgICAgICdpbmRleC5odG1sJzogJ3NyYycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbmZpZyc6IHt9LFxuICAgICAgfSk7XG5cbiAgICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoe1xuICAgICAgICBvdXRwdXRQYXRoczoge1xuICAgICAgICAgIGFwcDogeyBodG1sOiAnZm9vLmh0bWwnIH1cbiAgICAgICAgfVxuICAgICAgfSkgYXMgYW55O1xuXG4gICAgICBsZXQgb3V0cHV0ID0gYXdhaXQgYnVpbGRPdXRwdXQoYXBwLmh0bWxUcmVlKCkpO1xuXG4gICAgICBleHBlY3Qob3V0cHV0LnJlYWQoKSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgICdmb28uaHRtbCc6ICdzcmMnLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjc3NUcmVlJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ2FsbG93cyBwYXNzaW5nIGN1c3RvbSBgc3R5bGVzYCB0cmVlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgaW5wdXQud3JpdGUoe1xuICAgICAgICAnYXBwJzoge30sXG4gICAgICAgICdkZXJwJzoge1xuICAgICAgICAgICd1aSc6IHtcbiAgICAgICAgICAgICdzdHlsZXMnOiB7XG4gICAgICAgICAgICAgICdhcHAuY3NzJzogJ2RlcnAnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnc3JjJzoge1xuICAgICAgICAgICdpbmRleC50cyc6ICcnLFxuICAgICAgICAgICd1aSc6IHtcbiAgICAgICAgICAgICdpbmRleC5odG1sJzogJ3NyYydcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnY29uZmlnJzoge30sXG4gICAgICB9KTtcblxuICAgICAgbGV0IGFwcCA9IGNyZWF0ZUFwcCh7XG4gICAgICAgIHRyZWVzOiB7XG4gICAgICAgICAgc3R5bGVzOiAnZGVycC91aS9zdHlsZXMnLFxuICAgICAgICAgIG5vZGVNb2R1bGVzOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJylcbiAgICAgICAgfVxuICAgICAgfSkgYXMgYW55O1xuXG4gICAgICBsZXQgb3V0cHV0ID0gYXdhaXQgYnVpbGRPdXRwdXQoYXBwLnRvVHJlZSgpKTtcbiAgICAgIGxldCBhY3R1YWwgPSBvdXRwdXQucmVhZCgpO1xuXG4gICAgICBleHBlY3QoYWN0dWFsWydhcHAuY3NzJ10pLnRvLmVxdWFsKCdkZXJwJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnZG9lcyBub3QgZ2VuZXJhdGUgYXBwLmNzcyB3aXRob3V0IHN0eWxlcycsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlucHV0LndyaXRlKHtcbiAgICAgICAgJ2FwcCc6IHt9LFxuICAgICAgICAnc3JjJzoge1xuICAgICAgICAgICdpbmRleC50cyc6ICcnLFxuICAgICAgICAgICd1aSc6IHtcbiAgICAgICAgICAgICdpbmRleC5odG1sJzogJ3NyYycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbmZpZyc6IHt9LFxuICAgICAgfSk7XG5cbiAgICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoe1xuICAgICAgICB0cmVlczoge1xuICAgICAgICAgIG5vZGVNb2R1bGVzOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJylcbiAgICAgICAgfVxuICAgICAgfSkgYXMgYW55O1xuICAgICAgbGV0IG91dHB1dCA9IGF3YWl0IGJ1aWxkT3V0cHV0KGFwcC50b1RyZWUoKSk7XG4gICAgICBsZXQgYWN0dWFsID0gb3V0cHV0LnJlYWQoKTtcblxuICAgICAgZXhwZWN0KGFjdHVhbFsnYXBwLmNzcyddKS50by5iZS51bmRlZmluZWQ7XG4gICAgfSk7XG5cbiAgICBpdCgnY29tcGlsZXMgc2FzcycsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlucHV0LndyaXRlKHtcbiAgICAgICAgJ2FwcCc6IHt9LFxuICAgICAgICAnc3JjJzoge1xuICAgICAgICAgICdpbmRleC50cyc6ICcnLFxuICAgICAgICAgICd1aSc6IHtcbiAgICAgICAgICAgICdpbmRleC5odG1sJzogJycsXG4gICAgICAgICAgICAnc3R5bGVzJzoge1xuICAgICAgICAgICAgICAnYXBwLnNjc3MnOiBzdHJpcEluZGVudGBcbiAgICAgICAgICAgICAgICAkZm9udC1zdGFjazogSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xuICAgICAgICAgICAgICAgICRwcmltYXJ5LWNvbG9yOiAjMzMzO1xuXG4gICAgICAgICAgICAgICAgYm9keSB7IGZvbnQ6IDEwMCUgJGZvbnQtc3RhY2s7IGNvbG9yOiAkcHJpbWFyeS1jb2xvcjsgfVxuICAgICAgICAgICAgICBgLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICdjb25maWcnOiB7fSxcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgYXBwID0gY3JlYXRlQXBwKHtcbiAgICAgICAgdHJlZXM6IHtcbiAgICAgICAgICBub2RlTW9kdWxlczogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ25vZGVfbW9kdWxlcycpXG4gICAgICAgIH1cbiAgICAgIH0pIGFzIGFueTtcbiAgICAgIGxldCBvdXRwdXQgPSBhd2FpdCBidWlsZE91dHB1dChhcHAudG9UcmVlKCkpO1xuICAgICAgbGV0IGFjdHVhbCA9IG91dHB1dC5yZWFkKCk7XG5cbiAgICAgIGV4cGVjdChhY3R1YWxbJ2FwcC5jc3MnXSkudG8uZXF1YWwoXG4gICAgICAgIGBib2R5IHtcXG4gIGZvbnQ6IDEwMCUgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgY29sb3I6ICMzMzM7IH1cXG5gXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Bhc3NlcyB0aHJvdWdoIGNzcycsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlucHV0LndyaXRlKHtcbiAgICAgICAgJ2FwcCc6IHt9LFxuICAgICAgICAnc3JjJzoge1xuICAgICAgICAgICdpbmRleC50cyc6ICcnLFxuICAgICAgICAgICd1aSc6IHtcbiAgICAgICAgICAgICdpbmRleC5odG1sJzogJycsXG4gICAgICAgICAgICAnc3R5bGVzJzoge1xuICAgICAgICAgICAgICAnYXBwLmNzcyc6IGBib2R5IHsgY29sb3I6ICMzMzM7IH1gXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbmZpZyc6IHt9LFxuICAgICAgfSk7XG5cbiAgICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoe1xuICAgICAgICB0cmVlczoge1xuICAgICAgICAgIG5vZGVNb2R1bGVzOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJylcbiAgICAgICAgfVxuICAgICAgfSkgYXMgYW55O1xuICAgICAgbGV0IG91dHB1dCA9IGF3YWl0IGJ1aWxkT3V0cHV0KGFwcC50b1RyZWUoKSk7XG4gICAgICBsZXQgYWN0dWFsID0gb3V0cHV0LnJlYWQoKTtcblxuICAgICAgZXhwZWN0KGFjdHVhbFsnYXBwLmNzcyddKS50by5lcXVhbChgYm9keSB7IGNvbG9yOiAjMzMzOyB9YCk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVzcGVjdHMgb3V0cHV0UGF0aHMuYXBwLmNzcyB3aXRoIHBsYWluIGNzcycsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlucHV0LndyaXRlKHtcbiAgICAgICAgJ2FwcCc6IHt9LFxuICAgICAgICAnc3JjJzoge1xuICAgICAgICAgICdpbmRleC50cyc6ICcnLFxuICAgICAgICAgICd1aSc6IHtcbiAgICAgICAgICAgICdpbmRleC5odG1sJzogJycsXG4gICAgICAgICAgICAnc3R5bGVzJzoge1xuICAgICAgICAgICAgICAnYXBwLmNzcyc6IGBib2R5IHsgY29sb3I6ICMzMzM7IH1gXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbmZpZyc6IHt9LFxuICAgICAgfSk7XG5cbiAgICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoe1xuICAgICAgICB0cmVlczoge1xuICAgICAgICAgIG5vZGVNb2R1bGVzOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJylcbiAgICAgICAgfSxcbiAgICAgICAgb3V0cHV0UGF0aHM6IHtcbiAgICAgICAgICBhcHA6IHtcbiAgICAgICAgICAgIGNzczogJ2Zvby1iYXIuY3NzJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSkgYXMgYW55O1xuICAgICAgbGV0IG91dHB1dCA9IGF3YWl0IGJ1aWxkT3V0cHV0KGFwcC50b1RyZWUoKSk7XG4gICAgICBsZXQgYWN0dWFsID0gb3V0cHV0LnJlYWQoKTtcblxuICAgICAgZXhwZWN0KGFjdHVhbFsnZm9vLWJhci5jc3MnXSkudG8uZXF1YWwoYGJvZHkgeyBjb2xvcjogIzMzMzsgfWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Jlc3BlY3RzIG91dHB1dFBhdGhzLmFwcC5jc3Mgd2l0aCBzYXNzJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgaW5wdXQud3JpdGUoe1xuICAgICAgICAnYXBwJzoge30sXG4gICAgICAgICdzcmMnOiB7XG4gICAgICAgICAgJ2luZGV4LnRzJzogJycsXG4gICAgICAgICAgJ3VpJzoge1xuICAgICAgICAgICAgJ2luZGV4Lmh0bWwnOiAnJyxcbiAgICAgICAgICAgICdzdHlsZXMnOiB7XG4gICAgICAgICAgICAgICdhcHAuc2Nzcyc6IHN0cmlwSW5kZW50YFxuICAgICAgICAgICAgICAgICRmb250LXN0YWNrOiBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XG4gICAgICAgICAgICAgICAgJHByaW1hcnktY29sb3I6ICMzMzM7XG5cbiAgICAgICAgICAgICAgICBib2R5IHsgZm9udDogMTAwJSAkZm9udC1zdGFjazsgY29sb3I6ICRwcmltYXJ5LWNvbG9yOyB9XG4gICAgICAgICAgICAgIGAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbmZpZyc6IHt9LFxuICAgICAgfSk7XG5cbiAgICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoe1xuICAgICAgICB0cmVlczoge1xuICAgICAgICAgIG5vZGVNb2R1bGVzOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJylcbiAgICAgICAgfSxcbiAgICAgICAgb3V0cHV0UGF0aHM6IHtcbiAgICAgICAgICBhcHA6IHtcbiAgICAgICAgICAgIGNzczogJ2Zvby1iYXIuY3NzJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSkgYXMgYW55O1xuICAgICAgbGV0IG91dHB1dCA9IGF3YWl0IGJ1aWxkT3V0cHV0KGFwcC50b1RyZWUoKSk7XG4gICAgICBsZXQgYWN0dWFsID0gb3V0cHV0LnJlYWQoKTtcblxuICAgICAgZXhwZWN0KGFjdHVhbFsnZm9vLWJhci5jc3MnXSkudG8uZXF1YWwoXG4gICAgICAgIGBib2R5IHtcXG4gIGZvbnQ6IDEwMCUgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgY29sb3I6ICMzMzM7IH1cXG5gXG4gICAgICApO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndGVzdFBhY2thZ2UnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBPUklHSU5BTF9FTUJFUl9FTlYgPSBwcm9jZXNzLmVudi5FTUJFUl9FTlY7XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHByb2Nlc3MuZW52LkVNQkVSX0VOViA9ICd0ZXN0JztcbiAgICB9KTtcblxuICAgIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgICBwcm9jZXNzLmVudi5FTUJFUl9FTlYgPSBPUklHSU5BTF9FTUJFUl9FTlY7XG4gICAgfSk7XG5cbiAgICBjb25zdCB0c2NvbmZpZ0NvbnRlbnRzID0gc3RyaXBJbmRlbnRgXG4gICAgICB7XG4gICAgICAgIFwiY29tcGlsZXJPcHRpb25zXCI6IHtcbiAgICAgICAgICBcInRhcmdldFwiOiBcImVzNlwiLFxuICAgICAgICAgIFwibW9kdWxlXCI6IFwiZXMyMDE1XCIsXG4gICAgICAgICAgXCJpbmxpbmVTb3VyY2VNYXBcIjogdHJ1ZSxcbiAgICAgICAgICBcImlubGluZVNvdXJjZXNcIjogdHJ1ZSxcbiAgICAgICAgICBcIm1vZHVsZVJlc29sdXRpb25cIjogXCJub2RlXCIsXG4gICAgICAgICAgXCJleHBlcmltZW50YWxEZWNvcmF0b3JzXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJleGNsdWRlXCI6IFtcbiAgICAgICAgICBcIm5vZGVfbW9kdWxlc1wiLFxuICAgICAgICAgIFwidG1wXCIsXG4gICAgICAgICAgXCJkaXN0XCJcbiAgICAgICAgXVxuICAgICAgfVxuICAgIGA7XG5cbiAgICBpdCgnYnVpbGRzIHRlc3QgZmlsZXMgYWxvbmcgd2l0aCBzcmMgZmlsZXMnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGlucHV0LndyaXRlKHtcbiAgICAgICAgJ3NyYyc6IHtcbiAgICAgICAgICAnaW5kZXgudHMnOiAnY29uc29sZS5sb2coXCJmb29cIik7JyxcbiAgICAgICAgICAndWknOiB7XG4gICAgICAgICAgICAnY29tcG9uZW50cyc6IHtcbiAgICAgICAgICAgICAgJ2Zvby1iYXInOiB7XG4gICAgICAgICAgICAgICAgJ3RlbXBsYXRlLmQudHMnOiAnZXhwb3J0IGRlZmF1bHQge307JyxcbiAgICAgICAgICAgICAgICAndGVtcGxhdGUuaGJzJzogYDxkaXY+SGVsbG8hPC9kaXY+YCxcbiAgICAgICAgICAgICAgICAnY29tcG9uZW50LnRzJzogJ2NvbnNvbGUubG9nKFwicXV4XCIpOyBleHBvcnQgZGVmYXVsdCBjbGFzcyBGb29CYXIge30nLFxuICAgICAgICAgICAgICAgICdjb21wb25lbnQtdGVzdC50cyc6ICdpbXBvcnQgdGVtcGxhdGUgZnJvbSBcIi4vdGVtcGxhdGVcIjsgaW1wb3J0IEZvb0JhciBmcm9tIFwiLi9jb21wb25lbnRcIjsgY29uc29sZS5sb2codGVtcGxhdGUpOyBjb25zb2xlLmxvZyhGb29CYXIpOydcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3V0aWxzJzoge1xuICAgICAgICAgICAgJ3Rlc3QtaGVscGVycyc6IHtcbiAgICAgICAgICAgICAgJ3Rlc3QtaGVscGVyLnRzJzogJ2ltcG9ydCBcIi4uLy4uLy4uL3Rlc3RzXCInXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnY29uZmlnJzoge30sXG4gICAgICAgICd0c2NvbmZpZy5qc29uJzogdHNjb25maWdDb250ZW50c1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoe1xuICAgICAgICB0cmVlczoge1xuICAgICAgICAgIG5vZGVNb2R1bGVzOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJylcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBsZXQgb3V0cHV0ID0gYXdhaXQgYnVpbGRPdXRwdXQoYXBwLnRvVHJlZSgpKTtcbiAgICAgIGxldCBhY3R1YWwgPSBvdXRwdXQucmVhZCgpO1xuXG4gICAgICBleHBlY3QoYXBwLmVudikudG8uZXEoJ3Rlc3QnKTtcbiAgICAgIGV4cGVjdChhY3R1YWxbJ2luZGV4LmpzJ10sICdidWlsZHMgc3JjJykudG8uaW5jbHVkZSgnY29uc29sZS5sb2coXCJxdXhcIiknKTtcbiAgICAgIGV4cGVjdChhY3R1YWxbJ2luZGV4LmpzJ10sICdidWlsZHMgdGVzdHMnKS50by5pbmNsdWRlKCdjb25zb2xlLmxvZyhGb29CYXIpJyk7XG4gICAgICBleHBlY3QoYWN0dWFsWydpbmRleC5qcyddLCAnYnVpbGRzIG1vZHVsZSBtYXAgd2hpY2ggaW5jbHVkZXMgdGhlIGNvbXBpbGVkIHRlbXBsYXRlcycpLnRvLmluY2x1ZGUoJ0hlbGxvIScpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndG9UcmVlJywgZnVuY3Rpb24oKSB7XG5cbiAgICBjb25zdCB0c2NvbmZpZ0NvbnRlbnRzID0gc3RyaXBJbmRlbnRgXG4gICAgICB7XG4gICAgICAgIFwiY29tcGlsZXJPcHRpb25zXCI6IHtcbiAgICAgICAgICBcInRhcmdldFwiOiBcImVzNlwiLFxuICAgICAgICAgIFwibW9kdWxlXCI6IFwiZXMyMDE1XCIsXG4gICAgICAgICAgXCJpbmxpbmVTb3VyY2VNYXBcIjogdHJ1ZSxcbiAgICAgICAgICBcImlubGluZVNvdXJjZXNcIjogdHJ1ZSxcbiAgICAgICAgICBcIm1vZHVsZVJlc29sdXRpb25cIjogXCJub2RlXCIsXG4gICAgICAgICAgXCJleHBlcmltZW50YWxEZWNvcmF0b3JzXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJleGNsdWRlXCI6IFtcbiAgICAgICAgICBcIm5vZGVfbW9kdWxlc1wiLFxuICAgICAgICAgIFwidG1wXCIsXG4gICAgICAgICAgXCJkaXN0XCJcbiAgICAgICAgXVxuICAgICAgfVxuICAgIGA7XG5cbiAgICBpdCgndHJhbnNwaWxlcyB0ZW1wbGF0ZXMnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGlucHV0LndyaXRlKHtcbiAgICAgICAgJ3NyYyc6IHtcbiAgICAgICAgICAnaW5kZXgudHMnOiAnaW1wb3J0IHRlbXBsYXRlIGZyb20gXCIuL3VpL2NvbXBvbmVudHMvZm9vLWJhclwiOyBjb25zb2xlLmxvZyh0ZW1wbGF0ZSk7JyxcbiAgICAgICAgICAndWknOiB7XG4gICAgICAgICAgICAnaW5kZXguaHRtbCc6ICdzcmMnLFxuICAgICAgICAgICAgJ2NvbXBvbmVudHMnOiB7XG4gICAgICAgICAgICAgICdmb28tYmFyLmhicyc6IGA8ZGl2PkhlbGxvITwvZGl2PmBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnY29uZmlnJzoge30sXG4gICAgICAgICd0c2NvbmZpZy5qc29uJzogdHNjb25maWdDb250ZW50c1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoe1xuICAgICAgICB0cmVlczoge1xuICAgICAgICAgIG5vZGVNb2R1bGVzOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJylcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBsZXQgb3V0cHV0ID0gYXdhaXQgYnVpbGRPdXRwdXQoYXBwLnRvVHJlZSgpKTtcbiAgICAgIGxldCBhY3R1YWwgPSBvdXRwdXQucmVhZCgpO1xuXG4gICAgICBleHBlY3QoYWN0dWFsWydpbmRleC5odG1sJ10pLnRvLmVxdWFsKCdzcmMnKTtcbiAgICAgIGV4cGVjdChhY3R1YWxbJ2FwcC5qcyddKS50by5pbmNsdWRlKCdIZWxsbyEnKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdhbGxvd3MgdXNlcmxhbmQgYmFiZWwgcGx1Z2lucycsIGZ1bmN0aW9uKCkge1xuICAgICAgZnVuY3Rpb24gcmV2ZXJzZXIgKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IFwiYXN0LXRyYW5zZm9ybVwiLFxuICAgICAgICAgIHZpc2l0b3I6IHtcbiAgICAgICAgICAgIFN0cmluZ0xpdGVyYWwocGF0aCkge1xuICAgICAgICAgICAgICBwYXRoLm5vZGUudmFsdWUgPSBwYXRoLm5vZGUudmFsdWUuc3BsaXQoJycpLnJldmVyc2UoKS5qb2luKCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGl0KCdydW5zIHVzZXItbGFuZCBwbHVnaW5zJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlucHV0LndyaXRlKHtcbiAgICAgICAgICAnc3JjJzoge1xuICAgICAgICAgICAgJ2luZGV4LnRzJzogJ2NvbnNvbGUubG9nKFxcJ29sbGVoXFwnKTsnLFxuICAgICAgICAgICAgJ3VpJzoge1xuICAgICAgICAgICAgICAnaW5kZXguaHRtbCc6ICdzcmMnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICAnY29uZmlnJzoge30sXG4gICAgICAgICAgJ3RzY29uZmlnLmpzb24nOiB0c2NvbmZpZ0NvbnRlbnRzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoe1xuICAgICAgICAgIGJhYmVsOiB7XG4gICAgICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICAgIFtyZXZlcnNlcl1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHRyZWVzOiB7XG4gICAgICAgICAgICBub2RlTW9kdWxlczogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ25vZGVfbW9kdWxlcycpXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IG91dHB1dCA9IGF3YWl0IGJ1aWxkT3V0cHV0KGFwcC50b1RyZWUoKSk7XG4gICAgICAgIGxldCBhY3R1YWwgPSBvdXRwdXQucmVhZCgpO1xuXG4gICAgICAgIGV4cGVjdChhY3R1YWxbJ2luZGV4Lmh0bWwnXSkudG8uZXF1YWwoJ3NyYycpO1xuICAgICAgICBleHBlY3QoYWN0dWFsWydhcHAuanMnXSkudG8uaW5jbHVkZSgnaGVsbG8nKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2JhYmVsLXBsdWdpbi1kZWJ1Zy1tYWNyb3MnLCBmdW5jdGlvbigpIHtcbiAgICAgIGl0KCdyZXBsYWNlcyBAZ2xpbW1lci9lbnYgaW1wb3J0cycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICBpbnB1dC53cml0ZSh7XG4gICAgICAgICAgJ3NyYyc6IHtcbiAgICAgICAgICAgICdpbmRleC50cyc6ICdpbXBvcnQgeyBERUJVRyB9IGZyb20gXCJAZ2xpbW1lci9lbnZcIjsgY29uc29sZS5sb2coREVCVUcpOycsXG4gICAgICAgICAgICAndWknOiB7XG4gICAgICAgICAgICAgICdpbmRleC5odG1sJzogJ3NyYydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgICdjb25maWcnOiB7fSxcbiAgICAgICAgICAndHNjb25maWcuanNvbic6IHRzY29uZmlnQ29udGVudHNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGFwcCA9IGNyZWF0ZUFwcCh7XG4gICAgICAgICAgdHJlZXM6IHtcbiAgICAgICAgICAgIG5vZGVNb2R1bGVzOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJylcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgb3V0cHV0ID0gYXdhaXQgYnVpbGRPdXRwdXQoYXBwLnRvVHJlZSgpKTtcbiAgICAgICAgbGV0IGFjdHVhbCA9IG91dHB1dC5yZWFkKCk7XG5cbiAgICAgICAgZXhwZWN0KGFjdHVhbFsnaW5kZXguaHRtbCddKS50by5lcXVhbCgnc3JjJyk7XG4gICAgICAgIGV4cGVjdChhY3R1YWxbJ2FwcC5qcyddKS50by5pbmNsdWRlKCdjb25zb2xlLmxvZyh0cnVlKScpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdyZXdyaXRlcyBAZ2xpbW1lci9kZWJ1ZyBpbXBvcnRzJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlucHV0LndyaXRlKHtcbiAgICAgICAgICAnc3JjJzoge1xuICAgICAgICAgICAgJ2luZGV4LnRzJzogJ2ltcG9ydCB7IGFzc2VydCB9IGZyb20gXCJAZ2xpbW1lci9kZWJ1Z1wiOyBhc3NlcnQodHJ1ZSwgXCJzb21lIG1lc3NhZ2UgZm9yIGRlYnVnXCIpOycsXG4gICAgICAgICAgICAndWknOiB7XG4gICAgICAgICAgICAgICdpbmRleC5odG1sJzogJ3NyYydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgICdjb25maWcnOiB7fSxcbiAgICAgICAgICAndHNjb25maWcuanNvbic6IHRzY29uZmlnQ29udGVudHNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGFwcCA9IGNyZWF0ZUFwcCh7XG4gICAgICAgICAgdHJlZXM6IHtcbiAgICAgICAgICAgIG5vZGVNb2R1bGVzOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJylcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgb3V0cHV0ID0gYXdhaXQgYnVpbGRPdXRwdXQoYXBwLnRvVHJlZSgpKTtcbiAgICAgICAgbGV0IGFjdHVhbCA9IG91dHB1dC5yZWFkKCk7XG5cbiAgICAgICAgZXhwZWN0KGFjdHVhbFsnaW5kZXguaHRtbCddKS50by5lcXVhbCgnc3JjJyk7XG4gICAgICAgIGV4cGVjdChhY3R1YWxbJ2FwcC5qcyddKS50by5pbmNsdWRlKCd0cnVlICYmIGNvbnNvbGUuYXNzZXJ0KHRydWUnKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgncmVtb3ZlcyBAZ2xpbW1lci9kZWJ1ZyBpbXBvcnRzIGluIHByb2R1Y3Rpb24gYnVpbGRzJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIHByb2Nlc3MuZW52LkVNQkVSX0VOViA9ICdwcm9kdWN0aW9uJztcblxuICAgICAgICBpbnB1dC53cml0ZSh7XG4gICAgICAgICAgJ3NyYyc6IHtcbiAgICAgICAgICAgICdpbmRleC50cyc6ICdpbXBvcnQgeyBhc3NlcnQgfSBmcm9tIFwiQGdsaW1tZXIvZGVidWdcIjsgYXNzZXJ0KHRydWUsIFwic29tZSBtZXNzYWdlIGZvciBkZWJ1Z1wiKTsnLFxuICAgICAgICAgICAgJ3VpJzoge1xuICAgICAgICAgICAgICAnaW5kZXguaHRtbCc6ICdzcmMnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICAnY29uZmlnJzoge30sXG4gICAgICAgICAgJ3RzY29uZmlnLmpzb24nOiB0c2NvbmZpZ0NvbnRlbnRzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoe1xuICAgICAgICAgIHRyZWVzOiB7XG4gICAgICAgICAgICBub2RlTW9kdWxlczogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ25vZGVfbW9kdWxlcycpXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IG91dHB1dCA9IGF3YWl0IGJ1aWxkT3V0cHV0KGFwcC50b1RyZWUoKSk7XG4gICAgICAgIGxldCBhY3R1YWwgPSBvdXRwdXQucmVhZCgpO1xuXG4gICAgICAgIGV4cGVjdChhY3R1YWxbJ2luZGV4Lmh0bWwnXSkudG8uZXF1YWwoJ3NyYycpO1xuXG4gICAgICAgIGxldCBvdXRwdXRGaWxlcyA9IE9iamVjdC5rZXlzKGFjdHVhbCk7XG4gICAgICAgIGxldCBhcHBGaWxlID0gb3V0cHV0RmlsZXMuZmluZChmaWxlTmFtZSA9PiBmaWxlTmFtZS5zdGFydHNXaXRoKCdhcHAnKSk7XG5cbiAgICAgICAgZXhwZWN0KGFjdHVhbFthcHBGaWxlXSkudG8uaW5jbHVkZSgnZmFsc2UgJiYgY29uc29sZS5hc3NlcnQodHJ1ZScpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnYnVpbGRzIGEgbW9kdWxlIG1hcCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgaW5wdXQud3JpdGUoe1xuICAgICAgICAnc3JjJzoge1xuICAgICAgICAgICdpbmRleC50cyc6ICdpbXBvcnQgbW9kdWxlTWFwIGZyb20gXCIuLi9jb25maWcvbW9kdWxlLW1hcFwiOyBjb25zb2xlLmxvZyhtb2R1bGVNYXApOycsXG4gICAgICAgICAgJ3VpJzoge1xuICAgICAgICAgICAgJ2luZGV4Lmh0bWwnOiAnc3JjJyxcbiAgICAgICAgICAgICdjb21wb25lbnRzJzoge1xuICAgICAgICAgICAgICAnZm9vLWJhcic6IHtcbiAgICAgICAgICAgICAgICAndGVtcGxhdGUuaGJzJzogYDxkaXY+SGVsbG8hPC9kaXY+YFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbmZpZyc6IHt9LFxuICAgICAgICAndHNjb25maWcuanNvbic6IHRzY29uZmlnQ29udGVudHNcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgYXBwID0gY3JlYXRlQXBwKHtcbiAgICAgICAgdHJlZXM6IHtcbiAgICAgICAgICBub2RlTW9kdWxlczogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ25vZGVfbW9kdWxlcycpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbGV0IG91dHB1dCA9IGF3YWl0IGJ1aWxkT3V0cHV0KGFwcC50b1RyZWUoKSk7XG4gICAgICBsZXQgYWN0dWFsID0gb3V0cHV0LnJlYWQoKTtcblxuICAgICAgZXhwZWN0KGFjdHVhbFsnaW5kZXguaHRtbCddKS50by5lcXVhbCgnc3JjJyk7XG4gICAgICBleHBlY3QoYWN0dWFsWydhcHAuanMnXSkudG8uaW5jbHVkZSgndGVtcGxhdGU6L2dsaW1tZXItYXBwLXRlc3QvY29tcG9uZW50cy9mb28tYmFyJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnaW5jbHVkZXMgcmVzb2x2ZXIgY29uZmlnJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBpbnB1dC53cml0ZSh7XG4gICAgICAgICdzcmMnOiB7XG4gICAgICAgICAgJ2luZGV4LnRzJzogJ2ltcG9ydCByZXNvbHZlckNvbmZpZyBmcm9tIFwiLi4vY29uZmlnL3Jlc29sdmVyLWNvbmZpZ3VyYXRpb25cIjsgY29uc29sZS5sb2cocmVzb2x2ZXJDb25maWcpOycsXG4gICAgICAgICAgJ3VpJzoge1xuICAgICAgICAgICAgJ2luZGV4Lmh0bWwnOiAnc3JjJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbmZpZyc6IHt9LFxuICAgICAgICAndHNjb25maWcuanNvbic6IHRzY29uZmlnQ29udGVudHNcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgYXBwID0gY3JlYXRlQXBwKHtcbiAgICAgICAgdHJlZXM6IHtcbiAgICAgICAgICBub2RlTW9kdWxlczogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ25vZGVfbW9kdWxlcycpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbGV0IG91dHB1dCA9IGF3YWl0IGJ1aWxkT3V0cHV0KGFwcC50b1RyZWUoKSk7XG4gICAgICBsZXQgYWN0dWFsID0gb3V0cHV0LnJlYWQoKTtcblxuICAgICAgLy8gaXQgd291bGQgYmUgbXVjaCBiZXR0ZXIgdG8gY29uZmlybSB0aGUgZnVsbCBleHBlY3RlZCByZXNvbHZlciBjb25maWdcbiAgICAgIC8vIGJ1dCByb2xsdXAgYWN0dWFsbHkgcmVmb3JtYXRzIHRoZSBjb2RlIHNvIGl0IGRvZXNuJ3QgbWF0Y2ggYSBzaW1wbGVcbiAgICAgIC8vIEpTT04uc3RyaW5naWZ5J2llZCB2ZXJzaW9uIG9mIHRoZSBkZWZhdWx0TW9kdWxlQ29uZmlndXJhdGlvblxuICAgICAgZXhwZWN0KGFjdHVhbFsnYXBwLmpzJ10pLnRvLmluY2x1ZGUoJ2dsaW1tZXItYXBwLXRlc3QnKTtcbiAgICAgIGV4cGVjdChhY3R1YWxbJ2FwcC5qcyddKS50by5pbmNsdWRlKCdkZWZpbml0aXZlQ29sbGVjdGlvbicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2hvbm9ycyBvdXRwdXRQYXRocy5hcHAuanMnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGlucHV0LndyaXRlKHtcbiAgICAgICAgJ3NyYyc6IHtcbiAgICAgICAgICAnaW5kZXgudHMnOiAnJyxcbiAgICAgICAgICAndWknOiB7XG4gICAgICAgICAgICAnaW5kZXguaHRtbCc6ICdzcmMnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnY29uZmlnJzoge30sXG4gICAgICAgICd0c2NvbmZpZy5qc29uJzogdHNjb25maWdDb250ZW50c1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoe1xuICAgICAgICB0cmVlczoge1xuICAgICAgICAgIG5vZGVNb2R1bGVzOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJylcbiAgICAgICAgfSxcbiAgICAgICAgb3V0cHV0UGF0aHM6IHtcbiAgICAgICAgICBhcHA6IHtcbiAgICAgICAgICAgIGpzOiAnZm9vLWJhci1maWxlLmpzJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBsZXQgb3V0cHV0ID0gYXdhaXQgYnVpbGRPdXRwdXQoYXBwLnRvVHJlZSgpKTtcbiAgICAgIGxldCBhY3R1YWwgPSBvdXRwdXQucmVhZCgpO1xuXG4gICAgICBleHBlY3QoYWN0dWFsWydmb28tYmFyLWZpbGUuanMnXSkudG8uYmUuZGVmaW5lZDtcbiAgICB9KTtcblxuICAgIGl0KCdhbGxvd3Mgc3BlY2lmeWluZyByb2xsdXAgb3B0aW9ucycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgaW5wdXQud3JpdGUoe1xuICAgICAgICAnc3JjJzoge1xuICAgICAgICAgICdpbmRleC50cyc6ICdjb25zb2xlLmxvZyhcIk5PVyBZT1UgU0VFIE1FXCIpOycsXG4gICAgICAgICAgJ3VpJzoge1xuICAgICAgICAgICAgJ2luZGV4Lmh0bWwnOiAnc3JjJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbmZpZyc6IHt9LFxuICAgICAgICAndHNjb25maWcuanNvbic6IHRzY29uZmlnQ29udGVudHNcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgYXBwID0gY3JlYXRlQXBwKHtcbiAgICAgICAgdHJlZXM6IHtcbiAgICAgICAgICBub2RlTW9kdWxlczogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ25vZGVfbW9kdWxlcycpXG4gICAgICAgIH0sXG4gICAgICAgIHJvbGx1cDoge1xuICAgICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ3Rlc3QtcmVwbGFjZW1lbnQnLFxuICAgICAgICAgICAgICB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29kZS5yZXBsYWNlKCdOT1cgWU9VIFNFRSBNRScsICdOT1cgWU9VIERPTlxcJ1QnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGxldCBvdXRwdXQgPSBhd2FpdCBidWlsZE91dHB1dChhcHAudG9UcmVlKCkpO1xuICAgICAgbGV0IGFjdHVhbCA9IG91dHB1dC5yZWFkKCk7XG5cbiAgICAgIGV4cGVjdChhY3R1YWxbJ2FwcC5qcyddKS50by5pbmNsdWRlKCdOT1cgWU9VIERPTlxcJ1QnKTtcbiAgICB9KTtcblxuICAgIGl0KCdhbGxvd3MgcGFzc2luZyBjdXN0b20gQnJvY2NvbGkgbm9kZXMnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGlucHV0LndyaXRlKHtcbiAgICAgICAgJ3NyYyc6IHtcbiAgICAgICAgICAnaW5kZXgudHMnOiAnJyxcbiAgICAgICAgICAndWknOiB7XG4gICAgICAgICAgICAnaW5kZXguaHRtbCc6ICdzcmMnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnY29uZmlnJzoge30sXG4gICAgICAgICd0c2NvbmZpZy5qc29uJzogdHNjb25maWdDb250ZW50c1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoe1xuICAgICAgICB0cmVlczoge1xuICAgICAgICAgIHNyYzogc3Rldy5sb2cocGF0aC5qb2luKGlucHV0LnBhdGgoKSwgJ3NyYycpKSxcbiAgICAgICAgICBub2RlTW9kdWxlczogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ25vZGVfbW9kdWxlcycpXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGxldCBvdXRwdXQgPSBhd2FpdCBidWlsZE91dHB1dChhcHAudG9UcmVlKCkpO1xuICAgICAgbGV0IGFjdHVhbCA9IG91dHB1dC5yZWFkKCk7XG5cbiAgICAgIGV4cGVjdChhY3R1YWxbJ2FwcC5qcyddKS50by5iZS5kZWZpbmVkO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2BnZXRHbGltbWVyRW52aXJvbm1lbnRgJywgKCkgPT4ge1xuICAgICAgaXQoJ3JldHVybnMgYXBwbGljYXRpb24gb3B0aW9ucyBmcm9tIGBjb25maWcvZW52aXJvbm1lbnQuanNgIGlmIGl0IGlzIHNwZWNpZmllZCB2aWEgYEdsaW1tZXJFTlZgJywgKCkgPT4ge1xuICAgICAgICBpbnB1dC53cml0ZSh7XG4gICAgICAgICAgJ2FwcCc6IHt9LFxuICAgICAgICAgICdzcmMnOiB7XG4gICAgICAgICAgICAndWknOiB7XG4gICAgICAgICAgICAgICdpbmRleC5odG1sJzogJ3NyYycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICdlbnZpcm9ubWVudC5qcyc6IGBcbiAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IEdsaW1tZXJFTlY6IHsgRkVBVFVSRVM6IHt9IH0gfTtcbiAgICAgICAgICAgIH07YFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgYXBwID0gY3JlYXRlQXBwKCk7XG5cbiAgICAgICAgZXhwZWN0KGFwcC5nZXRHbGltbWVyRW52aXJvbm1lbnQoKSkudG8uZGVlcC5lcXVhbCh7IEZFQVRVUkVTOiB7fSB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgncmV0dXJucyBhcHBsaWNhdGlvbiBvcHRpb25zIGZyb20gYGNvbmZpZy9lbnZpcm9ubWVudC5qc2AgaWYgaXQgaXMgc3BlY2lmaWVkIHZpYSBgRW1iZXJFTlZgJywgKCkgPT4ge1xuICAgICAgICBpbnB1dC53cml0ZSh7XG4gICAgICAgICAgJ2FwcCc6IHt9LFxuICAgICAgICAgICdzcmMnOiB7XG4gICAgICAgICAgICAndWknOiB7XG4gICAgICAgICAgICAgICdpbmRleC5odG1sJzogJ3NyYycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICdlbnZpcm9ubWVudC5qcyc6IGBcbiAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IEVtYmVyRU5WOiB7IEZFQVRVUkVTOiB7fSB9IH07XG4gICAgICAgICAgICB9O2BcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGFwcCA9IGNyZWF0ZUFwcCgpO1xuXG4gICAgICAgIGV4cGVjdChhcHAuZ2V0R2xpbW1lckVudmlyb25tZW50KCkpLnRvLmRlZXAuZXF1YWwoeyBGRUFUVVJFUzoge30gfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==