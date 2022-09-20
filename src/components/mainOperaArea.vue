<template>
  <div class="main-opera-area"
	v-loading="loading"
	element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="main-opera-area__header">
      <p style="color: #fff">{{fileName}}</p>
      <el-button type="primary" 
		:disabled="!imgList.length" @click="createPdf">生成pdf</el-button>
    </div>
    <template v-if="imgList.length">
		<div class="main-opera-area__body" v-for="(img, index) in imgList" 
			:key="index" :ref="'imgWrapper' + index">
			<img :src="img.base64" :style="calcImgStyle(img)" alt="图片" />
			<!-- 已拖拽完成的组件 -->
			<template v-if="componentsList.length">
			<template v-for="item in componentsList[index]">
				<p v-if="item.type === 'text'"
				:key="item.id"
				:style="item.style">{{item.value}}</p>
			</template>
			</template>
		</div>
    </template>
    <p v-else class="no-data">暂无内容</p>
  </div>
</template>
<script>
import html2canvas from 'html2canvas';
import utils from '@/common/utils';

export default {
  name: 'MainOperaArea',
  props: {
    imgList: {
      type: Array,
      default: () => ([]),
    },
    componentsList: {
      type: Array,
      default: () => ([]),
    },
    fileName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
		imgBlobDataList: [],
		loading: false,
		loadingText: '',
    };
  },
  computed: {
    
  },
  methods: {
	calcImgStyle(item) {
		let imgWidth = 0;
		let imgHeight = 0;
		if (item) {
			const sizes = item.size.split('x');
			imgWidth = sizes[0];
			imgHeight = sizes[1];
		}
		return {
			width: `${imgWidth}px`,
			height: `${imgHeight}px`,
		};
	},
    async createPdf() {
		this.loading = true;
		let index = 0;
		this.convertToImage(this.$refs[`imgWrapper${index}`][0], index);
    },
    convertToImage(container, index, options = {}) {
		this.loadingText = `正在处理第${index + 1}页内容`;
		this.$message(this.loadingText);
		// 设置放大倍数
		const scale = window.devicePixelRatio;
		// 传入节点原始宽高
		const _width = container.offsetWidth;
		const _height = container.offsetHeight;
		const width = options.width || _width;
		const height = options.height || _height;

		// html2canvas配置项
		const opts = {
			scale,
			...options,
			width,
			height,
		};
		html2canvas(container, opts).then(async canvas => {
			// 返回图片的二进制数据
			this.imgBlobDataList.push({
				url: canvas.toDataURL('image/png'),
				size: this.imgList[index].size,
				isBase64: true,
			});
			index++;
			if (index < this.imgList.length) {
				this.convertToImage(this.$refs[`imgWrapper${index}`][0], index);
			} else {
				await utils.convertPic2Pdf(this.imgBlobDataList, () => {
					this.imgBlobDataList = [];
					this.loading = false;
				});
			}
		});
    },
  },
};
</script>
<style scoped>
.main-opera-area {
  height: 100%;
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #999;
  padding: 0 12px;
}
.main-opera-area__header {
  flex: 0;
  width: 90%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}
.main-opera-area__body {
  position: relative;
}
.no-data {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
