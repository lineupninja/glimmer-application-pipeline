"use strict";
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
var nodeResolve = require('rollup-plugin-node-resolve');
var babel = require('rollup-plugin-babel');
var GlimmerInlinePrecompile = require('babel-plugin-glimmer-inline-precompile');
var fs = require('fs');
var BabelPresetEnv = require('babel-preset-env').default;
var babel_plugin_debug_macros_1 = require("babel-plugin-debug-macros");
function hasPlugin(plugins, name) {
    return plugins.some(function (plugin) { return plugin.name === name; });
}
exports.Rollup = require('broccoli-rollup');
var RollupWithDependencies = (function (_super) {
    __extends(RollupWithDependencies, _super);
    function RollupWithDependencies(inputTree, options) {
        var _this = _super.call(this, inputTree, options) || this;
        _this.project = options.project;
        _this.buildConfig = options.buildConfig;
        return _this;
    }
    RollupWithDependencies.prototype.build = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var plugins = this.rollupOptions.plugins || [];
        var sourceMapsEnabled = !!this.rollupOptions.sourceMap;
        var isProduction = process.env.EMBER_ENV === 'production';
        if (sourceMapsEnabled) {
            plugins.push(loadWithInlineMap());
        }
        if (!hasPlugin(plugins, 'babel')) {
            var buildConfig = this.buildConfig;
            var userProvidedBabelConfig = buildConfig.babel && buildConfig.babel || {};
            var userProvidedBabelPlugins = userProvidedBabelConfig.plugins || [];
            var babelPlugins = [
                'external-helpers',
                [GlimmerInlinePrecompile],
                [babel_plugin_debug_macros_1.default, {
                        envFlags: {
                            source: '@glimmer/env',
                            flags: { DEBUG: !isProduction, PROD: isProduction, CI: !!process.env.CI }
                        },
                        debugTools: {
                            source: '@glimmer/debug'
                        }
                    }]
            ].concat(userProvidedBabelPlugins);
            var presetEnvConfig = Object.assign({ loose: true }, userProvidedBabelConfig, {
                // ensure we do not carry forward `plugins`
                plugins: undefined,
                // do not transpile modules
                modules: false,
                targets: this.project.targets
            });
            plugins.push(babel({
                presets: [
                    [BabelPresetEnv, presetEnvConfig]
                ],
                plugins: babelPlugins,
                sourceMaps: sourceMapsEnabled && 'inline',
                retainLines: false
            }));
        }
        if (!hasPlugin(plugins, 'resolve')) {
            plugins.push(nodeResolve({
                jsnext: true,
                module: true,
                modulesOnly: true,
                // this is a temporary work around to force all @glimmer/*
                // packages to use the `es2017` output (they are currently
                // using `es5` output)
                //
                // this should be removed once the various glimmerjs/glimmer-vm
                // packages have been updated to use the "Correct" module entry
                // point
                customResolveOptions: {
                    packageFilter: function (pkg, file) {
                        if (pkg.name.startsWith('@glimmer/')) {
                            pkg.main = 'dist/modules/es2017/index.js';
                        }
                        else if (pkg.module) {
                            pkg.main = pkg.module;
                        }
                        else if (pkg['jsnext:main']) {
                            pkg.main = pkg['jsnext:main'];
                        }
                        return pkg;
                    }
                }
            }));
        }
        this.rollupOptions.plugins = plugins;
        this.rollupOptions.onwarn = function (warning) {
            // Suppress known error message caused by TypeScript compiled code with Rollup
            // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
            if (warning.code === 'THIS_IS_UNDEFINED') {
                return;
            }
            console.log("Rollup warning: ", warning.message);
        };
        return exports.Rollup.prototype.build.apply(this, args);
    };
    return RollupWithDependencies;
}(exports.Rollup));
var SOURCE_MAPPING_DATA_URL = '//# sourceMap';
SOURCE_MAPPING_DATA_URL += 'pingURL=data:application/json;base64,';
function loadWithInlineMap() {
    return {
        load: function (id) {
            if (id.indexOf('\0') > -1) {
                return;
            }
            var code = fs.readFileSync(id, 'utf8');
            var result = {
                code: code,
                map: null
            };
            var index = code.lastIndexOf(SOURCE_MAPPING_DATA_URL);
            if (index === -1) {
                return result;
            }
            result.code = code;
            result.map = parseSourceMap(code.slice(index + SOURCE_MAPPING_DATA_URL.length));
            return result;
        }
    };
}
function parseSourceMap(base64) {
    return JSON.parse(new Buffer(base64, 'base64').toString('utf8'));
}
exports.default = RollupWithDependencies;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sbHVwLXdpdGgtZGVwZW5kZW5jaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm9sbHVwLXdpdGgtZGVwZW5kZW5jaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQzFELElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQzdDLElBQU0sdUJBQXVCLEdBQUcsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7QUFDbEYsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUUzRCx1RUFBb0Q7QUFFcEQsbUJBQW1CLE9BQU8sRUFBRSxJQUFJO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTSxJQUFJLE9BQUEsTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQXBCLENBQW9CLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBRVksUUFBQSxNQUFNLEdBRWYsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFTL0I7SUFBcUMsMENBQU07SUFJekMsZ0NBQVksU0FBUyxFQUFFLE9BQXNDO1FBQTdELFlBQ0Usa0JBQU0sU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUkxQjtRQUZDLEtBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUMvQixLQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7O0lBQ3pDLENBQUM7SUFLRCxzQ0FBSyxHQUFMO1FBQU0sY0FBTzthQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87WUFBUCx5QkFBTzs7UUFDWCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDL0MsSUFBSSxpQkFBaUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7UUFDdkQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEtBQUssWUFBWSxDQUFDO1FBRTFELEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztZQUN0QixPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBRW5DLElBQUksdUJBQXVCLEdBQUcsV0FBVyxDQUFDLEtBQUssSUFBSSxXQUFXLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUMzRSxJQUFJLHdCQUF3QixHQUFHLHVCQUF1QixDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7WUFFckUsSUFBSSxZQUFZO2dCQUNkLGtCQUFrQjtnQkFDbEIsQ0FBQyx1QkFBdUIsQ0FBQztnQkFDekIsQ0FBQyxtQ0FBVyxFQUFFO3dCQUNaLFFBQVEsRUFBRTs0QkFDUixNQUFNLEVBQUUsY0FBYzs0QkFDdEIsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRTt5QkFDMUU7d0JBRUQsVUFBVSxFQUFFOzRCQUNWLE1BQU0sRUFBRSxnQkFBZ0I7eUJBQ3pCO3FCQUNGLENBQUM7cUJBRUMsd0JBQXdCLENBQzVCLENBQUM7WUFFRixJQUFJLGVBQWUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLHVCQUF1QixFQUFFO2dCQUM1RSwyQ0FBMkM7Z0JBQzNDLE9BQU8sRUFBRSxTQUFTO2dCQUVsQiwyQkFBMkI7Z0JBQzNCLE9BQU8sRUFBRSxLQUFLO2dCQUVkLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU87YUFDOUIsQ0FBQyxDQUFDO1lBRUgsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ2pCLE9BQU8sRUFBRTtvQkFDUCxDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUM7aUJBQ2xDO2dCQUNELE9BQU8sRUFBRSxZQUFZO2dCQUNyQixVQUFVLEVBQUUsaUJBQWlCLElBQUksUUFBUTtnQkFDekMsV0FBVyxFQUFFLEtBQUs7YUFDbkIsQ0FBQyxDQUFDLENBQUM7UUFDTixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFDdkIsTUFBTSxFQUFFLElBQUk7Z0JBQ1osTUFBTSxFQUFFLElBQUk7Z0JBQ1osV0FBVyxFQUFFLElBQUk7Z0JBRWpCLDBEQUEwRDtnQkFDMUQsMERBQTBEO2dCQUMxRCxzQkFBc0I7Z0JBQ3RCLEVBQUU7Z0JBQ0YsK0RBQStEO2dCQUMvRCwrREFBK0Q7Z0JBQy9ELFFBQVE7Z0JBQ1Isb0JBQW9CLEVBQUM7b0JBQ25CLGFBQWEsWUFBQyxHQUFHLEVBQUUsSUFBSTt3QkFDckIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNyQyxHQUFHLENBQUMsSUFBSSxHQUFHLDhCQUE4QixDQUFDO3dCQUM1QyxDQUFDO3dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs0QkFDdEIsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO3dCQUN4QixDQUFDO3dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUM5QixHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDaEMsQ0FBQzt3QkFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO29CQUNiLENBQUM7aUJBQ0Y7YUFDRixDQUFDLENBQUMsQ0FBQztRQUNOLENBQUM7UUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFFckMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsVUFBUyxPQUFPO1lBQzFDLDhFQUE4RTtZQUM5RSwwRUFBMEU7WUFDMUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLE1BQU0sQ0FBQztZQUNULENBQUM7WUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUM7UUFFRixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0gsNkJBQUM7QUFBRCxDQUFDLEFBNUdELENBQXFDLGNBQU0sR0E0RzFDO0FBRUQsSUFBSSx1QkFBdUIsR0FBRyxlQUFlLENBQUM7QUFDOUMsdUJBQXVCLElBQUksdUNBQXVDLENBQUM7QUFFbkU7SUFDRSxNQUFNLENBQUM7UUFDTCxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2hCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUFDLENBQUM7WUFFdEMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDdkMsSUFBSSxNQUFNLEdBQUc7Z0JBQ1gsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsR0FBRyxFQUFFLElBQUk7YUFDVixDQUFDO1lBQ0YsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBQ3RELEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDaEIsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxHQUFHLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDaEYsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCx3QkFBd0IsTUFBTTtJQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDbkUsQ0FBQztBQUVELGtCQUFlLHNCQUFzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgbm9kZVJlc29sdmUgPSByZXF1aXJlKCdyb2xsdXAtcGx1Z2luLW5vZGUtcmVzb2x2ZScpO1xuY29uc3QgYmFiZWwgPSByZXF1aXJlKCdyb2xsdXAtcGx1Z2luLWJhYmVsJyk7XG5jb25zdCBHbGltbWVySW5saW5lUHJlY29tcGlsZSA9IHJlcXVpcmUoJ2JhYmVsLXBsdWdpbi1nbGltbWVyLWlubGluZS1wcmVjb21waWxlJyk7XG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCBCYWJlbFByZXNldEVudiA9IHJlcXVpcmUoJ2JhYmVsLXByZXNldC1lbnYnKS5kZWZhdWx0O1xuaW1wb3J0IHsgUHJvamVjdCwgVHJlZSwgVHJlZUVudHJ5LCBSb2xsdXBPcHRpb25zLCBHbGltbWVyQXBwT3B0aW9ucyB9IGZyb20gJy4uL2ludGVyZmFjZXMnO1xuaW1wb3J0IERlYnVnTWFjcm9zIGZyb20gJ2JhYmVsLXBsdWdpbi1kZWJ1Zy1tYWNyb3MnO1xuXG5mdW5jdGlvbiBoYXNQbHVnaW4ocGx1Z2lucywgbmFtZSkge1xuICByZXR1cm4gcGx1Z2lucy5zb21lKHBsdWdpbiA9PiBwbHVnaW4ubmFtZSA9PT0gbmFtZSk7XG59XG5cbmV4cG9ydCBjb25zdCBSb2xsdXA6IHtcbiAgbmV3IChpbnB1dE5vZGU6IFRyZWVFbnRyeSwgb3B0aW9ucz8pOiBUcmVlO1xufSA9IHJlcXVpcmUoJ2Jyb2Njb2xpLXJvbGx1cCcpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJvbGx1cFdpdGhEZXBlbmRlbmNpZXNPcHRpb25zIHtcbiAgaW5wdXRGaWxlczogc3RyaW5nW107XG4gIHJvbGx1cD86IFJvbGx1cE9wdGlvbnM7XG4gIHByb2plY3Q6IFByb2plY3Q7XG4gIGJ1aWxkQ29uZmlnOiBHbGltbWVyQXBwT3B0aW9ucztcbn1cblxuY2xhc3MgUm9sbHVwV2l0aERlcGVuZGVuY2llcyBleHRlbmRzIFJvbGx1cCB7XG4gIHByaXZhdGUgcHJvamVjdDogUHJvamVjdDtcbiAgcHJpdmF0ZSBidWlsZENvbmZpZzogR2xpbW1lckFwcE9wdGlvbnM7XG5cbiAgY29uc3RydWN0b3IoaW5wdXRUcmVlLCBvcHRpb25zOiBSb2xsdXBXaXRoRGVwZW5kZW5jaWVzT3B0aW9ucykge1xuICAgIHN1cGVyKGlucHV0VHJlZSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnByb2plY3QgPSBvcHRpb25zLnByb2plY3Q7XG4gICAgdGhpcy5idWlsZENvbmZpZyA9IG9wdGlvbnMuYnVpbGRDb25maWc7XG4gIH1cblxuICByb2xsdXBPcHRpb25zOiBhbnk7XG4gIGlucHV0UGF0aHM6IGFueVtdO1xuXG4gIGJ1aWxkKC4uLmFyZ3MpIHtcbiAgICBsZXQgcGx1Z2lucyA9IHRoaXMucm9sbHVwT3B0aW9ucy5wbHVnaW5zIHx8IFtdO1xuICAgIGxldCBzb3VyY2VNYXBzRW5hYmxlZCA9ICEhdGhpcy5yb2xsdXBPcHRpb25zLnNvdXJjZU1hcDtcbiAgICBsZXQgaXNQcm9kdWN0aW9uID0gcHJvY2Vzcy5lbnYuRU1CRVJfRU5WID09PSAncHJvZHVjdGlvbic7XG5cbiAgICBpZiAoc291cmNlTWFwc0VuYWJsZWQpIHtcbiAgICAgIHBsdWdpbnMucHVzaChsb2FkV2l0aElubGluZU1hcCgpKTtcbiAgICB9XG5cbiAgICBpZiAoIWhhc1BsdWdpbihwbHVnaW5zLCAnYmFiZWwnKSkge1xuICAgICAgbGV0IGJ1aWxkQ29uZmlnID0gdGhpcy5idWlsZENvbmZpZztcblxuICAgICAgbGV0IHVzZXJQcm92aWRlZEJhYmVsQ29uZmlnID0gYnVpbGRDb25maWcuYmFiZWwgJiYgYnVpbGRDb25maWcuYmFiZWwgfHwge307XG4gICAgICBsZXQgdXNlclByb3ZpZGVkQmFiZWxQbHVnaW5zID0gdXNlclByb3ZpZGVkQmFiZWxDb25maWcucGx1Z2lucyB8fCBbXTtcblxuICAgICAgbGV0IGJhYmVsUGx1Z2lucyA9IFtcbiAgICAgICAgJ2V4dGVybmFsLWhlbHBlcnMnLFxuICAgICAgICBbR2xpbW1lcklubGluZVByZWNvbXBpbGVdLFxuICAgICAgICBbRGVidWdNYWNyb3MsIHtcbiAgICAgICAgICBlbnZGbGFnczoge1xuICAgICAgICAgICAgc291cmNlOiAnQGdsaW1tZXIvZW52JyxcbiAgICAgICAgICAgIGZsYWdzOiB7IERFQlVHOiAhaXNQcm9kdWN0aW9uLCBQUk9EOiBpc1Byb2R1Y3Rpb24sIENJOiAhIXByb2Nlc3MuZW52LkNJIH1cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgZGVidWdUb29sczoge1xuICAgICAgICAgICAgc291cmNlOiAnQGdsaW1tZXIvZGVidWcnXG4gICAgICAgICAgfVxuICAgICAgICB9XSxcblxuICAgICAgICAuLi51c2VyUHJvdmlkZWRCYWJlbFBsdWdpbnNcbiAgICAgIF07XG5cbiAgICAgIGxldCBwcmVzZXRFbnZDb25maWcgPSBPYmplY3QuYXNzaWduKHsgbG9vc2U6IHRydWUgfSwgdXNlclByb3ZpZGVkQmFiZWxDb25maWcsIHtcbiAgICAgICAgLy8gZW5zdXJlIHdlIGRvIG5vdCBjYXJyeSBmb3J3YXJkIGBwbHVnaW5zYFxuICAgICAgICBwbHVnaW5zOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLy8gZG8gbm90IHRyYW5zcGlsZSBtb2R1bGVzXG4gICAgICAgIG1vZHVsZXM6IGZhbHNlLFxuXG4gICAgICAgIHRhcmdldHM6IHRoaXMucHJvamVjdC50YXJnZXRzXG4gICAgICB9KTtcblxuICAgICAgcGx1Z2lucy5wdXNoKGJhYmVsKHtcbiAgICAgICAgcHJlc2V0czogW1xuICAgICAgICAgIFtCYWJlbFByZXNldEVudiwgcHJlc2V0RW52Q29uZmlnXVxuICAgICAgICBdLFxuICAgICAgICBwbHVnaW5zOiBiYWJlbFBsdWdpbnMsXG4gICAgICAgIHNvdXJjZU1hcHM6IHNvdXJjZU1hcHNFbmFibGVkICYmICdpbmxpbmUnLFxuICAgICAgICByZXRhaW5MaW5lczogZmFsc2VcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBpZiAoIWhhc1BsdWdpbihwbHVnaW5zLCAncmVzb2x2ZScpKSB7XG4gICAgICBwbHVnaW5zLnB1c2gobm9kZVJlc29sdmUoe1xuICAgICAgICBqc25leHQ6IHRydWUsXG4gICAgICAgIG1vZHVsZTogdHJ1ZSxcbiAgICAgICAgbW9kdWxlc09ubHk6IHRydWUsXG5cbiAgICAgICAgLy8gdGhpcyBpcyBhIHRlbXBvcmFyeSB3b3JrIGFyb3VuZCB0byBmb3JjZSBhbGwgQGdsaW1tZXIvKlxuICAgICAgICAvLyBwYWNrYWdlcyB0byB1c2UgdGhlIGBlczIwMTdgIG91dHB1dCAodGhleSBhcmUgY3VycmVudGx5XG4gICAgICAgIC8vIHVzaW5nIGBlczVgIG91dHB1dClcbiAgICAgICAgLy9cbiAgICAgICAgLy8gdGhpcyBzaG91bGQgYmUgcmVtb3ZlZCBvbmNlIHRoZSB2YXJpb3VzIGdsaW1tZXJqcy9nbGltbWVyLXZtXG4gICAgICAgIC8vIHBhY2thZ2VzIGhhdmUgYmVlbiB1cGRhdGVkIHRvIHVzZSB0aGUgXCJDb3JyZWN0XCIgbW9kdWxlIGVudHJ5XG4gICAgICAgIC8vIHBvaW50XG4gICAgICAgIGN1c3RvbVJlc29sdmVPcHRpb25zOntcbiAgICAgICAgICBwYWNrYWdlRmlsdGVyKHBrZywgZmlsZSkge1xuICAgICAgICAgICAgaWYgKHBrZy5uYW1lLnN0YXJ0c1dpdGgoJ0BnbGltbWVyLycpKSB7XG4gICAgICAgICAgICAgIHBrZy5tYWluID0gJ2Rpc3QvbW9kdWxlcy9lczIwMTcvaW5kZXguanMnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwa2cubW9kdWxlKSB7XG4gICAgICAgICAgICAgIHBrZy5tYWluID0gcGtnLm1vZHVsZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGtnWydqc25leHQ6bWFpbiddKSB7XG4gICAgICAgICAgICAgIHBrZy5tYWluID0gcGtnWydqc25leHQ6bWFpbiddO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcGtnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIHRoaXMucm9sbHVwT3B0aW9ucy5wbHVnaW5zID0gcGx1Z2lucztcblxuICAgIHRoaXMucm9sbHVwT3B0aW9ucy5vbndhcm4gPSBmdW5jdGlvbih3YXJuaW5nKSB7XG4gICAgICAvLyBTdXBwcmVzcyBrbm93biBlcnJvciBtZXNzYWdlIGNhdXNlZCBieSBUeXBlU2NyaXB0IGNvbXBpbGVkIGNvZGUgd2l0aCBSb2xsdXBcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9yb2xsdXAvcm9sbHVwL3dpa2kvVHJvdWJsZXNob290aW5nI3RoaXMtaXMtdW5kZWZpbmVkXG4gICAgICBpZiAod2FybmluZy5jb2RlID09PSAnVEhJU19JU19VTkRFRklORUQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKFwiUm9sbHVwIHdhcm5pbmc6IFwiLCB3YXJuaW5nLm1lc3NhZ2UpO1xuICAgIH07XG5cbiAgICByZXR1cm4gUm9sbHVwLnByb3RvdHlwZS5idWlsZC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxufVxuXG5sZXQgU09VUkNFX01BUFBJTkdfREFUQV9VUkwgPSAnLy8jIHNvdXJjZU1hcCc7XG5TT1VSQ0VfTUFQUElOR19EQVRBX1VSTCArPSAncGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LCc7XG5cbmZ1bmN0aW9uIGxvYWRXaXRoSW5saW5lTWFwKCkge1xuICByZXR1cm4ge1xuICAgIGxvYWQ6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgaWYgKGlkLmluZGV4T2YoJ1xcMCcpID4gLTEpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHZhciBjb2RlID0gZnMucmVhZEZpbGVTeW5jKGlkLCAndXRmOCcpO1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgY29kZTogY29kZSxcbiAgICAgICAgbWFwOiBudWxsXG4gICAgICB9O1xuICAgICAgdmFyIGluZGV4ID0gY29kZS5sYXN0SW5kZXhPZihTT1VSQ0VfTUFQUElOR19EQVRBX1VSTCk7XG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgICByZXN1bHQuY29kZSA9IGNvZGU7XG4gICAgICByZXN1bHQubWFwID0gcGFyc2VTb3VyY2VNYXAoY29kZS5zbGljZShpbmRleCArIFNPVVJDRV9NQVBQSU5HX0RBVEFfVVJMLmxlbmd0aCkpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlU291cmNlTWFwKGJhc2U2NCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShuZXcgQnVmZmVyKGJhc2U2NCwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCd1dGY4JykpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBSb2xsdXBXaXRoRGVwZW5kZW5jaWVzO1xuIl19