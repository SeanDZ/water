<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            :title="popupTitle"
            :async="true"
            width="1100px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form
                ref="formRef"
                :model="formData"
                label-width="110px"
                :rules="formRules"
            >
                <el-form-item label="组合商品名称" prop="title">
                    <el-input
                        v-model="formData.name"
                        clearable
                        placeholder="请输入名称"
                        style="width: 500px"
                    />
                </el-form-item>
                <el-form-item label="副标题" prop="title">
                    <el-input
                        v-model="formData.desc"
                        clearable
                        placeholder="请输入副标题"
                        style="width: 500px"
                    />
                </el-form-item>
                <el-col :span="24">
                    <el-row v-for="(item, index) in formData.good" :key="index">
                        <el-form-item label="商品" :prop="`good.${index}.good_id`" :rules="formRules.good_id" style="width: 300px">
                            <el-select class="w-70" v-model="item.good_id" placeholder="" clearable>
                                <el-option v-for="item in goodOptions" :key="item.id" :label="item.name" :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数量" :prop="`good.${index}.good_num`" :rules="formRules.good_num"  style="width: 300px;margin-left: -50px">
                            <el-input-number v-model="item.good_num" clearable placeholder=""  style="width:120px"/>
                        </el-form-item>
                        <el-form-item style="margin-left: -150px">
                            <el-button type="primary" @click="handleAdd">添加</el-button>
                            <el-button type="danger" @click="handleDel(index)"> 删除 </el-button>
                        </el-form-item>
                    </el-row>
                </el-col>

                <el-form-item label="图片" prop="images_all">
                    <div class="flex-1">
                        <material-picker :limit="4" v-model="formData.images_all" />
                    </div>
                </el-form-item>

                <el-form-item label="是否上架" prop="status">
                    <el-switch v-model="formData.status" class="ml-2" inline-prompt :active-value="1"
                               :inactive-value="0" />
                </el-form-item>

                <el-form-item label="售价" prop="price">
                    <el-input v-model="formData.price" clearable placeholder="请输入售价" type="number" style="width: 150px"/>
                </el-form-item>

                <el-form-item label="库存" prop="stock">
                    <el-input-number v-model="formData.stock" clearable placeholder="请输入库存"/>
                </el-form-item>

                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="formData.order" clearable placeholder="请输入排序" type="number"/>
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="shopActivityEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import {
    apiCombinationAdd,
    apiCombinationEdit,
    apiGoodDetail,
    apiNormalGood
} from '@/api/good'
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
    return mode.value == 'edit' ? '编辑' : '新增'
})

// 表单数据
const formData = reactive({
    id: '',
    name:'',
    desc:'',
    type:3,
    status: 1,
    order: '',
    price:0,
    stock:0,
    images_all:'',
    good: [
        {
            good_id: '',
            good_num: 1,
        }
    ],
})

// 表单验证
const formRules = reactive<any>({
    name: [
        {
            required: true,
            message: '请输入组合商品名称',
            trigger: ['blur']
        }
    ],
    images_all: [
        {
            required: true,
            message: '请上传图片',
            trigger: ['blur']
        }
    ],
    status: [
        {
            required: true,
            message: '请选择状态',
            trigger: ['blur']
        }
    ],
    good_id: [
        {
            required: true,
            message: '请选择商品',
            trigger: ['blur']
        }
    ],

    good_num: [
        {
            required: true,
            message: '请填写商品数量',
            trigger: ['blur']
        }
    ],
    price: [
        {
            required: true,
            message: '请填写价格',
            trigger: ['blur']
        }
    ],
    stock: [
        {
            required: true,
            message: '请填写商品库存',
            trigger: ['blur']
        }
    ],
})

const handleAdd = () => {
    formData.good.push({
        good_id: '',
        good_num: 1,
        price: 0,
        stock: 0
    })
}

const handleDel = (index : number) => {
    if (formData.good.length > 1) {
        formData.good.splice(index, 1)
    }

}
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


const goodOptions = ref<any[]>([])
// 编辑 商品列表相关
const getgoodList = async () => {
    try {
        const goodListLists: any = await apiNormalGood(0)
        goodOptions.value = goodListLists.lists
        console.log(goodOptions)
    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}
getgoodList()



// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData }
    mode.value == 'edit'
        ? await apiCombinationEdit(data)
        : await apiCombinationAdd(data)
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
