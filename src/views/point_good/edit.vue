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
            <el-form ref="formRef" :model="formData" label-width="120px" :rules="formRules">
                <el-form-item label="关联商品" prop="good_id">
                    <el-select class="w-100" v-model="formData.good_id" placeholder="请选择商品" clearable>
                        <el-option v-for="item in goodListOptions" :key="item.id" :label="item.name"
                                   :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="需要积分" prop="point">
                    <el-input v-model="formData.point" clearable placeholder="请输入需要积分" style="width: 218px"/>
                </el-form-item>
                <el-form-item label="库存" prop="stock">
                    <el-input v-model="formData.stock" clearable placeholder="请输入库存" style="width: 218px"/>
                </el-form-item>
                <el-form-item label="单次限制数量" prop="limit_num">
                    <el-input v-model="formData.limit_num" clearable placeholder="请输入限制兑换数量" style="width: 218px"/>
                </el-form-item>
                <el-form-item label="水票有效期" prop="days">
                    <el-input v-model="formData.days" clearable placeholder="请输入有效期" type="number"  style="width: 150px">
                        <template #append>天</template>
                    </el-input>
                    <el-tag type="danger" style="margin-left: 20px;" >默认0 表示永久有效</el-tag>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formData.status" placeholder="请选择状态">
                        <el-radio
                                v-for="(item, index) in dictData.good_status"
                                :key="index"
                                :label="parseInt(item.value)"
                        >
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="排序" prop="order">
                    <el-input v-model="formData.order" clearable placeholder="请输入排序" style="width: 218px"/>
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="pointGoodEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiPointGoodAdd, apiPointGoodEdit, apiPointGoodDetail } from '@/api/point_good'
import { timeFormat } from '@/utils/util'
import type { PropType } from 'vue'
import { apiNormalGood } from "@/api/good";
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
    return mode.value == 'edit' ? '编辑' : '新增'
})

// 表单数据
const formData = reactive({
    id: '',
    good_id: '',
    point: '',
    stock: '',
    limit_num: 1,
    status: 1,
    days: 0,
    order: 1,
})


// 表单验证
const formRules = reactive<any>({
    good_id: [{
        required: true,
        message: '请输入商品名称',
        trigger: ['blur']
    }],
    point: [{
        required: true,
        message: '请输入需要积分',
        trigger: ['blur']
    }],
    stock: [{
        required: true,
        message: '请输入库存',
        trigger: ['blur']
    }],
    limit_num: [{
        required: true,
        message: '请输入限制兑换数量',
        trigger: ['blur']
    }],
    status: [{
        required: true,
        message: '请选择状态',
        trigger: ['blur']
    }],
    order: [{
        required: true,
        message: '请输入排序',
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
const goodListOptions = ref<any[]>([])
// 分页相关
const getGoodList = async () => {
    try {
        const goodListLists : any = await apiNormalGood({})
        goodListOptions.value = goodListLists.lists
    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}
getGoodList()


const getDetail = async (row: Record<string, any>) => {
    const data = await apiPointGoodDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData,  }
    mode.value == 'edit' 
        ? await apiPointGoodEdit(data) 
        : await apiPointGoodAdd(data)
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
