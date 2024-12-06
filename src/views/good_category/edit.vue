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
                <el-form-item label="名称" prop="name">
    <el-input v-model="formData.name" clearable placeholder="请输入名称" />
</el-form-item>
                <el-form-item label="图片" prop="image">
    <material-picker v-model="formData.image" />
</el-form-item>
                <el-form-item label="排序" prop="order">
    <el-input-number v-model="formData.order" clearable placeholder="请输入排序" />
</el-form-item>
                <el-form-item label="是否开启" prop="is_show">
	<el-switch v-model="formData.is_show" class="ml-2" inline-prompt :active-value="1"
		:inactive-value="0" />
</el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="goodCategoryEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiGoodCategoryAdd, apiGoodCategoryEdit, apiGoodCategoryDetail } from '@/api/good_category'
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
    return mode.value == 'edit' ? '编辑商品分类' : '新增商品分类'
})

// 表单数据
const formData = reactive({
    id: '',
    name: '',
    image: '',
    order: '',
    is_show: 1,
})


// 表单验证
const formRules = reactive<any>({
    name: [{
        required: true,
        message: '请输入名称',
        trigger: ['blur']
    }],
    image: [{
        required: true,
        message: '请选择图片',
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
    const data = await apiGoodCategoryDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
	try{
		await formRef.value?.validate()
		const data = { ...formData,  }
		mode.value == 'edit' 
		    ? await apiGoodCategoryEdit(data) 
		    : await apiGoodCategoryAdd(data)
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
