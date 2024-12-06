<template>
	<div class="order-popup">
		<popup ref="popupRef" :title="popupTitle"  :async="true" width="1100px"
			@confirm="handleSubmit" @close="handleClose">
			<el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
				<el-row>
					<el-col :span="24">
						<el-row>
							<el-form-item label="基本信息">
								<el-tag size="large">联系人：{{userInfo.name}}</el-tag>
								<el-tag class="ml-4" size="large">电话：{{userInfo.mobile}}</el-tag>
								<el-tag class="ml-4"
									size="large">门店：{{stationListTem[userInfo.water_station_id]}}</el-tag>
								<el-tag class="ml-4" size="large">地址：{{userInfo.address}}</el-tag>
								<el-tag class="ml-8" size="large" type="danger" v-show="userInfo.month_type == 1">月结地址</el-tag>
							</el-form-item>
						</el-row>
					</el-col>

					<el-col :span="24">
						<el-form-item label="支付方式" prop="type">
							<el-radio-group v-model="formData.type">
								<el-radio-button label="1" v-show="userInfo.month_type == 0">水票支付</el-radio-button>
								<el-radio-button label="3" v-show="userInfo.month_type == 0">货到付款</el-radio-button>
								<el-radio-button label="2" v-show="userInfo.month_type == 1"> 月结 </el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-row v-for="(item, index) in formData.good" :key="index">
							<el-form-item label="下单商品" :prop="`good.${index}.good_id`" :rules="formRules.good_id">
								<el-select class="w-80" v-model="item.good_id" placeholder="" clearable>
									<el-option v-for="item in goodListOptions" :key="item.id" :label="item.name"
										:value="item.id" />
								</el-select>
							</el-form-item>
							<el-form-item label="数量" :prop="`good.${index}.num`" :rules="formRules.num">
								<el-input-number v-model="item.num" clearable placeholder="请输入大于0的数字" />
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="handleAdd">添加</el-button>
								<el-button type="danger" @click="handleDel(index)"> 删除 </el-button>
							</el-form-item>
						</el-row>
					</el-col>
					<el-col :span="20">
						<el-form-item class="w-80" label="支付金额" prop="pay_price" v-show="formData.type == 3">
							<el-input  v-model="formData.pay_price" clearable placeholder="" />
						</el-form-item>
					</el-col>
					<el-col :span="20">
						<el-form-item label="下单备注" prop="remark">
							<el-input type="textarea" v-model="formData.remark" clearable placeholder="" />
						</el-form-item>
					</el-col>

				</el-row>

			</el-form>
		</popup>
	</div>
</template>

<script lang="ts" setup name="addOrderForUser">
	import type { FormInstance } from 'element-plus'
	import Popup from '@/components/popup/index.vue'
	import { apiShopOrderAddForUser } from '@/api/shop_order'
	import { apiNormalGood } from '@/api/good'
	import { apiShopWaterStationLists } from '@/api/shop_water_station'
	import type { PropType } from 'vue'
	import { ref } from 'vue'

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
		return mode.value == 'order' ? '代客下单' : ''
	})

	const userInfo = reactive({
		name: '',
		address: '',
		mobile: '',
		water_station_id: '',
		waterStation: '',
		month_type:0,
	})
	// 表单数据
	const formData = reactive({
		address_id: 0,

		good: [
			{
				good_id: '',
				num: 1
			}
		],
		type: '',
		remark: '',
		pay_price:0,
	})


	const formRules = reactive<any>({
		type: [
			{
				required: true,
				message: '请选择支付方式',
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
				message: '请填写商品数量',
				trigger: ['blur']

			},
			{ pattern: /^[1-9]\d*$/, message: '请填写正确的商品数量', trigger: ['blur'] }
		]

	})

	// 获取详情
	const setFormData = async (data : Record<any, any>) => {
		// for (const key in formData) {
		// 	if (data[key] != null && data[key] != undefined) {
		// 		//@ts-ignore
		// 		formData[key] = data[key]
		// 	}
		// }

		userInfo.address = data.address
		userInfo.mobile = data.mobile
		userInfo.name = data.name
		userInfo.water_station_id = data.water_station_id
		userInfo.month_type = data.month_type
		formData.address_id = data.id
		formData.good = [
			{
				good_id: '',
				num: 1
			}
		]
		formData.type = ''
		formData.remark = ''
		// console.log(data);
		getgoodList()
		getStationList()
	}


	const handleAdd = () => {
		formData.good.push({
			good_id: '',
			num: 1
		})
	}

	const handleDel = (index : number) => {
		if (formData.good.length > 1) {
			formData.good.splice(index, 1)
		}

	}


	const stationListTem : any = reactive({})

	// 分页相关
	const getStationList = async () => {
		try {
			const stationLists : any = await apiShopWaterStationLists({ address_id: formData.address_id })
			for (const key in stationLists.lists) {
				// if (data[key] != null && data[key] != undefined) {
				//     //@ts-ignore
				//     formData[key] = data[key]
				// }
				stationListTem[stationLists.lists[key]['id']] = stationLists.lists[key]['name']
			}

			// console.log(stationListTem)

		} catch (e) {
			console.log('err', e)
			//TODO handle the exception
		}
	}


	const goodListOptions = ref<any[]>([])
	// 分页相关
	const getgoodList = async () => {
		try {
			const goodListLists : any = await apiNormalGood({ address_id: formData.address_id })
			goodListOptions.value = goodListLists.lists
		} catch (e) {
			console.log('err', e)

			//TODO handle the exception
		}
	}


	// 提交按钮
	const handleSubmit = async () => {
		try {
			await formRef.value?.validate()
			const data = { ...formData, }
			await apiShopOrderAddForUser(data)
			popupRef.value?.close()
			emit('success')
		} catch (e) {
			console.log('err', e)
			// feedback.msgError('下单失败～')
			//TODO handle the exception
		}

	}

	//打开弹窗
	const open = (type = 'order') => {
		mode.value = type
		formRef.value?.resetFields()
		popupRef.value?.open()
	}

	// 关闭回调
	const handleClose = () => {
		emit('close')
	}



	defineExpose({
		open,
		setFormData
	})
</script>