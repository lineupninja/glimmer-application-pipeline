'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers/helpers");
describe('Acceptance: ember generate and destroy glimmer-helper', function () {
    helpers_1.setupTestHooks(this);
    it('glimmer-helper foo', function () {
        var args = ['glimmer-helper', 'foo'];
        return helpers_1.emberNew()
            .then(function () { return helpers_1.emberGenerateDestroy(args, function (file) {
            helpers_1.expect(file('src/ui/components/foo/helper.ts'))
                .to.contain("export default function foo(params) {");
            helpers_1.expect(file('src/ui/components/foo/helper.js')).to.not.exist;
            helpers_1.expect(file('src/ui/components/foo/template.hbs')).to.not.exist;
            helpers_1.expect(file('src/ui/components/foo/component.ts')).to.not.exist;
        }); });
    });
    it('glimmer-helper foo-bar', function () {
        var args = ['glimmer-helper', 'foo-bar'];
        return helpers_1.emberNew()
            .then(function () { return helpers_1.emberGenerateDestroy(args, function (file) {
            helpers_1.expect(file('src/ui/components/foo-bar/helper.ts'))
                .to.contain("export default function fooBar(params) {");
            helpers_1.expect(file('src/ui/components/foo-bar/helper.js')).to.not.exist;
            helpers_1.expect(file('src/ui/components/foo-bar/template.hbs')).to.not.exist;
            helpers_1.expect(file('src/ui/components/foo-bar/component.ts')).to.not.exist;
        }); });
    });
    it('glimmer-helper foo/bar/baz', function () {
        var args = ['glimmer-helper', 'foo/bar/baz'];
        return helpers_1.emberNew()
            .then(function () { return helpers_1.emberGenerateDestroy(args, function (file) {
            helpers_1.expect(file('src/ui/components/foo/bar/baz/helper.ts'))
                .to.contain("export default function baz(params) {");
            helpers_1.expect(file('src/ui/components/foo/bar/baz/helper.js')).to.not.exist;
            helpers_1.expect(file('src/ui/components/foo/bar/baz/template.hbs')).to.not.exist;
            helpers_1.expect(file('src/ui/components/foo/bar/baz/component.ts')).to.not.exist;
        }); });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xpbW1lci1oZWxwZXItdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdsaW1tZXItaGVscGVyLXRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUViLDZDQUsyQjtBQUUzQixRQUFRLENBQUMsdURBQXVELEVBQUU7SUFDaEUsd0JBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVyQixFQUFFLENBQUMsb0JBQW9CLEVBQUU7UUFDdkIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVyQyxNQUFNLENBQUMsa0JBQVEsRUFBRTthQUNkLElBQUksQ0FBQyxjQUFNLE9BQUEsOEJBQW9CLENBQUMsSUFBSSxFQUFFLFVBQUMsSUFBSTtZQUMxQyxnQkFBTSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO2lCQUM1QyxFQUFFLENBQUMsT0FBTyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7WUFFdkQsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQzdELGdCQUFNLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUNoRSxnQkFBTSxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFDbEUsQ0FBQyxDQUFDLEVBUFUsQ0FPVixDQUFDLENBQUM7SUFDUixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx3QkFBd0IsRUFBRTtRQUMzQixJQUFJLElBQUksR0FBRyxDQUFDLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXpDLE1BQU0sQ0FBQyxrQkFBUSxFQUFFO2FBQ2QsSUFBSSxDQUFDLGNBQU0sT0FBQSw4QkFBb0IsQ0FBQyxJQUFJLEVBQUUsVUFBQyxJQUFJO1lBQzFDLGdCQUFNLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7aUJBQ2hELEVBQUUsQ0FBQyxPQUFPLENBQUMsMENBQTBDLENBQUMsQ0FBQztZQUUxRCxnQkFBTSxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDakUsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ3BFLGdCQUFNLENBQUMsSUFBSSxDQUFDLHdDQUF3QyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUN0RSxDQUFDLENBQUMsRUFQVSxDQU9WLENBQUMsQ0FBQztJQUNSLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDRCQUE0QixFQUFFO1FBQy9CLElBQUksSUFBSSxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFFN0MsTUFBTSxDQUFDLGtCQUFRLEVBQUU7YUFDZCxJQUFJLENBQUMsY0FBTSxPQUFBLDhCQUFvQixDQUFDLElBQUksRUFBRSxVQUFDLElBQUk7WUFDMUMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMseUNBQXlDLENBQUMsQ0FBQztpQkFDcEQsRUFBRSxDQUFDLE9BQU8sQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1lBRXZELGdCQUFNLENBQUMsSUFBSSxDQUFDLHlDQUF5QyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUNyRSxnQkFBTSxDQUFDLElBQUksQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDeEUsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsNENBQTRDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQzFFLENBQUMsQ0FBQyxFQVBVLENBT1YsQ0FBQyxDQUFDO0lBQ1IsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAgc2V0dXBUZXN0SG9va3MsXG4gIGV4cGVjdCxcbiAgZW1iZXJOZXcsXG4gIGVtYmVyR2VuZXJhdGVEZXN0cm95XG59IGZyb20gJy4vaGVscGVycy9oZWxwZXJzJztcblxuZGVzY3JpYmUoJ0FjY2VwdGFuY2U6IGVtYmVyIGdlbmVyYXRlIGFuZCBkZXN0cm95IGdsaW1tZXItaGVscGVyJywgZnVuY3Rpb24oKSB7XG4gIHNldHVwVGVzdEhvb2tzKHRoaXMpO1xuXG4gIGl0KCdnbGltbWVyLWhlbHBlciBmb28nLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGFyZ3MgPSBbJ2dsaW1tZXItaGVscGVyJywgJ2ZvbyddO1xuXG4gICAgcmV0dXJuIGVtYmVyTmV3KClcbiAgICAgIC50aGVuKCgpID0+IGVtYmVyR2VuZXJhdGVEZXN0cm95KGFyZ3MsIChmaWxlKSA9PiB7XG4gICAgICAgIGV4cGVjdChmaWxlKCdzcmMvdWkvY29tcG9uZW50cy9mb28vaGVscGVyLnRzJykpXG4gICAgICAgICAgLnRvLmNvbnRhaW4oYGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZvbyhwYXJhbXMpIHtgKTtcblxuICAgICAgICBleHBlY3QoZmlsZSgnc3JjL3VpL2NvbXBvbmVudHMvZm9vL2hlbHBlci5qcycpKS50by5ub3QuZXhpc3Q7XG4gICAgICAgIGV4cGVjdChmaWxlKCdzcmMvdWkvY29tcG9uZW50cy9mb28vdGVtcGxhdGUuaGJzJykpLnRvLm5vdC5leGlzdDtcbiAgICAgICAgZXhwZWN0KGZpbGUoJ3NyYy91aS9jb21wb25lbnRzL2Zvby9jb21wb25lbnQudHMnKSkudG8ubm90LmV4aXN0O1xuICAgICAgfSkpO1xuICB9KTtcblxuICBpdCgnZ2xpbW1lci1oZWxwZXIgZm9vLWJhcicsIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYXJncyA9IFsnZ2xpbW1lci1oZWxwZXInLCAnZm9vLWJhciddO1xuXG4gICAgcmV0dXJuIGVtYmVyTmV3KClcbiAgICAgIC50aGVuKCgpID0+IGVtYmVyR2VuZXJhdGVEZXN0cm95KGFyZ3MsIChmaWxlKSA9PiB7XG4gICAgICAgIGV4cGVjdChmaWxlKCdzcmMvdWkvY29tcG9uZW50cy9mb28tYmFyL2hlbHBlci50cycpKVxuICAgICAgICAgIC50by5jb250YWluKGBleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmb29CYXIocGFyYW1zKSB7YCk7XG5cbiAgICAgICAgZXhwZWN0KGZpbGUoJ3NyYy91aS9jb21wb25lbnRzL2Zvby1iYXIvaGVscGVyLmpzJykpLnRvLm5vdC5leGlzdDtcbiAgICAgICAgZXhwZWN0KGZpbGUoJ3NyYy91aS9jb21wb25lbnRzL2Zvby1iYXIvdGVtcGxhdGUuaGJzJykpLnRvLm5vdC5leGlzdDtcbiAgICAgICAgZXhwZWN0KGZpbGUoJ3NyYy91aS9jb21wb25lbnRzL2Zvby1iYXIvY29tcG9uZW50LnRzJykpLnRvLm5vdC5leGlzdDtcbiAgICAgIH0pKTtcbiAgfSk7XG5cbiAgaXQoJ2dsaW1tZXItaGVscGVyIGZvby9iYXIvYmF6JywgZnVuY3Rpb24gKCkge1xuICAgIGxldCBhcmdzID0gWydnbGltbWVyLWhlbHBlcicsICdmb28vYmFyL2JheiddO1xuXG4gICAgcmV0dXJuIGVtYmVyTmV3KClcbiAgICAgIC50aGVuKCgpID0+IGVtYmVyR2VuZXJhdGVEZXN0cm95KGFyZ3MsIChmaWxlKSA9PiB7XG4gICAgICAgIGV4cGVjdChmaWxlKCdzcmMvdWkvY29tcG9uZW50cy9mb28vYmFyL2Jhei9oZWxwZXIudHMnKSlcbiAgICAgICAgICAudG8uY29udGFpbihgZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYmF6KHBhcmFtcykge2ApO1xuXG4gICAgICAgIGV4cGVjdChmaWxlKCdzcmMvdWkvY29tcG9uZW50cy9mb28vYmFyL2Jhei9oZWxwZXIuanMnKSkudG8ubm90LmV4aXN0O1xuICAgICAgICBleHBlY3QoZmlsZSgnc3JjL3VpL2NvbXBvbmVudHMvZm9vL2Jhci9iYXovdGVtcGxhdGUuaGJzJykpLnRvLm5vdC5leGlzdDtcbiAgICAgICAgZXhwZWN0KGZpbGUoJ3NyYy91aS9jb21wb25lbnRzL2Zvby9iYXIvYmF6L2NvbXBvbmVudC50cycpKS50by5ub3QuZXhpc3Q7XG4gICAgICB9KSk7XG4gIH0pO1xufSk7XG4iXX0=