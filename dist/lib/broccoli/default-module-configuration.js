"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    types: {
        application: { definitiveCollection: 'main' },
        component: { definitiveCollection: 'components' },
        'component-test': { unresolvable: true },
        helper: { definitiveCollection: 'components' },
        'helper-test': { unresolvable: true },
        renderer: { definitiveCollection: 'main' },
        template: { definitiveCollection: 'components' }
    },
    collections: {
        main: {
            types: ['application', 'renderer']
        },
        components: {
            group: 'ui',
            types: ['component', 'component-test', 'template', 'helper', 'helper-test'],
            defaultType: 'component',
            privateCollections: ['utils']
        },
        styles: {
            group: 'ui',
            unresolvable: true
        },
        utils: {
            unresolvable: true
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1tb2R1bGUtY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQtbW9kdWxlLWNvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrQkFBZTtJQUNiLEtBQUssRUFBRTtRQUNMLFdBQVcsRUFBRSxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRTtRQUM3QyxTQUFTLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSxZQUFZLEVBQUU7UUFDakQsZ0JBQWdCLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFO1FBQ3hDLE1BQU0sRUFBRSxFQUFFLG9CQUFvQixFQUFFLFlBQVksRUFBRTtRQUM5QyxhQUFhLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFO1FBQ3JDLFFBQVEsRUFBRSxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRTtRQUMxQyxRQUFRLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSxZQUFZLEVBQUU7S0FDakQ7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUU7WUFDSixLQUFLLEVBQUUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDO1NBQ25DO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsS0FBSyxFQUFFLElBQUk7WUFDWCxLQUFLLEVBQUUsQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUM7WUFDM0UsV0FBVyxFQUFFLFdBQVc7WUFDeEIsa0JBQWtCLEVBQUUsQ0FBQyxPQUFPLENBQUM7U0FDOUI7UUFDRCxNQUFNLEVBQUU7WUFDTixLQUFLLEVBQUUsSUFBSTtZQUNYLFlBQVksRUFBRSxJQUFJO1NBQ25CO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsWUFBWSxFQUFFLElBQUk7U0FDbkI7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gIHR5cGVzOiB7XG4gICAgYXBwbGljYXRpb246IHsgZGVmaW5pdGl2ZUNvbGxlY3Rpb246ICdtYWluJyB9LFxuICAgIGNvbXBvbmVudDogeyBkZWZpbml0aXZlQ29sbGVjdGlvbjogJ2NvbXBvbmVudHMnIH0sXG4gICAgJ2NvbXBvbmVudC10ZXN0JzogeyB1bnJlc29sdmFibGU6IHRydWUgfSxcbiAgICBoZWxwZXI6IHsgZGVmaW5pdGl2ZUNvbGxlY3Rpb246ICdjb21wb25lbnRzJyB9LFxuICAgICdoZWxwZXItdGVzdCc6IHsgdW5yZXNvbHZhYmxlOiB0cnVlIH0sXG4gICAgcmVuZGVyZXI6IHsgZGVmaW5pdGl2ZUNvbGxlY3Rpb246ICdtYWluJyB9LFxuICAgIHRlbXBsYXRlOiB7IGRlZmluaXRpdmVDb2xsZWN0aW9uOiAnY29tcG9uZW50cycgfVxuICB9LFxuICBjb2xsZWN0aW9uczoge1xuICAgIG1haW46IHtcbiAgICAgIHR5cGVzOiBbJ2FwcGxpY2F0aW9uJywgJ3JlbmRlcmVyJ11cbiAgICB9LFxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgIGdyb3VwOiAndWknLFxuICAgICAgdHlwZXM6IFsnY29tcG9uZW50JywgJ2NvbXBvbmVudC10ZXN0JywgJ3RlbXBsYXRlJywgJ2hlbHBlcicsICdoZWxwZXItdGVzdCddLFxuICAgICAgZGVmYXVsdFR5cGU6ICdjb21wb25lbnQnLFxuICAgICAgcHJpdmF0ZUNvbGxlY3Rpb25zOiBbJ3V0aWxzJ11cbiAgICB9LFxuICAgIHN0eWxlczoge1xuICAgICAgZ3JvdXA6ICd1aScsXG4gICAgICB1bnJlc29sdmFibGU6IHRydWVcbiAgICB9LFxuICAgIHV0aWxzOiB7XG4gICAgICB1bnJlc29sdmFibGU6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iXX0=