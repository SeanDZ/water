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
                <el-form-item label="活动名称" prop="title">
                    <el-input
                            v-model="formData.title"
                            clearable
                            placeholder="请输入活动名称"
                            style="width: 500px"
                    />
                </el-form-item>
                <el-form-item label="活动图片" prop="img">
                    <material-picker v-model="formData.img" />
                </el-form-item>
                <el-col :span="24">
                    <el-row v-for="(item, index) in formData.good" :key="index">
                        <el-form-item label="商品" :prop="`good.${index}.good_id`" :rules="formRules.good_id" style="width: 300px">
                            <el-select class="w-50" v-model="item.good_id" placeholder="" clearable>
                                <el-option v-for="item in goodOptions" :key="item.id" :label="item.name"
                                           :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数量" :prop="`good.${index}.good_num`" :rules="formRules.good_num"  style="width: 300px;margin-left: -60px">
                            <el-input-number v-model="item.good_num" clearable placeholder=""  style="width:120px"/>
                        </el-form-item>
                        <el-form-item label="价格" :prop="`good.${index}.price`" :rules="formRules.price" style="width: 300px;margin-left: -113px">
                            <el-input-number v-model="item.price" clearable placeholder="" style="width:120px"/>
                        </el-form-item>
                        <el-form-item label="库存" :prop="`good.${index}.stock`" :rules="formRules.stock"  style="width: 300px;margin-left: -130px">
                            <el-input-number v-model="item.stock" clearable placeholder=""  style="width:120px"/>
                        </el-form-item>
                        <el-form-item style="margin-left: -150px">
                            <el-button type="primary" @click="handleAdd">添加</el-button>
                            <el-button type="danger" @click="handleDel(index)"> 删除 </el-button>
                        </el-form-item>
                    </el-row>
                </el-col>

                <el-form-item label="开始日期" prop="start_date" style="width: 500px">
                    <el-date-picker
                            class="flex-1 !flex"
                            v-model="formData.start_date"
                            clearable
                            type="datetime"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            placeholder="选择开始日期"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束日期" prop="end_date"  style="width: 500px">
                    <el-date-picker
                            class="flex-1 !flex"
                            v-model="formData.end_date"
                            clearable
                            type="datetime"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            placeholder="选择结束日期"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formData.status" placeholder="请选择状态">
                        <el-radio
                                v-for="(item, index) in dictData.status"
                                :key="index"
                                :label="parseInt(item.value)"
                        >
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="面向用户" prop="open_user">
                    <el-radio-group
                            v-model="formData.open_user"
                            placeholder="请选择面向用户"
                    >
                        <el-radio
                                v-for="(item, index) in dictData.user_limit"
                                :key="index"
                                :label="parseInt(item.value)"
                        >
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="限购数量" prop="num">
                    <el-input
                            v-model="formData.num"
                            clearable
                            placeholder="请输入限购数量"
                            style="width: 218px"
                    />
                </el-form-item>
                <el-form-item label="成团人数" prop="group_num">
                    <el-input
                        v-model="formData.group_num"
                        clearable
                        placeholder="请输入成团人数"
                        style="width: 218px"
                    />
                </el-form-item>
                <el-form-item label="成团时效" prop="group_hour">
                    <el-input
                        v-model="formData.group_hour"
                        clearable
                        placeholder="请输入成团时效"
                        style="width: 218px"
                    >
                        <template #append>小时</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="自动成团" prop="is_auto">
                    <el-radio-group
                        v-model="formData.is_auto"
                        placeholder="请选择自动成团"
                        style="width: 218px"
                    >
                        <el-radio
                            v-for="(item, index) in dictData.is_auto"
                            :key="index"
                            :label="parseInt(item.value)"
                        >
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="排序" prop="order">
                    <el-input
                            v-model="formData.order"
                            clearable
                            placeholder="请输入排序"
                            style="width: 218px"
                    />
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="shopActivityEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import {
    apiShopActivityAdd,
    apiShopActivityEdit,
    apiShopActivityDetail
} from '@/api/shop_activity'
import { timeFormat } from '@/utils/util'
import type { PropType } from 'vue'
import {apiGoodLists} from "@/api/good";
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
    return mode.value == 'edit' ? '编辑活动' : '新增活动'
})

// 表单数据
const formData = reactive({
    id: '',
    title: '',
    img: '',
    type:2,
    status: 1,
    start_date: '',
    end_date: '',
    open_user: 1,
    num: '',
    group_num: 0,
    group_hour: 0,
    is_auto: 0,
    order: '',
    good: [
        {
            good_id: '',
            good_num: 1,
            price:0,
            stock:0
        }
    ],
})

// 表单验证
const formRules = reactive<any>({
    title: [
        {
            required: true,
            message: '请输入活动名称',
            trigger: ['blur']
        }
    ],
    img: [
        {
            required: true,
            message: '请选择活动图片',
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
    start_date: [
        {
            required: true,
            message: '请选择开始日期',
            trigger: ['blur']
        }
    ],
    end_date: [
        {
            required: true,
            message: '请选择结束日期',
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
    open_user: [
        {
            required: true,
            message: '请选择面向用户',
            trigger: ['blur']
        }
    ],
    num: [
        {
            required: true,
            message: '请输入限购数量',
            trigger: ['blur']
        }
    ]
})

const handleAdd = () => {
    formData.good.push({
        good_id: '',
        good_num: 1,
        price:0,
        stock:0
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
    const data = await apiShopActivityDetail({
        id: row.id
    })
    setFormData(data)
}

const goodOptions = ref<any[]>([])
// 商品列表相关
const getgoodList = async () => {
    try {
        const goodListLists: any = await apiGoodLists()
        goodOptions.value = goodListLists.lists
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
        ? await apiShopActivityEdit(data)
        : await apiShopActivityAdd(data)
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
