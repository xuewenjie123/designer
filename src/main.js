import Vue from "vue"
import App from "./App.vue"
import router from "./router/index" //路由
import store from "./store/index.js" //store
import validateForm from "./utils/validateForm.js" //表单验证
import "./assets/css/reset.css"
import "./assets/js/rem.js" //rem
import HeaderCommon from "./components/HeaderCommon.vue"
import "vant/lib/index.css"
import { Swipe, SwipeItem, Lazyload, Slider } from "vant"
Vue.use(Lazyload)
Vue.use(Swipe)
Vue.use(Slider)
Vue.use(SwipeItem)
import { get, post, upFile } from "./utils/ajax.js"
import VueDraggableResizable from "vue-draggable-resizable"
import "vue-draggable-resizable/dist/VueDraggableResizable.css"
Vue.component("vue-draggable-resizable", VueDraggableResizable)
Vue.component("header-common", HeaderCommon)
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$upFile = upFile
Vue.use(validateForm)
Vue.config.productionTip = false
new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app")
