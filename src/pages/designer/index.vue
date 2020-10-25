<template>
	<div class="designer flex flex-column">
		<header-common title="开始定制"></header-common>
		<div id="designerBox" class="designerBox flex-column flex all-center">
			<img :src="imgUrl" style="width:300px" alt="" />
			<div
				class="designerArea"
				:style="{
					border:
						eidtFinshed && (selectImgUrl || textContent)
							? 'none'
							: '1px dashed #000',
				}"
			>
				<vue-draggable-resizable
					:style="{
						border: eidtFinshed ? 'none' : '1px dashed #000',
					}"
					v-if="selectImgUrl"
					@activated="onImgActivated"
					:active="imgActive"
					:preventDeactivation="true"
					:w="40"
					:h="20"
					:x="imgx"
					:y="imgy"
					@dragging="onImgDrag"
					@resizing="onResize"
					:parent="true"
				>
					<img
						style="width:100%;height:100%;"
						:style="{ transform: 'rotate(' + imgdeg + 'deg)' }"
						:src="selectImgUrl"
					/>
				</vue-draggable-resizable>
				<vue-draggable-resizable
					:style="{
						border: eidtFinshed ? 'none' : '1px dashed #000',
					}"
					v-if="showDragText"
					@activated="onTextActivated"
					:active="textActive"
					:preventDeactivation="true"
					:w="90"
					:h="20"
					:x="textx"
					:y="texty"
					@dragging="onTextDrag"
					@resizing="onResize"
					:parent="true"
				>
					<p
						:style="{
							fontSize: fontSize,
							color: currentColor,
							fontFamily: fontFamily,
							fontWeight: 'bold',
							width: '100%',
							height: '100%',
							transform: 'rotate(' + textdeg + 'deg)',
						}"
					>
						{{ textContent ? textContent : "Text in here" }}
					</p>
				</vue-draggable-resizable>
			</div>
		</div>
		<div class="designerBottom">
			<!-- <div class="classifyWrapperOpa"></div> -->
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
										? '#c62336'
										: '#333',
							}"
							>{{ item.name }}</span
						>
					</div>
				</div>
				<div
					v-else
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
			</div>
			<div class="innerContent" id="innerContent" @scroll="scrollImgList">
				<div
					v-if="designerWhat == 'img'"
					class="flex align-center"
					id="scrollEl"
					:style="{ width: sourceWidth + 'px', height: 120 + 'px' }"
				>
					<div
						class="flex all-center sourceBox flex-column"
						v-for="item in source"
						:key="item.id"
						@click="selectImg(item.mainPic)"
					>
						<img :src="item.mainPic" alt="" />
						<span
							style="font-size:12px;color:#333;margin-top:10px;"
							>{{ item.name }}</span
						>
					</div>
				</div>
				<div
					v-else
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
									${currentColor == item ? '-10px' : '0'}
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
								color: fontFamily == item ? '#c62336' : '#333',
							}"
						>
							{{ item }}
						</div>
					</template>

					<template v-if="fontConfigId == 'fontSize'">
						<div
							class="flex all-center fontFamily"
							v-for="item in fontSizeList"
							:key="item.id"
							@click="setFontSize(item)"
							:style="{
								color: fontSize == item ? '#c62336' : '#333',
							}"
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
							class="content"
							v-model="textContent"
							maxlength="40"
							placeholder="点这里可以输入文字内容哦"
						></textarea>
						<!-- <div class="flex all-center submitBtn">
							<span class="font14 bold bai">提交</span>
						</div> -->
					</div>
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
				:style="{ color: designerWhat == 'img' ? '#fff' : '#a2a6a5' }"
			></span>
			<span
				class="font14 "
				:style="{ color: designerWhat == 'img' ? '#fff' : '#a2a6a5' }"
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
				:style="{ color: designerWhat == 'text' ? '#fff' : '#a2a6a5' }"
				>Aa</span
			>
			<span
				class="font14"
				:style="{ color: designerWhat == 'text' ? '#fff' : '#a2a6a5' }"
				>文字</span
			>
		</div>
		<div
			class="finshedBox"
			v-if="eidtFinshed && (textContent || selectImgUrl)"
		>
			<div @click="resetDesigner" class="finshedbtn flex all-center">
				<span class="font12 _33hei">重做</span>
			</div>
			<div @click="fineshDesigner" class="finshedbtn flex all-center">
				<span class="font12 _33hei">完成</span>
			</div>
		</div>
		<div
			v-if="!eidtFinshed && (textContent || selectImgUrl)"
			class="sliderBox flex align-center flex-column"
		>
			<van-slider
				v-if="textActive"
				vertical
				v-model="textdeg"
				active-color="#c52436"
				bar-height="4px"
			/>
			<van-slider
				active-color="#c52436"
				v-else
				vertical
				v-model="imgdeg"
				bar-height="4px"
			/>
			<div class="actionBox" @click="yesDesigner">
				<span class="iconfont iconduihao"></span>
			</div>
			<div class="actionBox" @click="delDesigner">
				<span class="iconfont iconshanchu"></span>
			</div>
		</div>
	</div>
</template>

<script>
import { mapMutations } from "vuex"
import { Dialog } from "vant"
import html2canvas from "html2canvas"
export default {
	name: "login",
	data() {
		let { designerInfo } = this.$route.query
		let info = JSON.parse(designerInfo)
		return {
			width: 0,
			height: 0,
			x: 0,
			y: 0,
			textActive: false,
			imgActive: false,
			textdeg: 0,
			imgdeg: 0,
			designerImg: "",
			imgUrl: info.picUrl,
			designerWhat: "img",
			classifyList: [], //素材类别
			source: [], //素材列表
			textContent: "", //当前正在编辑的文字
			selectImgUrl: "", //当前选中的imgurl
			eidtFinshed: false,
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
				"Arial",
				"Helvetica",
				"Tahoma",
				"Verdana",
				"Droid Sans",
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
			imgx: 10,
			imgy: 50,
			textx: 20,
			texty: 20,
			lastBackPressed: "",
			status: "loading", //还有更多
		}
	},
	mounted() {
		this.getClassifyList()
	},
	methods: {
		scrollImgList() {
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
		},
		...mapMutations(["setDesignerImg"]),
		setdesignerWhatText() {
			this.designerWhat = "text"
			this.showDragText = true
			this.textActive = true
			this.imgActive = false
			this.eidtFinshed = false
		},
		setdesignerWhatImg() {
			this.designerWhat = "img"
			this.textActive = false
			this.imgActive = true
			this.eidtFinshed = false
		},
		setFontSize(fontSize) {
			this.fontSize = fontSize
			this.textActive = true
			this.imgActive = false
			this.eidtFinshed = false
		},
		setFontFamily(fontFamily) {
			this.fontFamily = fontFamily
			this.textActive = true
			this.imgActive = false
			this.eidtFinshed = false
		},
		setColor(currentColor) {
			this.currentColor = currentColor
			this.textActive = true
			this.imgActive = false
			this.eidtFinshed = false
		},
		selectImg(url) {
			this.selectImgUrl = url
			this.eidtFinshed = false
			this.imgActive = true
			this.textActive = false
		},
		tabFontShowContent(id) {
			this.fontConfigId = id
			console.log("this.fontConfigId", this.fontConfigId)
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
						this.fontFamilyList.length * 80 + 30 + "px"
					break
				case "fontSize":
					this.fontConfigWidth = this.fontSizeList.length * 80 + "px"
					break
			}
		},

		getClassifyList() {
			this.$get("/front/materialsClass/get").then((result) => {
				this.classifyList = result
				this.classifyWidth = result.length * 80
				this.selectClassId = result[0].id
				this.getSourceList()
			})
		},
		getSourceList() {
			this.$get("/front/materialsSource/get", {
				"materialsClass.id": this.selectClassId,
				Page: this.page,
				isMine: "0",
				audit: "1",
				status: "1",
				isOpen: "1",
			}).then((result) => {
				this.page++
				this.source = this.source.concat(result.source)
				this.status =
					this.source.length < result.totalCount ? "more" : "noMore"
				this.sourceWidth = this.source.length * 80
			})
		},
		setClassId(id) {
			this.selectClassId = id
			this.source = []
			this.page = 1
			this.getSourceList()
		},
		onResize: function(x, y, width, height) {
			this.x = x
			this.y = y
			this.width = width
			this.height = height
		},
		onTextDrag(x, y) {
			this.textX = x
			this.textY = y
		},
		onImgDrag(x, y) {
			this.imgx = x
			this.imgy = y
		},
		onImgActivated() {
			this.eidtFinshed = false
			this.imgActive = true
			this.textActive = false
		},
		onTextActivated() {
			this.eidtFinshed = false
			console.log("onTextActivated")
			this.textActive = true
			this.imgActive = false
		},
		fineshDesigner() {
			let content_html = document.getElementById("designerBox") //要转化的div
			console.log("content_html", content_html)
			let width = content_html.offsetWidth
			let height = content_html.offsetHeight
			let offsetTop = content_html.offsetTop
			let canvas = document.createElement("canvas")
			let context = canvas.getContext("2d")
			console.log("window.devicePixelRatio", window.devicePixelRatio)
			let scaleBy = Math.ceil(window.devicePixelRatio)
			canvas.width = width * scaleBy
			canvas.height = (height + offsetTop) * scaleBy
			context.scale(scaleBy, scaleBy)
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
				//  var imgurl = canvas.toBlob((blob)=>{
				//   	//以时间戳作为文件名 实时区分不同文件 按需求自己定义就好
				//     let filename = `${new Date().getTime()}.jpg`;
				//   	//转换canvas图片数据格式为formData
				//     let uploadFile = new File([blob], filename, {type: 'image/jpg'});
				//     let formData = new FormData();
				//     formData.append('file', uploadFile);
				//     //将转换为formData的canvas图片 上传到服务器
				//     this.$post('后台接口地址',formData).then(res=>{
				//      //图片上传成功之后，再调用对应的其他接口，传递指定的参数
				//     })
				// })
				console.log(canvas)
				canvas.style.width = width + "px"
				canvas.style.height = height + "px"
				this.setDesignerImg(canvas.toDataURL())
				this.$router.push("/previewDesigner")
				// $("#grow-img").attr("src", canvas.toDataURL())
			})
		},
		yesDesigner() {
			if (!this.textContent) {
				this.showDragText = false
			}
			this.designerWhat = "img"
			this.textActive = false
			this.imgActive = false
			this.eidtFinshed = true
		},
		resetDesigner() {
			Dialog.confirm({
				title: "您确定要重做吗",
				message: "取消您当前的设计？",
			}).then(() => {
				this.selectImgUrl = ""
				this.textContent = ""
				this.showDragText = false
			})
		},
		delDesigner() {
			if (this.imgActive) {
				this.selectImgUrl = ""
			} else {
				this.textContent = ""
				this.showDragText = false
			}

			this.designerWhat = "img"
		},
	},
}
</script>

<style scoped>
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
	position: relative;
	height: 60vh;
	width: 350px;
}
.designerBottom {
	position: fixed;
	bottom: 0;
	width: 100%;
}
.classifyWrapperOpa {
	width: 100%;
	height: 40px;
	background: #000;
	opacity: 0.4;
}
.classifyWrapper::-webkit-scrollbar {
	display: none;
}
.classifyWrapper {
	width: 100%;
	overflow-x: scroll;
	height: 40px;
	scrollbar-width: none;
	-ms-overflow-style: none; /* IE 10+ */
}
.classifyBox {
	height: 40px;
	width: 80px;
	border: 1px solid #1f1f1f;
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
	width: 120px;
	height: 200px;
	position: absolute;
}
.finshedbtn {
	width: 40px;
	height: 20px;
	border: 1px solid #000;
	border-radius: 4px;
	margin-top: 20px;
}
.finshedBox {
	position: absolute;
	top: 60px;
	right: 20px;
	height: 100px;
	width: 40px;
}
.sliderBox {
	position: absolute;
	top: 80px;
	right: 20px;
	height: 60vh;
	width: 30px;
}
.showImgConfig {
	width: 80px;
	height: 30px;
	border-top-right-radius: 15px;
	border-bottom-right-radius: 15px;
	position: fixed;
	bottom: 250px;
	left: 0;
}
.showTextConfig {
	width: 80px;
	height: 30px;
	border-top-right-radius: 15px;
	border-bottom-right-radius: 15px;
	position: fixed;
	bottom: 200px;
	left: 0;
}
</style>
