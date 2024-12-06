<template>
  <div class="edit-popup">
    <popup
      ref="popupRef"
      :title="popupTitle"
      :async="true"
      width="700px"
      @confirm="handleSubmit"
      @close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        label-width="90px"
        :rules="formRules"
      >
        <el-form-item label="活动标题" prop="name">
          <el-input
            v-model="formData.name"
            clearable
            placeholder="请输入活动标题"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
          <el-form-item label="活动图片" prop="img">
              <material-picker v-model="formData.img" />
          </el-form-item>
        <el-form-item label="商品信息" prop="good_id">

          <el-select v-model="formData.good_id" placeholder="请选择商品信息">
            <el-option
              v-for="item in goodOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="水票价值" prop="price">
          <el-input-number
            v-model="formData.price"
            :precision="2"
            clearable
            placeholder="请输入水票价值"
          />
          <!-- <el-input-number v-model="num" :precision="2" :step="0.1" :max="10" /> -->
        </el-form-item>
        <el-form-item label="水票数量" prop="ticket_num">
          <el-input-number
            v-model="formData.ticket_num"
            :min="1"
            clearable
            placeholder="请输入水票数量"
          />
        </el-form-item>
          <el-form-item label="有效期" prop="days">
              <el-input-number
                      v-model="formData.days"
                      :min="0"
                      clearable
                      placeholder="请输入水票有效期"
              />
              <el-tag type="danger" style="margin-left: 20px;" >默认0 表示永久有效, 过期水票会自动扣除</el-tag>
          </el-form-item>
        <el-form-item label="活动时间" prop="activity_time">
          <el-date-picker
            v-model="formData.activity_time"
            type="datetimerange"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY/MM/DD"
            time-format="hh:mm:ss"
            @change="dealChange"
            unlink-panels
          />
        </el-form-item>
        <el-form-item label="库存" prop="stock_num">
          <el-input-number
            v-model="formData.stock_num"
            clearable
            placeholder="请输入库存"
          />
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-switch
            v-model="formData.status"
            class="ml-2"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
    
    <script lang="ts" setup name="shopInviteActivityEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import {
  apiShopInviteActivityAdd,
  apiShopInviteActivityEdit,
  apiShopInviteActivityDetail
} from '@/api/shop_invite_activity'
import { apiNormalGood } from '@/api/good'
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
  good_id: '',
  price: '',
  ticket_num: 0,
  activity_time: '',
  start_time: '',
  end_time: '',
  stock_num: 0,
  received_num: 0,
  days: 0,
  limit_type: 2,
  user_limit: 1,
  status: 1,
    img: ''
})

// 表单验证
const formRules = reactive<any>({
  name: [
    {
      required: true,
      message: '请输入活动标题',
      trigger: ['blur']
    }
  ],
    img: [
        {
            required: true,
            message: '请上传图片',
            trigger: ['blur']
        }
    ],
  good_id: [
    {
      required: true,
      message: '请输入商品信息',
      trigger: ['blur']
    }
  ],
  price: [
    {
      required: true,
      message: '请输入水票价值',
      trigger: ['blur']
    }
  ],
  ticket_num: [
    {
      required: true,
      message: '请输入水票数量',
      trigger: ['blur']
    }
  ],
  stock_num: [
    {
      required: true,
      message: '请输入剩余库存',
      trigger: ['blur']
    }
  ],

  activity_time: [
    {
      required: true,
      message: '活动时间不能为空',
      trigger: ['blur']
    }
  ],
  days: [
    {
      required: true,
      message: '请输入有效天数',
      trigger: ['blur']
    }
  ],

  status: [
    {
      required: true,
      message: '请选择状态',
      trigger: ['blur']
    }
  ]
})

const dealChange = (e) => {
  // console.log(e)
  formData.start_time = e[0]
  formData.end_time = e[1]
}

// 获取详情
const setFormData = async (data: Record<any, any>) => {
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      //@ts-ignore
      formData['activity_time'] = [data['start_time'], data['end_time']]
      formData[key] = data[key]
    }
  }
}

const getDetail = async (row: Record<string, any>) => {
  const data = await apiShopInviteActivityDetail({
    id: row.id
  })
  setFormData(data)
}

const goodOptions = ref<any[]>([])
// 商品列表相关
const getgoodList = async () => {
  try {
    const goodListLists: any = await apiNormalGood()
    goodOptions.value = goodListLists.lists
  } catch (e) {
    console.log('err', e)
    //TODO handle the exception
  }
}
getgoodList()

// 提交按钮
const handleSubmit = async () => {
  // console.log(formData)

  await formRef.value?.validate()
  const data = { ...formData }
  mode.value == 'edit'
    ? await apiShopInviteActivityEdit(data)
    : await apiShopInviteActivityAdd(data)
  popupRef.value?.close()
  emit('success')
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
    