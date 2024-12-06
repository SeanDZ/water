<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            :title="popupTitle"
            :async="true"
            width="800px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form ref="formRef" :model="formData" label-width="90px" :rules="formRules">
                <el-form-item label="选择门店" prop="water_station_id">
                    <el-input v-model="formData.water_station_id" clearable placeholder="请输入进货门店" />
                </el-form-item>
                <el-form-item label="供应商" prop="supplier_id">
                    <el-input v-model="formData.supplier_id" clearable placeholder="请输入供应商" />
                </el-form-item>


                <el-form-item
                    label="选择商品"
                    prop="good"
                >
                    <el-button
                        class="button-new-tag ml-1"
                        size="default"
                        type="success"
                        @click="addGoods(formData.goods)"
                    >
                        添加商品
                    </el-button>
                </el-form-item>

                <el-table :data="selectedProducts">
                    <el-table-column label="商品名称" prop="name" />
                    <el-table-column label="数量" prop="quantity" />
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button size="small" type="danger" @click="removeFromTable(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>


                <el-form-item label="实付金额" prop="price">
                    <el-input v-model="formData.price" clearable placeholder="请输入实付金额" />
                </el-form-item>
                <el-form-item label="状态" prop="apply_status">
                  <el-select class="flex-1" v-model="formData.apply_status" clearable placeholder="请选择状态">
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
        <goods-popup
            v-if="showGoods"
            ref="goodsRef"
            @success="dealTags"
            @close="showGoods = false"
        />
    </div>
</template>

<script lang="ts" setup name="shopPurchaseOrderEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiShopPurchaseOrderAdd, apiShopPurchaseOrderEdit, apiShopPurchaseOrderDetail } from '@/api/shop_purchase_order'
import { timeFormat } from '@/utils/util'
import type { PropType } from 'vue'
import GoodsPopup from "@/views/shop_discount_activity/choose_good.vue";
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
const goodsRef = shallowRef<InstanceType<typeof GoodsPopup>>()

// 是否显示商品选择
const showGoods = ref(false)

const selectedItems = ref([]);
const selectedProducts = ref([]);


// 弹窗标题
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '编辑进货单' : '新增进货单'
})


const addGoods = async (data: any) => {
    showGoods.value = true
    await nextTick()
    goodsRef.value?.open('goods')
    goodsRef.value?.setFormData(data)

}

function addSelectedItems() {
    selectedProducts.value.push(...selectedItems.value);
    clearSelection();
}

function clearSelection() {
    selectedItems.value = [];
}


function removeItem(index) {
    selectedItems.value.splice(index, 1);
}

function removeFromTable(index) {
    selectedProducts.value.splice(index, 1);
}

function onClose() {
    clearSelection();
}


// 表单数据
const formData = reactive({
    id: '',
    water_station_id: '',
    supplier_id: '',
    order_sn: '',
    price: '',
    apply_status: '',
    goods: [
        {
            name: '',
            good_id: '',
            num: 1
        }
    ],
})


// 表单验证
const formRules = reactive<any>({
    water_station_id: [{
        required: true,
        message: '请输入进货门店',
        trigger: ['blur']
    }],
    supplier_id: [{
        required: true,
        message: '请输入供应商',
        trigger: ['blur']
    }],
    price: [{
        required: true,
        message: '请输入实付金额',
        trigger: ['blur']
    }],
    apply_status: [{
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
    
    //@ts-ignore
    formData.create_time = timeFormat(formData.create_time,'yyyy-mm-dd hh:MM:ss') 
}

const getDetail = async (row: Record<string, any>) => {
    const data = await apiShopPurchaseOrderDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData,  }
    mode.value == 'edit' 
        ? await apiShopPurchaseOrderEdit(data) 
        : await apiShopPurchaseOrderAdd(data)
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
