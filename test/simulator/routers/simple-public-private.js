import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import PublicPage from '../pages/PublicPage.vue'
import PrivatePage from '../pages/PrivatePage.vue'
import UserMenuPage from '../pages/UserMenuPage.vue'
import LanguagePickerPage from '../pages/LanguagePickerPage.vue'

Vue.use(Router)

export function createRouter() {
  const router = new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),

    routes: [
      {
        path: '/',
        name: 'home',
        component: HomePage,
      },
      {
        path: '/public',
        name: 'public',
        component: PublicPage,
      },
      {
        path: '/private',
        name: 'private',
        component: PrivatePage,
        meta: { requiresAuth: true },
      },
      {
        path: '/user-menu',
        name: 'user-menu',
        component: UserMenuPage,
      },
      {
        path: '/language-picker',
        name: 'language-picker-page',
        component: LanguagePickerPage,
      },
    ],
  })

  return router
}
