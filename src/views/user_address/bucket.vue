<template>
	<div class="bucket-popup">
		<popup ref="popupRef" :title="popupTitle" :async="true" width="1100px" confirmButtonText="" cancelButtonText="">

			<div class="card-title mb-5">
				<el-tag  size="large">所属门店：{{stationListTem[userInfo.water_station_id]}}</el-tag>
				<el-tag class="ml-4" size="large">联系人：{{userInfo.name}}</el-tag>
				<el-tag class="ml-4" size="large">手机号：{{userInfo.mobile}}</el-tag>
				<el-tag class="ml-4" size="large">地址：{{userInfo.address}}</el-tag>
			</div>
			<el-card class="!border-none"  shadow="always">
				<template #header>
					<el-button v-perms="['address.user_address/change_bucket']" type="primary" @click="handleBucketAdd('add','')">
						<template #icon>
							<icon name="el-icon-Plus" />
						</template>
						新增
					</el-button>


					<el-button style="float: right;" size="mini" @click="handleQuery"><el-icon>
							<Refresh />
						</el-icon></el-button>
				</template>
				<div class="mt-4">
					<el-table :data="dataSource.list" height="500">
						<el-table-column label="商品名称" prop="name" show-overflow-tooltip />
						<el-table-column label="类型" prop="type">
							<template #default="{ row }">
								<el-tag v-if="row.type == 1" type="success">押桶</el-tag>
								<el-tag type="danger" v-else>欠桶</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="数量" prop="num" show-overflow-tooltip />
<!--						<el-table-column label="押金单价(元)" prop="deposit_price" show-overflow-tooltip />-->
						<el-table-column label="创建时间" prop="create_time" show-overflow-tooltip />
						<el-table-column label="操作" width="120" fixed="right">
							<template #default="{ row }">
								<el-button type="primary" @click="handleBucketAdd('dec',row)">
									扣除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			
			</el-card>

		</popup>
	</div>

	<el-dialog v-model="dialogFormVisible" :title=dialogTitle width="30%" :before-close="handleClose">
		<el-form ref="formRef" :model="formData" :rules="formRules" :label-width="formLabelWidth">
			<el-form-item v-if="mode==='add'" label="类型" prop="type">
				<el-radio-group v-model="formData.type">
					<el-radio-button label="1">押桶</el-radio-button>
					<el-radio-button label="2">欠桶</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-form-item v-if="mode==='add'" label="选择商品" prop="good_id">
				<el-select class="w-80" v-model="formData.good_id" placeholder="" clearable>
					<el-option v-for="item in goodListOptions" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="数量" prop="num">
				<el-input-number v-model="formData.num" clearable placeholder="请输入大于0的数字" />
			</el-form-item>
			<el-form-item label="单价" prop="price" v-show="formData.type == 1 && mode==='add'">
				<el-input-number v-model="formData.price" clearable placeholder="请输入大于0的数字" />
			</el-form-item>
<!--			<el-form-item label="是否支付" v-show="formData.type == 1 && mode==='add'">-->
<!--				<el-radio-group v-model="formData.is_pay">-->
<!--					<el-radio :label="1">已支付</el-radio>-->
<!--					<el-radio :label="0">未支付</el-radio>-->
<!--				</el-radio-group>-->
<!--			</el-form-item>-->
			<el-form-item label="备注" prop="remark">
				<el-input type="textarea" v-model="formData.remark" clearable placeholder="" />
			</el-form-item>
		</el-form>

		<el-alert
				type="warning"
				title="温馨提示：增加押桶数量会生成一条押桶订单记录"
				:closable="false"
				show-icon
		></el-alert>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSubmit">
					确认
				</el-button>
			</span>
		</template>
	</el-dialog>

</template>

<script lang="ts" setup name="goodEdit">
	import type { FormInstance } from 'element-plus'
	import Popup from '@/components/popup/index.vue'
	import { usePaging } from '@/hooks/usePaging'
	import {apiUserBucketLists, apiUserBucketAdd, apiUserBucketDec} from '@/api/user_address'
	import { apiShopWaterStationLists } from '@/api/shop_water_station'
	import { apiNormalGood } from '@/api/good'
	import { ref } from 'vue'

	const formRef = shallowRef<FormInstance>()

	const emit = defineEmits(['success', 'close'])

	const popupRef = shallowRef<InstanceType<typeof Popup>>()
	const mode = ref('add')
	const dialogFormVisible = ref(false)
	const dialogTitle = computed(() => {
		return mode.value == 'add' ? '增加' : '扣除'
	})

	const formLabelWidth = '140px'

	const formData = reactive({
		id:'',
		address_id: '',
		type: 1,
		good_id: '',
		num: '',
		remark: '',
		price:'',
	})

	const formRules = reactive<any>({
		type: [
			{
				required: true,
				message: '请选择类型',
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
		num: [
			{
				required: true,
				message: '请填写数量',
				trigger: ['blur']

			},
			{ pattern: /^[1-9]\d*$/, message: '请填写正确的数量', trigger: ['blur'] }
		],
	})

	const handleClose = (done : () => void) => {
		done()
	}

	// 弹窗标题
	const popupTitle = computed(() => {
		return mode.value == 'bucket' ? '押桶欠桶' : ''
	})

	const userInfo = reactive({
		name: '',
		address: '',
		mobile: '',
		water_station_id: '',
		waterStation: '',
	})

	// 查询条件
	const queryParams = reactive({
		address_id: ''
	})

	// 分页相关
	const goodListOptions = ref<any[]>([])
	// 分页相关
	const getgoodList = async () => {
		try {
			const goodListLists : any = await apiNormalGood({ shop_id: 1 })
			goodListOptions.value = goodListLists.lists
		} catch (e) {
			console.log('err', e)

			//TODO handle the exception
		}
	}
	getgoodList()


	// 获取详情
	const setFormData = async (data : Record<any, any>) => {
		userInfo.address = data.address
		userInfo.mobile = data.mobile
		userInfo.name = data.name
		userInfo.water_station_id = data.water_station_id
		queryParams.address_id = data.id
		formData.address_id = data.id
		getLists()
	}

	const dataSource : any=reactive({
		list:[]
	})
	const getLists  = async () => {
		dataSource.list  = await apiUserBucketLists(queryParams)
	}

	const handleBucketAdd = (type : string,rows :any) => {
		mode.value = type
		formRef.value?.resetFields()
		formData.id=rows.id
		dialogFormVisible.value = true
	}

	const stationListTem : any = reactive({})

	// 分页相关
	const getStationList = async () => {
		try {
			const stationLists : any = await apiShopWaterStationLists({  })
			for (const key in stationLists.lists) {
				stationListTem[stationLists.lists[key]['id']] = stationLists.lists[key]['name']
			}
		} catch (e) {
			console.log('err', e)
			//TODO handle the exception
		}
	}
	getStationList()

	const handleQuery = async () => {
		getLists()
	}
	// 提交按钮
	const handleSubmit = async () => {
		try {
			await formRef.value?.validate()
			const data = { ...formData, }
			mode.value == 'add'
					? await apiUserBucketAdd(data)
					: await apiUserBucketDec(data)
			dialogFormVisible.value = false
			getLists()
		} catch (e) {
			console.log('err', e)
			//TODO handle the exception
		}

	}

	//打开弹窗
	const open = (type = 'order') => {
		mode.value = type

		popupRef.value?.open()
	}

	defineExpose({
		open,
		setFormData
	})
</script>