'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers/helpers");
describe('Acceptance: ember generate and destroy glimmer-component', function () {
    helpers_1.setupTestHooks(this);
    // testing that this is failing doesn't work properly at the moment
    it.skip('glimmer-component foo', function () {
        var args = ['glimmer-component', 'foo'];
        return helpers_1.emberNew().then(function () {
            return helpers_1.expect(helpers_1.emberGenerate(args)).to.be.rejected;
        });
    });
    it('glimmer-component foo-bar', function () {
        var args = ['glimmer-component', 'foo-bar'];
        return helpers_1.emberNew()
            .then(function () { return helpers_1.emberGenerateDestroy(args, function (file) {
            helpers_1.expect(file('src/ui/components/foo-bar/component.ts'))
                .to.contain("import Component from '@glimmer/component';")
                .to.contain("export default class FooBar extends Component {");
            helpers_1.expect(file('src/ui/components/foo-bar/template.hbs'))
                .to.contain("<div></div>");
            helpers_1.expect(file('src/ui/components/foo-bar/component.js')).to.not.exist;
            helpers_1.expect(file('src/ui/components/foo-bar/helper.ts')).to.not.exist;
        }); });
    });
    it('glimmer-component foo/bar/x-baz', function () {
        var args = ['glimmer-component', 'foo/bar/x-baz'];
        return helpers_1.emberNew()
            .then(function () { return helpers_1.emberGenerateDestroy(args, function (file) {
            helpers_1.expect(file('src/ui/components/foo/bar/x-baz/component.ts'))
                .to.contain("import Component from '@glimmer/component';")
                .to.contain("export default class XBaz extends Component {");
            helpers_1.expect(file('src/ui/components/foo/bar/x-baz/template.hbs'))
                .to.contain("<div></div>");
            helpers_1.expect(file('src/ui/components/foo/bar/x-baz/component.js')).to.not.exist;
            helpers_1.expect(file('src/ui/components/foo/bar/x-baz/helper.ts')).to.not.exist;
        }); });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xpbW1lci1jb21wb25lbnQtdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdsaW1tZXItY29tcG9uZW50LXRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUViLDZDQU0yQjtBQUczQixRQUFRLENBQUMsMERBQTBELEVBQUU7SUFDbkUsd0JBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVyQixtRUFBbUU7SUFDbkUsRUFBRSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtRQUMvQixJQUFJLElBQUksR0FBRyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhDLE1BQU0sQ0FBQyxrQkFBUSxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxnQkFBTSxDQUFDLHVCQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDJCQUEyQixFQUFFO1FBQzlCLElBQUksSUFBSSxHQUFHLENBQUMsbUJBQW1CLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFNUMsTUFBTSxDQUFDLGtCQUFRLEVBQUU7YUFDZCxJQUFJLENBQUMsY0FBTSxPQUFBLDhCQUFvQixDQUFDLElBQUksRUFBRSxVQUFDLElBQUk7WUFDMUMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQztpQkFDbkQsRUFBRSxDQUFDLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQztpQkFDekQsRUFBRSxDQUFDLE9BQU8sQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1lBRWpFLGdCQUFNLENBQUMsSUFBSSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7aUJBQ25ELEVBQUUsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFN0IsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ3BFLGdCQUFNLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUNuRSxDQUFDLENBQUMsRUFWVSxDQVVWLENBQUMsQ0FBQztJQUNSLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO1FBQ3BDLElBQUksSUFBSSxHQUFHLENBQUMsbUJBQW1CLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFbEQsTUFBTSxDQUFDLGtCQUFRLEVBQUU7YUFDZCxJQUFJLENBQUMsY0FBTSxPQUFBLDhCQUFvQixDQUFDLElBQUksRUFBRSxVQUFDLElBQUk7WUFDMUMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsOENBQThDLENBQUMsQ0FBQztpQkFDekQsRUFBRSxDQUFDLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQztpQkFDekQsRUFBRSxDQUFDLE9BQU8sQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1lBRS9ELGdCQUFNLENBQUMsSUFBSSxDQUFDLDhDQUE4QyxDQUFDLENBQUM7aUJBQ3pELEVBQUUsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFN0IsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsOENBQThDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQzFFLGdCQUFNLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUN6RSxDQUFDLENBQUMsRUFWVSxDQVVWLENBQUMsQ0FBQztJQUNSLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gIHNldHVwVGVzdEhvb2tzLFxuICBleHBlY3QsXG4gIGVtYmVyTmV3LFxuICBlbWJlckdlbmVyYXRlLFxuICBlbWJlckdlbmVyYXRlRGVzdHJveVxufSBmcm9tICcuL2hlbHBlcnMvaGVscGVycyc7XG5cblxuZGVzY3JpYmUoJ0FjY2VwdGFuY2U6IGVtYmVyIGdlbmVyYXRlIGFuZCBkZXN0cm95IGdsaW1tZXItY29tcG9uZW50JywgZnVuY3Rpb24oKSB7XG4gIHNldHVwVGVzdEhvb2tzKHRoaXMpO1xuXG4gIC8vIHRlc3RpbmcgdGhhdCB0aGlzIGlzIGZhaWxpbmcgZG9lc24ndCB3b3JrIHByb3Blcmx5IGF0IHRoZSBtb21lbnRcbiAgaXQuc2tpcCgnZ2xpbW1lci1jb21wb25lbnQgZm9vJywgZnVuY3Rpb24gKCkge1xuICAgIGxldCBhcmdzID0gWydnbGltbWVyLWNvbXBvbmVudCcsICdmb28nXTtcblxuICAgIHJldHVybiBlbWJlck5ldygpLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGV4cGVjdChlbWJlckdlbmVyYXRlKGFyZ3MpKS50by5iZS5yZWplY3RlZDtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ2dsaW1tZXItY29tcG9uZW50IGZvby1iYXInLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGFyZ3MgPSBbJ2dsaW1tZXItY29tcG9uZW50JywgJ2Zvby1iYXInXTtcblxuICAgIHJldHVybiBlbWJlck5ldygpXG4gICAgICAudGhlbigoKSA9PiBlbWJlckdlbmVyYXRlRGVzdHJveShhcmdzLCAoZmlsZSkgPT4ge1xuICAgICAgICBleHBlY3QoZmlsZSgnc3JjL3VpL2NvbXBvbmVudHMvZm9vLWJhci9jb21wb25lbnQudHMnKSlcbiAgICAgICAgICAudG8uY29udGFpbihgaW1wb3J0IENvbXBvbmVudCBmcm9tICdAZ2xpbW1lci9jb21wb25lbnQnO2ApXG4gICAgICAgICAgLnRvLmNvbnRhaW4oYGV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvb0JhciBleHRlbmRzIENvbXBvbmVudCB7YCk7XG5cbiAgICAgICAgZXhwZWN0KGZpbGUoJ3NyYy91aS9jb21wb25lbnRzL2Zvby1iYXIvdGVtcGxhdGUuaGJzJykpXG4gICAgICAgICAgLnRvLmNvbnRhaW4oYDxkaXY+PC9kaXY+YCk7XG5cbiAgICAgICAgZXhwZWN0KGZpbGUoJ3NyYy91aS9jb21wb25lbnRzL2Zvby1iYXIvY29tcG9uZW50LmpzJykpLnRvLm5vdC5leGlzdDtcbiAgICAgICAgZXhwZWN0KGZpbGUoJ3NyYy91aS9jb21wb25lbnRzL2Zvby1iYXIvaGVscGVyLnRzJykpLnRvLm5vdC5leGlzdDtcbiAgICAgIH0pKTtcbiAgfSk7XG5cbiAgaXQoJ2dsaW1tZXItY29tcG9uZW50IGZvby9iYXIveC1iYXonLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGFyZ3MgPSBbJ2dsaW1tZXItY29tcG9uZW50JywgJ2Zvby9iYXIveC1iYXonXTtcblxuICAgIHJldHVybiBlbWJlck5ldygpXG4gICAgICAudGhlbigoKSA9PiBlbWJlckdlbmVyYXRlRGVzdHJveShhcmdzLCAoZmlsZSkgPT4ge1xuICAgICAgICBleHBlY3QoZmlsZSgnc3JjL3VpL2NvbXBvbmVudHMvZm9vL2Jhci94LWJhei9jb21wb25lbnQudHMnKSlcbiAgICAgICAgICAudG8uY29udGFpbihgaW1wb3J0IENvbXBvbmVudCBmcm9tICdAZ2xpbW1lci9jb21wb25lbnQnO2ApXG4gICAgICAgICAgLnRvLmNvbnRhaW4oYGV4cG9ydCBkZWZhdWx0IGNsYXNzIFhCYXogZXh0ZW5kcyBDb21wb25lbnQge2ApO1xuXG4gICAgICAgIGV4cGVjdChmaWxlKCdzcmMvdWkvY29tcG9uZW50cy9mb28vYmFyL3gtYmF6L3RlbXBsYXRlLmhicycpKVxuICAgICAgICAgIC50by5jb250YWluKGA8ZGl2PjwvZGl2PmApO1xuXG4gICAgICAgIGV4cGVjdChmaWxlKCdzcmMvdWkvY29tcG9uZW50cy9mb28vYmFyL3gtYmF6L2NvbXBvbmVudC5qcycpKS50by5ub3QuZXhpc3Q7XG4gICAgICAgIGV4cGVjdChmaWxlKCdzcmMvdWkvY29tcG9uZW50cy9mb28vYmFyL3gtYmF6L2hlbHBlci50cycpKS50by5ub3QuZXhpc3Q7XG4gICAgICB9KSk7XG4gIH0pO1xufSk7XG4iXX0=