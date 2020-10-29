import axios from "axios"
import { Toast } from "vant"
import qs from "qs"
let bulicurl = ""

if (process.env.NODE_ENV == "development") {
	bulicurl = "/api"
} else {
	bulicurl = "https://custom.sw580.net"
}
const instance = axios.create({
	//创建axios实例，在这里可以设置请求的默认配置
	timeout: 10000, // 设置超时时间10s
})

let httpCode = {
	//这里我简单列出一些常见的http状态码信息，可以自己去调整配置
	400: "请求参数错误",
	401: "权限不足, 请重新登录",
	403: "服务器拒绝本次访问",
	404: "请求资源未找到",
	500: "内部服务器错误",
	501: "服务器不支持该请求中使用的方法",
	502: "网关错误",
	504: "网关超时",
}

/** 添加请求拦截器 **/
instance.interceptors.request.use(
	(config) => {
		if (config.method == "get") {
			config.url += "?" + config.data
		}
		if (!config.noshowLoading) {
			Toast.loading({
				duration: 0,
				message: "加载中...",
				forbidClick: true,
				loadingType: "spinner",
			})
		}

		if (config.method == "post") {
			config.params = {}
		}
		return config
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error)
	}
)

/** 添加响应拦截器  **/
instance.interceptors.response.use(
	(response) => {
		console.log(response.config.url + "服务器返回数据", response.data)
		if (response.data.status) {
			//成功
			return Promise.resolve(response.data.other)
		} else {
			Toast(response.data.message)
			return Promise.reject(response.data.message)
		}
	},
	(error) => {
		Toast.clear()
		if (error.response) {
			// 根据请求失败的http状态码去给用户相应的提示
			let tips =
				error.response.status in httpCode
					? httpCode[error.response.status]
					: error.response.data.message
			Toast(tips)

			return Promise.reject(error)
		} else {
			Toast("请求超时, 请刷新重试")
			return Promise.reject(new Error("请求超时, 请刷新重试"))
		}
	}
)
const ajax = (methodType, url, params = {}, config) => {
	params.token = "123456"
	return new Promise((resolve, reject) => {
		instance({
			method: methodType,
			url: `${bulicurl}${url}`,
			data: qs.stringify(params),
			...config,
		})
			.then((response) => {
				if (!config.noshowLoading) {
					Toast.clear()
				}
				resolve(response)
			})
			.catch((error) => {
				if (!config.noshowLoading) {
					Toast.clear()
				}
				reject(error)
			})
	})
}
const upFileFetch = (url, methodsParams) => {
	// 事件端口为11002  接口路径 /event/  ||  /electric/   //
	let formData = new FormData()
	methodsParams.token = "123456"
	for (let attr in methodsParams) {
		formData.append(attr, methodsParams[attr])
	}
	for (var [a, b] of formData.entries()) {
		console.log(a, b)
	}
	return new Promise((resolve, reject) => {
		instance({
			method: "post",
			url: `${bulicurl}${url}`,
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
			.then((response) => {
				resolve(response)
			})
			.catch((error) => {
				reject(error)
			})
	})
}
export const get = (url, params, config = {}) =>
	ajax("get", url, params, config)
export const post = (url, params, config = {}) =>
	ajax("post", url, params, config)
export const upFile = (url, params) => upFileFetch(url, params)
