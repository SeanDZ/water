<template>
  <div>
    <el-card class="!border-none mb-4" shadow="never">
      <el-form class="mb-[-16px]" :model="queryParams" inline>
        <el-form-item label="所属门店" prop="water_station_id">
            <el-select class="w-50" v-model="queryParams.water_station_id" placeholder="" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in waterStationListOptions" :key="item.id" :label="item.name"
                           :value="item.id" />
            </el-select>
        </el-form-item>
          <el-form-item label="地址编码" prop="code">
              <el-input
                      class="w-[250px]"
                      v-model="queryParams.code"
                      clearable
                      placeholder="请输入编码"
              />
          </el-form-item>
        <el-form-item label="收货人" prop="name">
          <el-input
            class="w-[250px]"
            v-model="queryParams.name"
            clearable
            placeholder="请输入收货人"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            class="w-[250px]"
            v-model="queryParams.mobile"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            class="w-[250px]"
            v-model="queryParams.address"
            clearable
            placeholder="请输入地址"
          />
        </el-form-item>
          <el-form-item label="月结地址">
              <el-select class="w-50" v-model="queryParams.month_type">
                  <el-option label="全部" value />
                  <el-option label="是" :value="1" />
                  <el-option label="否" :value="0" />
              </el-select>
          </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="!border-none" v-loading="pager.loading" shadow="never">
     <el-button v-perms="['address.user_address/add']" type="primary" @click="handleAdd">
            <template #icon>
                <icon name="el-icon-Plus" />
            </template>
            新增
      </el-button>
      <el-button
        v-perms="['address.user_address/delete']"
        :disabled="!selectData.length"
        @click="handleDelete(selectData)"
      >
        删除
      </el-button>
      <div class="mt-4">
        <el-table :data="pager.lists" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
            <el-table-column label="ID" prop="id" show-overflow-tooltip width="50"/>
            <el-table-column label="地址编码" prop="code" show-overflow-tooltip width="100" />
            <el-table-column
            label="客户昵称"
            prop="nickname"
            show-overflow-tooltip
          />
            <el-table-column label="是否月结" prop="month_type">
                <template #default="{ row }">
                    <el-tag type="danger" v-if="row.month_type == 0">否</el-tag>
                    <el-tag type="success" v-else-if="row.month_type == 1">是</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="地址信息" width="250">
                <template #default="{ row }">
                    <div>收货人：{{row.name}}</div>
                    <div>手机号：{{row.mobile}}</div>
                    <div>地址：{{row.address}} {{row.number}}</div>
                </template>
            </el-table-column>
            <el-table-column label="所属门店" prop="station_name" show-overflow-tooltip />
            <el-table-column label="水票余量" prop="ticket_num" show-overflow-tooltip />
            <el-table-column
                    label="押桶"
                    prop="bucket_add"
                    width="80"
            >
                <template #default="{ row }">
                    <el-button v-perms="['address.user_address/log']"
                               type="primary"
                               link  @click="handleBucketLog(row,1)">{{row.bucket_add}}</el-button>
                </template>
            </el-table-column>

          <el-table-column
            label="欠桶"
            prop="bucket_dec"
            width="80"
          >
              <template #default="{ row }">
                  <el-button v-perms="['address.user_address/log']"
                             type="primary"
                             link  @click="handleBucketLog(row,2)">{{row.bucket_dec}}</el-button>
              </template>
          </el-table-column>
          <el-table-column label="状态" prop="status">
            <template #default="{ row }">
              <el-tag :type="row.status == 1 ? 'success' : 'danger'"
                ><dict-value
                  :options="dictData.status"
                  :value="row.status"
                  :config="{ label: 'name', value: 'value' }"
              /></el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="create_time"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="300" fixed="right">
            <template #default="{ row }">
              <el-button
                v-perms="['address.user_address/order']"
                type="success"
                link
                @click="handleOrder(row)"
              >
                代客下单
              </el-button>
              <el-button
                v-perms="['address.user_address/address_bucket']"
                type="warning"
                link
                @click="handleBucket(row)"
              >
                押桶欠桶
              </el-button>
<!--              <el-button-->
<!--                v-perms="['address.user_address/address_ticket']"-->
<!--                type="primary"-->
<!--                link-->
<!--                @click="handleTickets(row)"-->
<!--              >-->
<!--                水票充值-->
<!--              </el-button>-->
              <el-button
                v-perms="['address.user_address/edit']"
                type="success"
                link
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                v-perms="['address.user_address/delete']"
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
    <order-popup
      v-if="showOrder"
      ref="orderRef"
      @success="getLists"
      @close="showOrder = false"
    />
    <bucket-popup
      v-if="showBucket"
      ref="bucketRef"
      @success="getLists"
      @close="showBucket = false"
    />
    <tickets-popup
      v-if="showTickets"
      ref="ticketsRef"
      @success="getLists"
      @close="showTickets = false"
    />
    <log-popup
        v-if="showLog"
        ref="logRef"
        @success="getLists"
        @close="showLog = false"
    />
  </div>
</template>

<script lang="ts" setup name="userAddressLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiUserAddressLists, apiUserAddressDelete } from '@/api/user_address'
import { apiShopWaterStationLists } from '@/api/shop_water_station'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
import OrderPopup from './order.vue'
import BucketPopup from './bucket.vue'
import TicketsPopup from './tickets.vue'
import LogPopup from './log.vue'
import { getRoutePath } from '@/router'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const orderRef = shallowRef<InstanceType<typeof OrderPopup>>()
const bucketRef = shallowRef<InstanceType<typeof BucketPopup>>()
const ticketsRef = shallowRef<InstanceType<typeof TicketsPopup>>()
const logRef = shallowRef<InstanceType<typeof LogPopup>>()
// 是否显示编辑框
const showEdit = ref(false)
const showOrder = ref(false)
const showBucket = ref(false)
const showTickets = ref(false)
const showLog = ref(false)

// 查询条件
const queryParams = reactive({
  water_station_id:'',
  name: '',
  mobile: '',
  address: '',
  month_type:'',
  code:''
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
  fetchFun: apiUserAddressLists,
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
//代客下单
const handleOrder = async (data: any) => {
  showOrder.value = true
  await nextTick()
  orderRef.value?.open('order')
  orderRef.value?.setFormData(data)
}

//押桶欠桶
const handleBucket = async (data: any) => {
  showBucket.value = true
  await nextTick()
  bucketRef.value?.open('bucket')
  bucketRef.value?.setFormData(data)
}

const handleTickets = async (data: any) => {
  showTickets.value = true
  await nextTick()
  ticketsRef.value?.open('tickets')
  ticketsRef.value?.setFormData(data)

}


//押桶记录
const handleBucketLog = async (data: any,type:any) => {
    showLog.value = true
    await nextTick()
    logRef.value?.open('log')
    logRef.value?.setFormData(data,type)
}

// 删除
const handleDelete = async (id: number | any[]) => {
  await feedback.confirm('确定要删除？')
  await apiUserAddressDelete({ id })
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
        //TODO handle the exception
    }
}
getWaterStationList()
getLists()
</script>