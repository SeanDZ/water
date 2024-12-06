<template>
	<div class="edit-popup">
		<popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit"
			@close="handleClose">
			<el-form ref="formRef" :model="formData" label-width="90px" :rules="formRules">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="formData.name" clearable placeholder="请输入员工姓名" />
				</el-form-item>
				<el-form-item label="头像" prop="img">
					<material-picker v-model="formData.img" />
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="formData.mobile" clearable placeholder="请输入手机号" />
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="formData.password" clearable placeholder="请输入密码，默认手机号后6位！" />
				</el-form-item>
				<el-form-item label="职务" prop="type">
					<el-select class="w-80" v-model="formData.type" placeholder="请选择职务" clearable>
						<el-option :key="0" label="商户老板" :value="0" />
						<el-option :key="1" label="门店站长" :value="1" />
						<el-option :key="2" label="配送员" :value="2" />
					</el-select>
				</el-form-item>
				<el-form-item label="所属门店" prop="water_station_id">
					<el-select class="w-80" v-model="formData.water_station_id" placeholder="请选择所属门店" clearable :disabled="formData.id > 0">
						<el-option v-for="item in stationListOptions" :key="item.id" :label="item.name"
							:value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="启用状态" prop="status">
					<el-switch v-model="formData.status" class="ml-2" inline-prompt :active-value="1"
						:inactive-value="0" />
				</el-form-item>
			</el-form>
		</popup>
	</div>
</template>

<script lang="ts" setup name="shopWaterStationStaffEdit">
	import type { FormInstance } from 'element-plus'
	import Popup from '@/components/popup/index.vue'
	import { apiShopWaterStationStaffAdd, apiShopWaterStationStaffEdit, apiShopWaterStationStaffDetail } from '@/api/shop_water_station_staff'
	import { apiShopWaterStationLists } from '@/api/shop_water_station'
	import { timeFormat } from '@/utils/util'
		import { isPhone } from '@/utils/validate'
	import type { PropType } from 'vue'
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
		return mode.value == 'edit' ? '编辑' : '新增'
	})

	// 表单数据
	const formData = reactive({
		id: '',
		name: '',
		mobile: '',
		password: '',
		type: '',
		water_station_id: '',
		status: 1,
		img:'',
	})

	const stationListOptions = ref<any[]>([])
	// 分页相关
	const getStationList = async () => {
		try {
			const stationLists : any = await apiShopWaterStationLists({  })
			stationListOptions.value = stationLists.lists
			console.log(stationListOptions)

		} catch (e) {
			console.log('err', e)
			//TODO handle the exception
		}
	}
	getStationList()

	const validatePhones = (rule : any, value : any, callback : any) => {
		if (isPhone(value)) {
			callback() // *验证成功的地方必须callback()
		} else {
			callback(new Error('手机号码输入格式不正确'))
		}
	}
	// 表单验证
	const formRules = reactive<any>({
		name: [{
			required: true,
			message: '请输入员工',
			trigger: ['blur']
		}],
		img: [{
			required: true,
			message: '请上传头像',
			trigger: ['blur']
		}],
		mobile: [{
			required: true,
			message: '请输入手机号',
			trigger: ['blur']
		},
		{
			validator: validatePhones,
			trigger: ['blur']
		}
		],
		type: [{
			required: true,
			message: '请选择职务',
			trigger: ['blur']
		}],
		water_station_id: [{
			required: true,
			message: '请选择所属门店',
			trigger: ['blur']
		}],
		status: [{
			required: true,
			message: '请选择状态',
			trigger: ['blur']
		}],
	})


	// 获取详情
	const setFormData = async (data : Record<any, any>) => {
		for (const key in formData) {
			if (data[key] != null && data[key] != undefined) {
				//@ts-ignore
				formData[key] = data[key]
			}
		}

	}

	const getDetail = async (row : Record<string, any>) => {
		const data = await apiShopWaterStationStaffDetail({
			id: row.id
		})
		setFormData(data)
	}


	// 提交按钮
	const handleSubmit = async () => {
		try {
			await formRef.value?.validate()
			const data = { ...formData, }
			mode.value == 'edit'
				? await apiShopWaterStationStaffEdit(data)
				: await apiShopWaterStationStaffAdd(data)
			popupRef.value?.close()
			emit('success')
		} catch (e) {
			console.log('err', e)
			//TODO handle the exception
		}
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