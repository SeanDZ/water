<template>
	<div>
		<!--    <el-card class="!border-none" shadow="never">
            <el-page-header content="用户详情" @back="$router.back()" />
        </el-card> -->
		<div class="lg">
			<el-card class="!border-none mb-4 " shadow="always">
				<template #header>
					<span class="card-title">基础信息</span>


				</template>

				<el-row>
					<el-col :span="2">
						<div class="inline-block leading-9  pt-3">
							<!-- <div class="w-40">手机号</div> -->
							<el-avatar :src="formData.avatar" :size="50" />
						</div>
					</el-col>
					<el-col :span="2">
						<div class="inline-block leading-9" style="text-align: center;">
							<div>昵称</div>
							<span> {{ formData.nickname }}</span>
						</div>
					</el-col>
					<el-col :span="2">
						<div class="inline-block leading-9" style="text-align: center;">
							<div>手机号</div>
							<span> {{ formData.mobile }}</span>
						</div>
					</el-col>
					<el-col :span="2">
						<div class="inline-block leading-9" style="text-align: center;">
							<div>注册时间</div>
							<span> {{ formData.create_time }}</span>
						</div>
					</el-col>
					<el-col :span="2">
						<div class="inline-block leading-9" style="text-align: center;">
							<div>水票余量</div>
							<span> {{ formData.user_ticket_num }}</span>
						</div>
					</el-col>
					<el-col :span="2">
						<div class="inline-block leading-9" style="text-align: center;">
							<div>押桶</div>
							<span> {{ formData.user_bucket_num }}</span>
						</div>
					</el-col>
					<el-col :span="2">
						<div class="inline-block leading-9" style="text-align: center;">
							<div>押金金额</div>
							<span> {{ formData.all_deposit_price }}</span>
						</div>
					</el-col>
					<el-col :span="2">
						<div class="inline-block leading-9" style="text-align: center;">
							<div>欠桶</div>
							<span> {{ formData.user_bucket_num2 }}</span>
						</div>
					</el-col>

				</el-row>
			</el-card>
			<el-card class="!border-none mb-4" shadow="always">
				<template #header>
					<span class="card-title">地址信息</span>
					<el-button v-perms="['address.user_address/add']" type="primary" style="float: right;" link @click="handleAddressAdd">
						<template #icon>
							<icon name="el-icon-Plus" />
						</template>
						新增地址
					</el-button>
				</template>
				<el-table :data="Lists.addressDatas" height="250" >
					<el-table-column label="地址编码" prop="code" show-overflow-tooltip />
					<el-table-column label="收货人" prop="name" show-overflow-tooltip />
					<el-table-column label="手机号" prop="mobile" show-overflow-tooltip />
					<el-table-column label="地址" prop="address" show-overflow-tooltip />
					<el-table-column label="门牌号" prop="number" show-overflow-tooltip />
					<el-table-column label="所属门店" prop="water_station_name" show-overflow-tooltip />
					<el-table-column label="状态" prop="status">
						<template #default="{ row }">
							<el-tag v-if="row.status == 1">正常</el-tag>
							<el-tag type="danger" v-else>已停用</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="默认地址" prop="type">
						<template #default="{ row }">
							<el-tag v-if="row.type == 1">是</el-tag>
							<el-tag type="danger" v-else>否</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="120" fixed="right">
						<template #default="{ row }">
							<el-button v-perms="['address.user_address/edit']" type="primary" link  @click="handleAddressEdit(row)" >
								编辑
							</el-button>
							<el-button v-perms="['address.user_address/delete']" type="danger" link @click="handleAddressDelete(row.id)" >
								删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>

			<el-card class="!border-none mb-4 " shadow="always">
				<template #header>
					<span class="card-title">销售订单</span>
					<el-check-tag checked style="float: right">订单总量：{{formData.order_count}}</el-check-tag>
				</template>
				<el-table :data="Lists.OrderDatas" height="250" >
						<el-table-column label="订单号" prop="trade_no" show-overflow-tooltip />
						<el-table-column label="支付时间" prop="pay_time" show-overflow-tooltip />
					<el-table-column label="订单类型" prop="type">
						<template #default="{ row }">
							<el-tag v-if="row.type == 0">配送订单</el-tag>
							<el-tag type="success" v-else-if="row.type == 1">押桶订单</el-tag>
							<el-tag type="warning" v-else>购买水票</el-tag>
						</template>
					</el-table-column>
						<el-table-column label="支付金额" prop="pay_price" show-overflow-tooltip />
					<el-table-column label="支付方式" prop="pay_type">
						<template #default="{ row }">
							<el-tag v-if="row.pay_type == 0">微信支付</el-tag>
							<el-tag type="success" v-else-if="row.pay_type == 1">水票支付</el-tag>
							<el-tag type="info" v-else-if="row.pay_type == 2">积分兑换</el-tag>
							<el-tag type="warning" v-else-if="row.pay_type == 3">代客下单</el-tag>
							<el-tag type="warning" v-else>代客下单</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="状态" prop="is_refund">
						<template #default="{ row }">
							<el-tag type="danger" v-if="row.is_refund == 1">已退费</el-tag>
							<el-tag type="success" v-else>已支付</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="消耗水票" prop="ticket_num" show-overflow-tooltip />
					<el-table-column label="优惠券" prop="coupon_price" show-overflow-tooltip />
					<el-table-column label="备注" prop="remark" show-overflow-tooltip />
					</el-table>
			</el-card>

			<el-card class="!border-none mb-4 " shadow="always">
				<template #header>
					<span class="card-title">配送订单</span>
					<el-check-tag checked style="float: right">配送总量：{{formData.order_distribution_count}}</el-check-tag>
				</template>
					<el-table :data="Lists.OrderDistributionDatas" height="250" >
						<el-table-column label="配送单号" prop="distribution_no" show-overflow-tooltip />
						<el-table-column label="收货地址" prop="address_info" show-overflow-tooltip />
						<el-table-column label="手机号" prop="mobile" show-overflow-tooltip />
						<el-table-column label="状态" prop="status">
							<template #default="{ row }">
								<el-tag v-if="row.status == 1">待接单</el-tag>
								<el-tag type="success" v-else-if="row.status == 2">配送中</el-tag>
								<el-tag type="warning" v-else-if="row.status == 3">已送达</el-tag>
								<el-tag type="danger" v-else>已取消</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="配送件数" prop="delivery_num" show-overflow-tooltip />
						<el-table-column label="接单时间" prop="accept_time" show-overflow-tooltip />
						<el-table-column label="送达时间" prop="done_time" show-overflow-tooltip />
						<el-table-column label="配送费" prop="delivery_price" show-overflow-tooltip />
						<el-table-column label="备注" prop="remark" show-overflow-tooltip />
					</el-table>
			</el-card>

		</div>
		<edit-popup v-if="showAddressEdit" ref="editAddressRef" :dict-data="dictData" @success="getAddressList"
			@close="showAddressEdit = false" />

	</div>
</template>

<script lang="ts" setup name="consumerDetail">
	import {  getUserDetail } from '@/api/consumer'
import feedback from '@/utils/feedback'
	import { useDictData } from '@/hooks/useDictOptions'
	import EditPopup from '../../user_address/edit.vue'
	import { apiUserAddressLists, apiUserAddressDelete } from '@/api/user_address'
	const route = useRoute()
	const formData = reactive({
		avatar: '',
		channel: '',
		create_time: '',
		login_time: '',
		mobile: '',
		nickname: '',
		real_name: 0,
		sex: 0,
		sn: '',
		account: '',
		user_money: '',
		user_ticket_num:0,
		user_bucket_num:0,
		address_num:0,
		all_deposit_price:0,
		user_bucket_num2:0,
		order_distribution_count:0,
		order_count:0,
	})
	const Lists = reactive({
		addressDatas: '',
		OrderDatas: '',
		OrderDistributionDatas: '',
	})
	// 获取字典数据
	const { dictData } = useDictData('status')
	const editAddressRef = shallowRef<InstanceType<typeof EditPopup>>()
	// 是否显示编辑框
	const showAddressEdit = ref(false)


	// 添加
	const handleAddressAdd = async () => {

		showAddressEdit.value = true
		await nextTick()
		editAddressRef.value?.open('add')
		editAddressRef.value?.setUserId(route.query.id)
	}

// 编辑
const handleAddressEdit = async (data: any) => {
    showAddressEdit.value = true
    await nextTick()
    editAddressRef.value?.open('edit')
    editAddressRef.value?.setFormData(data)
}

// 删除
const handleAddressDelete = async (id: number | any[]) => {
    await feedback.confirm('确定要删除该地址吗？')
    await apiUserAddressDelete({ id })
    getDetails()
}

const getDetails = async () => {
	const data = await getUserDetail({
		id: route.query.id
	})
	Lists.addressDatas = data.address
	Lists.OrderDatas = data.order
	Lists.OrderDistributionDatas = data.order_distribution
	Object.keys(formData).forEach((key) => {
		//@ts-ignore
		formData[key] = data[key]
	})
}

	getDetails()
</script>
<style lang="scss" scoped>
	.box-card {
		margin-bottom: 5px;
		max-height: 200px;
		overflow-y: scroll;
	}

	.l-flex {
		display: inline-flex;
	}
</style>