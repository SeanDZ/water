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
        <el-row>
          <el-col :span="24">
            <el-form-item label="活动名称" prop="name">
              <el-input
                v-model="formData.name"
                maxlength="30"
                show-word-limit
                clearable
                placeholder="请输入活动名称"
              />
            </el-form-item>
          </el-col>
            <el-col :span="24">
            <el-form-item label="活动图片" prop="img">
                <material-picker v-model="formData.img" />
            </el-form-item>
            </el-col>
          <el-col :span="24">
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
          </el-col>
          <el-col :span="24">
            <el-form-item label="优惠类型" prop="type">
              <el-radio-group
                v-model="formData.type"
                placeholder="请选择优惠类型"
                @change="typeChange"
              >
                <el-radio
                  v-for="(item, index) in dictData.discount_type"
                  :key="index"
                  :label="parseInt(item.value)"
                >
                  {{ item.name }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="优惠条件" prop="condition">
              <el-table :data="formData.condition" border style="width: 100%">
                <el-table-column prop="full" :label="'同种商品满/' + unitType">
                  <template #default="{ row }">
                    <text> 满</text>
                    <el-input
                      type="number"
                      class="mx-2"
                      v-model="row.full"
                      placeholder="Please input"
                      style="width: 90px"
                    />{{ unitType }}
                  </template>
                </el-table-column>
                <el-table-column prop="discount" label="优惠/元">
                  <template #default="{ row }">
                    优惠<el-input
                      type="number"
                      class="mx-2"
                      v-model="row.discount"
                      placeholder="Please input"
                      style="width: 90px"
                    />元
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="60">
                  <template #default="{ $index }">
                    <el-button
                      link
                      type="danger"
                      size="small"
                      @click="handleDel($index)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" class="mt-4" @click="handleAdd"
                >添加优惠条件</el-button
              >
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参与商品" prop="good_type">
              <el-radio-group v-model="formData.good_type">
                <el-radio-button label="1">部分商品</el-radio-button>
                <el-radio-button label="2">全部商品</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="选择商品"
              prop="good"
              v-if="formData.good_type == 1"
            >
              <el-tag style="height: 32px"
                v-for="(tag, index) in formData.good"
                :key="index"
                class="mx-1 my-1"
                closable
                @close="handleTagClose"
              >
                {{ tag.name }}
              </el-tag>
              <el-button
                class="button-new-tag ml-1"
                size="default"
                type="success"
                @click="addGoods(formData.good)"
              >
                添加指定商品
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-switch
                v-model="formData.status"
                class="ml-2"
                inline-prompt
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
            <el-alert
                    type="warning"
                    title="温馨提示：一个商品只能参与一个优惠活动"
                    :closable="false"
                    show-icon
            ></el-alert>
        </el-row>
      </el-form>
    </popup>
    <goods-popup
      v-if="showGoods"
      ref="goodsRef"
      @success="dealTags"
      @close="showGoods = false"
    />
  </div>
</template>

<script lang="ts" setup name="shopDiscountActivityEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import {
  apiShopDiscountActivityAdd,
  apiShopDiscountActivityEdit,
  apiShopDiscountActivityDetail
} from '@/api/shop_discount_activity'
import { timeFormat } from '@/utils/util'
import type { PropType } from 'vue'
import GoodsPopup from './choose_good.vue'
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
const unitType = ref('件')

const goodsRef = shallowRef<InstanceType<typeof GoodsPopup>>()

// 是否显示商品选择
const showGoods = ref(false)

// 弹窗标题
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑' : '新增'
})

const addGoods = async (data: any) => {
  showGoods.value = true
  await nextTick()
  goodsRef.value?.open('goods')
  goodsRef.value?.setFormData(data)
}

const handleTagClose = (index: number) => {
  formData.good.splice(formData.good.indexOf(index), 1)
}

const dealTags = (e) => {
  // console.log(e, 22)
  let zArr = [...formData.good, ...e]
  let obj = {}
  let brr = []
  zArr.forEach((item) => {
    if (obj[item.id] == undefined) {
      obj[item.id] = 1
      // item['good_id'] = item.id
      brr.push(item)
    } else {
      obj[item.id] += 1
    }
  })
  // console.log(brr, 444)
  formData.good = brr
}

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  img: '',
  start_date: '',
  end_date: '',
  type: 2,
  good_type: '',
  good: [],
  status: 1,
  condition: [
    {
      full: 1,
      discount: 1
    }
  ],
  shop_id: ''
})

// 表单验证
const formRules = reactive<any>({
  name: [
    {
      required: true,
      message: '请输入名称',
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
  type: [
    {
      required: true,
      message: '请选择优惠类型',
      trigger: ['blur']
    }
  ],
  good_type: [
    {
      required: true,
      message: '请选择商品类型',
      trigger: ['blur']
    }
  ],
  good: [
    {
      required: true,
      message: '请选择商品',
      trigger: ['blur']
    }
  ],
  activity_time: [
    {
      required: true,
      message: '有效时间不能为空!',
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
  formData.start_date = e[0]
  formData.end_date = e[1]
}

// 获取详情
const setFormData = async (data: Record<any, any>) => {
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      //@ts-ignore

      if (key == 'good') {
        for (const ei in data[key]) {
          formData[key][ei] = data[key][ei]
          formData[key][ei]['id'] = data[key][ei]['good_id']
        }
      } else {
        formData[key] = data[key]
      }
    }
  }
  formData['activity_time'] = [data['start_date'], data['end_date']]
}

const handleAdd = () => {
  formData.condition.push({
    full: 1,
    discount: 1
  })
}

const handleDel = (index: number) => {
  // console.log(index)
  if (formData.condition.length > 1) {
    formData.condition.splice(index, 1)
  }
}

const getDetail = async (row: Record<string, any>) => {
  const data = await apiShopDiscountActivityDetail({
    id: row.id
  })
  setFormData(data)
}

// 提交按钮
const handleSubmit = async () => {
  await formRef.value?.validate()
  for (const ei in formData['good']) {
    // formData['good'][ei] = data[key][ei]
    formData['good'][ei]['good_id'] = formData['good'][ei]['id']
  }
  const data = { ...formData }
  mode.value == 'edit'
    ? await apiShopDiscountActivityEdit(data)
    : await apiShopDiscountActivityAdd(data)
  popupRef.value?.close()
  emit('success')
}

const typeChange = (e) => {
  // console.log(e)
  if (e == 1) {
    unitType.value = '件'
  } else if (e == 2) {
    unitType.value = '元'
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
