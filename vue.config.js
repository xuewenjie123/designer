let devConfig = {
	devServer: {
		// 基本路径
		proxy: {
			"/api": {
				target: "https://custom.sw580.net",
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					"^/api": "", //需要rewrite的,
				},
			},
		},
	},
	lintOnSave: false,
}

module.exports = devConfig
