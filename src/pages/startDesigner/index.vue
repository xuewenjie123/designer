<template>
	<div class="homeBox border-box flex flex-column">
		<header-common leftNoShow title="开始定制"> </header-common>
		<div
			class="flex-item flex flex-column all-center"
			style="background:#f5f5f5"
		>
			<h3 class="font18 bold" style="margin-bottom:20px;">
				左右滑动查看正/背面
			</h3>
			<van-swipe indicator-color="#ccc">
				<van-swipe-item v-for="(item, index) in images" :key="index">
					<img width="100%" v-lazy="item.picUrl" />
					<div class="addDesigner" @click="goDesiner(item)">
						<span
							class="iconfont iconadd"
							style="color:#fff;font-size:15px;line-height:20px;"
						></span>
					</div>
				</van-swipe-item>
			</van-swipe>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			images: [],
		}
	},
	mounted() {
		this.getImgList()
	},
	methods: {
		getImgList() {
			this.$get("/front/type/getItems", { typeId: 3 }).then((result) => {
				this.images = result
			})
		},
		goDesiner(designerInfo) {
			let info = JSON.stringify(designerInfo)
			this.$router.push("/designer?designerInfo=" + info)
		},
	},
}
</script>
<style>
.homeBox .van-swipe {
	width: 80%;
	height: 6rem;
}
</style>

<style scoped lang="less">
.homeBox {
	width: 100%;
	min-height: 100vh;
}
.addDesigner {
	position: absolute;
	left: 50%;
	top: 50%;
	margin-left: -10px;
	margin-top: -10px;
	width: 20px;
	height: 20px;
	background: #000;
	border-radius: 50%;
	line-height: 20px;
	text-align: center;
}
</style>
