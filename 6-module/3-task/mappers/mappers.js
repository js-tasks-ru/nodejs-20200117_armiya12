mappers = {
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

module.exports = mappers;