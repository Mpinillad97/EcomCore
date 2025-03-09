export function validateUser(user: any): boolean{
    const validUser = 
        user.name && 
        user.email &&
        user.password &&
        user.address &&
        user.phone
    
    return validUser;
}

export function validateProduct(product: any): boolean{
    const validProduct = 
    product.name &&
    product.description &&
    product.price &&
    product.stock &&
    product.imgUrl

    return validProduct;
}