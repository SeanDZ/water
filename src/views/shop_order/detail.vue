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
                    <el-table-column label="商品名称" prop="name" show-overflow-tooltip />
                    <el-table-column label="图片" prop="images" show-overflow-tooltip >
                        <template #default="{ row }">
                            <el-image style="width: 50px; height: 50px" :src="row.images" />
                        </template></el-table-column>
                    <el-table-column label="购买数量" prop="num" show-overflow-tooltip />
                    <el-table-column label="售价" prop="price" show-overflow-tooltip />
                    <el-table-column label="成本价" prop="cost_price" show-overflow-tooltip />
                    <el-table-column label="优惠金额" prop="discount_price" show-overflow-tooltip />
                    <el-table-column label="使用水票（张）" prop="ticket_num" show-overflow-tooltip />
                </el-table>
            </el-card>


            <el-row :gutter="10">
                <el-col :span="12">
                    <el-card class="!border-none mt-4" shadow="hover">
                        <template #header>
                            <span class="card-title">支付信息</span>
                        </template>

                        <el-form-item style="flex: 1" label="订单号："> {{ formData.trade_no }} </el-form-item>
                        <el-form-item style="flex: 1" label="支付时间："> {{ formData.pay_time }} </el-form-item>
                        <el-form-item style="flex: 1" label="订单类型：">  <el-tag type="success"> {{ formData.order_type }} </el-tag> </el-form-item>
                        <el-form-item style="flex: 1" label="支付方式：">  <el-tag type="warning"> {{ formData.pay_type }} </el-tag> </el-form-item>
                        <el-form-item style="flex: 1" label="实付金额："> {{ formData.pay_price }} 元</el-form-item>
                        <el-form-item style="flex: 1" label="优惠券抵扣："> {{ formData.coupon_price }} 元</el-form-item>
                        <el-form-item style="flex: 1" label="满减金额："> {{ formData.discount_price }} 元</el-form-item>
                        <el-form-item style="flex: 1" label="押桶金额："> {{ formData.bucket_price }} 元</el-form-item>
                        <el-form-item style="flex: 1" label="订单状态："> <el-tag type="danger"> {{ formData.pay_status }} </el-tag></el-form-item>
                        <el-form-item style="flex: 1" label="交易单号："> {{ formData.transaction_id }} </el-form-item>
                        <el-form-item style="flex: 1" label="使用水票：">{{ formData.ticket_num }} 张 </el-form-item>
                        <el-form-item style="flex: 1" label="使用积分：">{{ formData.point }} 张 </el-form-item>
                        <el-form-item style="flex: 1" label="订单备注："> {{ formData.remark }} </el-form-item>
                    </el-card>
                </el-col>

                <el-col :span="12"  v-show="formData.type == 0">
                    <el-card class="!border-none mt-4" shadow="hover">
                        <template #header>
                            <span class="card-title">配送信息</span>
                        </template>
                        <el-form-item style="flex: 1" label="配送单号："> {{ formData.distribution_no }} </el-form-item>
                        <el-form-item style="flex: 1" label="收货人/手机号："> {{ formData.name }} </el-form-item>
                        <el-form-item style="flex: 1" label="地址："> {{ formData.address_info }} </el-form-item>
                        <el-form-item style="flex: 1" label="配送门店："> {{ formData.station_name }}  </el-form-item>
                        <el-form-item style="flex: 1" label="配送员："> {{ formData.staff_name }}  </el-form-item>
                        <el-form-item style="flex: 1" label="配送状态："> <el-tag type="success"> {{ formData.dis_status }} </el-tag> </el-form-item>
                        <el-form-item style="flex: 1" label="接单时间："> {{ formData.accept_time }} </el-form-item>
                        <el-form-item style="flex: 1" label="送达时间："> {{ formData.done_time }} </el-form-item>
                        <el-form-item style="flex: 1" label="配送费：">{{ formData.delivery_price }} 元 </el-form-item>
                        <el-form-item style="flex: 1" label="上楼费：">{{ formData.floor_price }} 元 </el-form-item>
                        <el-form-item style="flex: 1" label="回桶：">{{ formData.back_num }}  </el-form-item>
                        <el-form-item style="flex: 1" label="押桶："> {{ formData.ya_num }} </el-form-item>
                        <el-form-item style="flex: 1" label="欠桶："> {{ formData.owe_num }} </el-form-item>
                    </el-card>
                </el-col>
            </el-row>



        </el-form>

    </div>
</template>

<script lang="ts" setup name="detail">
import type { FormInstance } from 'element-plus'
import { apiShopOrderDetail } from '@/api/shop_order'
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
    const data = await apiShopOrderDetail({
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