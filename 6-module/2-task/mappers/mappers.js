mappers = {
    mapCategory(doc) {
        return {
            id: doc.id,
            title: doc.title,
            subcategories: doc.subcategories.map(subcategory),
        }
    },
    mapProduct(doc) {
        return {
            id: doc.id,
            images: doc.images,
            title: doc.title,
            description: doc.description,
            price: doc.price,
            category: doc.category,
            subcategory: doc.subcategory,
        }
    }
};

function subcategory(doc) {
    return {
        id: doc.id,
        title: doc.title,
    }
}

module.exports = mappers;