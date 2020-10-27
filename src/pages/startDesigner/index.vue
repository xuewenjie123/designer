<template>
	<div class="homeBox border-box flex flex-column">
		<header-common leftNoShow title="开始定制"> </header-common>
		<div
			class="flex-item flex flex-column all-center"
			style="background:#f5f5f5"
		>
			<h3
				class="font18 bold"
				style="margin-bottom:20px;"
				@click="testDesigner"
			>
				左右滑动查看正/背面
			</h3>
			<van-swipe indicator-color="#ccc">
				<van-swipe-item v-for="(item, index) in images" :key="index">
					<div class="showImgBox" @click="goDesiner(item)">
						<img width="100%" v-lazy="item.goodsImg" />
						<img
							class="addDesigner"
							:style="{
								top: item.y * scale + 'px',
								left: item.x * scale + 'px',
								width: item.width + 'px',
							}"
							:src="item.picUrl"
							alt=""
						/>
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
			clientWidth: 0,
			scaleZ: 1,
			scaleB: 1,
		}
	},
	mounted() {
		this.getImgList()
		this.clientWidth = document.body.clientWidth
	},
	methods: {
		getImgList() {
			this.$get("/front/type/getItems", { designId: 1 }).then(
				(result) => {
					// 图片地址
					// 创建对象
					let img = new Image()
					// 改变图片的src

					img.src = result[0].goodsImg
					this.scale = this.clientWidth / img.width
					console.log("scale", this.scale)
					img.src = result[0].picUrl
					result[0].width = img.width * this.scale

					img.src = result[1].goodsImg
					this.scale = this.clientWidth / img.width
					console.log("scale", this.scale)
					img.src = result[1].picUrl
					result[1].width = img.width * this.scale
					setTimeout(() => {
						this.images = result
						this.$forceUpdate()
					}, 1000)
				}
			)
		},
		goDesiner(designerInfo) {
			let info = JSON.stringify(designerInfo)
			this.$router.push("/designer?designerInfo=" + info)
		},
		testDesigner() {
			let designerInfo = {
				picUrl:
					"https://custom.sw580.net/upload/images/materialsSource/2.png",
			}
			let info = JSON.stringify(designerInfo)
			this.$router.push("/designer?designerInfo=" + info)
		},
	},
}
</script>
<style>
.homeBox .van-swipe {
	width: 100%;
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
}
.showImgBox {
	position: relative;
	width: 100%;
}
</style>
