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
var fs = require('fs');
var path = require('path');
var walkSync = require('walk-sync');
exports.Plugin = require('broccoli-caching-writer');
var TestEntrypointBuilder = (function (_super) {
    __extends(TestEntrypointBuilder, _super);
    function TestEntrypointBuilder(testTree, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, [testTree], {
            annotation: options['annotation']
        }) || this;
        _this.options = options;
        return _this;
    }
    TestEntrypointBuilder.prototype.build = function () {
        var testDir = this.inputPaths[0];
        var testFiles = walkSync(testDir);
        function isTest(_a) {
            var name = _a.name;
            return name.match(/\-test$/);
        }
        function asImportStatement(_a) {
            var dir = _a.dir, name = _a.name;
            var testDirRelativePath = "./" + path.join(dir, name);
            return "import '" + testDirRelativePath + "';\n";
        }
        var contents = testFiles.map(path.parse).filter(isTest).map(asImportStatement).join('');
        fs.writeFileSync(path.posix.join(this.outputPath, 'tests.js'), contents, { encoding: 'utf8' });
    };
    return TestEntrypointBuilder;
}(exports.Plugin));
exports.default = TestEntrypointBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1lbnRyeXBvaW50LWJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXN0LWVudHJ5cG9pbnQtYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7OztBQUViLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBSXpCLFFBQUEsTUFBTSxHQUVmLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBRXZDO0lBQW1ELHlDQUFNO0lBQ3ZELCtCQUFZLFFBQVEsRUFBUyxPQUFZO1FBQVosd0JBQUEsRUFBQSxZQUFZO1FBQXpDLFlBQ0Usa0JBQU0sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNoQixVQUFVLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQztTQUNsQyxDQUFDLFNBQ0g7UUFKNEIsYUFBTyxHQUFQLE9BQU8sQ0FBSzs7SUFJekMsQ0FBQztJQUVELHFDQUFLLEdBQUw7UUFDRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVsQyxnQkFBZ0IsRUFBUTtnQkFBTixjQUFJO1lBQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFBQyxDQUFDO1FBQzNELDJCQUEyQixFQUFhO2dCQUFYLFlBQUcsRUFBRSxjQUFJO1lBQ3BDLElBQUksbUJBQW1CLEdBQUcsT0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUcsQ0FBQztZQUN0RCxNQUFNLENBQUMsYUFBVyxtQkFBbUIsU0FBTSxDQUFDO1FBQzlDLENBQUM7UUFFRCxJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXhGLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNqRyxDQUFDO0lBQ0gsNEJBQUM7QUFBRCxDQUFDLEFBckJELENBQW1ELGNBQU0sR0FxQnhEIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3Qgd2Fsa1N5bmMgPSByZXF1aXJlKCd3YWxrLXN5bmMnKTtcblxuaW1wb3J0IHsgVHJlZSwgVHJlZUVudHJ5IH0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBjb25zdCBQbHVnaW46IHtcbiAgbmV3IChpbnB1dE5vZGU6IFRyZWVFbnRyeVtdLCBvcHRpb25zPyk6IFRyZWU7XG59ID0gcmVxdWlyZSgnYnJvY2NvbGktY2FjaGluZy13cml0ZXInKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVzdEVudHJ5cG9pbnRCdWlsZGVyIGV4dGVuZHMgUGx1Z2luIHtcbiAgY29uc3RydWN0b3IodGVzdFRyZWUsIHB1YmxpYyBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihbdGVzdFRyZWVdLCB7XG4gICAgICBhbm5vdGF0aW9uOiBvcHRpb25zWydhbm5vdGF0aW9uJ11cbiAgICB9KTtcbiAgfVxuXG4gIGJ1aWxkKCkge1xuICAgIGxldCB0ZXN0RGlyID0gdGhpcy5pbnB1dFBhdGhzWzBdO1xuICAgIGxldCB0ZXN0RmlsZXMgPSB3YWxrU3luYyh0ZXN0RGlyKTtcblxuICAgIGZ1bmN0aW9uIGlzVGVzdCh7IG5hbWUgfSkgeyByZXR1cm4gbmFtZS5tYXRjaCgvXFwtdGVzdCQvKTsgfVxuICAgIGZ1bmN0aW9uIGFzSW1wb3J0U3RhdGVtZW50KHsgZGlyLCBuYW1lIH0pIHtcbiAgICAgIGxldCB0ZXN0RGlyUmVsYXRpdmVQYXRoID0gYC4vJHtwYXRoLmpvaW4oZGlyLCBuYW1lKX1gO1xuICAgICAgcmV0dXJuIGBpbXBvcnQgJyR7dGVzdERpclJlbGF0aXZlUGF0aH0nO1xcbmA7XG4gICAgfVxuXG4gICAgbGV0IGNvbnRlbnRzID0gdGVzdEZpbGVzLm1hcChwYXRoLnBhcnNlKS5maWx0ZXIoaXNUZXN0KS5tYXAoYXNJbXBvcnRTdGF0ZW1lbnQpLmpvaW4oJycpO1xuXG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLnBvc2l4LmpvaW4odGhpcy5vdXRwdXRQYXRoLCAndGVzdHMuanMnKSwgY29udGVudHMsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcbiAgfVxufVxuIl19