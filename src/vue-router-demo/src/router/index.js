import Vue from 'vue'
// import VueRouter from 'vue-router'
import VueRouter from '../../../vue-router/index'
import Home from '../components/Hello.vue'
import About from '../components/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'name',
    component: Home
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    children: [
      {
        path: 'a',
        component: { render: (h) => <div>a页面</div> }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
