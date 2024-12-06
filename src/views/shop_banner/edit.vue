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
                <el-form-item label="排序" prop="order">
    <el-input v-model="formData.order" clearable placeholder="请输入排序" />
</el-form-item>
                <el-form-item label="图片" prop="img">
    <material-picker v-model="formData.img" />
</el-form-item>
                <el-form-item label="显示" prop="is_show">
    <el-radio-group v-model="formData.is_show" placeholder="请选择显示">
        <el-radio 
            v-for="(item, index) in dictData.show_status"
            :key="index"
            :label="parseInt(item.value)"
        >
            {{ item.name }}
        </el-radio>
    </el-radio-group>
</el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="shopBannerEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiShopBannerAdd, apiShopBannerEdit, apiShopBannerDetail } from '@/api/shop_banner'
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
    return mode.value == 'edit' ? '编辑首页轮播图' : '新增首页轮播图'
})

// 表单数据
const formData = reactive({
    id: '',
    order: '',
    img: '',
    is_show: '',
})


// 表单验证
const formRules = reactive<any>({
    order: [{
        required: true,
        message: '请输入排序',
        trigger: ['blur']
    }],
    img: [{
        required: true,
        message: '请选择图片',
        trigger: ['blur']
    }],
    is_show: [{
        required: true,
        message: '请选择显示',
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
    const data = await apiShopBannerDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData,  }
    mode.value == 'edit' 
        ? await apiShopBannerEdit(data) 
        : await apiShopBannerAdd(data)
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
