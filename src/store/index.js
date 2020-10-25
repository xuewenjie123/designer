import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex)
const store = {
	state: {
		designerImg: "",
	},
	mutations: {
		setDesignerImg(state, data) {
			state.designerImg = data
		},
	},
	actions: {},
	getters: {
		designerImg: (state) => state.designerImg,
	},
	modules: {},
}
export default new Vuex.Store({
	...store,
	plugins: [
		createPersistedState({
			storage: window.sessionStorage,
		}),
	],
})
