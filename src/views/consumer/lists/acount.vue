<template>
    <div class="edit-popup">
        <popup ref="popupRef" :title="popupTitle" :async="true" width="700px" @confirm="handleSubmit"
               @close="handleClose">
            <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
                <el-col :span="12">
                    <el-form-item label="选择类型" prop="type">
                        <el-radio-group v-model="formData.type" class="ml-4">
                            <el-radio label="200" size="large">增加余额</el-radio>
                            <el-radio label="100" size="large">减少余额</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="账户余额" prop="account">
                        <el-input v-model="formData.account" clearable placeholder="请输入大于0的数字" type="number" />
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
import { userAccount } from '@/api/consumer'
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
    return mode.value == 'account' ? '变更账户余额' : ''
})

// 表单数据
const formData = reactive({
    id: '',
    type: '',
    remark:''
})

const formRules = reactive<any>({
    type: [
        {
            required: true,
            message: '请选择类型',
            trigger: ['blur']
        }
    ],
    account: [
        {
            required: true,
            message: '请填写余额',
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
        mode.value == await userAccount(data)
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