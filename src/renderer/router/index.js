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
    redirect: '/home/document',
    children: [{
      path: 'document',
      name: 'document',
      meta: { title: '公文管理', icon: 'tab' },
      component: () => import('@/views/document/index')
    },{
      path: 'edit',
      name: 'edit',
      hidden: true,
      meta: { title: '公文编辑', icon: 'upload' },
      component: () => import('@/views/document/edit')
    },{
      path: 'detail',
      name: 'detail',
      hidden: true,
      meta: { title: '公文详情', icon: 'upload' },
      component: () => import('@/views/document/detail')
    }]
  },
  {
    path: '/thesaurus',
    component: Layout,
    redirect: '/thesaurus/index',
    name: 'thesaurus',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/thesaurus/index'),
        meta: { title: '自定义词库', icon: 'documentation' }
      },
      {
        path: 'list',
        name: 'list',
        hidden: true,
        component: () => import('@/views/thesaurus/list'),
        meta: { title: '词库列表', icon: 'ciku' }
      },
      {
        path: 'search',
        name: 'search',
        hidden: true,
        component: () => import('@/views/thesaurus/search'),
        meta: { title: '词库搜索', icon: 'ciku' }
      }
    ]
  },
    {
        path: '/thesaurus',
        component: Layout,
        meta: {
            title: '词库管理',
            icon: 'tree'
        },
        children: [
            {
                path: 'recycle',
                component: () => import('@/views/thesaurus/recycle'),
                name: 'recycle',
                meta: { title: '词库回收站', icon: 'tree', affix: true }
            },
        ]
    },
    // {
    //   path: '/history',
    //   component: Layout,
    //   hidden: true,
    //     children: [
    //         {
    //             path: 'index',
    //             name: 'history',
    //           hidden: true,
    //             component: () => import('@/views/doc/index'),
    //             meta: { title: '历史查询', icon: 'search' }
    //         }
    //     ]
    // },
  // {
  //   path: '/user',
  //   component: Layout,
  //     role:['puser','padmin','cadmin'],
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'user',
  //       component: () => import('@/views/user/index'),
  //       meta: { title: '用户管理', icon: 'people' }
  //     }
  //   ]
  // },
    {
        path: '/download',
        component: Layout,
        roles:['puser','padmin','cuser','cadmin'],
        children: [
            {
                path: 'index',
                roles:['puser','padmin','cuser','cadmin'],
                component: () => import('@/views/download/index'),
                name: 'download',
                meta: { title: '字体下载', icon: 'skill', affix: true }
            }
        ]
    },
    {
        path: '/password',
        component: Layout,
        role:['puser','padmin','cadmin','cuser'],
        children: [
            {
                path: 'password',
                name: 'password',
                component: () => import('@/views/user/account'),
                meta: { title: '修改密码', icon: 'lock' }
            }
        ]
    },
    // {
    //     path: '/license',
    //     component: Layout,
    //     role:['padmin','cadmin'],
    //     children: [
    //         {
    //             path: 'index',
    //             name: 'license',
    //             component: () => import('@/views/license/index'),
    //             meta: { title: '许可证管理', icon: 'tree' }
    //         }
    //     ]
    // },
  // {
  //   path: '/account',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'account',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: '账号设置', icon: 'set' }
  //     }
  //   ]
  // },
    // {
    //     path: '/notice',
    //     component: Layout,
    //     children: [
    //         {
    //             path: 'index',
    //             name: 'notice',
    //             component: () => import('@/views/notice/index'),
    //             meta: { title: '公文工具', icon: 'education' }
    //         }
    //     ]
    // },
    // {
    //     path: '/history',
    //     component: Layout,
    //     children: [
    //         {
    //             path: 'index',
    //             name: 'history',
    //             component: () => import('@/views/history/index'),
    //             meta: { title: '操作记录', icon: 'tree' }
    //         }
    //     ]
    // },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

