<template>
  <div>
    <el-card class="!border-none mb-4" shadow="never">
      <el-form class="mb-[-16px]" :model="queryParams" inline>
        <el-form-item label="所属门店" prop="water_station_id">
          <el-select
            class="w-80"
            v-model="queryParams.water_station_id"
            placeholder=""
            clearable
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in waterStationListOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input
            class="w-[280px]"
            v-model="queryParams.name"
            clearable
            placeholder="请输入商品名称"
          />
        </el-form-item>
        <el-form-item label="出入库类型" prop="type">
          <el-select
            class="w-[280px]"
            v-model="queryParams.type"
            clearable
            placeholder="请选择出入库类型"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(item, index) in dictData.bstock_type"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="!border-none" v-loading="pager.loading" shadow="never">

      <div class="mt-4">
        <el-table :data="pager.lists" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column
            label="所属门店"
            prop="water_station_name"
            show-overflow-tooltip
          />
          <el-table-column
            label="商品名称"
            prop="good_name"
            show-overflow-tooltip
          />
          <el-table-column label="出入库类型" prop="type">
            <template #default="{ row }">
              <dict-value
                :options="dictData.bstock_type"
                :value="row.type"
                :config="{ label: 'name', value: 'value' }"
              />
            </template>
          </el-table-column>
            <el-table-column label="变动前" prop="before_num" show-overflow-tooltip />

            <el-table-column label="变动数量" prop="num">
                <template #default="{ row }">
                    <el-tag v-if="row.num >= 0" type="danger" style="width: 60px;font-size: larger">+{{row.num}}</el-tag>
                    <el-tag type="success" v-else style="width: 60px;font-size: larger">{{row.num}}</el-tag>
                </template>
            </el-table-column>
          <el-table-column label="变动后" prop="after_num" show-overflow-tooltip />
          <el-table-column label="配送单号" prop="distribution_no" show-overflow-tooltip />
          <el-table-column label="备注" prop="remark" show-overflow-tooltip />
          <el-table-column
            label="变更时间"
            prop="create_time"
            show-overflow-tooltip
          />

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

<script lang="ts" setup name="goodBstockHistoryLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import {
  apiGoodBstockHistoryLists,
  apiGoodBstockHistoryDelete
} from '@/api/good_bstock_history'
import { apiShopWaterStationLists } from '@/api/shop_water_station'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)

// 查询条件
const queryParams = reactive({
  water_station_id: '',
  name: '',
  type: ''
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
  selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('bstock_type')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: apiGoodBstockHistoryLists,
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
  await apiGoodBstockHistoryDelete({ id })
  getLists()
}
//门店
const waterStationListOptions = ref<any[]>([])
const getWaterStationList = async () => {
  try {
    const getWaterStationLists: any = await apiShopWaterStationLists({})
    waterStationListOptions.value = getWaterStationLists.lists
  } catch (e) {
    console.log('err', e)
    //TODO handle the exception
  }
}
getWaterStationList()
getLists()
</script>

