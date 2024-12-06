<!-- 网站信息 -->
<template>
    <div class="website-information">
        <el-form ref="formRef" :rules="rules" class="ls-form" :model="formData" label-width="120px">
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-card shadow="never" class="!border-none mt-4">
                        <div class="text-xl font-medium mb-[20px]">接单模式   <span style="color: #e6a23c;margin-left: 15px">温馨提示：自动派单(下单后自动分配配送员)，手动派单(下单后统一分配门店站长)</span></div>
                        <el-form-item label="选择模式" prop="accept_type">
                            <div class="mb-2 flex items-center text-sm">
                                <el-radio-group v-model="formData.accept_type" class="ml-4">
                                    <el-radio :label="1" size="large">自动派单</el-radio>
                                    <el-radio :label="2" size="large">手动派单</el-radio>
                                </el-radio-group>
                            </div>
                        </el-form-item>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card shadow="never" class="!border-none mt-4">
                        <div class="text-xl font-medium mb-[20px]">营业时间</div>
                        <el-form-item label="" prop="">
                            <div class="mb-2 flex items-center text-sm">
                                <el-time-select
                                    v-model="formData.startTime"
                                    :max-time="endTime"
                                    class="mr-4"
                                    placeholder="Start time"
                                    start="05:30"
                                    step="00:30"
                                    end="22:30"
                                    size="large"
                                />
                                <span style="color: #9ca3af;margin-right: 20px">至</span>
                                <el-time-select
                                    v-model="formData.endTime"
                                    :min-time="startTime"
                                    placeholder="End time"
                                    start="05:30"
                                    step="00:30"
                                    end="22:30"
                                    size="large"
                                />
                            </div>
                        </el-form-item>
                    </el-card>
                </el-col>
            </el-row>


            <el-row :gutter="10">
                <el-col :span="12">
                    <el-card shadow="never" class="!border-none mt-4">
                        <div class="text-xl font-medium mb-[20px]">配送员接单设置</div>
                        <el-form-item label="最大接单量" prop="max_num">
                            <div class="mb-2 flex items-center text-sm">
                                <el-input v-model="formData.max_num" clearable placeholder="请输入最大接单量" type="number" >
                                <template #append>单</template>
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="接单超时" prop="accept_time">
                            <div class="mb-2 flex items-center text-sm">
                                <el-input v-model="formData.accept_time" clearable placeholder="请输入接单超时（分钟）" type="number">
                                    <template #append>分钟</template>
                                </el-input>
                            </div>
                        </el-form-item>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card shadow="never" class="!border-none mt-4">
                        <div class="text-xl font-medium mb-[20px]">配送员推广设置  <span style="color: #e6a23c;margin-left: 15px">温馨提示：配送员推广新用户下单，配送完成后自动发放奖励！（仅限首单）</span></div>
                        <el-form-item label="选择发放规则" prop="commission_type">
                            <div class="mb-2 flex items-center text-sm">
                                <el-radio-group v-model="formData.commission_type" class="ml-4">
                                    <el-radio :label="1" >按订单比例</el-radio>
                                    <el-radio :label="2" >按固定金额</el-radio>
                                </el-radio-group>
                            </div>
                        </el-form-item>
                        <el-form-item label="设置比例" prop="commission_rate"  v-show="formData.commission_type == 1">
                            <div class="mb-2 flex items-center text-sm">
                                <el-input style="width: 180px" v-model="formData.commission_rate" clearable placeholder="请输入比例" type="number">
                                    <template #append>%</template>
                                </el-input>
                            </div>
                        </el-form-item>

                        <el-form-item label="设置金额" prop="commission_rate" v-show="formData.commission_type == 2">
                            <div class="mb-2 flex items-center text-sm">
                                <el-input style="width: 180px" v-model="formData.commission" clearable placeholder="请输入金额" type="number">
                                    <template #append>元</template>
                                </el-input>
                            </div>
                        </el-form-item>
                    </el-card>

                </el-col>
            </el-row>



            <el-row :gutter="10">
                <el-col :span="12">
                    <el-card shadow="never" class="!border-none mt-4">
                        <div class="text-xl font-medium mb-[20px]">配送时效设置（单位：分钟）</div>
                        <el-form-item label="极速送达" prop="rapid_time">
                            <div class="mb-2 flex items-center text-sm">
                                <el-input v-model="formData.rapid_time" clearable placeholder="" type="number" />
                            </div>
                        </el-form-item>
                        <el-form-item label="准时送达" prop="normal_time">
                            <div class="mb-2 flex items-center text-sm">
                                <el-input v-model="formData.normal_time" clearable placeholder="" type="number" />
                            </div>
                        </el-form-item>
                        <el-form-item label="超时" prop="slight_time">
                            <div class="mb-2 flex items-center text-sm">
                                <el-input v-model="formData.slight_time" clearable placeholder="" type="number" />
                            </div>
                        </el-form-item>
                        <el-form-item label="严重超时" prop="hard_time">
                            <div class="mb-2 flex items-center text-sm">
                                <el-input v-model="formData.hard_time" clearable placeholder="" type="number" />
                            </div>
                        </el-form-item>
                    </el-card>
                </el-col>

                <el-col :span="12">
                    <el-card shadow="never" class="!border-none mt-4">
                        <div class="text-xl font-medium mb-[20px]">配送费设置（元） <span style="color: #e6a23c">温馨提示：指每桶 / 件商品配送费，针对所有商品生效！(如果商品单独设置配送费，按商品单独计算)</span></div>
                        <el-form-item label="极速送达配送费" prop="rapid_time">
                            <div class="mb-2 flex items-center text-sm">
                                <el-input v-model="formData.rapid_price" clearable placeholder="" type="number" />
                            </div>
                        </el-form-item>
                        <el-form-item label="准时送达配送费" prop="normal_time">
                            <div class="mb-2 flex items-center text-sm">
                                <el-input v-model="formData.normal_price" clearable placeholder="" type="number" />
                            </div>
                        </el-form-item>
                        <el-form-item label="超时配送费" prop="slight_time">
                            <div class="mb-2 flex items-center text-sm">
                                <el-input v-model="formData.slight_price" clearable placeholder="" type="number" />
                            </div>
                        </el-form-item>
                        <el-form-item label="严重超时配送费" prop="hard_time">
                            <div class="mb-2 flex items-center text-sm">
                                <el-input v-model="formData.hard_price" clearable placeholder="" type="number" />
                            </div>
                        </el-form-item>
                    </el-card>
                </el-col>
            </el-row>


            <el-card shadow="never" class="!border-none mt-4">
                <div class="text-xl font-medium mb-[20px]">
                    楼层费设置（元）  <span style="color: #e6a23c">温馨提示：如果商品设置需要支付楼层费，此处代表每桶 / 件商品楼层费</span>
                </div>
                <el-form-item label="是否收取楼层费" prop="has_cost">
                    <div class="mb-2 flex items-center text-sm">
                        <el-radio-group v-model="formData.has_cost" class="ml-4">
                            <el-radio :label="1" size="large">是</el-radio>
                            <el-radio :label="0" size="large">否</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <el-form-item label="有电梯/无需爬楼" prop="rapid_time">
                    <div class="mb-2 flex items-center text-sm">
                        <el-input v-model="formData.floor1" clearable placeholder="" type="number" />
                    </div>
                </el-form-item>
                <el-form-item label="2楼" prop="normal_time">
                    <div class="mb-2 flex items-center text-sm">
                        <el-input v-model="formData.floor2" clearable placeholder="" type="number" />
                    </div>
                </el-form-item>
                <el-form-item label="3楼" prop="slight_time">
                    <div class="mb-2 flex items-center text-sm">
                        <el-input v-model="formData.floor3" clearable placeholder="" type="number" />
                    </div>
                </el-form-item>
                <el-form-item label="4楼" prop="hard_time">
                    <div class="mb-2 flex items-center text-sm">
                        <el-input v-model="formData.floor4" clearable placeholder="" type="number" />
                    </div>
                </el-form-item>
                <el-form-item label="5楼" prop="hard_time">
                    <div class="mb-2 flex items-center text-sm">
                        <el-input v-model="formData.floor5" clearable placeholder="" type="number" />
                    </div>
                </el-form-item>
                <el-form-item label="6楼及以上" prop="hard_time">
                    <div class="mb-2 flex items-center text-sm">
                        <el-input v-model="formData.floor6" clearable placeholder="" type="number" />
                    </div>
                </el-form-item>
            </el-card>

        </el-form>
        <footer-btns v-perms="['shop.shop_config/set_point']">
            <el-button type="primary" @click="handleSubmit">保存</el-button>
        </footer-btns>
    </div>
</template>

<script lang="ts" setup name="shopConfig">
import { apiShopConfigDetail, apiShopConfigSet } from '@/api/shop_config'
import type { FormInstance } from 'element-plus'
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
    accept_type: 1,
    has_cost: 1,
    max_num:'',
    accept_time:'',
    rapid_time:'',
    normal_time:'',
    slight_time:'',
    hard_time:'',
    rapid_price:0,
    normal_price:0,
    slight_price:0,
    hard_price:0,
    startTime:'',
    endTime:'',
    floor1:0,
    floor2:0,
    floor3:0,
    floor4:0,
    floor5:0,
    floor6:0,
    commission_type:1,
    commission_rate:'',
    commission:'',

})

const getData = async () => {
    const data = await apiShopConfigDetail()
    console.log(formData)
    for (const key in formData) {
        //@ts-ignore
        formData[key] = data[key]
    }
}

const handleSubmit = async () => {
    await formRef.value?.validate()
    await apiShopConfigSet(formData)
    getData()
}

getData()

</script>

<style lang="scss" scoped></style>
