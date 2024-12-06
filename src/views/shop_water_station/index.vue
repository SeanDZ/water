<template>
  <div>
    <el-card class="!border-none mb-4" shadow="never">
      <el-form class="mb-[-16px]" :model="queryParams" inline>
        <el-form-item label="门店名称" prop="name">
          <el-input
            class="w-[280px]"
            v-model="queryParams.name"
            clearable
            placeholder="请输入门店名称"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            class="w-[280px]"
            v-model="queryParams.mobile"
            clearable
            placeholder="请输入联系方式"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="!border-none" v-loading="pager.loading" shadow="never">

        <div>
            <router-link
                    v-perms="['station.shop_water_station/add', 'station.shop_water_station/edit:add']"
                    :to="{
                        path: getRoutePath('station.shop_water_station/edit:add')
                    }"
            >
                <el-button type="primary" class="mb-4">
                    新增门店
                </el-button>
            </router-link>
        </div>
<!--      <el-button-->
<!--        v-perms="['station.shop_water_station/delete']"-->
<!--        :disabled="!selectData.length"-->
<!--        @click="handleDelete(selectData)"-->
<!--      >-->
<!--        删除-->
<!--      </el-button>-->
      <div class="mt-4">
        <el-table :data="pager.lists" @selection-change="handleSelectionChange">
          <el-table-column label="ID" prop="id" show-overflow-tooltip />
          <el-table-column label="门店店长" prop="staff_name" show-overflow-tooltip />
          <el-table-column label="门店名称" prop="name" show-overflow-tooltip />
          <el-table-column
            label="手机号"
            prop="mobile"
            show-overflow-tooltip
          />
          <el-table-column
            label="门店地址"
            prop="address"
            show-overflow-tooltip
          />
          <el-table-column label="状态" prop="status">
            <template #default="{ row }">
              <dict-value
                :options="dictData.status"
                :value="row.status"
                :config="{ label: 'name', value: 'value' }"
              />
            </template>
          </el-table-column>
            <el-table-column
                    label="备注"
                    prop="content"
                    show-overflow-tooltip
            />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
                <el-button
                        v-perms="['station.shop_water_station/edit', 'station.shop_water_station/edit:add']"
                        type="primary"
                        link
                >
                    <router-link
                            :to="{
                                    path: getRoutePath('station.shop_water_station/edit:add'),
                                    query: {
                                        id: row.id
                                    }
                                }"
                    >
                        编辑
                    </router-link>
                </el-button>

              <el-button
                v-perms="['station.shop_water_station/delete']"
                type="danger"
                link
                @click="handleDelete(row.id)"
              >
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
    <edit-popup
      v-if="showEdit"
      ref="editRef"
      :dict-data="dictData"
      @success="getLists"
      @close="showEdit = false"
    />
  </div>
</template>

<script lang="ts" setup name="shopWaterStationLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import {
  apiShopWaterStationLists,
  apiShopWaterStationDelete
} from '@/api/shop_water_station'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
import { getRoutePath } from '@/router'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)

// 查询条件
const queryParams = reactive({
  name: '',
  mobile: ''
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
  selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('status')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: apiShopWaterStationLists,
  params: queryParams
})

// 添加
const handleAdd = async () => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('add')
}

// 编辑
const handleEdit = async (data: any) => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('edit')
  editRef.value?.setFormData(data)
}

// 删除
const handleDelete = async (id: number | any[]) => {
  await feedback.confirm('确定要删除？')
  await apiShopWaterStationDelete({ id })
  getLists()
}

getLists()
</script>