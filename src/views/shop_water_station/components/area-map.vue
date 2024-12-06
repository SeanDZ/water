<template>
    <div style="width: 100%;">
<!--        <el-button type="primary" :loading="state2.isLock" @click="chooseArea" v-show="state2.btnShow">-->
<!--            选择区域范围-->
<!--        </el-button>-->
        <div id="mapContainer2" :style="state2.mapDomStyle">
        </div>
        <div id="toolControl" @click="handleToolClick" :style="state2.toolDomStyle">
            <div class="toolItem" id="polygon" title="多边形"></div>
<!--            <div class="toolItem" id="rectangle" title="多边形"></div>-->
            <div class="toolItem" id="toolDelete" title="删除"></div>
        </div>
    </div>

</template>
<script lang="ts" setup>
import { reactive, defineEmits, onMounted } from 'vue'
let map2 : any = null
const props : any = defineProps({
    formValue: {
        type: Object
    }
})
var editor : any = null
const state2 = reactive<any>({
    latitude: 34.795541,
    longitude: 113.681646,
    simplePath: [],
    isLock: false,
    btnShow: true,
    activeType: 'polygon',
    mapDomStyle: '',
    toolDomStyle: '',
})
onMounted(() => {
    nextTick(() => { initMap2() })
})
const emit = defineEmits(['messageToParent']);
const TMap2 = (window as any).TMap

const chooseArea = () => {
    state2.isLock = true
    state2.mapDomStyle = 'position:relative;left:0;';
    state2.toolDomStyle = 'left:0;';
    state2.btnShow = true
}

const handleToolClick = (e : any) => {
    var id = e.target.id;
    if (id !== 'toolControl') {
        let noActive : any = document.getElementById(state2.activeType)
        noActive.className = 'toolItem';
        let activeId : any = document.getElementById(id)
        activeId.className = 'toolItem active';
        state2.activeType = id;
        // editor.setActiveOverlay('polygon');
        if (id === 'polygon') {
            editor.setActionMode(TMap2.tools.constants.EDITOR_ACTION.DRAW);
        }
    }
}

/**
 * 初始化地图
 */
const initMap2 = () => {
    if (props.formValue.area == '') {
        emitSubmit({ area: '' })
    }
    // else {
    //     chooseArea()
    // }
    chooseArea()
    if (props.formValue.latitude != '' && props.formValue.longitude != '') {
        // if(state2.btnShow===true){
        // 		chooseArea()
        // }
        state2.latitude = props.formValue.latitude
        state2.longitude = props.formValue.longitude
    }
    //中心位置设置成参数
    const center = new TMap2.LatLng(state2 ?.latitude, state2?.longitude)

    // 初始化地图
    map2 = new TMap2.Map("mapContainer2", {
        zoom: 11, // 设置地图缩放级别
        center: center // 设置地图中心点坐标
    });
    map2.removeControl(TMap2.constants.DEFAULT_CONTROL_ID.ZOOM); // 从地图容器移出 缩放控件,
    map2.removeControl(TMap2.constants.DEFAULT_CONTROL_ID.SCALE); // 从地图容器移出 比例尺控件,
    map2.removeControl(TMap2.constants.DEFAULT_CONTROL_ID.ROTATION); // 从地图容器移出 旋转控件,

    if (props.formValue.area != '') {
        console.log(props.formValue.area )
        var jsonPaths : any = JSON.parse(props.formValue.area);
        for (var i = 0; i < jsonPaths.length; i++) {
            state2.simplePath.push(new TMap2.LatLng(jsonPaths[i].lat, jsonPaths[i].lng))

        }
        var polygon = new TMap2.MultiPolygon({
            map: map2,
            styles: {
                highlight: new TMap2.PolygonStyle({
                    color: 'rgba(255, 255, 0, 0.6)'
                })
            },
            geometries: [
                {
                    paths: state2.simplePath
                },

            ]
        });
    } else {
        var polygon = new TMap2.MultiPolygon({
            map: map2,
            styles: {
                highlight: new TMap2.PolygonStyle({
                    color: 'rgba(255, 255, 0, 0.6)'
                })
            },

        });
    }


    editor = new TMap2.tools.GeometryEditor({
        // TMap.tools.GeometryEditor 文档地址：https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocEditor
        map: map2, // 编辑器绑定的地图对象
        overlayList: [
            // 可编辑图层 文档地址：https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocEditor#4
            {
                overlay: polygon,
                id: 'polygon',
                selectedStyleId: 'highlight'
            },
        ],
        actionMode: TMap2.tools.constants.EDITOR_ACTION.INTERACT, // 编辑器的工作模式
        activeOverlayId: 'polygon', // 激活图层
        snappable: true, // 开启吸附
        selectable: true, // 开启点选功能
    });
    // 监听地图点击事件
    // map2.on('click', (e: any) => {
    // 	console.log(editor.getActionMode(),666);
    // })
    const deleteID : any = document.getElementById('toolDelete')
    deleteID.addEventListener("click", function (event : any) {
        editor.delete()
    })
    // 监听绘制结束事件，获取绘制几何图形
    editor.on('draw_complete', (geometry : any) => {
        // console.log(geometry, '11111')
        var shu = geometry.paths
        // console.log(JSON.stringify(shu), 2222)
        // $("#paths").val(JSON.stringify(shu))
        emitSubmit({ 'area': JSON.stringify(shu) });
        let noActive : any = document.getElementById(state2.activeType)
        noActive.className = "toolItem";
        editor.setActionMode(TMap2.tools.constants.EDITOR_ACTION.INTERACT);
    });
    let evtList = ['delete', 'adjust'];
    evtList.forEach(evtName => {
        editor.on(evtName + '_complete', (evtResult : any) => {
            console.log(evtName, evtResult, 444);
        });
    });
    if (props.formValue.latitude == '' || props.formValue.longitude == '' || state2.btnShow) {
        state2.mapDomStyle = 'position:absolute; left:-10000px;';
        state2.toolDomStyle = ' left:-10000px;';
    }
    chooseArea()
}

const emitSubmit = (e : object) => {
    emit('messageToParent', e)
}

watch(() => props.formValue.latitude, (newValue, oldValue) => {
    // console.log('watch 已触发', newValue)
    // console.log(props.formValue)
    map2.setCenter(new TMap2.LatLng(props.formValue.latitude, props.formValue.longitude));
    // initMap2()
}, { deep: true })
</script>

<style lang="scss" scoped>

#mapContainer2 {
    width: 100%;
    height: 500px;
}
#toolControl {
  position: absolute;
  top: 10px;
  right: 0px;
  margin: auto;
  width: 150px;
  z-index: 1001;

  #polygon {
    background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/polygon.png');
  }

  #rectangle {
    background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/rectangle.png');
  }

  #toolDelete {
    background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/delete.png');
  }

  .toolItem {
    // box-sizing: initial;
    width: 40px;
    height: 40px;
    float: left;
    margin: 1px;
    padding: 4px;
    border-radius: 3px;
    background-size: 30px 30px;
    background-position: 4px 4px;
    background-repeat: no-repeat;
    box-shadow: 0 1px 2px 0 #E4E7EF;
    background-color: #ffffff;
    border: 1px solid #ffffff;
  }

  .toolItem:hover {
    border-color: #789CFF;
  }

  .active {
    border-color: #D5DFF2;
    background-color: #D5DFF2;
  }
}
</style>