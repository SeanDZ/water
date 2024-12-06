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
                    <span class="card-title">订单信息</span>
                </template>
                <div style="display: flex">
                    <el-form-item style="flex: 1" label="订单号："> {{ formData.trade_no }} </el-form-item>
                    <el-form-item style="flex: 1" label="支付方式："> <el-tag type="danger"> {{ formData.pay_type }} </el-tag></el-form-item>
                    <el-form-item style="flex: 1" label="支付时间："> {{ formData.pay_time }} </el-form-item>
                </div>
                <div style="display: flex">
                    <el-form-item style="flex: 1" label="实付金额："> {{ formData.pay_price }} 元</el-form-item>
                    <el-form-item style="flex: 1" label="优惠券金额："> {{ formData.coupon_price }} 元</el-form-item>
                    <el-form-item style="flex: 1" label="满减金额："> {{ formData.discount_price }} 元</el-form-item>
                </div>
                <div style="display: flex">
                    <el-form-item style="flex: 1" label="订单状态："> <el-tag type="success"> {{ formData.pay_status }} </el-tag></el-form-item>
                    <el-form-item style="flex: 1" label="交易单号："> {{ formData.transaction_id }} </el-form-item>
                    <el-form-item style="flex: 1" label="订单备注："> {{ formData.remark }} </el-form-item>
                </div>
                <div style="display: flex">
                    <el-form-item style="flex: 1" label="使用水票：">{{ formData.ticket_num }} 张 </el-form-item>
                    <el-form-item style="flex: 1" label="押桶："> {{ formData.bucket_add }} 个</el-form-item>
                    <el-form-item style="flex: 1" label="押金："> {{ formData.bucket_price }} 元 </el-form-item>
                </div>
            </el-card>

            <el-card class="!border-none mt-4" shadow="hover">
                <template #header>
                    <span class="card-title">配送信息</span>
                </template>
                <div style="display: flex">
                    <el-form-item style="flex: 1" label="收货人/手机号："> {{ formData.name }} / {{ formData.mobile }} </el-form-item>
                    <el-form-item style="flex: 1" label="配送状态："> <el-tag type="success"> {{ formData.status }} </el-tag> </el-form-item>
                    <el-form-item style="flex: 1" label="送达时间："> {{ formData.done_time }} </el-form-item>
                </div>
                <div style="display: flex">
                    <el-form-item style="flex: 1; white-space: nowrap;overflow: hidden; text-overflow: ellipsis;width: 100px" label="地址："> {{ formData.address_info }} </el-form-item>
                    <el-form-item style="flex: 1" label="所属门店："> {{ formData.water_station }} </el-form-item>
                    <el-form-item style="flex: 1" label="配送员："> {{ formData.staff_name }} </el-form-item>
                </div>
                <div style="display: flex">
                    <el-form-item style="flex: 1" label="上楼费："> {{ formData.floor_price }} 元</el-form-item>
                    <el-form-item style="flex: 1" label="配送费："> {{ formData.delivery_price }} 元 </el-form-item>
                    <el-form-item style="flex: 1" label="商品数量："> {{ formData.delivery_num }} </el-form-item>
                </div>
                <div style="display: flex">
                    <el-form-item style="flex: 1" label="回桶："> {{ formData.bucket_back }} </el-form-item>
                    <el-form-item style="flex: 1" label="临时欠桶："> {{ formData.bucket_dec }} </el-form-item>
                    <el-form-item style="flex: 1" label="额外回桶："> {{ formData.bucket_new_add }} </el-form-item>
                </div>
            </el-card>

<!--            <el-row :gutter="10">-->
<!--                <el-col :span="12">-->
<!--                    <el-card class="!border-none mt-4" shadow="hover">-->
<!--                        <template #header>-->
<!--                            <span class="card-title">订单信息</span>-->
<!--                        </template>-->
<!--                        <div style="display: flex">-->
<!--                            <el-form-item style="flex: 1" label="订单号："> {{ formData.trade_no }} </el-form-item>-->
<!--                            <el-form-item style="flex: 1" label="支付时间："> {{ formData.pay_time }} </el-form-item>-->
<!--                        </div>-->
<!--                        <div style="display: flex">-->
<!--                            <el-form-item style="flex: 1" label="支付方式："> <el-tag type="danger"> {{ formData.pay_type }} </el-tag></el-form-item>-->
<!--                            <el-form-item style="flex: 1" label="实付金额："> {{ formData.pay_price }} 元</el-form-item>-->
<!--                        </div>-->
<!--                        <div style="display: flex">-->
<!--                            <el-form-item style="flex: 1" label="订单状态："> <el-tag type="success"> {{ formData.pay_status }} </el-tag></el-form-item>-->
<!--                            <el-form-item style="flex: 1" label="交易单号："> {{ formData.transaction_id }} </el-form-item>-->
<!--                        </div>-->
<!--                        <div style="display: flex">-->
<!--                            <el-form-item style="flex: 1" label="使用水票：">{{ formData.ticket_num }} 张 </el-form-item>-->
<!--                            <el-form-item style="flex: 1" label="订单备注："> {{ formData.remark }} </el-form-item>-->
<!--                        </div>-->
<!--                        <div style="display: flex">-->
<!--                            <el-form-item style="flex: 1" label="押桶："> {{ formData.bucket_add }} </el-form-item>-->
<!--                            <el-form-item style="flex: 1" label="押金："> {{ formData.bucket_price }} 元 </el-form-item>-->
<!--                        </div>-->
<!--                    </el-card>-->
<!--                </el-col>-->

<!--                <el-col :span="12">-->
<!--                    <el-card class="!border-none mt-4" shadow="hover">-->
<!--                        <template #header>-->
<!--                            <span class="card-title">配送信息</span>-->
<!--                        </template>-->
<!--                        <div style="display: flex">-->
<!--                            <el-form-item style="flex: 1" label="收货人/手机号："> {{ formData.name }} / {{ formData.mobile }} </el-form-item>-->
<!--                            <el-form-item style="flex: 1; white-space: nowrap;overflow: hidden; text-overflow: ellipsis;width: 100px" label="地址："> {{ formData.address_info }} </el-form-item>-->
<!--                        </div>-->
<!--                        <div style="display: flex">-->
<!--                            <el-form-item style="flex: 1" label="所属门店："> {{ formData.water_station }} </el-form-item>-->
<!--                            <el-form-item style="flex: 1" label="配送员："> {{ formData.staff_name }} </el-form-item>-->
<!--                        </div>-->

<!--                        <div style="display: flex">-->
<!--                            <el-form-item style="flex: 1" label="配送状态："> <el-tag type="success"> {{ formData.status }} </el-tag> </el-form-item>-->
<!--                            <el-form-item style="flex: 1" label="送达时间："> {{ formData.done_time }} </el-form-item>-->
<!--                        </div>-->
<!--                        <div style="display: flex">-->
<!--                            <el-form-item style="flex: 1" label="上楼费："> {{ formData.floor_price }} 元</el-form-item>-->
<!--                            <el-form-item style="flex: 1" label="配送费："> {{ formData.delivery_price }} 元 </el-form-item>-->
<!--                        </div>-->
<!--                        <div style="display: flex">-->
<!--                            <el-form-item style="flex: 1" label="回桶："> {{ formData.bucket_back }} </el-form-item>-->
<!--                            <el-form-item style="flex: 1" label="欠桶："> {{ formData.bucket_dec }} </el-form-item>-->
<!--                        </div>-->

<!--                    </el-card>-->
<!--                </el-col>-->
<!--            </el-row>-->

            <el-card class="!border-none mt-4" shadow="hover">
                <template #header>
                    <span class="card-title">商品信息</span>
                </template>
                <el-table :data="formData.goods" height="260" >
                    <el-table-column label="品牌" prop="brand_name" show-overflow-tooltip />
                    <el-table-column label="商品名称" prop="name" show-overflow-tooltip />
                    <el-table-column label="图片" prop="images" show-overflow-tooltip >
                        <template #default="{ row }">
                            <el-image style="width: 50px; height: 50px" :src="row.images" />
                        </template>
                    </el-table-column>
                    <el-table-column label="购买数量" prop="num" show-overflow-tooltip />
                    <el-table-column label="售价" prop="price" show-overflow-tooltip />
                    <el-table-column label="成本价" prop="cost_price" show-overflow-tooltip />
                    <el-table-column label="优惠金额" prop="discount_price" show-overflow-tooltip />
                    <el-table-column label="使用水票（张）" prop="ticket_num" show-overflow-tooltip />
                    <el-table-column label="使用积分" prop="point" show-overflow-tooltip />
                </el-table>
            </el-card>

            <el-card class="!border-none mt-4" shadow="hover">
                <template #header>
                    <span class="card-title">回桶信息</span>
                </template>
                <el-table :data="formData.back" height="260" >
                    <el-table-column label="品牌" prop="brand_name" show-overflow-tooltip />
                    <el-table-column label="商品名称" prop="name" show-overflow-tooltip />
                    <el-table-column label="图片" prop="images" show-overflow-tooltip >
                        <template #default="{ row }">
                            <el-image style="width: 50px; height: 50px" :src="row.images" />
                        </template></el-table-column>
                    <el-table-column label="类型" prop="type">
                        <template #default="{ row }">
                            <el-tag type="success" v-if="row.type == 1">回桶</el-tag>
                            <el-tag type="warning" v-else-if="row.type == 2">押桶</el-tag>
                            <el-tag type="danger" v-else-if="row.type == 3">临时欠桶</el-tag>
                            <el-tag  v-else-if="row.type == 4">额外回桶</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量" prop="num" show-overflow-tooltip />
                    <el-table-column label="空桶单价" prop="deposit_price" show-overflow-tooltip />
                </el-table>
            </el-card>

        </el-form>

    </div>
</template>

<script lang="ts" setup name="detail">
import type { FormInstance } from 'element-plus'
import { apiShopOrderDistributionDetail } from '@/api/shop_order_distribution'
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
    const data = await apiShopOrderDistributionDetail({
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