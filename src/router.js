import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
    {
        path: '*',
        redirect: '/home'
    },
    {
        name: 'home',
        component: () => import('./components/home'),
        meta: {
            title: '首页'
        }
    },
    {
        name: 'scan',
        component: () => import('./components/scan'),
        meta: {
            title: '扫描商品'
        }
    }

];

// add route path
routes.forEach(route => {
    route.path = route.path || '/' + (route.name || '');
});

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
    const title = to.meta && to.meta.title;
    if (title) {
        document.title = title;
    }
    next();
});

export {
    router
};
