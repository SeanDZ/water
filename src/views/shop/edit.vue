<template>
	<div class="edit-popup">
		<popup ref="popupRef" :title="popupTitle" :async="true" width="950px" @confirm="handleSubmit"
			@close="handleClose">
			<el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
				<el-row>
					<el-col :span="24">
						<el-form-item label="商户名称" prop="name">
							<el-input v-model="formData.name" clearable placeholder="请输入商户名称" />
						</el-form-item>
					</el-col>



					<el-col :span="12">
						<el-form-item label="门店数量" prop="water_station_num">
							<el-input-number v-model="formData.water_station_num" :min="0" :max="100" clearable
								placeholder="请输入门店数量" />

						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="员工数量" prop="water_staff_num">
							<el-input-number v-model="formData.water_staff_num" :min="0" :max="10000" clearable
								placeholder="请输入员工数量" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="手机号" prop="mobile">
							<el-input v-model="formData.mobile" clearable placeholder="请输入手机号" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="有效期" prop="end_time">
							<el-date-picker class="flex-1 !flex" v-model="formData.end_time" clearable type="date"
								value-format="YYYY-MM-DD" placeholder="选择有效期" >
							</el-date-picker>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="小程序logo" prop="admin_img">
							<material-picker v-model="formData.admin_img" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="商家收款码" prop="pay_img">
							<material-picker v-model="formData.pay_img" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="小程序码" prop="app_img">
							<material-picker v-model="formData.app_img" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="微信公众号码" prop="wx_img">
							<material-picker v-model="formData.wx_img" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="小程序appid" prop="app_id">
							<el-input v-model="formData.app_id" clearable placeholder="请输入小程序appid" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="小程序secret" prop="app_secret">
							<el-input v-model="formData.app_secret" clearable placeholder="请输入小程序secret" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="支付商户号" prop="pay_mchid">
							<el-input v-model="formData.pay_mchid" clearable placeholder="请输入支付商户号" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="支付密钥" prop="pay_key">
							<el-input v-model="formData.pay_key" clearable placeholder="请输入支付密钥" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="支付证书" prop="pay_pem">
							<el-input
									type="textarea"
									rows="5"
									v-model="formData.pay_pem"
									placeholder="请输入微信支付证书"
							/>
							<span class="form-tips">
                            微信支付证书（apiclient_cert.pem）
              </span>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="支付证书密钥" prop="pay_pem_key">
							<el-input
									type="textarea"
									rows="5"
									v-model="formData.pay_pem_key"
									placeholder="请输入支付证书密钥"
							/>
							<span class="form-tips">
                             微信支付证书密钥（apiclient_key.pem）
              </span>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="公众号appid" prop="wx_appid">
							<el-input v-model="formData.wx_appid" clearable placeholder="请输入公众号appid" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="公众号seret" prop="wx_secret">
							<el-input v-model="formData.wx_secret" clearable placeholder="请输入公众号seret" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="公众号token" prop="wx_token">
							<el-input v-model="formData.wx_token" clearable placeholder="请输入公众号token" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="状态" prop="status">
								<el-switch v-model="formData.status" class="ml-2"
									style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" :active-value="1"
						:inactive-value="0" />
						</el-form-item>
					</el-col>

					<el-col>
						<el-form-item label="版本">
							<el-radio-group v-model="formData.version">
								<el-radio :label="1">单店版</el-radio>
								<el-radio :label="2">连锁版</el-radio>
								<el-radio :label="3">企业版</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>

					<el-col>
						<el-form-item label="商品展示">
							<el-radio-group v-model="formData.sale_type">
								<el-radio :label="0">所有用户一致</el-radio>
								<el-radio :label="1">根据水站切换</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>

				</el-row>
			</el-form>
		</popup>
	</div>
</template>

<script lang="ts" setup name="shopEdit">
	import type { FormInstance } from 'element-plus'
	import Popup from '@/components/popup/index.vue'
	import { apiShopAdd, apiShopEdit, apiShopDetail } from '@/api/shop'
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
		return mode.value == 'edit' ? '编辑商家管理' : '新增商家管理'
	})

	// 表单数据
	const formData = reactive({
		id: '',
		name: '',
		mobile: '',
		water_station_num: '',
		water_staff_num: '',
		end_time: '',
		admin_img: '',
		pay_img: '',
		app_id: '',
		app_secret: '',
		pay_mchid: '',
		pay_key: '',
		pay_pem: '',
		pay_pem_key: '',
		wx_appid: '',
		wx_secret: '',
		wx_token: '',
		status: 1,
		app_img:'',
		wx_img:'',
		version:'',
		sale_type:''
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
		name: [{
			required: true,
			message: '请输入商户名称',
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
		}],
		water_station_num: [{
			required: true,
			message: '请输入门店数量',
			trigger: ['blur']
		}],
		water_staff_num: [{
			required: true,
			message: '请输入员工数量',
			trigger: ['blur']
		}],
		end_time: [{
			required: true,
			message: '请选择有效期',
			trigger: ['blur']
		}],
		pay_img: [{
			required: true,
			message: '请选择商家收款码',
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
		const data = await apiShopDetail({
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
				? await apiShopEdit(data)
				: await apiShopAdd(data)
			popupRef.value?.close()
			emit('success')
		} catch (e) {
			console.log('err', e)
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