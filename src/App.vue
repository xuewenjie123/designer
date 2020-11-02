<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	name: "App",
	mounted() {
		//禁止下拉
	},
}
</script>

<style>
@import url("//at.alicdn.com/t/font_2102205_orbmx3x5drj.css");
@import url("./common/common.css");
@import url("./common/font.css");

/* @import url("./fontFace/fontFace.css"); */
#app {
	position: relative;
	width: 100%;
	min-height: 100vh;
	overflow: scroll;
	-webkit-overflow-scrolling: touch;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
}
img {
	pointer-events: none;
}
*:not(textarea) {
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
</style>
