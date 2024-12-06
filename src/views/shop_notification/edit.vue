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
                <el-form-item label="标题" prop="title">
    <el-input v-model="formData.title" clearable placeholder="请输入标题" />
</el-form-item>
                <el-form-item label="通知内容" prop="content">
    <el-input v-model="formData.content" clearable placeholder="请输入通知内容" />
</el-form-item>
                <el-form-item label="状态" prop="status">
    <el-radio-group v-model="formData.status" placeholder="请选择状态">
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

<script lang="ts" setup name="shopNotificationEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiShopNotificationAdd, apiShopNotificationEdit, apiShopNotificationDetail } from '@/api/shop_notification'
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
    return mode.value == 'edit' ? '编辑首页通知配置' : '新增首页通知配置'
})

// 表单数据
const formData = reactive({
    id: '',
    title: '',
    content: '',
    status: '',
})


// 表单验证
const formRules = reactive<any>({
    title: [{
        required: true,
        message: '请输入标题',
        trigger: ['blur']
    }],
    content: [{
        required: true,
        message: '请输入通知内容',
        trigger: ['blur']
    }],
    status: [{
        required: true,
        message: '请选择状态',
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
    const data = await apiShopNotificationDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData,  }
    mode.value == 'edit' 
        ? await apiShopNotificationEdit(data) 
        : await apiShopNotificationAdd(data)
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
