import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '无锡陆贰捌科技', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '巡检记录', icon: 'example' },
    children: [
      {
        path: 'table',
        name: '巡检记录',
        component: () => import('@/views/logs/index'),
        meta: { title: '巡检记录', icon: 'table' }
      },
      {
        path: 'tree',
        name: '管线记录',
        component: () => import('@/views/tree/index'),
        meta: { title: '管线记录', icon: 'tree' }
      },
      {
        path: 'tree',
        name: '异常记录',
        component: () => import('@/views/tree/index'),
        meta: { title: '异常记录', icon: 'tree' }
      },
      {
        path: 'turnLog',
        name: '轮次记录',
        component: () => import('@/views/logs/turnLog'),
        meta: { title: '轮次记录', icon: 'tree' }
      },
      {
        path: 'pointLog',
        name: '巡检点记录',
        component: () => import('@/views/logs/pointLog'),
        meta: { title: '巡检点记录', icon: 'tree' }
      },
      {
        path: 'itemLog',
        name: '巡检项记录',
        component: () => import('@/views/logs/itemLog'),
        meta: { title: '巡检项记录', icon: 'tree' }
      },
      {
        path: 'deviceLog',
        name: '设备记录',
        component: () => import('@/views/logs/deviceLog'),
        meta: { title: '设备记录', icon: 'tree' }
      },
      {
        path: 'dutyCheckLog',
        name: '班中检查记录',
        component: () => import('@/views/logs/dutyCheckLog'),
        meta: { title: '班中检查记录', icon: 'tree' }
      },
      {
        path: 'dutyCheckItemLog',
        name: '班中检查项记录',
        component: () => import('@/views/logs/dutyCheckItemLog'),
        meta: { title: '班中检查项记录', icon: 'tree' }
      }
    ]
  },

  {
    path: '/statistic',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '数据统计',
        component: () => import('@/views/form/index'),
        meta: { title: '数据统计', icon: 'form' }
      }
    ]
  },

  {
    path: '/take-over-log',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '交班记录',
        component: () => import('@/views/form/index'),
        meta: { title: '交班记录', icon: 'form' }
      }
    ]
  },

  {
    path: '/tranfer-log',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '调班记录',
        component: () => import('@/views/form/index'),
        meta: { title: '调班记录', icon: 'form' }
      }
    ]
  },

  {
    path: '/abc',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'abc',
        component: () => import('@/views/form/index')
      }
    ]
  },

  {
    path: '/inspData',
    component: Layout,
    redirect: 'inspData',
    name: '巡检数据',
    meta: { title: '巡检数据', icon: 'tree' },
    children: [
      {
        path: 'point',
        name: '巡检数据',
        component: () => import('@/views/inspData/point'),
        meta: { title: '巡检数据', icon: 'form' }
      },
      {
        path: 'device',
        name: '设备管理',
        component: () => import('@/views/inspData/device'),
        meta: { title: '设备管理', icon: 'form' }
      },
      {
        path: 'item',
        name: '巡检项数据',
        component: () => import('@/views/inspData/item'),
        meta: { title: '巡检项数据', icon: 'form' }
      },
      {
        path: 'turn',
        name: '轮次管理',
        component: () => import('@/views/inspData/turn'),
        meta: { title: '轮次管理', icon: 'form' }
      },
      {
        path: 'dutyCheck',
        name: '班中检查',
        component: () => import('@/views/inspData/dutyCheck'),
        meta: { title: '班中检查', icon: 'form' }
      },
      {
        path: 'dutyCheckItem',
        name: '班中检查项',
        component: () => import('@/views/inspData/dutyCheckItem'),
        meta: { title: '班中检查项', icon: 'form' }
      }
    ]
  },

  {
    path: '/arrange-duty',
    component: Layout,
    redirect: 'dutyLog',
    name: '排班管理',
    meta: { title: '排班管理', icon: 'form' },
    children: [
      {
        path: 'dutyLogConfig',
        name: '排班设置',
        component: () => import('@/views/dutyLog/dutyLogConfig'),
        meta: { title: '排班设置', icon: 'form' }
      },
      {
        path: 'dutyLog',
        name: '排班记录',
        component: () => import('@/views/dutyLog/dutyLog'),
        meta: { title: '排班记录', icon: 'form' }
      }
    ]
  },

  {
    path: '/roleManage',
    component: Layout,
    redirect: 'roleManage',
    name: '角色管理',
    meta: { title: '角色管理', icon: 'form' },
    children: [
      {
        path: 'operationWay',
        name: '运转方式管理',
        component: () => import('@/views/roleManage/operationWay'),
        meta: { title: '运转方式管理', icon: 'form' }
      },
      {
        path: 'team',
        name: '值管理',
        component: () => import('@/views/roleManage/team'),
        meta: { title: '值管理', icon: 'form' }
      },
      {
        path: 'profession',
        name: '专业管理',
        component: () => import('@/views/roleManage/profession'),
        meta: { title: '专业管理', icon: 'form' }
      },
      {
        path: 'function',
        name: '功能管理',
        component: () => import('@/views/roleManage/function'),
        meta: { title: '功能管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/userManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'account manage',
        component: () => import('@/views/userManage/index'),
        meta: { title: '用户管理', icon: 'user' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
