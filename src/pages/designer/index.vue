<template>
	<div class="designer" id="designerAction">
		<div
			v-show="!eidtFinshed"
			style="width:100%;height:100vh;position:absolute;background:#000;z-index:0;opacity:0.4"
		></div>
		<!-- <header-common title="开始定制"></header-common> -->
		<div
			class="flex"
			style="width:100;position:relative;"
			:style="{ opacity: !loading ? 1 : 0 }"
		>
			<div ref="leftBox" class="flex flex-item"></div>

			<div class="designerBox flex-column flex">
				<div
					ref="designerBox"
					id="designerBox"
					style="position:relative;left:0"
					:style="{
						width: designAreaWidth + 'px',
						height: designAreaHeight + 'px',
					}"
				>
					<div
						class="canvasBox"
						:style="{
							width: designAreaWidth + 'px',
							height: designAreaHeight + 'px',
							zIndex: canvasZindex,
						}"
						@mousemove="beginPath($event)"
					>
						<canvas
							id="canvas"
							:width="designAreaWidth"
							:height="designAreaHeight"
							@mousedown="canvasDown($event)"
							@mouseup="canvasUp($event)"
							@mousemove="canvasMove($event)"
							@touchstart="canvasDown($event)"
							@touchend="canvasUp($event)"
							@touchmove="canvasMove($event)"
						>
						</canvas>
					</div>
					<img id="designImg" :src="imgUrl" alt="" />
					<img
						@click="clickImg"
						:src="designArea"
						:style="{ zIndex: bgzIndex }"
						style="position:absolute;left:0;top:0"
						alt=""
					/>
					<div
						class="designerArea"
						:style="{
							width: designAreaWidth + 'px',
							height: designAreaHeight + 'px',
							zIndex: selectzIndex,
						}"
					>
						<template v-if="selectImgList.length">
							<drag-and-resizable
								v-for="(item, index) in selectImgList"
								:style="{
									border: eidtFinshed
										? 'none'
										: '1px dashed #000',
								}"
								:key="item.id + '' + index"
								@activated="onImgActivated(item)"
								:active="item.imgActive"
								:preventDeactivation="true"
								@resizestop="resizestop"
								:handles="handles"
								@dragstop="dragstop"
								:lockAspectRatio="true"
								:w="item.w"
								:h="item.h"
								:x="item.x"
								:y="item.y"
								:z="item.z"
								@dragging="(x, y) => onImgDrag(x, y, item)"
								@resizing="
									(x, y, w, h) =>
										onImgResize(x, y, w, h, item)
								"
								:parent="true"
							>
								<img
									style="width:100%;height:100%;"
									:style="{
										transform:
											'rotate(' + item.imgdeg + 'deg)',
									}"
									:src="item.url"
								/>
							</drag-and-resizable>
						</template>
						<template>
							<drag-and-resizable
								v-for="item in selectTextList"
								:key="item.id"
								:style="{
									border: eidtFinshed
										? 'none'
										: '1px dashed #000',
								}"
								:handles="texthandles"
								v-if="showDragText"
								@resizestop="resizestop('text')"
								@dragstop="dragstop"
								@activated="onTextActivated(item)"
								:active="item.textActive"
								:preventDeactivation="true"
								:w="item.w"
								:h="item.h"
								:x="item.x"
								:y="item.y"
								:z="item.z"
								@dragging="(x, y) => onTextDrag(x, y, item)"
								@resizing="
									(x, y, w, h) =>
										onTextResize(x, y, w, h, item)
								"
								:parent="true"
							>
								<p
									:ref="'inputContent' + item.id"
									:style="{
										fontSize: item.fontSize + 'px',
										color: item.currentColor,
										fontFamily: item.fontFamily,
										fontWeight: 'bold',
										width: '100%',
										transform:
											'rotate(' + item.textdeg + 'deg)',
									}"
								>
									{{
										item.textContent
											? item.textContent
											: "Text in here"
									}}
								</p>
							</drag-and-resizable>
						</template>
					</div>
				</div>
			</div>
			<div ref="rightBox" class="flex flex-item"></div>

			<div class="designerBottom">
				<div class="classifyWrapper">
					<div
						class="flex align-center"
						:style="{ width: classifyWidth + 'px' }"
						v-if="designerWhat == 'img'"
					>
						<div
							@click="setClassId(item.id)"
							class="flex all-center classifyBox"
							v-for="item in classifyList"
							:key="item.id"
						>
							<span
								:style="{
									color:
										selectClassId == item.id
											? '#fff'
											: '#333',
								}"
								>{{ item.name }}</span
							>
						</div>
					</div>
					<div
						v-if="designerWhat == 'text'"
						class="flex align-center"
						style="width:100%;height:40px"
					>
						<div
							@click="tabFontShowContent(item.id)"
							class="flex all-center flex-item fontConfigBox border-box"
							v-for="item in fontConfigList"
							:key="item.id"
						>
							<span
								:style="{
									color:
										fontConfigId == item.id
											? '#c62336'
											: '#333',
								}"
								>{{ item.name }}</span
							>
						</div>
					</div>
					<div
						v-if="designerWhat == 'tuya'"
						class="flex align-center"
						style="width:100%;height:40px"
					>
						<div
							@click="tabCanvasShowContent(item.id)"
							class="flex all-center flex-item fontConfigBox border-box"
							v-for="item in canvasConfigList"
							:key="item.id"
						>
							<span
								:style="{
									color:
										canvasConfigId == item.id
											? '#c62336'
											: '#333',
								}"
								>{{ item.name }}</span
							>
						</div>
					</div>
					<div
						v-if="designerWhat == 'rubber'"
						class="flex align-center"
						style="width:100%;height:40px"
					>
						<div
							class="flex all-center flex-item fontConfigBox border-box"
						>
							<span style="color: #c62336">橡皮擦大小</span>
						</div>
					</div>
				</div>
				<div
					class="innerContent"
					id="innerContent"
					@scroll="scrollImgList"
				>
					<div
						v-if="designerWhat == 'img'"
						class="flex align-center"
						id="scrollEl"
						:style="{
							width: sourceWidth + 'px',
							height: 120 + 'px',
						}"
					>
						<div
							class="flex all-center sourceBox flex-column"
							v-for="item in source"
							:key="item.id + 'source'"
							@click="selectImg(item)"
						>
							<img :src="item.mainPic" alt="" />
							<span
								style="font-size:12px;color:#333;margin-top:10px;"
								>{{ item.name }}</span
							>
						</div>
					</div>
					<div
						v-if="designerWhat == 'text'"
						style="height:120px"
						class="flex align-center"
						:style="{ width: fontConfigWidth }"
					>
						<template v-if="fontConfigId == 'color'">
							<div
								class="flex fontColorBox"
								v-for="(item, index) in fontColorList"
								:key="index"
								@click="setColor(item)"
								:style="{
									background: item,
									transform: `translateY(
									${selectShowText.currentColor == item ? '-10px' : '0'}
								)`,
								}"
								style="{ transform: 'rotate(' + textdeg + 'deg)' }"
							></div>
						</template>
						<template v-if="fontConfigId == 'fontFamily'">
							<div
								class="flex all-center fontFamily"
								v-for="(item, index) in fontFamilyList"
								:key="index + 'fontFamliy'"
								@click="setFontFamily(item)"
								:style="{
									color:
										selectShowText.fontFamily == item
											? '#c62336'
											: '#333',
									fontFamily: item,
								}"
							>
								{{ item }}
							</div>
						</template>

						<template v-if="fontConfigId == 'fontSize'">
							<div
								class="flex align-end justify-center fontFamily"
								v-for="item in fontSizeList"
								:key="item.id"
								@click="setFontSize(item)"
								:style="{
									color:
										selectShowText.fontSize == item
											? '#c62336'
											: '#333',
								}"
							>
								<span :style="{ fontSize: item + 'px' }"
									>T</span
								>
								{{ item }}
							</div>
						</template>

						<div
							v-if="fontConfigId == 'content'"
							:style="{ width: fontConfigWidth }"
							style="height:120px;padding-top:20px"
							class="flex felx-row justify-around align-start border-box"
						>
							<textarea
								@focus="textfocus = true"
								@blur="textfocus = false"
								class="content"
								@input="changeTextContent"
								:value="selectShowText.textContent"
								maxlength="40"
								placeholder="点这里可以输入文字内容哦,最多可输入40字"
							></textarea>
							<!-- <div class="flex all-center submitBtn">
							<span class="font14 bold bai">提交</span>
						</div> -->
						</div>
					</div>

					<div
						v-if="designerWhat == 'tuya'"
						style="height:120px"
						class="flex align-center"
						:style="{ width: canvasConfigWidth }"
					>
						<template v-if="canvasConfigId == 'tuyaColor'">
							<!-- @click="setColor(item)" -->
							<div
								class="flex fontColorBox"
								v-for="(item, index) in brushColor"
								:key="index"
								@click="setCanvasColor(item)"
								:style="{
									background: item,
									transform: `translateY(
									${config.lineColor === item ? '-10px' : '0'}
								)`,
								}"
							></div>
						</template>

						<template v-if="canvasConfigId == 'tuyaSize'">
							<div
								class="flex align-end justify-center fontFamily"
								v-for="item in brushs"
								:key="item.lineWidth"
								@click="setBrush(item.lineWidth)"
								:style="{
									color:
										config.lineWidth === item.lineWidth
											? '#c62336'
											: '#333',
								}"
							>
								<span
									:class="item.className"
									:style="{ fontSize: item.fontSize + 'px' }"
								></span>
								{{ item.lineWidth }}
							</div>
						</template>

						<template v-if="canvasConfigId == 'tuyaRubber'">
							<div
								class="flex align-end justify-center fontFamily"
								v-for="item in eraserSize"
								:key="item + 'rubber'"
								@click="setRubberWidth(item)"
								:style="{
									color:
										rubberWidth === item
											? '#c62336'
											: '#333',
								}"
							>
								<span
									class="iconfont iconxiangpica"
									:style="{ fontSize: item * 2.8 + 'px' }"
								></span>
								{{ item }}
							</div>
						</template>
					</div>
				</div>
			</div>

			<div
				@click="setdesignerWhatImg"
				:style="{
					background: designerWhat == 'img' ? '#c62336' : '#e8eceb',
				}"
				class="showImgConfig flex flex-row align-center justify-around"
			>
				<span
					class="iconfont icontupian"
					:style="{
						color: designerWhat == 'img' ? '#fff' : '#a2a6a5',
					}"
				></span>
				<span
					class="font14 "
					:style="{
						color: designerWhat == 'img' ? '#fff' : '#a2a6a5',
					}"
					>图片</span
				>
			</div>
			<div
				@click="setdesignerWhatText"
				:style="{
					background: designerWhat == 'text' ? '#c62336' : '#e8eceb',
				}"
				class="showTextConfig flex flex-row align-center justify-around"
			>
				<span
					class="bold font18"
					:style="{
						color: designerWhat == 'text' ? '#fff' : '#a2a6a5',
					}"
					>Aa</span
				>
				<span
					class="font14"
					:style="{
						color: designerWhat == 'text' ? '#fff' : '#a2a6a5',
					}"
					>文字</span
				>
			</div>

			<div
				@click="setdesignerWhatTuYa"
				:style="{
					background: designerWhat == 'tuya' ? '#c62336' : '#e8eceb',
				}"
				class="showCanvasConfig flex flex-row align-center justify-around"
			>
				<span
					class="iconfont icontuya"
					:style="{
						color: designerWhat == 'tuya' ? '#fff' : '#a2a6a5',
					}"
				></span>
				<span
					class="font14 "
					:style="{
						color: designerWhat == 'tuya' ? '#fff' : '#a2a6a5',
					}"
					>涂鸦</span
				>
			</div>

			<div class="prevBox">
				<div
					v-if="
						selectTextList.length ||
							selectImgList.length ||
							preDrawAry.length
					"
					@click="prevDesigner"
					class="finshedbtn flex all-center"
				>
					<span class="font12 _33hei">上一步</span>
				</div>
			</div>
			<div
				class="finshedBox"
				v-if="
					eidtFinshed &&
						(selectTextList.length ||
							selectImgList.length ||
							preDrawAry.length)
				"
			>
				<div @click="resetDesigner" class="finshedbtn flex all-center">
					<span class="font12 _33hei">重做</span>
				</div>
				<div @click="fineshDesigner" class="finshedbtn flex all-center">
					<span class="font12 _33hei">完成</span>
				</div>
			</div>
			<div
				v-if="
					!eidtFinshed &&
						(selectTextList.length ||
							selectImgList.length ||
							preDrawAry.length)
				"
				class="sliderBox flex align-center flex-column"
			>
				<div style="height:300px;">
					<van-slider
						min="-180"
						max="180"
						@input="showDeg"
						v-if="textActive"
						vertical
						@change="onChangeTextSlider"
						v-model="selectShowText.textdeg"
						active-color="#c52436"
						bar-height="4px"
					/>

					<van-slider
						min="-180"
						@input="showDeg"
						max="180"
						active-color="#c52436"
						v-else
						vertical
						@change="onChangeImgSlider"
						v-model="selectShowImg.imgdeg"
						bar-height="4px"
					/>
				</div>

				<div class="actionBox" @click="yesDesigner">
					<span class="iconfont iconduihao"></span>
				</div>
				<div class="actionBox" @click="delDesigner">
					<span class="iconfont iconshanchu"></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapMutations } from "vuex"
import { Dialog, Toast } from "vant"
import html2canvas from "html2canvas"
export default {
	name: "login",
	data() {
		//这里因为，一开始加载图片不知宽高，元素在定位情况下，有右移，所以展示loading
		Toast.loading({
			duration: 0,
			message: "加载中...",
			forbidClick: true,
			loadingType: "spinner",
		})
		let { designerInfo } = this.$route.query
		let info = JSON.parse(designerInfo)
		return {
			handles: [
				"tl iconzuoshangfang",
				"tr iconyoushangfang",
				"br iconyouxiafang",
				"bl iconzuoxiafang",
			],
			texthandles: ["mr iconxiangyou1", "ml iconxiangzuo1"],
			textActive: false,
			loading: true,
			canvasZindex: 1,
			designerInfo: info,
			textfocus: false,
			designerImg: "",
			imgUrl: info.picUrl,
			designArea: info.designArea,
			designerWhat: "img",
			classifyList: [], //素材类别
			source: [], //素材列表
			textContent: "", //当前正在编辑的文字
			selectImgList: [], //选择图片列表
			eidtFinshed: true,
			bgzIndex: 1000,
			fontConfigList: [
				{
					name: "文字内容",
					id: "content",
				},
				{
					name: "文字颜色",
					id: "color",
				},
				{
					name: "字体",
					id: "fontFamily",
				},
				{
					name: "字号",
					id: "fontSize",
				},
			],
			fontColorList: [
				"#000",
				"#c32436",
				"#572b30",
				"#34080d",
				"#0c0834",
				"#504d70",
				"#aeacbf",
				"#497e44",
				"#10350c",
				"#aeb23b",
			],
			fontFamilyList: [
				"新宋体",
				"楷体",
				"黑体",
				"仿宋",
				"ANDLSO",
				"BATANG",
				"繁体",
			],
			fontSizeList: ["14px", "18px", "24px"],
			fontConfigWidth: "100%",
			sourceWidth: 350,
			classifyWidth: 350,
			selectClassId: "",
			fontConfigId: "content",
			fontFamily: "Arial", //当前fontFamily
			fontSize: "14px",
			currentColor: "#000",
			showDragText: false,
			page: 1,
			designAreaWidth: 338,
			designAreaHeight: 338,
			selectShowImg: { imgdeg: 0 },
			selectShowText: {
				textContent: "",
			},
			lastBackPressed: "",
			status: "loading", //还有更多
			selectzIndex: 1,
			timer: null,
			brushColor: [
				"#fef4ac",
				"#0018ba",
				"#ffc200",
				"#f32f15",
				"#cccccc",
				"#5ab639",
			],
			brushs: [
				{
					className: "small fa fa-paint-brush",
					lineWidth: 1,
					fontSize: 12,
				},
				{
					className: "middle fa fa-paint-brush",
					lineWidth: 6,
					fontSize: 16,
				},
				{
					className: "big fa fa-paint-brush",
					lineWidth: 12,
					fontSize: 20,
				},
			],
			rubberConfigWidth: "100%",
			context: {},
			canvasMoveUse: true,
			// 存储当前表面状态数组-上一步
			preDrawAry: [],
			// 存储当前表面状态数组-下一步
			nextDrawAry: [],
			// 中间数组
			middleAry: [],
			// 配置参数
			config: {
				lineWidth: 1,
				lineColor: "#f2849e",
				shadowBlur: 2,
			},
			canvasConfigList: [
				{ name: "画笔大小", id: "tuyaSize" },
				{ name: "画笔颜色", id: "tuyaColor" },
				{ name: "橡皮擦", id: "tuyaRubber" },
			],
			canvasConfigId: "tuyaSize",
			canvasConfigWidth: "100%",
			eraserSize: [5, 10, 20],
			rubberWidth: 5,
			preAllData: [],
			isRubber: false,
			selectTextList: [],
		}
	},
	mounted() {
		var overscroll = function(el) {
			el.addEventListener(
				"touchstart",
				function() {
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
		overscroll(document.getElementById("designerAction"))
		document
			.querySelector("body")
			.addEventListener("touchmove", this.canscroll, { passive: false })
		const canvas = document.querySelector("#canvas")
		this.context = canvas.getContext("2d")
		this.getClassifyList("first")
		this.getFontList("first")
		this.getbrushList("first")
		this.getEraserList("first")
		this.timer = setTimeout(() => {
			let designImg = document.getElementById("designImg")
			console.log("offsetWidth", designImg.offsetWidth)
			console.log("offsetWidth", designImg.offsetHeight)
			this.designAreaWidth = designImg.offsetWidth
			this.designAreaHeight = designImg.offsetHeight
			this.$nextTick(() => {
				this.initDraw()
				this.setCanvasStyle()
				this.loading = false
				Toast.clear()
			})
		}, 2000)
	},
	beforeDestroy() {
		this.timer && clearTimeout(this.timer)
		document
			.querySelector("body")
			.removeEventListener("touchmove", this.canscroll, {
				passive: false,
			})
	},
	computed: {
		controls() {
			return [
				{
					title: "上一步",
					action: "prev",
					className: this.preDrawAry.length
						? "active fa fa-reply"
						: "fa fa-reply",
				},
				{
					title: "下一步",
					action: "next",
					className: this.nextDrawAry.length
						? "active fa fa-share"
						: "fa fa-share",
				},
				{
					title: "清除",
					action: "clear",
					className:
						this.preDrawAry.length || this.nextDrawAry.length
							? "active fa fa-trash"
							: "fa fa-trash",
				},
			]
		},
	},
	methods: {
		canscroll(evt) {
			//In this case, the default behavior is scrolling the body, which
			//would result in an overflow.  Since we don't want that, we preventDefault.
			if (
				!evt._isScroller &&
				!document
					.querySelector(".classifyWrapper")
					.contains(evt.target) &&
				!document.querySelector(".innerContent").contains(evt.target)
			) {
				evt.preventDefault()
			}
		},
		changeTextContent(e) {
			this.selectShowText.textContent = e.target.value
			this.$nextTick(() => {
				let dom = this.$refs["inputContent" + this.selectShowText.id]
				if (dom.length) {
					this.selectShowText.h = dom[0].offsetHeight
				}
				console.log(" dom[0].offsetHeight", dom[0].offsetHeight)
				this.$forceUpdate()
			})
		},
		isPc() {
			const userAgentInfo = navigator.userAgent
			const Agents = [
				"Android",
				"iPhone",
				"SymbianOS",
				"Windows Phone",
				"iPad",
				"iPod",
			]
			let flag = true
			for (let v = 0; v < Agents.length; v++) {
				if (userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = false
					break
				}
			}
			return flag
		},
		// 操作
		controlCanvas(action) {
			console.log(action, "================")
			switch (action) {
				case "prev":
					if (this.preDrawAry.length) {
						const popData = this.preDrawAry.pop()
						const midData = this.middleAry[
							this.preDrawAry.length + 1
						]
						this.nextDrawAry.push(midData)
						this.context.putImageData(popData, 0, 0)
					}
					break
				case "next":
					if (this.nextDrawAry.length) {
						const popData = this.nextDrawAry.pop()
						const midData = this.middleAry[
							this.middleAry.length - this.nextDrawAry.length - 2
						]
						this.preDrawAry.push(midData)
						this.context.putImageData(popData, 0, 0)
					}
					break
				case "clear":
					this.context.clearRect(
						0,
						0,
						this.context.canvas.width,
						this.context.canvas.height
					)
					this.preDrawAry = []
					this.nextDrawAry = []
					this.middleAry = [this.middleAry[0]]
					break
			}
		},
		// 设置绘画配置
		setCanvasStyle() {
			this.context.lineWidth = this.config.lineWidth
			this.context.shadowBlur = this.config.shadowBlur
			this.context.shadowColor = this.config.lineColor
			this.context.strokeStyle = this.config.lineColor
		},
		initDraw() {
			this.designAreaWidth = designImg.offsetWidth
			this.designAreaHeight = designImg.offsetHeight
			const preData = this.context.getImageData(
				0,
				0,
				this.designAreaWidth,
				this.designAreaHeight
			)
			// 空绘图表面进栈
			this.middleAry.push(preData)
		},
		beginPath(e) {
			const canvas = document.querySelector("#canvas")
			if (e.target !== canvas && this.designerWhat == "tuya") {
				console.log("beginPath")
				this.context.beginPath()
			}
		},
		canvasMove(e) {
			if (this.canvasMoveUse && this.designerWhat == "tuya") {
				let canvasX
				let canvasY
				console.log(this.isPc())
				if (this.isPc()) {
					canvasX = e.clientX - this.$refs.leftBox.offsetWidth
					canvasY = e.clientY - 20
				} else {
					console.log(
						e.changedTouches[0].clientX,
						e.changedTouches[0].clientY
					)

					canvasX =
						e.changedTouches[0].clientX -
						this.$refs.leftBox.offsetWidth
					canvasY = e.changedTouches[0].clientY - 20
				}
				if (this.isRubber) {
					this.context.save()
					this.context.clearRect(
						canvasX,
						canvasY,
						this.rubberWidth * 2,
						this.rubberWidth * 2
					)
					this.context.restore()
				} else {
					this.context.lineTo(canvasX, canvasY)
					this.context.stroke()
				}
			}
		},
		// mouseup
		canvasUp(e) {
			if (this.isRubber) {
				let canvasX
				let canvasY
				if (this.isPc()) {
					canvasX = e.clientX - this.$refs.leftBox.offsetWidth
					canvasY = e.clientY - 20
				} else {
					if (e.changedTouches && e.changedTouches.length) {
						canvasX =
							e.changedTouches[0].clientX -
							this.$refs.leftBox.offsetWidth
						canvasY = e.changedTouches[0].clientY - 20
					} else {
						canvasX = e.clientX - this.$refs.leftBox.offsetWidth
						canvasY = e.clientY - 20
					}
				}
				this.context.save()
				this.context.clearRect(
					canvasX,
					canvasY,
					this.rubberWidth * 2,
					this.rubberWidth * 2
				)
				this.context.restore()
			}

			const preData = this.context.getImageData(
				0,
				0,
				this.designAreaWidth,
				this.designAreaHeight
			)
			if (!this.nextDrawAry.length) {
				// 当前绘图表面进栈
				this.middleAry.push(preData)
			} else {
				this.middleAry = []
				this.middleAry = this.middleAry.concat(this.preDrawAry)
				this.middleAry.push(preData)
				this.nextDrawAry = []
			}
			this.canvasMoveUse = false
		},
		// mousedown
		canvasDown(e) {
			if (this.designerWhat != "tuya") {
				this.clickImg()
				return false
			}
			console.log("canvasDown")
			this.canvasMoveUse = true
			// client是基于整个页面的坐标
			// offset是cavas距离顶部以及左边的距离
			console.log(e.target.parentNode.offsetLeft)
			const canvasX = e.clientX - 20
			const canvasY = e.clientY - 40
			this.setCanvasStyle()
			// 清除子路径
			this.context.beginPath()
			this.context.moveTo(canvasX, canvasY)
			console.log("moveTo", canvasX, canvasY)
			// 当前绘图表面状态
			const preData = this.context.getImageData(
				0,
				0,
				this.designAreaWidth,
				this.designAreaHeight
			)
			// 当前绘图表面进栈
			this.preDrawAry.push(preData)
		},
		scrollImgList() {
			if (this.designerWhat == "img") {
				let scrollEl = document.getElementById("scrollEl")
				let wrapperEl = document.getElementById("innerContent")
				let scrollLeft = wrapperEl.scrollLeft
				let scrollWidth = scrollEl.offsetWidth
				let wrapWidth = wrapperEl.offsetWidth
				// console.log("wrapperEl.scrollLeft", wrapperEl.scrollLeft);
				// console.log("scrollEl.offsetWidth", scrollEl.offsetWidth);
				// console.log("wrapperEl.offsetWidth", wrapperEl.offsetWidth);
				if (scrollWidth - wrapWidth - scrollLeft < 2) {
					if (
						this.lastBackPressed &&
						this.lastBackPressed + 2000 >= new Date().getTime()
					) {
						return false
					}
					this.lastBackPressed = new Date().getTime()
					if (this.status != "noMore" && this.status != "loading") {
						this.status = "loading"
						this.getSourceList()
					}
				}
			}
		},
		...mapMutations(["setDesignerImg"]),
		setdesignerWhatTuYa() {
			this.designerWhat = "tuya"
			this.textActive = false
			this.eidtFinshed = false
			this.canvasZindex = 1002
			this.selectzIndex = 1
			this.selectImgList.forEach((item) => (item.imgActive = false))
			this.selectTextList.forEach((item) => (item.textActive = false))
			this.$forceUpdate()
		},
		setdesignerWhatText() {
			this.designerWhat = "text"
			this.showDragText = true
			this.textActive = true
			this.selectImgList.forEach((item) => {
				item.imgActive = false
				item.z = "auto"
			})
			let len = this.selectTextList.length
			if (
				this.eidtFinshed ||
				!this.selectTextList.length ||
				this.selectTextList[len - 1].textContent != ""
			) {
				this.selectShowText = {
					textdeg: 0,
					textContent: "",
					fontSize: this.fontSizeList[0],
					fontFamily: this.fontFamilyList[0],
					currentColor: this.fontColorList[0],
					x: 40,
					y: 40,
					w: 100,
					h: 20,
					z: 1,
					textActive: true,
					id: new Date().getTime(),
				}
				this.selectTextList.push(this.selectShowText)
				this.savePrevData()
			} else {
				this.selectShowText.textActive = true
			}
			this.eidtFinshed = false
			this.selectzIndex = 1002
			this.canvasZindex = 1

			this.$forceUpdate()
		},
		setdesignerWhatImg() {
			this.designerWhat = "img"
			this.textActive = false
			this.eidtFinshed = false
			this.selectTextList.forEach((item) => {
				item.textActive = false
				item.z = "auto"
			})
			this.selectzIndex = 1002
			this.canvasZindex = 1
			if (this.selectImgList.length) {
				this.selectImgList[0].imgActive = true
			}
			this.$forceUpdate()
		},
		setFontSize(fontSize) {
			this.designerWhat = "text"
			this.selectShowText.fontSize = fontSize
			this.textActive = true
			this.selectImgList.forEach((item) => (item.imgActive = false))
			this.eidtFinshed = false
			this.$nextTick(() => {
				let dom = this.$refs["inputContent" + this.selectShowText.id]
				if (dom.length) {
					this.selectShowText.h = dom[0].offsetHeight
				}
				console.log(" dom[0].offsetHeight", dom[0].offsetHeight)
				this.savePrevData()
				this.$set(this, "selectTextList", this.selectTextList)
				this.$forceUpdate()
			})
		},
		setFontFamily(fontFamily) {
			this.designerWhat = "text"
			this.selectShowText.fontFamily = fontFamily
			this.textActive = true
			this.selectImgList.forEach((item) => (item.imgActive = false))
			this.eidtFinshed = false
			this.$nextTick(() => {
				let dom = this.$refs["inputContent" + this.selectShowText.id]
				if (dom.length) {
					this.selectShowText.h = dom[0].offsetHeight
				}
				console.log(" dom[0].offsetHeight", dom[0].offsetHeight)
				this.savePrevData()
				this.$set(this, "selectTextList", this.selectTextList)
				this.$forceUpdate()
			})
		},
		setColor(currentColor) {
			this.designerWhat = "text"
			this.selectShowText.currentColor = currentColor
			this.textActive = true
			this.selectImgList.forEach((item) => (item.imgActive = false))
			this.eidtFinshed = false
			this.savePrevData()
			this.$forceUpdate()
		},
		setCanvasColor(color) {
			this.config.lineColor = color
		},
		// 设置笔刷大小
		setBrush(lineWidth) {
			this.config.lineWidth = lineWidth
		},
		setRubberWidth(rubberWidth) {
			this.rubberWidth = rubberWidth
		},
		// 操作
		controlCanvas(action) {
			switch (action) {
				case "prev":
					if (this.preDrawAry.length) {
						const popData = this.preDrawAry.pop()
						const midData = this.middleAry[
							this.preDrawAry.length + 1
						]
						this.nextDrawAry.push(midData)
						this.context.putImageData(popData, 0, 0)
					}
					break
				case "next":
					if (this.nextDrawAry.length) {
						const popData = this.nextDrawAry.pop()
						const midData = this.middleAry[
							this.middleAry.length - this.nextDrawAry.length - 2
						]
						this.preDrawAry.push(midData)
						this.context.putImageData(popData, 0, 0)
					}
					break
				case "clear":
					this.context.clearRect(
						0,
						0,
						this.context.canvas.width,
						this.context.canvas.height
					)
					this.preDrawAry = []
					this.nextDrawAry = []
					this.middleAry = [this.middleAry[0]]
					break
			}
		},
		tabCanvasShowContent(id) {
			this.canvasConfigId = id
			switch (id) {
				case "tuyaSize":
					this.isRubber = false
					this.canvasConfigWidth = this.brushs.length * 70 + 10 + "px"
					break
				case "tuyaColor":
					this.isRubber = false
					this.canvasConfigWidth =
						this.brushColor.length * 70 + 10 + "px"
					break
				case "tuyaRubber":
					console.log(this.brushColor)
					this.isRubber = true
					this.canvasConfigWidth =
						this.eraserSize.length * 80 + 10 + "px"
					break
			}
		},
		tabFontShowContent(id) {
			this.fontConfigId = id
			switch (id) {
				case "content":
					this.fontConfigWidth = "100%"
					break
				case "color":
					this.fontConfigWidth =
						this.fontColorList.length * 70 + 10 + "px"
					break
				case "fontFamily":
					this.fontConfigWidth =
						this.fontFamilyList.length * 80 + 50 + "px"
					break
				case "fontSize":
					this.fontConfigWidth = this.fontSizeList.length * 80 + "px"
					break
			}
		},
		getClassifyList(first) {
			this.$get(
				"/front/materialsClass/get",
				{},
				{ noshowLoading: first ? true : false }
			).then((result) => {
				this.classifyList = result
				this.classifyWidth = result.length * 80
				this.selectClassId = result[0].id
				this.getSourceList(first)
			})
		},
		getFontList(first) {
			this.$get(
				"/front/designTool/view",
				{
					id: 1,
				},
				{ noshowLoading: first ? true : false }
			).then((result) => {
				this.fontColorList = JSON.parse(result.fontColor)
				this.fontSizeList = JSON.parse(result.fontSize)
			})
		},
		getEraserList(first) {
			this.$get(
				"/front/designTool/view",
				{
					id: 3,
				},
				{ noshowLoading: first ? true : false }
			).then((result) => {
				this.eraserSize = JSON.parse(result.eraserSize).map((item) =>
					parseFloat(item)
				)
				this.rubberWidth = this.eraserSize[0]
			})
		},
		getbrushList(first) {
			this.$get(
				"/front/designTool/view",
				{
					id: 2,
				},
				{ noshowLoading: first ? true : false }
			).then((result) => {
				let brushSize = JSON.parse(result.brushSize)
				let brushColor = JSON.parse(result.brushColor)
				brushSize.forEach((item, index) => {
					this.brushs[index] = {
						className: "fa fa-paint-brush",
						lineWidth: parseFloat(item),
						fontSize: 12 + index * 2,
					}
				})
				this.config.lineWidth = this.brushs[0].lineWidth
				this.config.lineColor = brushColor[0]
				this.canvasConfigWidth = this.brushs.length * 70 + 10 + "px"
			})
		},
		getSourceList(first) {
			this.$get(
				"/front/materialsSource/get",
				{
					"materialsClass.id": this.selectClassId,
					page: this.page,
					isMine: "0",
					audit: "1",
					status: "1",
					isOpen: "1",
				},
				{ noshowLoading: first ? true : false }
			).then((result) => {
				this.page++
				this.source = this.source.concat(result.source)
				this.status =
					this.source.length < result.totalCount ? "more" : "noMore"
				this.sourceWidth = this.source.length * 80
			})
		},
		setClassId(id) {
			this.designerWhat = "img"
			this.selectClassId = id
			this.source = []
			this.page = 1
			let wrapperEl = document.getElementById("innerContent")
			wrapperEl.scrollLeft = 0
			this.getSourceList()
		},
		savePrevData() {
			let obj = {
				selectImgList: this.selectImgList,
				selectTextList: this.selectTextList,
			}
			this.preAllData.push(JSON.parse(JSON.stringify(obj)))
			console.log("----------------------savePrevData")
			console.log(this.preAllData)
		},
		onTextResize(x, y, width, height, item) {
			item.x = x
			item.y = y
			item.w = width == 0 ? 1 : width
			item.h = height == 0 ? 1 : height
		},
		onTextDrag(x, y, item) {
			item.x = x
			item.y = y
		},

		onImgResize(x, y, width, height, item) {
			item.x = x
			item.y = y
			item.w = width == 0 ? 1 : width
			item.h = height == 0 ? 1 : height
		},
		onImgDrag(x, y, item) {
			item.x = x
			item.y = y
		},
		resizestop(text) {
			if (text == "text") {
				this.$nextTick(() => {
					let dom = this.$refs[
						"inputContent" + this.selectShowText.id
					]
					if (dom.length) {
						this.selectShowText.h = dom[0].offsetHeight
					}
					console.log(" dom[0].offsetHeight", dom[0].offsetHeight)
					this.savePrevData()
					this.$forceUpdate()
				})
			} else {
				this.savePrevData()
			}
		},
		dragstop() {
			this.savePrevData()
		},
		clickImg() {
			console.log("----")
			this.selectzIndex = 1002
			this.eidtFinshed = false
		},
		selectImg(item) {
			this.designerWhat = "img"
			this.selectTextList.forEach((item) => {
				item.z = "auto"
				item.textActive = false
			})
			let len = this.selectImgList.length
			if (this.eidtFinshed || !this.selectImgList.length) {
				this.selectShowImg = {
					url: item.mainPic,
					imgdeg: 0,
					...item,
					x: 40,
					y: 40,
					w: 100,
					h: 100,
					z: 1,
					imgActive: true,
				}
				this.selectImgList.push(this.selectShowImg)
			} else {
				this.selectShowImg = {
					url: item.mainPic,
					imgdeg: item.imgdeg,
					...item,
					x: this.selectShowImg.x,
					y: this.selectShowImg.y,
					w: this.selectShowImg.w,
					h: this.selectShowImg.h,
					z: 1,
				}
				this.selectImgList[len - 1] = this.selectShowImg
				this.selectImgList[len - 1].imgActive = true
			}
			this.savePrevData()
			this.eidtFinshed = false
			this.textActive = false
			this.selectzIndex = 1002
			this.canvasZindex = 1
			let img = new Image()
			img.src = item.mainPic
			img.onload = () => {
				console.log("img.width", img.width)
				console.log("img.height", img.height)
				this.selectShowImg.w = img.width
				this.selectShowImg.h = img.height
				this.$set(this, "selectImgList", this.selectImgList)
				this.$forceUpdate()
			}
			this.$forceUpdate()
		},
		onImgActivated(item) {
			this.selectTextList.forEach((item) => {
				item.textActive = false
				item.z = "auto"
			})
			this.selectShowImg = item
			this.selectImgList.forEach((item) => {
				item.imgActive = false
				item.z = "auto"
			})
			this.designerWhat = "img"
			this.eidtFinshed = false

			item.imgActive = true
			item.z = 1
			this.selectzIndex = 1002
			this.canvasZindex = 1
			this.textActive = false
			this.$forceUpdate()
		},
		onTextActivated(item) {
			this.textActive = true
			this.designerWhat = "text"
			this.eidtFinshed = false
			this.selectzIndex = 1002
			this.canvasZindex = 1
			this.selectShowText = item
			this.selectTextList.forEach((item) => {
				item.textActive = false
				item.z = "auto"
			})
			item.textActive = true
			item.z = 1
			this.selectImgList.forEach((item) => {
				item.imgActive = false
				item.z = "auto"
			})
			this.$forceUpdate()
		},
		fineshDesigner() {
			Toast.loading({
				duration: 0,
				message: "上传中...",
				forbidClick: true,
				loadingType: "spinner",
			})
			let content_html = document.getElementById("designerBox") //要转化的div
			console.log("content_html", content_html)
			let width = content_html.offsetWidth
			let height = content_html.offsetHeight
			let canvas = document.createElement("canvas")
			let context = canvas.getContext("2d")
			console.log("window.devicePixelRatio", window.devicePixelRatio)
			let scaleBy = Math.ceil(window.devicePixelRatio)
			canvas.width = width
			canvas.height = height
			// context.scale(scaleBy, scaleBy)
			var opts = {
				allowTaint: true, //允许加载跨域的图片
				tainttest: true, //检测每张图片都已经加载完成
				scale: 1, // 添加的scale 参数
				canvas: canvas, //自定义 canvas
				logging: false, //日志开关，发布的时候记得改成false
				width: width, //dom 原始宽度
				height: height, //dom 原始高度
				useCORS: true,
			}
			html2canvas(content_html, opts).then((canvas) => {
				let imgurl = canvas.toBlob((blob) => {
					//以时间戳作为文件名 实时区分不同文件 按需求自己定义就好
					let filename = `${new Date().getTime()}.jpg`
					//转换canvas图片数据格式为formData
					let uploadFile = new File([blob], filename, {
						type: "image/jpg",
					})
					//将转换为formData的canvas图片 上传到服务器
					// id
					let sources = this.selectImgList.map((item) => {
						return item.id
					})
					sources = sources.join(",")
					this.$upFile("/front/userDesignItem/save", {
						"userDesign.id": "1",
						id: this.designerInfo.designItemId,
						"typeItem.id": this.designerInfo.id,
						picFile: uploadFile,
						sources,
					}).then((result) => {
						Toast("上传成功")
						canvas.style.width = width + "px"
						canvas.style.height = height + "px"
						this.setDesignerImg(canvas.toDataURL())
						this.$router.replace("/previewDesigner")
					})
				})
				// console.log(canvas)

				// $("#grow-img").attr("src", canvas.toDataURL())
			})
		},
		onChangeImgSlider(value) {
			this.selectShowImg.imgdeg = value
		},
		showDeg(value) {
			Toast.clear()
			Toast("当前值：" + value)
		},
		onChangeTextSlider(value) {
			this.selectShowText.textdeg = value
		},
		yesDesigner() {
			if (this.preAllData.length) {
				this.savePrevData()
			}

			if (
				this.selectTextList.length &&
				this.selectTextList[this.selectTextList.length - 1]
					.textContent == ""
			) {
				this.selectTextList.pop()
			}
			if (!this.selectTextList.length) {
				this.showDragText = false
			}
			this.selectTextList.forEach((item) => (item.textActive = false))
			this.selectImgList.forEach((item) => (item.imgActive = false))
			this.selectzIndex = 1
			this.canvasZindex = 2
			this.designerWhat = "img"
			this.textActive = false
			this.eidtFinshed = true
		},
		prevRouter() {
			this.$router.go(-1)
		},
		prevDesigner() {
			this.controlCanvas("prev")
			if (this.preAllData.length == 0) {
				return false
			}
			console.log("prealldata", this.preAllData[0])
			this.preAllData.pop()
			if (this.preAllData.length == 0) {
				console.log("==================这里是一个")
				this.selectImgList = []
				this.selectTextList = []
				this.preAllData = []
				this.designerWhat = "img"
			} else {
				if (this.preAllData[this.preAllData.length - 1]) {
					this.selectImgList = this.preAllData[
						this.preAllData.length - 1
					].selectImgList
					this.selectTextList = this.preAllData[
						this.preAllData.length - 1
					].selectTextList
				}
			}

			this.eidtFinshed = true
			this.$forceUpdate()
		},
		resetDesigner() {
			Dialog.confirm({
				title: "您确定要重做吗",
				message: "取消您当前的设计？",
			}).then(() => {
				this.preAllData = []
				this.selectImgList = []
				this.selectTextList = []
				this.showDragText = false
				this.selectzIndex = 1
				this.controlCanvas("clear")
			})
		},
		delDesigner() {
			if (this.textActive) {
				this.selectTextList = this.selectTextList.filter((item) => {
					return item.id != this.selectShowText.id
				})
			} else {
				this.selectImgList = this.selectImgList.filter((item) => {
					return item.id != this.selectShowImg.id
				})
			}
			this.savePrevData()
			if (
				!this.selectImgList.length &&
				!this.selectTextList.length &&
				!this.preDrawAry.length
			) {
				this.preAllData = []
			}
			this.selectzIndex = 1002
			this.designerWhat = "img"
		},
	},
}
</script>

<style scoped>
.canvasBox {
	position: absolute;
	top: 0;
	left: 0;
}

.submitBtn {
	width: 80px;
	background: #711101;
	margin-left: 10px;
	height: 36px;
	margin-right: 10px;
}
.content {
	width: 80%;
	height: 80px;
	box-sizing: border-box;
	padding: 6px 10px;
	border: 1px solid #cdcdcd;
	margin-left: 10px;
}
.actionBox {
	width: 30px;
	height: 30px;
	background: #fff;
	text-align: center;
	line-height: 30px;
	border-radius: 50%;
	margin-top: 20px;
	color: #c52436;
}
.designer {
	width: 100%;
	height: 100vh;
	position: relative;
	background: #f5f5f5;
}
.designerBox {
	background: #fff;
	position: relative;
	margin-top: 20px;
}
.designerBottom {
	position: fixed;
	bottom: 0;
	width: 100%;
	z-index: 1006;
}

.classifyWrapper::-webkit-scrollbar {
	display: none;
}
.classifyWrapper {
	width: 100%;
	overflow-x: scroll;
	overflow-y: hidden;
	height: 40px;
	scrollbar-width: none;
	-ms-overflow-style: none; /* IE 10+ */
}
.classifyBox {
	height: 40px;
	width: 80px;
	border: 1px solid #1f1f1f;
	background: #9c9c9c;
}
.fontConfigBox {
	border: 1px solid #1f1f1f;
	height: 40px;
	border-bottom: 0;
}
.innerContent::-webkit-scrollbar {
	display: none;
}
.innerContent {
	background: #e2e2e2;
	height: 120px;
	width: 100%;
	overflow-x: scroll;
	overflow-y: hidden;
	scrollbar-width: none;
	-ms-overflow-style: none; /* IE 10+ */
}
.fontColorBox {
	width: 60px;
	height: 60px;
	border-radius: 10px;
	margin-left: 10px;
}
.fontFamily {
	width: 80px;
	height: 60px;
	margin-left: 10px;
	overflow: auto;
}
.fontFamily .active {
	color: #f2849e;
}
.sourceBox {
	width: 120px;
	height: 120px;
}
.sourceBox img {
	width: 60px;
	height: 60px;
	border-radius: 10px;
}

.designerArea {
	position: absolute;
	top: 0;
	left: 0;
}
.finshedbtn {
	width: 60px;
	height: 30px;
	border: 1px solid #000;
	border-radius: 4px;
	margin-top: 20px;
}

.prevBox {
	position: absolute;
	top: 20px;
	left: 30px;
	height: 80px;
	width: 80px;
	z-index: 1009;
}
.finshedBox {
	position: absolute;
	top: 20px;
	right: 40px;
	height: 100px;
	width: 40px;
	z-index: 1005;
}
.sliderBox {
	position: absolute;
	top: 80px;
	right: 30px;
	height: 400px;
	width: 30px;
	z-index: 1007;
}
.showImgConfig {
	width: 80px;
	height: 30px;
	border-top-right-radius: 15px;
	border-bottom-right-radius: 15px;
	position: fixed;
	bottom: 260px;
	z-index: 1005;
	left: 0;
}
.showTextConfig {
	width: 80px;
	height: 30px;
	border-top-right-radius: 15px;
	border-bottom-right-radius: 15px;
	position: fixed;
	bottom: 220px;
	left: 0;
	z-index: 1005;
}
.showCanvasConfig {
	width: 80px;
	height: 30px;
	border-top-right-radius: 15px;
	border-bottom-right-radius: 15px;
	position: fixed;
	bottom: 180px;
	left: 0;
	z-index: 1005;
}
</style>
