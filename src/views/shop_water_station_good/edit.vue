<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            :title="popupTitle"
            :async="true"
            width="550px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form ref="formRef" :model="formData" label-width="90px" :rules="formRules">
                <el-row>
                    <el-col>
                        <el-form-item label="售价" prop="price">
                            <el-input-number v-model="formData.price" clearable placeholder="请输入售价" style="width: 200px"/>
                        </el-form-item>
                    </el-col>

                    <el-col>
                        <el-form-item label="是否上架" prop="is_sale">
                            <el-switch v-model="formData.is_sale" inline-prompt :active-value="1"
                                       :inactive-value="0" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="shopWaterStationGoodEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiShopWaterStationGoodAdd, apiShopWaterStationGoodEdit, apiShopWaterStationGoodDetail } from '@/api/shop_water_station_good'
import { timeFormat } from '@/utils/util'
import type { PropType } from 'vue'
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


// 弹窗标题
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '编辑门店商品' : '新增门店商品'
})

// 表单数据
const formData = reactive({
    id: '',
    price:'',
    is_sale: 1
})


// 表单验证
const formRules = reactive<any>({
    is_sale: [{
        required: true,
        message: '请选择售卖状态',
        trigger: ['blur']
    }],
    price: [{
        required: true,
        message: '请输入售价',
        trigger: ['blur']
    }],
})


// 获取详情
const setFormData = async (data: Record<any, any>) => {
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
        }
    }
    
    
}

const getDetail = async (row: Record<string, any>) => {
    const data = await apiShopWaterStationGoodDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData,  }
    mode.value == 'edit' 
        ? await apiShopWaterStationGoodEdit(data) 
        : await apiShopWaterStationGoodAdd(data)
    popupRef.value?.close()
    emit('success')
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
