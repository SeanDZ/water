<template>
    <div class="tickets-popup">
        <popup ref="popupRef" :title="popupTitle" :async="true" width="1100px" confirmButtonText="" cancelButtonText="">
            <el-card class="!border-none" shadow="always">
                <template #header>
                    <el-button v-perms="['address.user_address/add_ticket']" type="primary"
                               @click="handleTickets('add','')">
                        <template #icon>
                            <icon name="el-icon-Plus" />
                        </template>
                        水票充值
                    </el-button>
                    <el-button style="float: right;" size="mini" @click="handleQuery"><el-icon>
                        <Refresh />
                    </el-icon></el-button>
                </template>
                <div class="mt-4">
                    <el-table :data="dataSource.list" height="500">

                        <el-table-column label="水票名称" prop="name" show-overflow-tooltip />
                        <el-table-column label="水票余量(张)" prop="num" show-overflow-tooltip />
                        <!--						<el-table-column label="有效期(天)" prop="days" show-overflow-tooltip />-->

                        <!--						<el-table-column label="过期时间" prop="expire_time" show-overflow-tooltip />-->
                        <el-table-column label="操作" width="120" fixed="right">
                            <template #default="{ row }">
                                <el-button type="danger" @click="handleTickets('dec',row)">
                                    <template #icon>
                                        <icon name="el-icon-minus" />
                                    </template>
                                    核销水票
                                </el-button>

                            </template>
                        </el-table-column>
                    </el-table>
                </div>

            </el-card>

        </popup>
    </div>

    <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="30%" :before-close="handleTicketsClose">
        <el-form ref="formRef" :model="formData" :rules="formRules" :label-width="formLabelWidth">
            <el-form-item v-if="mode==='add'" label="水票" prop="good_id">
                <el-select class="w-80" v-model="formData.good_id" placeholder="" clearable>
                    <el-option v-for="item in goodListOptions" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="数量" prop="num">
                <el-input-number v-model="formData.num" clearable placeholder="请输入大于0的数字" />
            </el-form-item>
            <el-form-item label="是否生成订单" v-show="mode==='add'">
                <el-radio-group v-model="formData.shop_order_id">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="总价值" prop="price" v-show="mode==='add'">
                <el-input-number v-model="formData.price" clearable placeholder="请输入大于0的数字" />
            </el-form-item>
            <el-form-item label="水票有效期" prop="days" v-show="mode==='add'">
                <el-input-number v-model="formData.days" clearable placeholder="请输入水票有效期" />
                <el-tag type="danger" style="margin-left: 20px;" >默认0 表示永久有效,过期水票会自动扣除</el-tag>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="formData.remark" clearable placeholder="" />
            </el-form-item>
        </el-form>
        <template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="handleAddSubmit">
					确认
				</el-button>
			</span>
        </template>
    </el-dialog>




</template>

<script lang="ts" setup name="goodEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiUserTicketsLists, apiUserTicketsAdd, apiUserTicketsDelete } from '@/api/user_address'
import { apiShopWaterStationLists } from '@/api/shop_water_station'
import { apiNormalGood } from '@/api/good'
import { ref } from 'vue'

const formRef = shallowRef<FormInstance>()

const emit = defineEmits(['success', 'close'])

const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const dialogFormVisible = ref(false)

// 弹窗标题
const dialogTitle = computed(() => {
    return mode.value == 'add' ? '水票充值' : '扣除'
})
const formLabelWidth = '140px'

const formData = reactive({
    id: '',
    user_id: '',
    address_id: '',
    days: '',
    good_id: '',
    num: '',
    remark: '',
    price:'',
    shop_order_id:1,
})

const formRules = computed(() => {
    return mode.value == 'add' ? reactive<any>({
        good_id: [
            {
                required: true,
                message: '请选择水票',
                trigger: ['blur']
            }
        ],
        num: [
            {
                required: true,
                message: '请填写水票数量',
                trigger: ['blur']

            },
            { pattern: /^[1-9]\d*$/, message: '请填写正确的水票数量', trigger: ['blur'] }
        ],

    }) : reactive<any>({
        num: [
            {
                required: true,
                message: '请填写水票数量',
                trigger: ['blur']

            },
            { pattern: /^[1-9]\d*$/, message: '请填写正确的水票数量', trigger: ['blur'] }
        ]
    })
})




const handleTickets = (type : string,rows :any) => {
    mode.value = type
    formRef.value?.resetFields()
    formData.id=rows.id
    dialogFormVisible.value = true
}
const handleTicketsClose = () => {
    dialogFormVisible.value = false
}


// 弹窗标题
const popupTitle = '水票充值'

// 查询条件
const queryParams = reactive({
    id: ''
})


const goodListOptions = ref<any[]>([])

const getgoodList = async () => {
    try {
        const goodListLists : any = await apiNormalGood({ address_id: formData.address_id  })
        goodListOptions.value = goodListLists.lists
    } catch (e) {
        console.log('err', e)

        //TODO handle the exception
    }
}



// 获取详情
const setFormData = async (data : Record<any, any>) => {
    queryParams.id = data.id
    formData.user_id = data.id
    getLists()
    getStationList()
    getgoodList()
}

const dataSource : any = reactive({
    list: []
})
const getLists = async () => {
    dataSource.list = await apiUserTicketsLists(queryParams)
}


const stationListTem : any = reactive({})

// 分页相关
const getStationList = async () => {
    try {
        const stationLists : any = await apiShopWaterStationLists({ address_id: formData.address_id })
        for (const key in stationLists.lists) {
            stationListTem[stationLists.lists[key]['id']] = stationLists.lists[key]['name']
        }
    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}


const handleQuery = async () => {
    getLists()
}


// 提交按钮
const handleAddSubmit = async () => {
    try {
        await formRef.value?.validate()
        const data = { ...formData, }
        console.log(data)
        mode.value == 'add'
            ? await apiUserTicketsAdd(data)
            : await apiUserTicketsDelete(data)
        dialogFormVisible.value = false
        getLists()
    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }

}
//打开弹窗
const open = () => {
    popupRef.value?.open()
}


defineExpose({
    open,
    setFormData
})
</script>