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

router.beforeEach((from, to, next) => {
  console.log(1)
  setTimeout(() => {
    next()
  }, 1000)
})
router.beforeEach((from, to, next) => {
  console.log(2)
  setTimeout(() => {
    next()
  }, 1000)
})
export default router
