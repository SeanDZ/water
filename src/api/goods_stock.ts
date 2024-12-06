import request from '@/utils/request'

// 门店商品库存列表
export function apiGoodsStockLists(params: any) {
    return request.get({ url: '/stock.goods_stock/lists', params })
}

// 添加门店商品库存
export function apiGoodsStockAdd(params: any) {
    return request.post({ url: '/stock.goods_stock/add', params })
}

// 编辑门店商品库存
export function apiGoodsStockEdit(params: any) {
    return request.post({ url: '/stock.goods_stock/edit', params })
}

// 删除门店商品库存
export function apiGoodsStockDelete(params: any) {
    return request.post({ url: '/stock.goods_stock/delete', params })
}

// 门店商品库存详情
export function apiGoodsStockDetail(params: any) {
    return request.get({ url: '/stock.goods_stock/detail', params })
}


//成品库存修正
export function apiGoodsStockStock(params: any) {
    return request.post({ url: '/stock.goods_stock/stock', params })
}


//成品库存修正
export function apiGoodsStockBstock(params: any) {
    return request.post({ url: '/stock.goods_stock/bstock', params })
}


export function apiGoodsStockData(params: any) {
    return request.post({ url: '/stock.goods_stock/stock_data', params })
}
