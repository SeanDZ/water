<template>
  <div>
    <el-card class="!border-none mb-4" shadow="never">
      <el-form class="mb-[-16px]" :model="queryParams" inline>
        <el-form-item label="客户昵称" prop="user_id">
          <el-input
            class="w-[280px]"
            v-model="queryParams.nickname"
            clearable
            placeholder="请输入客户昵称"
          />
        </el-form-item>
        <el-form-item label="配送单号" prop="distribution_no">
          <el-input
            class="w-[280px]"
            v-model="queryParams.distribution_no"
            clearable
            placeholder="请输入配送单号"
          />
        </el-form-item>
          <el-form-item label="配送门店" prop="water_station_id">
              <el-select class="w-[280px]" v-model="queryParams.water_station_id" placeholder="" clearable>
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in waterStationListOptions" :key="item.id" :label="item.name"
                             :value="item.id" />
              </el-select>
          </el-form-item>
          <el-form-item label="配送员" prop="shop_water_station_staff_id">
              <el-select class="w-[280px]" v-model="queryParams.shop_water_station_staff_id" placeholder="" clearable>
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in staffListOptions" :key="item.id" :label="item.name"
                             :value="item.id" />
              </el-select>
          </el-form-item>
        <el-form-item label="收货人手机号" prop="mobile">
          <el-input
            class="w-[250px]"
            v-model="queryParams.mobile"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="收货地址" prop="address_info">
          <el-input
            class="w-[280px]"
            v-model="queryParams.address_info"
            clearable
            placeholder="请输入收货地址"
          />
        </el-form-item>
        <el-form-item label="配送时效" prop="delivery_type">
          <el-select
            class="w-[280px]"
            v-model="queryParams.delivery_type"
            clearable
            placeholder="请选择配送时效"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(item, index) in dictData.delivery_time"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
          <el-form-item label="送达时间" prop="pay_time">
              <daterange-picker
                      v-model:startTime="queryParams.start_time"
                      v-model:endTime="queryParams.end_time"
              />
          </el-form-item>

          <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
<!--          <el-button type="primary" @click="exportClick" v-perms="['distribution.shop_order_distribution/export']">导出订单</el-button>-->
              <export-data
                      class="ml-2.5"
                      :fetch-fun="apiShopOrderDistributionLists"
                      :params="queryParams"
                      :page-size="pager.size"
              />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="!border-none" v-loading="pager.loading" shadow="never">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
            <el-tab-pane
                    v-for="(item, index) in tabLists"
                    :label="`${item.name}(${pager.extend[item.numKey] ?? 0})`"
                    :name="index"
                    :key="index"
            >
        <el-table :data="pager.lists" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
            <el-table-column
                    label="客户昵称"
                    prop="nickname"
                    show-overflow-tooltip
                    width="120"
            />
            <el-table-column label="头像" min-width="60">
                <template #default="{ row }">
                    <el-avatar :src="row.avatar" :size="50" />
                </template>
            </el-table-column>
          <el-table-column
            label="配送单号"
            prop="distribution_no"
            width="180"
          />
          <el-table-column label="状态" prop="status">
            <template #default="{ row }">
              <el-tag
                :type="
                  row.status == 1
                    ? ''
                    : row.status == 2
                    ? 'warning'
                    : row.status == 3
                    ? 'success'
                    : row.status == 4
                    ? 'danger'
                    : ''
                "
                ><dict-value
                  :options="dictData.delivery_status"
                  :value="row.status"
                  :config="{ label: 'name', value: 'value' }"
              /></el-tag>
            </template>
          </el-table-column>
            <el-table-column label="地址信息" width="180">
                <template #default="{ row }">
                    <div>收货人：{{row.name}}</div>
                    <div>手机号：{{row.mobile}}</div>
                    <div>地址：{{row.address_info}}</div>
                </template>
            </el-table-column>
            <el-table-column
                    label="门店"
                    prop="station_name"
                    show-overflow-tooltip
            />
            <el-table-column
                    label="配送员"
                    prop="staff_name"
                    show-overflow-tooltip
            />
            <el-table-column
                    label="送达时间"
                    prop="done_time"
                    show-overflow-tooltip
                    width="200"
            />
          <el-table-column
            label="距离/km"
            prop="distance"
            show-overflow-tooltip
          />
          <el-table-column label="配送时效" prop="delivery_type">
            <template #default="{ row }">
              <el-tag
                :type="
                  row.delivery_type == 1
                    ? ''
                    : row.delivery_type == 2
                    ? 'warning'
                    : row.delivery_type == 3
                    ? 'success'
                    : row.delivery_type == 4
                    ? 'danger'
                    : row.delivery_type == 0
                    ? 'warning'
                    : ''
                "
                ><dict-value
                  :options="dictData.delivery_time"
                  :value="row.delivery_type"
                  :config="{ label: 'name', value: 'value' }"
              /></el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="配送费"
            prop="delivery_price"
            show-overflow-tooltip
          />
          <el-table-column
            label="配送件数"
            prop="delivery_num"
            show-overflow-tooltip
          />
          <el-table-column label="备注" prop="remark" show-overflow-tooltip />
          <el-table-column label="操作" fixed="right" width="150">
            <template #default="{ row }">
              <el-button
                v-perms="['distribution.shop_order_distribution/edit']"
                type="success"
                v-if="row.status < 3"
                link
                @click="handleEdit(row)"
              >
                派单
              </el-button>

                <el-button v-perms="['distribution.shop_order_distribution/detail']" type="primary" link>
                    <router-link
                            :to="{
                                    path: 'shop_order_distribution/detail', //菜单->路由路径
                                    query: {
                                        id: row.id
                                    }
                                }"
                    >
                        详情
                    </router-link>
                </el-button>

              <el-button
                v-perms="['distribution.shop_order_distribution/delete']"
                type="danger"
                v-if="row.status == 1"
                link
                @click="handleDelete(row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-tab-pane>
        </el-tabs>
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

<script lang="ts" setup name="shopOrderDistributionLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import {
  apiShopOrderDistributionLists,
  apiShopOrderDistributionDelete,
} from '@/api/shop_order_distribution'
import { apiShopWaterStationLists } from '@/api/shop_water_station'
import { apiShopWaterStationStaffLists } from '@/api/shop_water_station_staff'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
import {getRoutePath} from "@/router";

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)

// 查询条件
const queryParams = reactive({
  water_station_id:'',
  shop_water_station_staff_id:'',
  status: '',
  name: '',
  mobile: '',
  address_info: '',
  delivery_type: '',
  start_time:'',
  end_time:''
})

const activeTab = ref(0)
const tabLists = ref([
    {
        name: '全部',
        status: '',
        numKey: 'total'
    },
    {
        name: '待接单',
        status: 1,
        numKey: 'num1'
    },
    {
        name: '配送中',
        status: 2,
        numKey: 'num2'
    },
    {
        name: '已送达',
        status: 3,
        numKey: 'num3'
    },
    {
        name: '已取消',
        status: 4,
        numKey: 'num4'
    }
])


// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
  selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('delivery_status,delivery_time')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: apiShopOrderDistributionLists,
  params: queryParams
})

const handleTabChange = (index: any) => {
    queryParams.status = tabLists.value[index].status as string
    resetPage()
}


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
  await apiShopOrderDistributionDelete({ id })
  getLists()
}


// const exportClick = async () => {
//     await feedback.confirm('确定要导出？')
//     await apiShopOrderDistributionExport({
//         params: queryParams
//     })
// }


//门店
const waterStationListOptions = ref<any[]>([])
const getWaterStationList = async () => {
    try {
        const getWaterStationLists : any = await apiShopWaterStationLists({  })
        waterStationListOptions.value = getWaterStationLists.lists
    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}

//员工
const staffListOptions = ref<any[]>([])
const geStaffList = async () => {
    try {
        const geStaffLists : any = await apiShopWaterStationStaffLists({  })
        staffListOptions.value = geStaffLists.lists
    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}
geStaffList()

onActivated(() => {
    getLists()
})
getWaterStationList()
getLists()
</script>

