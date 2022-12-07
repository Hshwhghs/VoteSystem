import Vue from 'vue'
import Router from 'vue-router'
import list from "../pages/list";
import index from "../pages/index";
import org from "../pages/org"
import user from "../pages/user"
import createVote from "../pages/createVote";
import login from "../pages/login";
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录',
      component: login
    },
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/list',
      name: 'list',
      component: list
    },
    {
      path: '/organ',
      name: 'organ',
      component: org
    },
    {
      path: '/user',
      name: 'user',
      component: user
    },
    {
      path: '/create',
      name: 'create',
      component: createVote
    }
  ]
})
