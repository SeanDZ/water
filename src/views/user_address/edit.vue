<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            :title="popupTitle"
            :async="true"
            width="650px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form ref="formRef" :model="formData" label-width="90px" :rules="formRules">
				<el-form-item label="详细地址" prop="address">
				    <el-input v-model="formData.address" clearable placeholder="请输入详细地址，不超过50个字" :maxlength="48" />
<!--						<MakerMap :formValue="formData" @message-to-parent="handleAddressFromChild" />-->
				</el-form-item>

        <el-form-item label="门牌号" prop="number">
            <el-input v-model="formData.number" clearable placeholder="请输入门牌号" />
        </el-form-item>

        <el-form-item label="选择楼层" prop="floor">
            <el-select class="w-[280px]" v-model="formData.floor">
                <el-option label="无需爬楼" :value="0" />
                <el-option label="2楼" :value="2"/>
                <el-option label="3楼" :value="3"/>
                <el-option label="4楼" :value="4"/>
                <el-option label="5楼" :value="5"/>
                <el-option label="6楼及以上" :value="6"/>
            </el-select>
        </el-form-item>
        <el-form-item label="所属门店" prop="water_station_id">
            <el-select class="w-[280px]" v-model="formData.water_station_id" :disabled="isDisabled" placeholder="请选择门店" clearable>
                <el-option v-for="item in stationListOptions" :key="item.id" :label="item.name"
                           :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="收货人" prop="name">
            <el-input v-model="formData.name" clearable placeholder="请输入收货人" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
            <el-input v-model="formData.mobile" clearable placeholder="请输入联系方式" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" clearable placeholder="请输入备注" />
        </el-form-item>

    <el-input  type="hidden"  v-model="formData.province" clearable placeholder="请输入" />
    <el-input  type="hidden"  v-model="formData.city" clearable placeholder="请输入" />
    <el-input  type="hidden"  v-model="formData.county" clearable placeholder="请输入" />
    <el-input  type="hidden"  v-model="formData.longitude" clearable placeholder="请输入" />
    <el-input type="hidden"  v-model="formData.latitude" clearable placeholder="请输入" />

    <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status" placeholder="请选择状态">
            <el-radio
                v-for="(item, index) in dictData.status"
                :key="index"
                :label="parseInt(item.value)"
            >
                {{ item.name }}
            </el-radio>
        </el-radio-group>
    </el-form-item>

    <el-form-item label="月结地址" prop="month_type">
        <el-radio-group v-model="formData.month_type">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
        </el-radio-group>
    </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="userAddressEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiUserAddressAdd, apiUserAddressEdit, apiUserAddressDetail } from '@/api/user_address'
import MakerMap from './components/maker-map.vue'
import { isPhone } from '@/utils/validate'
import type { PropType } from 'vue'
import {apiShopWaterStationLists} from "@/api/shop_water_station";
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
const isDisabled = ref(false)



// 弹窗标题
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '编辑地址' : '新增地址'
})

// 表单数据
const formData = reactive({
    id: '',
    user_id:'',
    water_station_id:'',
    name: '',
    mobile: '',
    address: '',
    number: '',
    status: 1,
    floor:'',
    remark:'',
    month_type:0,
})

// 表单验证
const formRules = reactive<any>({
	address: [
		{
			required: true,
			message: '请输入详细地址',
			trigger: ['blur']
		}
	],
    water_station_id: [
        {
            required: true,
            message: '请选择门店',
            trigger: ['blur']
        }
    ],
    name: [{
        required: true,
        message: '请输入收货人',
        trigger: ['blur']
    }],
    mobile: [{
        required: true,
        message: '请输入联系方式',
        trigger: ['blur']
    },

      ],
    status: [{
        required: true,
        message: '请选择状态',
        trigger: ['blur']
    }],
})

const stationListOptions = ref<any[]>([])
const getStationList = async () => {
    try {
        const stationLists : any = await apiShopWaterStationLists('')
        stationListOptions.value = stationLists.lists
        console.log(stationListOptions)

    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}
getStationList()

// 获取详情
const setFormData = async (data: Record<any, any>) => {
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
        }
    }
}

const setUserId = async (userId:string) => {
     formData.user_id = userId
}


const getDetail = async (row: Record<string, any>) => {
    const data = await apiUserAddressDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
	try{
		await formRef.value?.validate()
		const data = { ...formData,  }
		mode.value == 'edit' 
		    ? await apiUserAddressEdit(data) 
		    : await apiUserAddressAdd(data)
		popupRef.value?.close()
		emit('success')
	}catch(e){
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
    getDetail,
	  setUserId
})
</script>
