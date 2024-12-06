<template>
    <div class="edit-popup">
        <popup ref="popupRef" :title="popupTitle" :async="true" width="700px" @confirm="handleSubmit"
               @close="handleClose">
            <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
                        <el-form-item label="所属门店" prop="water_station_name">
                            <el-input v-model="formData.water_station_name" clearable :disabled="true" style="width: 230px"/>
                        </el-form-item>
                        <el-form-item label="商品名称" prop="good_name">
                            <el-input v-model="formData.good_name" clearable :disabled="true" style="width: 230px"/>
                        </el-form-item>
                    <el-col :span="12">
                        <el-form-item label="当前库存" prop="stock">
                            <el-input v-model="formData.stock" clearable type="number" :disabled="true"/>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="选择类型" prop="type">
                            <el-radio-group v-model="formData.type" class="ml-4">
                                <el-radio label="1" size="large">增加库存</el-radio>
                                <el-radio label="2" size="large">减少库存</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数量" prop="num">
                            <el-input v-model="formData.num" clearable placeholder="请输入大于0的数字" type="number" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea"  v-model="formData.remark" clearable placeholder="" />
                        </el-form-item>
                    </el-col>



            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="goodEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiGoodAdd, apiGoodEdit, apiGoodDetail } from '@/api/good'
// import { timeFormat } from '@/utils/util'
import { apiGoodBrandLists } from '@/api/good_brand'
import { apiGoodCategoryLists } from '@/api/good_category'
import { apiShopWaterStationLists } from '@/api/shop_water_station'
import { apiGoodsStockStock } from '@/api/goods_stock'
import type { PropType } from 'vue'
import { ref } from 'vue'

defineProps({
    dictData: {
        type: Object as PropType<Record<string, any[]>>,
        default: () => ({})
    }
})
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const radio1 = ref('1')

// 弹窗标题
const popupTitle = computed(() => {
    return '修改库存'
})

// 表单数据
const formData = reactive({
    id: '',
    good_id: '',
    good_name: '',
    bstock: '',
    type: '',
    stock: '',
    remark:'',
    water_station_id: '',
    water_station_name: '',
})

const formRules = reactive<any>({
    type: [
        {
            required: true,
            message: '请选择类型',
            trigger: ['blur']
        }
    ],
    num: [
        {
            required: true,
            message: '请填写数量',
            trigger: ['blur']
        },
        { pattern: /^[1-9]\d*$/, message: '请填写正确的数量', trigger: ['blur'] }
    ]

})

// 获取详情
const setFormData = async (data : Record<any, any>) => {
    console.log(data)
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
        }
    }


}

const getDetail = async (row : Record<string, any>) => {
    const data = await apiGoodDetail({
        id: row.id
    })
    setFormData(data)
}

//门店
const waterStationListOptions = ref<any[]>([])
const getWaterStationList = async () => {
    try {
        const getWaterStationLists : any = await apiShopWaterStationLists({  })
        waterStationListOptions.value = getWaterStationLists.lists
    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}

const goodBrandListOptions = ref<any[]>([])
// 分页相关
const getGoodBrandList = async () => {
    try {
        // const userStore = useUserStore()
        // const userInfo = userStore.userInfo
        // console.log(userInfo)
        const goodBrandListLists : any = await apiGoodBrandLists({ shop_id: 1 })
        goodBrandListOptions.value = goodBrandListLists.lists
    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}
getGoodBrandList()


const goodCategoryListOptions = ref<any[]>([])
// 分页相关
const getGoodCategoryList = async () => {
    try {
        // const userStore = useUserStore()
        // const userInfo = userStore.userInfo
        // console.log(userInfo)
        const goodCategoryListLists : any = await apiGoodCategoryLists({ shop_id: 1 })
        goodCategoryListOptions.value = goodCategoryListLists.lists
    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}
getGoodCategoryList()

// 提交按钮
const handleSubmit = async () => {
    try {
        await formRef.value?.validate()
        const data = { ...formData, }
        mode.value == await apiGoodsStockStock(data)
        popupRef.value?.close()
        emit('success')
    } catch (e) {
        console.log('failed')
    }

}

//打开弹窗
const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}

// 关闭回调
const handleClose = () => {
    emit('close')
}



defineExpose({
    open,
    setFormData,
    getDetail
})
</script>