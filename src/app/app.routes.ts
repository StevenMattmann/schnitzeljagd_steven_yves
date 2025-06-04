import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    loadComponent: () =>
        import('./pages/tasks/tasks.page').then(m => m.TasksPage),
  },
  {
    path: 'geolocation',
    loadComponent: () =>
        import('./pages/geolocation/geolocation.page').then(m => m.GeolocationPage),
  },
  {
    path: 'qrcode',
    loadComponent: () =>
        import('./pages/qrcode/qrcode.page').then(m => m.QrcodePage),
  },
  {
    path: 'power',
    loadComponent: () =>
        import('./pages/power/power.page').then(m => m.PowerPage),
  },
  {
    path: 'distance',
    loadComponent: () =>
        import('./pages/distance/distance.page').then(m => m.DistancePage),
  },
];
