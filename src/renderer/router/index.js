import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/home'
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
    children: [{
      path: 'index',
      name: 'index',
      meta: { title: '首页', icon: 'icon_index_line' },
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/gongwen',
    component: Layout,
    redirect: '/gongwen/gongwen',
    meta: { title: '公文管理', icon: 'icon_invite' },
    name: 'gongwen',
    children: [
      {
        path: 'gongwen',
        name: 'Table1',
        component: () => import('@/views/gongwen/index'),
        meta: { title: '公文列表', icon: 'icon_invite' }
      },
      {
        path: 'detail',
        name: 'detail',
        hidden: true,
        component: () => import('@/views/gongwen/detail'),
        meta: { title: '模板编辑', icon: 'icon_invite' }
      },
      {
        path: 'cuobiezi',
        name: 'cuobiezi',
        hidden: true,
        component: () => import('@/views/gongwen/cuobiezi'),
        meta: { title: '错别字提示', icon: 'icon_invite' }
      }
    ]
  },
  {
    path: '/ciku',
    component: Layout,
    redirect: '/ciku/table',
    name: 'ciku',
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/private'),
        meta: { title: '词库管理', icon: 'icon_calendar' }
      }
    ]
  },
    {
        path: '/user',
        component: Layout,
        children: [
            {
                path: 'index',
                name: 'user',
                component: () => import('@/views/user/index'),
                meta: { title: '用户管理', icon: 'user' }
            }
        ]
    },
  {
    path: '/account',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'account',
        component: () => import('@/views/form/index'),
        meta: { title: '账号管理', icon: 'user' }
      }
    ]
  },


  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

