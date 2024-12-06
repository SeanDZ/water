<template>
	<div id="panel">
<!--		<el-input v-model="keyword" clearable placeholder="输入关键字" @input="getSuggestions()" />-->
		<ul id="suggestionList"></ul>
	</div>
	<div id="mapContainer" class="mapContainer"></div>
</template>
<script lang="ts" setup>
// import { onMounted, reactive, defineEmits, defineProps } from 'vue'
import { jsonp } from 'vue-jsonp'

let map : any = null
const props : any = defineProps({
	formValue: {
		type: Object
	}
})
const state = reactive<any>({
	markerLayer: '',
	marker: null,
	infoWindow: null,
	latitude: 34.795541,
	longitude: 113.681646,
	suggest: null,
	suggestionList: [],
	suggestionListContainer: null,
	infoWindowList: []
})

const keyword = ref('')
const emit = defineEmits(['messageToParent'])
const TMap = (window as any).TMap

onMounted(() => {
	// init()
	nextTick(() => {
		initMap()
	})
})

/**
 * 初始化地图
 */
const initMap = () => {
	if (props.formValue.address == '') {
		emitSubmit({ address: '', longitude: '', latitude: '' })
	} else {
		keyword.value = props.formValue.address
		if (props.formValue.latitude != '' && props.formValue.longitude != '') {
			state.latitude = props.formValue.latitude
			state.longitude = props.formValue.longitude
		}
	}

	//中心位置设置成参数
	const center = new TMap.LatLng(state.latitude, state.longitude)
	map = new TMap.Map(document.getElementById('mapContainer'), {
		center: center, // 设置地图中心点坐标
		zoom: 17, // 设置地图缩放级别
		viewMode: '2D'
	})
	map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM) // 从地图容器移出 缩放控件,
	map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.SCALE) // 从地图容器移出 比例尺控件,
	map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION) // 从地图容器移出 旋转控件,

	if (props.formValue.latitude != '' && props.formValue.longitude != '') {
		addImgMarker({
			lat: props.formValue.latitude,
			lng: props.formValue.longitude
		})
	}
	// 监听地图点击事件
	map.on('click', (e : any) => {
		// 清除点标记
		if (state.marker !== null) {
			state.marker.setMap(null)
		}
		state.marker = null
		// 添加点标记
		addImgMarker(e.latLng)
		// 地址解析
		getAddress(e)
	})
	// 监听选项点击事件
	const slist : any = document.getElementById('suggestionList')
	slist.addEventListener('click', function (event : any) {
		const targetindex = event.target.dataset.index
		emitSubmit({
			address: state.suggestionList[targetindex].title,
			longitude: state.suggestionList[targetindex].location.lng,
			latitude: state.suggestionList[targetindex].location.lat
		})
		keyword.value = state.suggestionList[targetindex].title

		state.suggestionListContainer.innerHTML = ''
		if (state.marker !== null) {
			state.marker.setMap(null)
		}
		addImgMarker(state.suggestionList[targetindex].location)
		map.setCenter(state.suggestionList[targetindex].location)
	})

	// 初始关闭信息窗关闭
	// state.infoWindow.close()
}

// var infoWindowList = Array(10);
const getSuggestions = () => {
	// 使用者在搜索框中输入文字时触发
	state.suggestionListContainer = document.getElementById('suggestionList')
	state.suggestionListContainer.innerHTML = ''
	// keyword.value = document.getElementById('keyword').value;
	if (keyword.value) {
		jsonp('https://apis.map.qq.com/ws/place/v1/suggestion', {
			key: 'ZUWBZ-VPVCV-3AXP2-524ZV-MD6Z7-EUB4O',
			keyword: keyword.value,
			pageSize: 10, // 返回结果每页条目数
			regionFix: true, // 搜索无结果时是否固定在当前城市
			output: 'jsonp' // output必须jsonp   不然会超时
		})
				.then((res) => {
					if (res.status == 0) {
						state.suggestionListContainer.innerHTML = ''
						state.suggestionList = res.data
						state.suggestionList.forEach((item : any, index : number) => {
							state.suggestionListContainer.innerHTML += `<li data-index="${index}" ><a href="#" data-index="${index}">${item.title}<span class="item_info" data-index="${index}" >${item.address}</span></a></li>`
						})
					}
				})
				.catch(() => {
					state.suggestionListContainer.innerHTML = ''
					state.suggestionList = []
					// emitSubmit({address: '',longitude: '',latitude: ''})
				})
	} else {
		// state.suggestionListContainer.innerHTML = '';
		// state.suggestionList = [];
		// emitSubmit({address: '1111',longitude: '',latitude: ''})
	}
}

/**
 * 添加点标记
 * @param data data
 */
const addImgMarker = (data : any) => {
	state.marker = new TMap.MultiMarker({
		map: map,
		geometries: [{ position: new TMap.LatLng(data.lat, data.lng) }]
	})
}

/**
 * 逆地址解析
 * @param e 待解析经纬度
 */
const getAddress = (e : any) => {
	jsonp('https://apis.map.qq.com/ws/geocoder/v1', {
		key: 'ZUWBZ-VPVCV-3AXP2-524ZV-MD6Z7-EUB4O',
		location: e.latLng.lat + ',' + e.latLng.lng,
		output: 'jsonp' // output必须jsonp   不然会超时
	})
			.then((res) => {
				if (res.status == 0) {
					keyword.value = res.result.address
					emitSubmit({
						address: res.result.address,
						longitude: e.latLng.lng,
						latitude: e.latLng.lat
					})
				}
			})
			.catch(() => {
				keyword.value = ''
				// emitSubmit({address: '',longitude: '',latitude: ''})
			})
}

const emitSubmit = (e : object) => {
	emit('messageToParent', e)
}
</script>

<style lang="scss" scoped>
.mapContainer {
	margin-top: 33px;
	width: 80%;
	height: 200px;
	position: relative;
}

#panel {
	position: absolute;
	width: 100%;
	z-index: 9999;
	top: 0px;

	#suggestionList {
		background-color: #fff;
		max-height: 96px;
		overflow-y: auto;
	}
}
</style>