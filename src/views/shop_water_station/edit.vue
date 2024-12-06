<template>
	<div class="edit-popup">
		<el-card class="!border-none" shadow="never">
			<el-page-header content="门店添加/编辑" @back="$router.back()" />
		</el-card>
		<el-card class="mt-4 !border-none" shadow="never">
			<el-form ref="formRef" :model="formData" label-width="80px" :rules="formRules"
				style="width: 100%; height: 700px; overflow-y: scroll">
				<el-form-item label="门店名称" prop="name">
					<el-input v-model="formData.name" clearable placeholder="请输入门店名称" />
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="formData.mobile" clearable placeholder="请输入联系方式" />
				</el-form-item>
				<el-form-item label="商户号" prop="pay_mchid">
					<el-input v-model="formData.pay_mchid" clearable placeholder="请输入商户号" />
				</el-form-item>
				<el-form-item label="启用状态" prop="status">
					<el-switch v-model="formData.status" class="ml-2" inline-prompt :active-value="1" :inactive-value="0" />
				</el-form-item>

<!--				<el-form-item label="备注" prop="content" v-show="formData.status == 0">-->
				<el-form-item label="备注" prop="content">
					<el-input v-model="formData.content" clearable placeholder="请输入备注" />
				</el-form-item>
				<el-form-item label="门店地址" prop="address">
					<el-input v-model="formData.address" clearable placeholder="请输入门店详细地址" />
					<MakerMap :formValue="formData" @message-to-parent="handleAddressFromChild" />
				</el-form-item>

				<el-form-item label="经度" prop="longitude" style="display:none;">
					<el-input v-model="formData.longitude" clearable placeholder="请输入经度" />
				</el-form-item>
				<el-form-item label="纬度" prop="latitude" style="display:none;">
					<el-input v-model="formData.latitude" clearable placeholder="请输入纬度" />
				</el-form-item>

				<el-input type="hidden" v-model="formData.area" clearable placeholder="请输入配送区域" />
				<el-form-item label="配送区域" prop="area" style="width: 96%">
					<AreaMap :formValue="formData" @message-to-parent="handleAreaFromChild" v-if="show"/>
				</el-form-item>
			</el-form>

		</el-card>

		<footer-btns>
			<el-button type="primary" @click="handleSubmit">保存</el-button>
		</footer-btns>
	</div>
</template>
<script lang="ts" setup name="shopWaterStationEdit">
	import type { FormInstance } from 'element-plus'
	import Popup from '@/components/popup/index.vue'
	import { isPhone } from '@/utils/validate'
	import {
		apiShopWaterStationAdd,
		apiShopWaterStationEdit,
		apiShopWaterStationDetail
	} from '@/api/shop_water_station'
	import type { PropType } from 'vue'
	import MakerMap from './components/maker-map.vue'
	import AreaMap from './components/area-map.vue'
	import router from "@/router";

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
	const route = useRoute()

	// 表单数据
	const formData = reactive({
		id: '',
		name: '',
		mobile: '',
		address: '',
		longitude: '',
		latitude: '',
		area: '',
		content: '',
		status: 1,
		pay_mchid: ''
	})
	const validatePhones = (rule : any, value : any, callback : any) => {
		if (isPhone(value)) {
			callback() // *验证成功的地方必须callback()
		} else {
			callback(new Error('手机号码输入格式不正确'))
		}
	}

	// 表单验证
	const formRules = reactive<any>({
		name: [
			{
				required: true,
				message: '请输入门店名称',
				trigger: ['blur']
			}
		],
		mobile: [
			{
				required: true,
				message: '请输入联系方式',
				trigger: ['blur']
			},
			{
				validator: validatePhones,
				trigger: ['blur']
			}
		],
		address: [
			{
				required: true,
				message: '请输入门店地址',
				trigger: ['blur']
			}
		],
		status: [
			{
				required: true,
				message: '请选择状态',
				trigger: ['blur']
			}
		]
	})

	const show = ref(false)
	// 获取详情
	const setFormData = async (data : Record<any, any>) => {
		for (const key in formData) {
			if (data[key] != null && data[key] != undefined) {
				//@ts-ignore
				formData[key] = data[key]
			}
		}
		show.value = true
	}

	const getDetail = async () => {
		const data = await apiShopWaterStationDetail({
			id: route.query.id
		})
		console.log(data)
		setFormData(data)
	}

	// 提交按钮
	const handleSubmit = async () => {
		try {
			await formRef.value?.validate()
			const data = { ...formData }
			mode.value == 'edit'
				? await apiShopWaterStationEdit(data)
				: await apiShopWaterStationAdd(data)
			popupRef.value?.close()
			router.back()
			emit('success')
		} catch (e) {
			console.log('err', e)
		}

	}

	const handleAddressFromChild = (message : any) => {
		formData.address = message.address
		formData.longitude = message.longitude
		formData.latitude = message.latitude
	}
	const handleAreaFromChild = (message : any) => {
		formData.area = message.area
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

	// route.query.id && getDetail()
	if(route.query.id){
		getDetail()
	}else{
		show.value = true
	}

</script>
<style lang="scss" scoped>
	.el-form-item {
		width: 55%;
	}
</style>