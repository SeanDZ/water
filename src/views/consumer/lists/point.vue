<template>
    <div class="edit-popup">
        <popup ref="popupRef" :title="popupTitle" :async="true" width="700px" @confirm="handleSubmit"
               @close="handleClose">
            <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
                <el-col :span="12">
                    <el-form-item label="选择类型" prop="type">
                        <el-radio-group v-model="formData.type" class="ml-4">
                            <el-radio label="3" size="large">增加积分</el-radio>
                            <el-radio label="4" size="large">减少积分</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="积分数量" prop="point">
                        <el-input v-model="formData.point" clearable placeholder="请输入大于0的数字" type="number" />
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
import { userPoint } from '@/api/consumer'
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
const mode = ref('point')

// 弹窗标题
const popupTitle = computed(() => {
    return mode.value == 'point' ? '变更积分' : ''
})

// 表单数据
const formData = reactive({
    id: '',
    type: '',
    point: '',
    remark: '',
})

const formRules = reactive<any>({
    type: [
        {
            required: true,
            message: '请选择类型',
            trigger: ['blur']
        }
    ],
    point: [
        {
            required: true,
            message: '请填写数量',
            trigger: ['blur']
        },
        { pattern: /^[1-9]\d*$/, message: '请填写正确的数量', trigger: ['blur'] }
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
        const data = { ...formData, }
        mode.value == await userPoint(data)
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