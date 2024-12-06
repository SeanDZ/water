<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-page-header content="订单详情" @back="$router.back()" />
        </el-card>
        <el-form
            ref="formRef"
            :model="formData"
            label-width="120px"
            v-loading="loading"
        >


            <el-card class="!border-none mt-4" shadow="hover">
                <template #header>
                    <span class="card-title">商品信息</span>
                </template>
                <el-table :data="formData.goods" height="200" >
                    <el-table-column label="品牌" prop="brand_name" show-overflow-tooltip />
                    <el-table-column label="商品名称" prop="name" show-overflow-tooltip />
                    <el-table-column label="图片" prop="images" show-overflow-tooltip >
                        <template #default="{ row }">
                            <el-image style="width: 50px; height: 50px" :src="row.images" />
                        </template></el-table-column>
                    <el-table-column label="数量" prop="num" show-overflow-tooltip />
                    <el-table-column label="空桶单价" prop="price" show-overflow-tooltip />
                </el-table>
            </el-card>

            <el-card class="!border-none mt-4" shadow="hover">
                <template #header>
                    <span class="card-title">支付信息</span>
                </template>

                <el-form-item style="flex: 1" label="订单号："> {{ formData.trade_no }} </el-form-item>
                <el-form-item style="flex: 1" label="支付时间："> {{ formData.pay_time }} </el-form-item>
                <el-form-item style="flex: 1" label="支付方式：">  <el-tag type="warning"> {{ formData.pay_type }} </el-tag> </el-form-item>
                <el-form-item style="flex: 1" label="押桶金额："> {{ formData.bucket_price }} 元</el-form-item>
                <el-form-item style="flex: 1" label="订单状态："> <el-tag type="danger"> {{ formData.apply_status }} </el-tag></el-form-item>
                <el-form-item style="flex: 1" label="交易单号："> {{ formData.transaction_id }} </el-form-item>
                <el-form-item style="flex: 1" label="订单备注："> {{ formData.remark }} </el-form-item>
            </el-card>


        </el-form>

    </div>
</template>

<script lang="ts" setup name="detail">
    import type { FormInstance } from 'element-plus'
    import { apiShopOrderBucketDetail } from '@/api/shop_order'
    import useMultipleTabs from '@/hooks/useMultipleTabs'

    const route = useRoute()
    const router = useRouter()

    const loading = ref(false)
    const formData = reactive({
        id: '',
        goods: []
    })

    const { removeTab } = useMultipleTabs()
    const formRef = shallowRef<FormInstance>()

    const getDetails = async () => {
        loading.value = true
        const data = await apiShopOrderBucketDetail({
            id: route.query.id
        })
        Object.keys(data).forEach((key) => {
            //@ts-ignore
            formData[key] = data[key]
        })
        loading.value = false
    }

    route.query.id && getDetails()
</script>