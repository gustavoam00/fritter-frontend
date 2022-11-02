import Vue from 'vue';
import VueRouter from 'vue-router';
import FreetsPage from './components/Freet/FreetsPage.vue';
import SettingsPage from './components/Settings/SettingsPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import GroupPage from './components/Group/GroupPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/home', name: 'Home', component: FreetsPage},
  {path: '/settings', name: 'Settings', component: SettingsPage},
  {path: '/', name: 'Login', component: LoginPage},
  {path: '/groups', name: 'Groups', component: GroupPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if ((to.name == 'Login' || to.name == 'Not Found') && router.app.$store.state.username) {
      next({name: 'Home'}); // Go to Home page if user navigates to Login and are signed in
      return;
    }

    if ((to.name == 'Settings' || to.name == 'Not Found' || to.name == 'Home') && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Settings and are not signed in
      return;
    }
  }

  next();
});

export default router;
