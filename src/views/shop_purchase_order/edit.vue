<template>
    <div class="article-edit">
        <el-card class="!border-none" shadow="never">
            <el-page-header content="详情" @back="$router.back()" />
        </el-card>
        <el-card class="mt-4 !border-none" shadow="never">
            <el-form
                    ref="formRef"
                    class="ls-form"
                    :model="formData"
                    label-width="85px"
                    :rules="rules"
            >
                <div class="xl:flex">
                    <div>

                        <el-form-item label="供应商" prop="supplier_id">
                            <el-select class="w-80" v-model="formData.supplier_id" placeholder="请选择供应商" clearable >
                                <el-option v-for="item in supplierListOptions" :key="item.id" :label="item.title"
                                           :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择门店" prop="water_station_id">
                            <el-select class="w-80" v-model="formData.water_station_id" placeholder="请选择门店" clearable >
                                <el-option v-for="item in stationListOptions" :key="item.id" :label="item.name"
                                           :value="item.id" />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="实付金额" prop="price">
                            <div>
                                <el-input-number v-model="formData.price" :min="0" :max="9999" />
                            </div>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <div class="w-80">
                                <el-input
                                        v-model="formData.remark"
                                        placeholder="请输入备注"
                                        type="textarea"
                                        :autosize="{ minRows: 3, maxRows: 3 }"
                                        maxlength="64"
                                        show-word-limit
                                        clearable
                                />
                            </div>
                        </el-form-item>

                        <el-form-item
                            label=""
                            prop="good"
                        >
                            <el-button
                                class="button-new-tag ml-1"
                                size="default"
                                type="success"
                                @click="addGoods(formData.goods)"
                            >
                                选择商品
                            </el-button>
                        </el-form-item>

                        <goods-popup
                            v-if="showGoods"
                            ref="goodsRef"
                            @success="dealTags"
                            @close="showGoods = false"
                        />
                    </div>
                </div>
            </el-form>
        </el-card>
        <footer-btns v-show="formData.apply_status != 1">
            <el-button type="primary" @click="handleSave(1)">保存</el-button>
            <el-button type="danger" @click="handleSave(2)">保存并审核</el-button>
        </footer-btns>
    </div>
</template>

<script lang="ts" setup name="shopPurchaseOrderEdit">
import type { FormInstance } from 'element-plus'
import useMultipleTabs from '@/hooks/useMultipleTabs'
import { apiShopWaterStationLists } from "@/api/shop_water_station";
import { apiShopSupplierLists } from "@/api/shop_supplier";
import { apiShopPurchaseOrderAdd, apiShopPurchaseOrderEdit, apiShopPurchaseOrderDetail } from "@/api/shop_purchase_order";
import GoodsPopup from "@/views/shop_purchase_order/choose_good.vue";

const route = useRoute()
const router = useRouter()
const formData = reactive({
    id: '',
    supplier_id: '',
    water_station_id: '',
    price: '',
    remark: '',
    apply_status:'',
    goods: [
        {
            good_id: '',
            num: 1,
        }
    ],
    type: '',

})

const goodsRef = shallowRef<InstanceType<typeof GoodsPopup>>()
// 是否显示商品选择
const showGoods = ref(false)
const addGoods = async (data: any) => {
    showGoods.value = true
    await nextTick()
    goodsRef.value?.open('goods')
    goodsRef.value?.setFormData(data)

}

const { removeTab } = useMultipleTabs()
const formRef = shallowRef<FormInstance>()
const rules = reactive({
    supplier_id: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
    water_station_id: [{ required: true, message: '请选择门店', trigger: 'blur' }]
})

const getDetails = async () => {
    const data = await apiShopPurchaseOrderDetail({
        id: route.query.id
    })
    Object.keys(formData).forEach((key) => {
        //@ts-ignore
        formData[key] = data[key]
    })
}


const supplierListOptions = ref<any[]>([])
const getSupplierList = async () => {
    try {
        const supplierLists : any = await apiShopSupplierLists({ status:1 })
        supplierListOptions.value = supplierLists.lists

    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}
getSupplierList()


const stationListOptions = ref<any[]>([])
const getStationList = async () => {
    try {
        const stationLists : any = await apiShopWaterStationLists({ status:1 })
        stationListOptions.value = stationLists.lists

    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}
getStationList()

const handleSave = async (type: any) => {
    await formRef.value?.validate()
    formData.type = type
    if (route.query.id) {
        await apiShopPurchaseOrderEdit(formData)
    } else {
        await apiShopPurchaseOrderAdd(formData)
    }
    removeTab()
    router.back()
}

route.query.id && getDetails()
</script>
