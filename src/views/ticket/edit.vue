<template>
	<div class="edit-popup">
		<popup ref="popupRef" :title="popupTitle" :async="true" width="950px" @confirm="handleSubmit"
			@close="handleClose">
			<el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
						<el-form-item label="水票名称" prop="name">
							<el-input v-model="formData.name" clearable placeholder="请输入名称" style="width: 500px"/>
						</el-form-item>
						<el-form-item label="副标题" prop="desc">
							<el-input v-model="formData.desc" clearable placeholder="请输入副标题" style="width: 500px"/>
						</el-form-item>
					<el-col :span="12">
						<el-form-item label="关联商品" prop="good_id">
							<el-select class="w-150" v-model="formData.good_id" placeholder="请选择商品" clearable style="width: 355px">
								<el-option v-for="item in goodOptions" :key="item.id" :label="item.name"
								  :value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-row v-for="(item, index) in formData.good" :key="index">
							<el-form-item label="套餐详情:">
							</el-form-item>
							<el-form-item label="购买" :prop="`good.${index}.th_num`" :rules="formRules.th_num"  style="width: 300px;margin-left: -40px">
								<el-input-number v-model="item.th_num" clearable placeholder=""  style="width:120px"/>
							</el-form-item>
							<el-form-item label="赠送" :prop="`good.${index}.gt_num`" :rules="formRules.gt_num"  style="width: 300px;margin-left: -115px">
								<el-input-number v-model="item.gt_num" clearable placeholder=""  style="width:120px"/>
							</el-form-item>
							<el-form-item label="售价" :prop="`good.${index}.price`" :rules="formRules.price"  style="width: 300px;margin-left: -115px">
								<el-input v-model="item.price" clearable placeholder=""  style="width:150px" > <template #append>元</template> </el-input>
							</el-form-item>
							<el-form-item style="margin-left: -140px">
								<el-button type="primary" @click="handleAdd">添加</el-button>
								<el-button type="danger" @click="handleDel(index)"> 删除 </el-button>
							</el-form-item>
						</el-row>
					</el-col>
						<el-form-item label="是否上架" prop="status">
							<el-switch v-model="formData.status" class="ml-2" inline-prompt :active-value="1"
								:inactive-value="0" />
						</el-form-item>
						<el-form-item label="图片" prop="images_all">
							<div class="flex-1">
								<material-picker :limit="4" v-model="formData.images_all" />
							</div>
						</el-form-item>
				<el-form-item label="有效期" prop="days">
					<el-input-number v-model="formData.days" clearable placeholder="请输入有效期" />
					<el-tag type="danger" style="margin-left: 20px;" >购买水票开始计时,过期水票会自动扣除,默认0 表示永久有效</el-tag>
				</el-form-item>
						<el-form-item label="排序" prop="order">
							<el-input-number v-model="formData.order" clearable placeholder="请输入排序" />
						</el-form-item>
			</el-form>
		</popup>
	</div>
</template>

<script lang="ts" setup name="goodEdit">
	import type { FormInstance } from 'element-plus'
	import Popup from '@/components/popup/index.vue'
	import {apiTicketEdit, apiNormalGood, apiGoodDetail, apiTicketAdd, apiGoodLists} from '@/api/good'
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
		desc: '',
		status: 1,
		stock:0,
		images_all: '',
		order: 0,
		days: 0,
		good_id:'',
		good: [
			{
				id:'',
				th_num: '',
				gt_num: 0,
				price:'',
			}
		],
	})


	// 表单验证
	const formRules = reactive<any>({
		name: [{
			required: true,
			message: '请输入副标题',
			trigger: ['blur']
		}],
		good_id: [{
			required: true,
			message: '请选择商品',
			trigger: ['blur']
		}],
		good_category_id: [{
			required: true,
			message: '请输入分类',
			trigger: ['blur']
		}],
		desc: [{
			required: true,
			message: '请输入副标题',
			trigger: ['blur']
		}],
		price: [{
			required: true,
			message: '请输入售价',
			trigger: ['blur']
		}],
		th_num: [{
			required: true,
			message: '请输入购买数量',
			trigger: ['blur']
		}],
		images_all: [{
			required: true,
			message: '请上传图片',
			trigger: ['blur']
		}],
	})


	const handleAdd = () => {
		formData.good.push({
			th_num: '',
			gt_num: '',
			price: '',
		})
	}

	const handleDel = (index : number) => {
		if (formData.good.length > 1) {
			formData.good.splice(index, 1)
		}

	}

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
		const data = await apiGoodDetail({
			id: row.id
		})
		setFormData(data)
	}


	const goodOptions = ref<any[]>([])
	// 商品列表相关
	const getgoodList = async () => {
		try {
			const goodListLists: any = await apiNormalGood('')
			goodOptions.value = goodListLists.lists
		} catch (e) {
			console.log('err', e)
			//TODO handle the exception
		}
	}
	getgoodList()

	// 提交按钮
	const handleSubmit = async () => {
		try {
			await formRef.value?.validate()
			const data = { ...formData, }
			mode.value == 'edit'
				? await apiTicketEdit(data)
				: await apiTicketAdd(data)
			popupRef.value?.close()
			emit('success')
		} catch (e) {
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