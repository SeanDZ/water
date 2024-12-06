<template>
    <div class="edit-popup">
        <popup ref="popupRef" :title="popupTitle" :async="true" width="600px" @confirm="handleSubmit"
               @close="handleClose">
            <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
                <el-col :span="12">
                    <el-form-item label="退款金额" prop="amount">
                        <el-input v-model="formData.amount" clearable placeholder="请输入大于0的数字" type="number" />
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

<script lang="ts" setup name="amount">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { refund } from '@/api/finance'
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
const mode = ref('account')

// 弹窗标题
const popupTitle = computed(() => {
    return mode.value == 'account' ? '退款金额' : ''
})

// 表单数据
const formData = reactive({
    id: '',
    amount: '',
    remark: ''
})

const formRules = reactive<any>({
    amount: [
        {
            required: true,
            message: '请填写退款金额',
            trigger: ['blur']
        },
        { pattern: /^\d+(\.\d{1,2})?$/, message: '最多保留两位小数', trigger: ['blur'] }
    ]

})

const setFormData = async (data : Record<any, any>) => {
    console.log(data)
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
        }
    }
}
// 提交按钮
const handleSubmit = async () => {
    try {
        await formRef.value?.validate()
        const data = { ...formData }
        mode.value == await refund(data)
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
    setFormData
})

</script>