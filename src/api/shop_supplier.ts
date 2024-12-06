import request from '@/utils/request'

// 供应商列表
export function apiShopSupplierLists(params: any) {
    return request.get({ url: '/supplier.shop_supplier/lists', params })
}

// 添加供应商
export function apiShopSupplierAdd(params: any) {
    return request.post({ url: '/supplier.shop_supplier/add', params })
}

// 编辑供应商
export function apiShopSupplierEdit(params: any) {
    return request.post({ url: '/supplier.shop_supplier/edit', params })
}

// 删除供应商
export function apiShopSupplierDelete(params: any) {
    return request.post({ url: '/supplier.shop_supplier/delete', params })
}

// 供应商详情
export function apiShopSupplierDetail(params: any) {
    return request.get({ url: '/supplier.shop_supplier/detail', params })
}