<template>
	<div class="bar" :style="barStyle">
		<!-- 左侧leftbar -->
		<div
			class="leftbar"
			:ga-data="goData"
			:style="leftBarStyle"
			@click="leftOnPress"
		>
			<slot name="leftView" v-if="!leftNoShow">
				<span class="iconfont iconfanhui"></span>
			</slot>
			<slot name="leftViewClose"></slot>
		</div>
		<!-- 中间titlebar -->
		<div class="titlebar" :style="titleBarStyle">
			<slot name="centerView">
				<span v-if="title != ''" class="titleText" :style="textStyle">{{
					title
				}}</span>
			</slot>
		</div>
		<!-- 右侧rightbar -->
		<div class="rightbar" :style="rightbarStyle">
			<slot name="rightView"></slot>
		</div>
	</div>
</template>

<script>
let _this = this
export default {
	beforeCreate() {
		_this = this
	},
	props: {
		barStyle: {
			type: Object,
			default: () => {
				return {}
			},
		},
		// 左侧样式
		leftBarStyle: {
			type: Object,
			default: () => {
				return {}
			},
		},
		textStyle: {
			type: Object,
			default: () => {
				return {}
			},
		},
		//是否显示左侧
		leftNoShow: {
			type: Boolean,
			default: false,
		},
		//标题bar样式
		titleBarStyle: {
			type: Object,
			default: () => {
				return {}
			},
		},
		//页面标题
		title: {
			type: String,
			default: "",
		},
		//谷歌统计
		goData: {
			type: String,
			default: "",
		},
		//右侧样式
		rightbarStyle: {
			type: Object,
			default: () => {
				return {}
			},
		},
		leftOnPress: {
			type: Function,
			default: () => {
				window.history.length > 1 ? _this.$router.go(-1) : () => {}
			},
		},
	},
}
</script>

<style scoped>
.bar {
	width: 100%;
	overflow: hidden;
	height: 48px;
	display: flex;
	align-items: center;
	flex-direction: row;
	background: #fff;
	border: 0 solid #eee;
	/* border-bottom-width:1px; */
}
.leftbar {
	flex: 1;
	display: flex;
	height: 48px;
	padding-left: 0.3rem;
	align-items: center;
}
.back {
	width: 0.24rem;
	height: 0.36rem;
}
.titlebar {
	height: 48px;
	flex: 1;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
.titleText {
	font: 17px/48px "Avenir";
	color: #333;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.rightbar {
	height: 48px;
	display: flex;
	flex: 1;
	align-items: center;
	padding-right: 0.3rem;
	justify-content: flex-end;
}
</style>
