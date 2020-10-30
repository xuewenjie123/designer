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
		var overscroll = function(el) {
			el.addEventListener(
				"touchstart",
				function() {
					console.log("===============")
					var top = el.scrollTop,
						totalScroll = el.scrollHeight,
						currentScroll = top + el.offsetHeight
					//If we're at the top or the bottom of the containers
					//scroll, push up or down one pixel.
					//
					//this prevents the scroll from "passing through" to
					//the body.
					if (top === 0) {
						el.scrollTop = 1
					} else if (currentScroll === totalScroll) {
						el.scrollTop = top - 1
					}
				},
				{ passive: false }
			)
			el.addEventListener(
				"touchmove",
				function(evt) {
					//if the content is actually scrollable, i.e. the content is long enough
					//that scrolling can occur
					if (el.offsetHeight < el.scrollHeight)
						evt._isScroller = true
				},
				{ passive: false }
			)
		}
		overscroll(document.getElementById("app"))
		document.body.addEventListener(
			"touchmove",
			function(evt) {
				//In this case, the default behavior is scrolling the body, which
				//would result in an overflow.  Since we don't want that, we preventDefault.
				if (!evt._isScroller) {
					evt.preventDefault()
				}
			},
			{ passive: false }
		)
	},
}
</script>

<style>
@import url("//at.alicdn.com/t/font_2102205_h9h3644chta.css");
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
* {
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
</style>
