<template>
    <div>
<!--                <el-card class="!border-none" shadow="never">-->
<!--                    <el-page-header content="配送记录" @back="$router.back()" />-->
<!--                </el-card>-->
        <el-form
            ref="formRef"
            :model="formData"
            label-width="120px"
            v-loading="loading"
        >
            <el-card class="!border-none mt-4" shadow="hover">
                <template #header>
                </template>
                <el-table :data="formData.order" height="800" >
                    <el-table-column label="下单时间" prop="pay_time" show-overflow-tooltip />
                    <el-table-column label="配送单号" prop="distribution_no" show-overflow-tooltip />
                    <el-table-column label="门店" prop="station_name" show-overflow-tooltip />
                    <el-table-column label="配送员" prop="staff_name" show-overflow-tooltip />
                    <el-table-column label="接单时间" prop="accept_time" show-overflow-tooltip />
                    <el-table-column label="送达时间" prop="done_time" show-overflow-tooltip />
                    <el-table-column label="商品信息(名称、数量、单价)" width="500">
                        <template #default="{ row }">
                            <el-table :data="row.good" :show-header="false">
                                <el-table-column prop="name" label="商品名称"> </el-table-column>
<!--                                <el-table-column prop="images" label="图片">-->
<!--                                    <el-image style="width: 50px; height: 50px" :src="row.good.images" />-->
<!--                                </el-table-column>-->
                                <el-table-column prop="num" label="数量"> </el-table-column>
                                <el-table-column prop="price" label="单价"> </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>

                </el-table>
            </el-card>

        </el-form>

    </div>
</template>

<script lang="ts" setup name="detail">
import type { FormInstance } from 'element-plus'
import { apiShopOrderMonthOrderDataDetail } from '@/api/shop_order'
import useMultipleTabs from '@/hooks/useMultipleTabs'

const route = useRoute()

const loading = ref(false)
const formData = reactive({
    order: []
})

const { removeTab } = useMultipleTabs()
const formRef = shallowRef<FormInstance>()

const getDetails = async () => {
    loading.value = true
    const data = await apiShopOrderMonthOrderDataDetail({
        order_month_id: route.query.order_month_id
    })
    console.log(data.order)
    Object.keys(data).forEach((key) => {
        //@ts-ignore
        formData[key] = data[key]
    })
    loading.value = false
}
getDetails()
</script>