import VueRouter from "vue-router"
import store from "../store"
import Vue from "vue"
// 路由匹
Vue.use(VueRouter)
const router = new VueRouter({
	mode: "history",
	routes: [
		{
			path: "/",
			name: "index",
			redirect: "/startDesigner",
		},
		{
			path: "/startDesigner",
			name: "startDesigner",
			component: () =>
				import(
					/* webpackChunkName: "startDesigner" */ "@/pages/startDesigner/index.vue"
				),
		},
		{
			path: "/designer",
			name: "designer",
			component: () =>
				import(
					/* webpackChunkName: "designer" */ "@/pages/designer/index.vue"
				),
		},
		{
			path: "/previewDesigner",
			name: "previewDesigner",
			component: () =>
				import(
					/* webpackChunkName: "previewDesigner" */ "@/pages/previewDesigner/index.vue"
				),
		},
	],
})
const whiteList = [] //白名单

router.beforeEach((to, from, next) => {
	let isLogin = store.state.token
	if (!isLogin && whiteList.indexOf(to.path) !== -1) {
		next({ path: "/login" })
	} else {
		next()
	}
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err)
}
export default router
