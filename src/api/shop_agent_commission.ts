import request from '@/utils/request'

// 分销佣金记录列表
export function apiShopAgentCommissionLists(params: any) {
    return request.get({ url: '/agent.shop_agent_commission/lists', params })
}

// 添加分销佣金记录
export function apiShopAgentCommissionAdd(params: any) {
    return request.post({ url: '/agent.shop_agent_commission/add', params })
}

// 编辑分销佣金记录
export function apiShopAgentCommissionEdit(params: any) {
    return request.post({ url: '/agent.shop_agent_commission/edit', params })
}

// 删除分销佣金记录
export function apiShopAgentCommissionDelete(params: any) {
    return request.post({ url: '/agent.shop_agent_commission/delete', params })
}

// 分销佣金记录详情
export function apiShopAgentCommissionDetail(params: any) {
    return request.get({ url: '/agent.shop_agent_commission/detail', params })
}

//分销配置
export function apiShopAgentConfigDetail() {
    return request.get({ url: '/agent.shop_agent_config/detail' })
}

//分销配置保存
export function apiShopAgentConfigSave(params: any) {
    return request.get({ url: '/agent.shop_agent_config/set_agent', params })
}

//分销商品设置、取消
export function apiShopAgentGoodSet(params: any) {
    return request.get({ url: '/agent.shop_agent_commission/set_agent_good', params })
}
export function apiShopAgentGoodCancel(params: any) {
    return request.get({ url: '/agent.shop_agent_commission/cancel_agent_good', params })
}


export function apiShopAgentData() {
    return request.get({ url: '/agent.shop_agent_commission/agent_data' })
}

//收入排名
export function apiShopAgentRank(params: any) {
    return request.get({ url: '/agent.shop_agent_commission/agent_rank', params })
}

//收入记录
export function apiShopCommissionLog(params: any) {
    return request.get({ url: '/agent.shop_agent_commission/commission_log', params })
}