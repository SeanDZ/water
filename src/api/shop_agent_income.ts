import request from '@/utils/request'

// 分销提现记录列表
export function apiShopAgentIncomeLists(params: any) {
    return request.get({ url: '/agent.shop_agent_income/lists', params })
}

// 添加分销提现记录
export function apiShopAgentIncomeAdd(params: any) {
    return request.post({ url: '/agent.shop_agent_income/add', params })
}

// 编辑分销提现记录
export function apiShopAgentIncomeEdit(params: any) {
    return request.post({ url: '/agent.shop_agent_income/edit', params })
}

// 删除分销提现记录
export function apiShopAgentIncomeDelete(params: any) {
    return request.post({ url: '/agent.shop_agent_income/delete', params })
}

// 分销提现记录详情
export function apiShopAgentIncomeDetail(params: any) {
    return request.get({ url: '/agent.shop_agent_income/detail', params })
}


//审核
export function apiShopAgentIncomeAudit(params: any) {
    return request.post({ url: '/agent.shop_agent_income/audit', params })
}