import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
let routes = [{
        path: '/',
        component: () => import('@/views/layout/Layout.vue'),
        redirect: '/',
        children: [
            {
                path: '/',
                name: 'Home',
                component: () => import('@/views/Home.vue'),
                meta: {
                    title: '',
                    keepAlive: true
                }
            },
            {
                path: 'market',
                name: 'Market',
                component: () => import('@/views/Market.vue'),
                meta: {
                    title: '',
                    keepAlive: true 
                }
            },
            {
                path: 'myCloud',
                name: 'MyCloud',
                component: () => import('@/views/mydata/MyCloud.vue'),
                meta: {
                    title: '',
                    keepAlive: true
                }
            },
            {
                path: 'uploadFile',
                name: 'UploadFile',
                component: () => import('@/views/mydata/UploadFile.vue'),
                meta: {
                    title: '',
                    keepAlive: true 
                }
            },
            {
                path: 'fileDetail',
                name: 'FileDetail',
                component: () => import('@/views/mydata/FileDetail.vue'),
                meta: {
                    title: '',
                    keepAlive: true 
                }
            }
        ]
    },
    {
        path: '**',
        redirect: '/'
    }
]


const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    // const nextRoute = ['MyCloud', ] 
    // let isLogin = store.state.userInfo.isLogined;
    // if (nextRoute.indexOf(to.name) >= 0) {
    //     if (!isLogin) {
    //         next('/')
    //         return
    //     }
    // }
    document.documentElement.scrollTop = 0
    next()
})

export default router