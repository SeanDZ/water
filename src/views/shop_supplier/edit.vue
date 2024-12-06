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
                <el-form-item label="供应商" prop="title">
    <el-input v-model="formData.title" clearable placeholder="请输入供应商公司" />
</el-form-item>
                <el-form-item label="联系人" prop="name">
    <el-input v-model="formData.name" clearable placeholder="请输入联系人" />
</el-form-item>
                <el-form-item label="手机号" prop="mobile">
    <el-input v-model="formData.mobile" clearable placeholder="请输入手机号" />
</el-form-item>
                <el-form-item label="地址" prop="address">
    <el-input v-model="formData.address" clearable placeholder="请输入地址" />
</el-form-item>
                <el-form-item label="备注" prop="remark">
    <el-input v-model="formData.remark" clearable placeholder="请输入备注" />
</el-form-item>
                <el-form-item label="启用状态" prop="status">
                    <el-switch v-model="formData.status" class="ml-2" inline-prompt :active-value="1"
                               :inactive-value="0" />
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="shopSupplierEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiShopSupplierAdd, apiShopSupplierEdit, apiShopSupplierDetail } from '@/api/shop_supplier'
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
    return mode.value == 'edit' ? '编辑供应商' : '新增供应商'
})

// 表单数据
const formData = reactive({
    id: '',
    title: '',
    name: '',
    mobile: '',
    address: '',
    remark: '',
    status: 1,
})


// 表单验证
const formRules = reactive<any>({
    title: [{
        required: true,
        message: '请输入供应商公司',
        trigger: ['blur']
    }],
    name: [{
        required: true,
        message: '请输入联系人',
        trigger: ['blur']
    }],
    mobile: [{
        required: true,
        message: '请输入联系方式',
        trigger: ['blur']
    }],
    address: [{
        required: true,
        message: '请输入地址',
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
    const data = await apiShopSupplierDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData,  }
    mode.value == 'edit' 
        ? await apiShopSupplierEdit(data) 
        : await apiShopSupplierAdd(data)
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
