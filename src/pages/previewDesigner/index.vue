<template>
	<div class="homeBox border-box flex flex-column">
		<!-- <header-common title="开始定制"> </header-common> -->
		<div
			class="flex-item flex flex-column all-center"
			style="background:#f5f5f5"
		>
			<h3 class="font18 bold" style="margin-bottom:20px;">
				预览效果
			</h3>
			<img :src="designerImg" style="width:100%" alt="" />
			<!-- <van-swipe indicator-color="#ccc">
				<van-swipe-item v-for="(item, index) in images" :key="index">
					<img width="100%" v-lazy="item.picUrl" />
				</van-swipe-item>
			</van-swipe> -->
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
	data() {
		return {
			images: [],
		}
	},
	computed: {
		...mapGetters(["designerImg"]),
	},
	mounted() {
		// this.getImgList()
		console.log(this.designerImg)
		this.images.push(this.designerImg)
		let img = new Image()
		// 改变图片的src
		img.src = this.designerImg
		this.$nextTick(() => {
			console.log(img)
			console.log(img.width)
		})
	},
	methods: {
		// getImgList() {
		// 	this.$get("/front/type/getItems", { typeId: 3 }).then((result) => {
		// 		this.images = result
		// 	})
		// },
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
</style>
