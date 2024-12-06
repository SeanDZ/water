<template>
    <div class="hot-search">
        <el-card class="!border-none" shadow="never">
            <el-alert
                type="warning"
                title="温馨提示：用户充值之后，下单可使用余额支付"
                :closable="false"
                show-icon
                style="margin-bottom: 15px;"
            ></el-alert>
            <el-form ref="formRef" :model="formData" label-width="100px">
                <el-form-item label="功能状态" style="margin-bottom: 0">
                    <div>
                        <el-radio-group v-model="formData.status">
                            <el-radio :label="1">开启</el-radio>
                            <el-radio :label="0">关闭</el-radio>
                        </el-radio-group>

                        <div class="form-tips">默认开启，关闭则前端不显示充值入口</div>
                    </div>
                </el-form-item>
                <el-form-item label="最低充值金额">
                    <div>
                        <el-input
                            v-model="formData.min_amount"
                            placeholder="请输入最低充值金额"
                            clearable
                        />
                        <div class="form-tips">
                            最低充值金额要求
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="!border-none mt-4" shadow="never">
            <div class="lg:flex">
                <div class="flex-1 min-w-0">
                    <el-button type="primary" class="mb-4" @click="handleAdd">添加充值设置</el-button>
                    <el-table size="large" :data="formData.data">
                        <el-table-column label="单笔充值满" prop="describe" min-width="100">
                            <template #default="{ row }">
                                <el-input
                                    v-model="row.price"
                                    clearable
                                    placeholder="请输入充值金额"
                                    type="number"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column label="奖励" prop="describe" min-width="100">
                            <template #default="{ row }">
                                <el-input v-model="row.gift_price" type="number" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="80" fixed="right">
                            <template #default="{ $index }">
                                <el-button
                                    type="danger"
                                    link
                                    @click="handleDel($index)"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-card>

        <footer-btns v-perms="['recharge.recharge/setConfig']">
            <el-button type="primary" @click="handleSave">保存</el-button>
        </footer-btns>
    </div>
</template>

<script setup lang="ts" name="search">
import { getRechargeConfig, setRechargeConfig } from '@/api/app/recharge'
import type { Search } from '@/api/setting/search'

const formData = reactive<Search>({
    status: 1,
    min_amount: 1,
    data: []
})

// const list = computed(() => {
//     return formData.data.filter((text) => text.name).sort((v1, v2) => v2.sort - v1.sort)
// })

// 获取登录注册数据
const getData = async () => {
    try {
        const data = await getRechargeConfig()
        for (const key in formData) {
            //@ts-ignore
            formData[key] = data[key]
        }
    } catch (error) {
        console.log('获取=>', error)
    }
}

const handleAdd = () => {
    formData.data.push({
        price: '',
        gift_price: 0
    })
}

const handleDel = (index: number) => {
    formData.data.splice(index, 1)
}

const handleSave = async () => {
    try {
        await setRechargeConfig(formData)
        getData()
    } catch (error) {
        console.log('保存=>', error)
    }
}

getData()
</script>

<style lang="scss" scoped>
.hot-search {
    .hot-search-phone {
        width: 300px;
        background-color: #fff;
        &-content {
            width: 100%;
            height: 530px;
            padding: 12px 12px;
            border-radius: 10px;
            border: 1px solid #e6e6e6;

            .search-com {
                .search-con {
                    height: 100%;
                    height: 36px;
                    border-radius: 36px;
                    background: #f4f4f4;
                    color: #999999;
                }
            }

            .hot-search-title {
                padding: 10px 0;
                font-size: 13px;
            }

            .hot-search-text {
                span {
                    font-size: 12px;
                    border-radius: 100px;
                    padding: 5px 10px;
                    margin: 0 6px 6px 0;
                    display: inline-block;
                    background-color: #f4f4f4;
                }
            }
        }
    }
}
</style>
