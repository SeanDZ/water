import request from '@/utils/request'

// 库存盘点列表
export function apiGoodStockCheckLists(params: any) {
    return request.get({ url: '/stock_check.good_stock_check/lists', params })
}

// 添加库存盘点
export function apiGoodStockCheckAdd(params: any) {
    return request.post({ url: '/stock_check.good_stock_check/add', params })
}

// 编辑库存盘点
export function apiGoodStockCheckEdit(params: any) {
    return request.post({ url: '/stock_check.good_stock_check/edit', params })
}

// 删除库存盘点
export function apiGoodStockCheckDelete(params: any) {
    return request.post({ url: '/stock_check.good_stock_check/delete', params })
}

// 库存盘点详情
export function apiGoodStockCheckDetail(params: any) {
    return request.get({ url: '/stock_check.good_stock_check/infos', params })
}

export function apiGoodsStockAudit(params: any) {
    return request.post({ url: '/stock_check.good_stock_check/audit', params })
}