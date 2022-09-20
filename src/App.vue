<template>
  <div id="app">
	<componentArea />
	<mainOperaArea :imgList="imgList" :componentsList="componentsList"
		:fileName="fileName"/>
	<editArea />
  </div>
</template>

<script>
import componentArea from './components/componentArea.vue';
import mainOperaArea from './components/mainOperaArea.vue';
import editArea from './components/editArea.vue';

export default {
  name: 'App',
  components: {
    componentArea,
    mainOperaArea,
    editArea,
  },
  data() {
    return {
		imgList: [],
		componentsList: [],
		fileName: '',
    }
  },
  mounted() {
	this.getPdfList();	
  },
  methods: {
    async getPdfList() {
      const res = await this.$api.getPdf2PicList({
        params: {
          fileName: 'contract',
        },
      });
      if (+res.code === 0 && res?.data?.list.length) {
        this.imgList = res.data.list;
		this.fileName = res.data.fileName;
        this.createCpnListData(this.imgList.length);
      }
    },
	// todo：模拟用户已完成拖拽组件的场景
	createCpnListData(total) {
		for (let i = 0; i < total; i++) {
			this.componentsList.push([{
				id: `${i}0`,
				type: 'text',
				value: `第${i + 1}个姓名`,
				style: `left: ${Math.floor(Math.random() * 200)}px;
					top: ${Math.floor(Math.random() * 300)}px;
					position: absolute; background: yellowgreen;`,
			}, {
				id: `${i}1`,
				type: 'text',
				value: `第${i + 1}个身份证号码`,
				style: `left: ${Math.floor(Math.random() * 200)}px;
					top: ${Math.floor(Math.random() * 300)}px;
					position: absolute; background: yellowgreen;`,
			}]);
		}
	},
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: row;
}
</style>
