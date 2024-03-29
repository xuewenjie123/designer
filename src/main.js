import Vue from "vue"
import App from "./App.vue"
import router from "./router/index" //路由
import store from "./store/index.js" //store
import "./assets/css/reset.css"
import "./assets/js/rem.js" //rem
import HeaderCommon from "./components/HeaderCommon.vue"
import "vant/lib/index.css"
import { Swipe, SwipeItem, Lazyload, Slider, Loading } from "vant"
Vue.use(Lazyload)
Vue.use(Swipe)
Vue.use(Slider)
Vue.use(SwipeItem)
Vue.use(Loading)
import { get, post, upFile } from "./utils/ajax.js"
import dragAndResizable from "./components/dragAndResizable.vue"
Vue.component("drag-and-resizable", dragAndResizable)
Vue.component("header-common", HeaderCommon)
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$upFile = upFile
Vue.config.productionTip = false
if (process.env.NODE_ENV == "production") {
	global.console = {
		info: () => {},
		log: () => {},
		warn: () => {},
		error: () => {},
	}
}
new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app")
