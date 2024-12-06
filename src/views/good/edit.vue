<template>
	<div class="edit-popup">
		<el-card class="!border-none" shadow="never">
			<el-page-header content="商品添加/编辑" @back="$router.back()" />
		</el-card>
		<el-card class="mt-4 !border-none" shadow="never">
			<el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
				<el-row>
					<el-row :gutter="120">
					<el-col :span="12">
						<el-form-item label="品牌" prop="good_brand_id">
							<el-select class="w-80" v-model="formData.good_brand_id" placeholder="请选择品牌" clearable>
								<el-option v-for="item in goodBrandListOptions" :key="item.id" :label="item.name"
									:value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="分类" prop="good_category_id">
							<el-select class="w-80" v-model="formData.good_category_id" placeholder="请选择分类" clearable>
								<el-option v-for="item in goodCategoryListOptions" :key="item.id" :label="item.name"
									:value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="120">
					<el-col  :span="12">
						<el-form-item label="商品名称" prop="name">
							<el-input v-model="formData.name" clearable placeholder="请输入商品名称,不超过20个字符" style="width: 320px" maxlength="20"/>
						</el-form-item>
					</el-col>
					<el-col  :span="12">
						<el-form-item label="副标题" prop="desc">
							<el-input v-model="formData.desc" clearable placeholder="请输入副标题,不超过30个字符"  style="width: 320px" maxlength="30"/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="120">
					<el-col :span="12">
						<el-form-item label="售价" prop="price">
							<el-input v-model="formData.price" clearable placeholder="请输入售价" type="number" style="width: 320px">
								<template #append>元</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="成本价" prop="cost_price">
							<el-input v-model="formData.cost_price" clearable placeholder="请输入成本价" type="number" style="width: 320px">
								<template #append>元</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>

					<el-row :gutter="120">
						<el-col :span="12">
							<el-form-item label="商品单位" prop="unit">
								<el-input v-model="formData.unit" clearable placeholder="请输入规格单位(桶、箱、件等)" style="width: 320px"/>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="规格大小" prop="spec">
								<el-input v-model="formData.spec" clearable placeholder="请输入商品规格(19L、18.9L)" style="width: 320px"/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-col>
						<el-form-item label="划线价" prop="marked_price">
							<el-input v-model="formData.marked_price" clearable placeholder="请输入划线价" type="number" style="width: 320px">
								<template #append>元</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否押桶" prop="is_deposit">
							<el-switch v-model="formData.is_deposit" class="ml-2" inline-prompt :active-value="1"
								:inactive-value="0" />
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="空桶押金" prop="deposit_price" v-show="formData.is_deposit == 1">
							<el-input v-model="formData.deposit_price" clearable placeholder="请输入空桶押金" type="number" style="width: 320px">
							<template #append>元</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="配送费" prop="is_delivery">
							<el-switch v-model="formData.is_delivery" inline-prompt :active-value="1"
												 :inactive-value="0" />
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="极速送达" prop="price1" v-show="formData.is_delivery == 1">
							<el-input v-model="formData.price1" clearable placeholder="请输入配送费" type="number" style="width: 320px">
								<template #append>元/件</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col>
						<el-form-item label="准时送达" prop="price2" v-show="formData.is_delivery == 1">
							<el-input v-model="formData.price2" clearable placeholder="请输入配送费" type="number" style="width: 320px">
								<template #append>元/件</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col>
						<el-form-item label="超时配送" prop="price3" v-show="formData.is_delivery == 1">
							<el-input v-model="formData.price3" clearable placeholder="请输入配送费" type="number" style="width: 320px">
								<template #append>元/件</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col>
						<el-form-item label="严重超时" prop="price4" v-show="formData.is_delivery == 1">
							<el-input v-model="formData.price4" clearable placeholder="请输入配送费" type="number" style="width: 320px">
								<template #append>元/件</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="商品图片" prop="images_all">
							<div class="flex-1">
								<material-picker :limit="4" v-model="formData.images_all" />
							</div>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="起送数量" prop="min_num">
							<el-input-number v-model="formData.min_num" clearable placeholder="请输入起送数量" style="width: 200px"/>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="排序" prop="order">
							<el-input-number v-model="formData.order" clearable placeholder="请输入排序" style="width: 200px"/>
						</el-form-item>
					</el-col>
					<el-col>
					<el-form-item label="月销" prop="month_num">
						<el-input-number v-model="formData.month_num" clearable placeholder="请输入月销量" style="width: 200px"/>
					</el-form-item>
					</el-col>

					<el-col>
						<el-form-item label="是否上架" prop="status">
							<el-switch v-model="formData.status" inline-prompt :active-value="1"
												 :inactive-value="0" />
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="热销商品" prop="is_hot">
							<el-switch v-model="formData.is_hot" inline-prompt :active-value="1"
												 :inactive-value="0" />
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="是否收楼层费" prop="is_floor">
							<el-switch v-model="formData.is_floor" inline-prompt :active-value="1"
												 :inactive-value="0" />
						</el-form-item>
					</el-col>

					<el-col>
						<el-form-item label="下单检查库存" prop="is_limit">
							<el-switch v-model="formData.is_limit" inline-prompt :active-value="1"
												 :inactive-value="0" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="商品介绍" prop="content">
							<editor class="flex-1" v-model="formData.content" :height="500" />
						</el-form-item>
					</el-col>

				</el-row>
			</el-form>
		</el-card>
		<footer-btns>
			<el-button type="primary" @click="handleSave">保存</el-button>
		</footer-btns>
	</div>
</template>

<script lang="ts" setup name="goodEdit">
	import type { FormInstance } from 'element-plus'
	import Popup from '@/components/popup/index.vue'
	import {apiGoodAdd, apiGoodEdit, apiGoodDetail, apiGoodLists} from '@/api/good'
	import { apiGoodBrandLists } from '@/api/good_brand'
	import { apiGoodCategoryLists, apiGoodCategoryLists2 } from '@/api/good_category'
	import type { PropType } from 'vue'
	import useMultipleTabs from "@/hooks/useMultipleTabs";
	import {usePaging} from "@/hooks/usePaging";

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
	const router = useRouter()
	const loading = ref(false)
	const { removeTab } = useMultipleTabs()


	// 表单数据
	const formData = reactive({
		id: '',
		good_brand_id: '',
		good_category_id: '',
		name: '',
		desc: '',
		status: 1,
		type: 1,
		price: '',
		cost_price: '',
		marked_price: '',
		is_deposit: 1,
		deposit_price: '',
		unit: '',
		spec: '',
		images_all: '',
		content: '',
		order: '',
		is_floor:1,
		is_delivery:0,
		min_num:1,
		is_hot:1,
		is_limit:0,
		month_num:0,
		price1:0,
		price2:0,
		price3:0,
		price4:0,
	})


	// 表单验证
	const formRules = reactive<any>({
		good_brand_id: [{
			required: true,
			message: '请输入品牌',
			trigger: ['blur']
		}],
		good_category_id: [{
			required: true,
			message: '请输入分类',
			trigger: ['blur']
		}],
		name: [{
			required: true,
			message: '请输入商品名称',
			trigger: ['blur']
		}],
		desc: [{
			required: true,
			message: '请输入副标题',
			trigger: ['blur']
		}],
		status: [{
			required: true,
			message: '请选择是否上架',
			trigger: ['blur']
		}],
		type: [{
			required: true,
			message: '请选择商品类型',
			trigger: ['blur']
		}],
		price: [{
			required: true,
			message: '请输入售价',
			trigger: ['blur']
		}],
		marked_price: [{
			required: true,
			message: '请输入划线价',
			trigger: ['blur']
		}],
		unit: [{
			required: true,
			message: '请输入规格单位',
			trigger: ['blur']
		}],
		spec: [{
			required: true,
			message: '请输入商品规格',
			trigger: ['blur']
		}],
		images_all: [{
			required: true,
			message: '请选择商品图片',
			trigger: ['blur']
		}],
		order: [{
			required: true,
			message: '请输入排序',
			trigger: ['blur']
		}],
	})




	// 获取详情
	const setFormData = async (data : Record<any, any>) => {
		console.log(data)
		for (const key in formData) {
			if (data[key] != null && data[key] != undefined) {
				//@ts-ignore
				formData[key] = data[key]
			}
		}
	}


	const getDetails = async () => {
		loading.value = true
		const data = await apiGoodDetail({
			id: route.query.id
		})
		setFormData(data)
		loading.value = false
	}



	const goodBrandListOptions = ref<any[]>([])
	// 分页相关
	const getGoodBrandList = async () => {
		try {
			const goodBrandListLists : any = await apiGoodBrandLists({ })
			goodBrandListOptions.value = goodBrandListLists.lists
		} catch (e) {
			console.log('err', e)
			//TODO handle the exception
		}
	}
	getGoodBrandList()


	const goodCategoryListOptions = ref<any[]>([])
	// 分页相关
	const getGoodCategoryList = async () => {
		try {
			const data : any = await apiGoodCategoryLists2({ })
			goodCategoryListOptions.value = data.lists
		} catch (e) {
			console.log('err', e)
			//TODO handle the exception
		}
	}
	getGoodCategoryList()


	const { getLists } = usePaging({
		fetchFun: apiGoodLists,
	})

	const handleSave = async () => {
		await formRef.value?.validate()
		if (route.query.id) {
			await apiGoodEdit(formData)
		} else {
			await apiGoodAdd(formData)
		}
		removeTab()
		router.back()
		getLists()
	}

	route.query.id && getDetails()

</script>