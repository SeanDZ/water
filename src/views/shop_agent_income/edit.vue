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
                <el-form-item label="用户信息" prop="user_id">
          <el-input v-model="formData.user_id" clearable placeholder="请输入用户信息" />
            </el-form-item>
                            <el-form-item label="审核状态" prop="status">
                <el-select class="flex-1" v-model="formData.status" clearable placeholder="请选择审核状态">
                    <el-option
                        v-for="(item, index) in dictData.apply_status"
                        :key="index"
                        :label="item.name"
                        :value="parseInt(item.value)"
                    />
                </el-select>
            </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="shopAgentIncomeEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiShopAgentIncomeAdd, apiShopAgentIncomeEdit, apiShopAgentIncomeDetail } from '@/api/shop_agent_income'
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
    return mode.value == 'edit' ? '分销记录' : '分销记录'
})

// 表单数据
const formData = reactive({
    id: '',
    user_id: '',
    status: '',
})


// 表单验证
const formRules = reactive<any>({

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
    const data = await apiShopAgentIncomeDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData,  }
    mode.value == 'edit'
        ? await apiShopAgentIncomeEdit(data)
        : await apiShopAgentIncomeAdd(data)
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
