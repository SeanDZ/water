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
            <el-form ref="formRef" :model="formData" label-width="90px">
                <el-form-item label="折扣价" prop="name" >
<!--                    <el-input v-model="formData.vip_price" clearable placeholder="请输入折扣价" number/>-->
                    <el-input v-model="formData.vip_price" clearable placeholder="请输入折扣价" type="number" style="width: 200px">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
<!--                <el-form-item label="是否参与" prop="is_show">-->
<!--                    <el-switch v-model="formData.is_show" class="ml-2" inline-prompt :active-value="1"-->
<!--                               :inactive-value="0" />-->
<!--                </el-form-item>-->
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="goodBrandEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiGoodDetail ,apiSetPriceGood} from '@/api/good'
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
    return mode.value == 'edit' ? '商品折扣价' : '商品折扣价'
})

// 表单数据
const formData = reactive({
    id: '',
    type: '',
    vip_price:0,
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
    const data = await apiGoodDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    try{
        await formRef.value?.validate()
        const data = { ...formData,  }
        await apiSetPriceGood(data)
        popupRef.value?.close()
        emit('success')
    }catch(e){
        //TODO handle the exception
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
