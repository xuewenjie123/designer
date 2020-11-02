<template>
	<div class="homeBox border-box flex flex-column">
		<div
			class="flex-item flex flex-column all-center"
			style="background:#f5f5f5"
		>
			<h3 class="font18 bold" style="margin-bottom:20px;">
				预览效果
			</h3>
			<van-swipe ref="swiper" indicator-color="#ccc" @change="changeImg">
				<van-swipe-item v-for="(item, index) in images" :key="index">
					<div class="showImgBox">
						<img
							width="100%"
							v-lazy="item.designPic || item.goodsImg"
						/>
						<span
							class="iconfont iconshouzhi"
							style="position:absolute;font-size:30px;color:#bf0d2a"
						></span>
					</div>
				</van-swipe-item>
			</van-swipe>
			<h3
				class="font16  flex all-center"
				style="margin-top:20px;height:40px;"
			>
				<span
					@click="swipeTo(0)"
					:style="{ color: curIndex == 0 ? '#c62336' : '#000' }"
					>{{ showNames[0] }}</span
				>
				<span style="margin:0 20px">|</span>
				<span
					@click="swipeTo(1)"
					:style="{ color: curIndex == 1 ? '#c62336' : '#000' }"
					>{{ showNames[1] }}</span
				>
			</h3>
			<div class="finishBtn flex all-center" @click="finishedDesigner">
				<span class="bai font14">完成设计</span>
			</div>
			<span class="font14" style="margin-top:20px;" @click="goDesigner"
				>继续设计</span
			>
		</div>
	</div>
</template>

<script>
export default {
	filters: {
		filterName(images) {
			let arr = images.map((item) => item.name)
		},
	},
	data() {
		return {
			images: [],
			clientWidth: 0,
			scaleZ: 1,
			scaleB: 1,
			curIndex: 0,
			showNames: [],
		}
	},
	mounted() {
		this.getImgList()
		this.clientWidth = document.body.clientWidth
	},
	methods: {
		swipeTo(index) {
			this.$refs.swiper.swipeTo(index)
		},
		getImgList() {
			this.$get("/front/type/getItems", { designId: 1 }).then(
				(result) => {
					this.images = result
					this.showNames = result.map((item) => item.name)
					// 图片地址
					// 创建对象
					// let img = new Image()
					// // 改变图片的src

					// img.src = result[0].goodsImg
					// this.scale = this.clientWidth / img.width
					// console.log("scale", this.scale)
					// img.src = result[0].picUrl
					// result[0].width = img.width * this.scale

					// img.src = result[1].goodsImg
					// this.scale = this.clientWidth / img.width
					// console.log("scale", this.scale)
					// img.src = result[1].picUrl
					// result[1].width = img.width * this.scale
					// setTimeout(() => {
					// 	this.images = result
					// 	this.$forceUpdate()
					// }, 1000)
				}
			)
		},
		goDesigner() {
			let info = JSON.stringify(this.images[this.curIndex])
			this.$router.push("/designer?designerInfo=" + info)
		},
		changeImg(index) {
			this.curIndex = index
		},
		testDesigner() {
			let designerInfo = {
				picUrl:
					"https://custom.sw580.net/upload/images/materialsSource/2.png",
			}
			let info = JSON.stringify(designerInfo)
			this.$router.push("/designer?designerInfo=" + info)
		},
		finishedDesigner() {
			this.$router.go(-1)
		},
	},
}
</script>
<style>
.homeBox .van-swipe {
	width: 80%;
}
</style>

<style scoped lang="less">
.homeBox {
	width: 100%;
	min-height: 100vh;
	background: #f1f1ef;
}
.addDesigner {
	position: absolute;
}
.showImgBox {
	position: relative;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.finishBtn {
	width: 80px;
	height: 30px;
	background: #731402;
	margin-top: 20px;
}
</style>
