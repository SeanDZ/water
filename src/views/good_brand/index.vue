<template>
	<div>
		<el-card class="!border-none mb-4" shadow="never">
			<el-form class="mb-[-16px]" :model="queryParams" inline>
				<el-form-item label="名称" prop="name">
					<el-input class="w-[280px]" v-model="queryParams.name" clearable placeholder="请输入名称" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="resetPage">查询</el-button>
					<el-button @click="resetParams">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="!border-none" v-loading="pager.loading" shadow="never">
			<el-button v-perms="['good.good_brand/add']" type="primary" @click="handleAdd">
				<template #icon>
					<icon name="el-icon-Plus" />
				</template>
				新增
			</el-button>
			<el-button v-perms="['good.good_brand/delete']" :disabled="!selectData.length"
				@click="handleDelete(selectData)">
				删除
			</el-button>
			<div class="mt-4">
				<el-table :data="pager.lists" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55" />
					<el-table-column label="名称" prop="name" show-overflow-tooltip />
					<el-table-column label="图片" prop="image">
						<template #default="{ row }">
							<image-contain
									v-if="row.image"
									:src="row.image"
									:width="50"
									:height="50"
									:preview-src-list="[row.image]"
									preview-teleported
									fit="contain"
							/>
						</template>
					</el-table-column>
					<el-table-column label="排序" prop="order" show-overflow-tooltip />
					<el-table-column label="是否显示" min-width="100" align="center">
						<template #default="{ row }">
							<el-switch v-perms="['good.good_brand/edit']" v-model="row.is_show"
								:active-value="1" :inactive-value="0" @change="changeStatus($event, row)" />
						</template>
					</el-table-column>
					<el-table-column label="创建时间" prop="create_time" show-overflow-tooltip />
					<el-table-column label="操作" width="120" fixed="right">
						<template #default="{ row }">
							<el-button v-perms="['good.good_brand/edit']" type="primary" link @click="handleEdit(row)">
								编辑
							</el-button>
							<el-button v-perms="['good.good_brand/delete']" type="danger" link
								@click="handleDelete(row.id)">
								删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="flex mt-4 justify-end">
				<pagination v-model="pager" @change="getLists" />
			</div>
		</el-card>
		<edit-popup v-if="showEdit" ref="editRef" :dict-data="dictData" @success="getLists" @close="showEdit = false" />
	</div>
</template>

<script lang="ts" setup name="goodBrandLists">
	import { usePaging } from '@/hooks/usePaging'
	import { useDictData } from '@/hooks/useDictOptions'
	import { apiGoodBrandLists, apiGoodBrandEdit, apiGoodBrandDelete } from '@/api/good_brand'
	import { timeFormat } from '@/utils/util'
	import feedback from '@/utils/feedback'
	import EditPopup from './edit.vue'

	const editRef = shallowRef<InstanceType<typeof EditPopup>>()
	// 是否显示编辑框
	const showEdit = ref(false)


	// 查询条件
	const queryParams = reactive({
		name: '',
	})

	const changeStatus = async (is_show : any, row : any) => {
		try {
			// console.log(is_show,id)
			row.is_show = is_show
			await apiGoodBrandEdit(row)
			getLists()
		} catch (error) {
			getLists()
		}
	}

	// 选中数据
	const selectData = ref<any[]>([])

	// 表格选择后回调事件
	const handleSelectionChange = (val : any[]) => {
		selectData.value = val.map(({ id }) => id)
	}

	// 获取字典数据
	const { dictData } = useDictData('show_status')

	// 分页相关
	const { pager, getLists, resetParams, resetPage } = usePaging({
		fetchFun: apiGoodBrandLists,
		params: queryParams
	})

	// 添加
	const handleAdd = async () => {
		showEdit.value = true
		await nextTick()
		editRef.value?.open('add')
	}

	// 编辑
	const handleEdit = async (data : any) => {
		showEdit.value = true
		await nextTick()
		editRef.value?.open('edit')
		editRef.value?.setFormData(data)
	}

	// 删除
	const handleDelete = async (id : number | any[]) => {
		await feedback.confirm('确定要删除？')
		await apiGoodBrandDelete({ id })
		getLists()
	}

	getLists()
</script>