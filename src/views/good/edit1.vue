<template>
    <div class="edit-popup">
        <popup ref="popupRef" :title="popupTitle" :async="true" width="950px" @confirm="handleSubmit"
               @close="handleClose">
            <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="品牌" prop="good_brand_id">
                            <!-- <el-input v-model="formData.good_brand_id" clearable placeholder="请输入品牌" /> -->
                            <el-select class="w-80" v-model="formData.good_brand_id" placeholder="请选择品牌" clearable>
                                <el-option v-for="item in goodBrandListOptions" :key="item.id" :label="item.name"
                                           :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="分类" prop="good_category_id">
                            <!-- <el-input v-model="formData.good_category_id" clearable placeholder="请输入分类" /> -->
                            <el-select class="w-80" v-model="formData.good_category_id" placeholder="请选择分类" clearable>
                                <el-option v-for="item in goodCategoryListOptions" :key="item.id" :label="item.name"
                                           :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品名称" prop="name">
                            <el-input v-model="formData.name" clearable placeholder="请输入商品名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="副标题" prop="desc">
                            <el-input v-model="formData.desc" clearable placeholder="请输入副标题" />
                        </el-form-item>
                    </el-col>
                    <!--					<el-col :span="12">-->
                    <!--						<el-form-item label="商品类型" prop="type">-->
                    <!--							<el-radio-group v-model="formData.type" placeholder="请选择商品类型">-->
                    <!--								<el-radio v-for="(item, index) in dictData.type" :key="index"-->
                    <!--									:label="parseInt(item.value)">-->
                    <!--									{{ item.name }}-->
                    <!--								</el-radio>-->
                    <!--							</el-radio-group>-->
                    <!--						</el-form-item>-->
                    <!--					</el-col>-->
                    <el-col :span="12">
                        <el-form-item label="售价" prop="price">
                            <el-input v-model="formData.price" clearable placeholder="请输入售价" type="number" >
                                <template #append>元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="成本价" prop="cost_price">
                            <el-input v-model="formData.cost_price" clearable placeholder="请输入成本价" type="number" >
                                <template #append>元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否押桶" prop="is_deposit">
                            <el-switch v-model="formData.is_deposit" class="ml-2" inline-prompt :active-value="1"
                                       :inactive-value="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="空桶押金" prop="deposit_price">
                            <el-input v-model="formData.deposit_price" clearable placeholder="请输入空桶押金" type="number" >
                                <template #append>元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品单位" prop="unit">
                            <el-input v-model="formData.unit" clearable placeholder="请输入规格单位(桶、箱、件等)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="规格大小" prop="spec">
                            <el-input v-model="formData.spec" clearable placeholder="请输入商品规格(19L、18.9L)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="商品图片" prop="images_all">
                            <div class="flex-1">
                                <material-picker :limit="4" v-model="formData.images_all" />
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="起送数量" prop="min_num">
                            <el-input-number v-model="formData.min_num" clearable placeholder="请输入起送数量" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序" prop="order">
                            <el-input-number v-model="formData.order" clearable placeholder="请输入排序" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="是否上架" prop="status">
                            <el-switch v-model="formData.status" inline-prompt :active-value="1"
                                       :inactive-value="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="热销商品" prop="is_hot">
                            <el-switch v-model="formData.is_hot" inline-prompt :active-value="1"
                                       :inactive-value="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否收楼层费" prop="is_floor">
                            <el-switch v-model="formData.is_floor" inline-prompt :active-value="1"
                                       :inactive-value="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否有配送费" prop="is_delivery">
                            <el-switch v-model="formData.is_delivery" inline-prompt :active-value="1"
                                       :inactive-value="0" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="下单检查库存" prop="is_limit">
                            <el-switch v-model="formData.is_limit" inline-prompt :active-value="1"
                                       :inactive-value="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="商品介绍" prop="content">
                            <editor class="flex-1" v-model="formData.content" :height="500" />
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="goodEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiGoodAdd, apiGoodEdit, apiGoodDetail } from '@/api/good'
// import { timeFormat } from '@/utils/util'
import { apiGoodBrandLists } from '@/api/good_brand'
import { apiGoodCategoryLists } from '@/api/good_category'
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
    return mode.value == 'edit' ? '编辑商品管理' : '新增商品管理'
})

// 表单数据
const formData = reactive({
    id: '',
    good_brand_id: '',
    good_category_id: '',
    name: '',
    desc: '',
    status: 1,
    type: 1,
    price: '',
    cost_price: '',
    is_deposit: 1,
    deposit_price: '',
    unit: '',
    spec: '',
    images_all: '',
    content: '',
    order: '',
    is_floor:1,
    is_delivery:0,
    min_num:1,
    is_hot:1,
    is_limit:0,
})


// 表单验证
const formRules = reactive<any>({
    good_brand_id: [{
        required: true,
        message: '请输入品牌',
        trigger: ['blur']
    }],
    good_category_id: [{
        required: true,
        message: '请输入分类',
        trigger: ['blur']
    }],
    name: [{
        required: true,
        message: '请输入商品名称',
        trigger: ['blur']
    }],
    desc: [{
        required: true,
        message: '请输入副标题',
        trigger: ['blur']
    }],
    status: [{
        required: true,
        message: '请选择是否上架',
        trigger: ['blur']
    }],
    type: [{
        required: true,
        message: '请选择商品类型',
        trigger: ['blur']
    }],
    price: [{
        required: true,
        message: '请输入售价',
        trigger: ['blur']
    }],
    unit: [{
        required: true,
        message: '请输入规格单位',
        trigger: ['blur']
    }],
    spec: [{
        required: true,
        message: '请输入商品规格',
        trigger: ['blur']
    }],
    images_all: [{
        required: true,
        message: '请选择商品图片',
        trigger: ['blur']
    }],
    order: [{
        required: true,
        message: '请输入排序',
        trigger: ['blur']
    }],
})




// 获取详情
const setFormData = async (data : Record<any, any>) => {
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
        }
    }


}

const getDetail = async (row : Record<string, any>) => {
    const data = await apiGoodDetail({
        id: row.id
    })
    setFormData(data)
}



const goodBrandListOptions = ref<any[]>([])
// 分页相关
const getGoodBrandList = async () => {
    try {
        // const userStore = useUserStore()
        // const userInfo = userStore.userInfo
        // console.log(userInfo)
        const goodBrandListLists : any = await apiGoodBrandLists({ shop_id: 1 })
        goodBrandListOptions.value = goodBrandListLists.lists
    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}
getGoodBrandList()


const goodCategoryListOptions = ref<any[]>([])
// 分页相关
const getGoodCategoryList = async () => {
    try {
        // const userStore = useUserStore()
        // const userInfo = userStore.userInfo
        // console.log(userInfo)
        const goodCategoryListLists : any = await apiGoodCategoryLists({ shop_id: 1 })
        goodCategoryListOptions.value = goodCategoryListLists.lists
    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}
getGoodCategoryList()

// 提交按钮
const handleSubmit = async () => {
    try {
        await formRef.value?.validate()
        const data = { ...formData, }
        mode.value == 'edit'
            ? await apiGoodEdit(data)
            : await apiGoodAdd(data)
        popupRef.value?.close()
        emit('success')
    } catch (e) {
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