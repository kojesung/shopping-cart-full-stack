// Transforms `import.meta.env` → `process.env` for Jest (CJS) environment
module.exports = function () {
    return {
        visitor: {
            MemberExpression(path) {
                const { object, property } = path.node;
                if (
                    object.type === 'MetaProperty' &&
                    object.meta.name === 'import' &&
                    object.property.name === 'meta' &&
                    property.name === 'env'
                ) {
                    path.replaceWithSourceString('process.env');
                }
            },
        },
    };
};
