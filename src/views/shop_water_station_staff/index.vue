<template>
  <div>
    <el-card class="!border-none mb-4" shadow="never">
      <el-form class="mb-[-16px]" :model="queryParams" inline>
        <el-form-item label="名称" prop="name">
          <el-input
            class="w-[280px]"
            v-model="queryParams.name"
            clearable
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            class="w-[280px]"
            v-model="queryParams.mobile"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
          <el-form-item label="门店" prop="water_station_id">
              <el-select class="w-[280px]" v-model="queryParams.water_station_id" placeholder="" clearable>
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in waterStationListOptions" :key="item.id" :label="item.name"
                             :value="item.id" />
              </el-select>
          </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="!border-none" v-loading="pager.loading" shadow="never">
      <el-button
        v-perms="['staff.shop_water_station_staff/add']"
        type="primary"
        @click="handleAdd"
      >
        <template #icon>
          <icon name="el-icon-Plus" />
        </template>
        新增
      </el-button>
      <el-button
        v-perms="['staff.shop_water_station_staff/delete']"
        :disabled="!selectData.length"
        @click="handleDelete(selectData)"
      >
        删除
      </el-button>
      <div class="mt-4">
        <el-table :data="pager.lists" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="名称" prop="name" show-overflow-tooltip />
            <el-table-column label="头像" min-width="100">
                <template #default="{ row }">
                    <el-avatar :src="row.img" :size="50" />
                </template>
            </el-table-column>
          <el-table-column label="手机号" prop="mobile" show-overflow-tooltip />
          <el-table-column label="职务" prop="type" show-overflow-tooltip>
            <template #default="{ row }">
              <div v-if="row.type == 0">商户老板</div>
              <div v-else-if="row.type == 1">门店站长</div>
              <div v-else-if="row.type == 2">配送员</div>
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            label="所属门店"-->
<!--            prop="water_station_id"-->
<!--            show-overflow-tooltip-->
<!--          >-->
<!--            <template #default="{ row }">-->
<!--              <div>{{ stationListTem[row.water_station_id] }}</div>-->
<!--            </template>-->
<!--          </el-table-column>-->
            <el-table-column label="所属门店" prop="water_station_name" show-overflow-tooltip />

            <el-table-column label="状态" prop="status">
            <template #default="{ row }">
              <dict-value
                :options="dictData.status"
                :value="row.status"
                :config="{ label: 'name', value: 'value' }"
              />
            </template>
          </el-table-column>
            <el-table-column label="推广总佣金(元)" prop="commission" show-overflow-tooltip />
          <el-table-column
            label="创建时间"
            prop="create_time"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button
                v-perms="['staff.shop_water_station_staff/edit']"
                type="primary"
                link
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                v-perms="['staff.shop_water_station_staff/delete']"
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

<script lang="ts" setup name="shopWaterStationStaffLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import {
  apiShopWaterStationStaffLists,
  apiShopWaterStationStaffDelete
} from '@/api/shop_water_station_staff'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
import { apiShopWaterStationLists } from '@/api/shop_water_station'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)

// 查询条件
const queryParams = reactive({
  name: '',
  mobile: '',
  water_station_id: ''
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
  selectData.value = val.map(({ id }) => id)
}
const stationListTem: any = reactive({})

// 分页相关
const getStationList = async () => {
  try {
    const stationLists: any = await apiShopWaterStationLists({ shop_id: 1 })
    for (const key in stationLists.lists) {
      stationListTem[stationLists.lists[key]['id']] =
        stationLists.lists[key]['name']
    }
    console.log(stationListTem)
  } catch (e) {
    console.log('err', e)
    //TODO handle the exception
  }
}
getStationList()
// 获取字典数据
const { dictData } = useDictData('status')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: apiShopWaterStationStaffLists,
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
  await apiShopWaterStationStaffDelete({ id })
  getLists()
}
//门店
const waterStationListOptions = ref<any[]>([])
const getWaterStationList = async () => {
    try {
        const getWaterStationLists : any = await apiShopWaterStationLists({  })
        waterStationListOptions.value = getWaterStationLists.lists
    } catch (e) {
        console.log('err', e)
    }
}
getWaterStationList()

getLists()
</script>