import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tasks',
        loadComponent: () => import('../tasks/tasks').then(m => m.TasksPage)
      },
      {
        path: 'Login',
        loadComponent: () =>
          import('../login/login').then((m) => m.Login),
      },
      {
        path: 'leaderboard',
        loadComponent: () =>
          import('../leaderboard/leaderboard').then((m) => m.Leaderboard),
      },
      {
        path: '',
        redirectTo: '/tabs/tasks',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tasks',
    pathMatch: 'full',
  },
];
