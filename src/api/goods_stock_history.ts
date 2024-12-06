import request from '@/utils/request'

// 商品出入记录列表
export function apiGoodsStockHistoryLists(params: any) {
    return request.get({ url: '/good_stock.goods_stock_history/lists', params })
}

// 添加商品出入记录
export function apiGoodsStockHistoryAdd(params: any) {
    return request.post({ url: '/good_stock.goods_stock_history/add', params })
}

// 编辑商品出入记录
export function apiGoodsStockHistoryEdit(params: any) {
    return request.post({ url: '/good_stock.goods_stock_history/edit', params })
}

// 删除商品出入记录
export function apiGoodsStockHistoryDelete(params: any) {
    return request.post({ url: '/good_stock.goods_stock_history/delete', params })
}

// 商品出入记录详情
export function apiGoodsStockHistoryDetail(params: any) {
    return request.get({ url: '/good_stock.goods_stock_history/detail', params })
}