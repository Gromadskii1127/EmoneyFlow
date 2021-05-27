const elasticsearch = require('elasticsearch');

const domain = process.env.ES_DOMAIN
const type = "_doc"//process.env.ES_INDEX_TYPE
const index = "emoney"//process.env.ES_INDEX


var elasticClient = new elasticsearch.Client({
    host: domain,
    log: 'trace'
});

module.exports.indexDocument = async (id, document) => {
    const result = await elasticClient.index(
        {
            index: index,
            type: type,
            body: document,
            id: id
        }
    )    
    return result;
}

module.exports.updateDocument = async (id, document) => {
    const result = await elasticClient.update({
        index: index,
        type: type,
        id: id,
        body: {
            doc: document
        }
    });
    return result;
}

module.exports.deleteDocument = async (id) => {
    const result = await elasticClient.delete(
        {
            index: index,
            type: type,
            id: id
        }
    );
    return result;
}
module.exports.searchDocument = async (query, from, size) => {
    const result = await elasticClient.search({
        index: index,
        type: type,
        from: from,
        size: size,
        body: query
    });
    return result;
}

module.exports.countDocument = async (query) => {
    const result = await elasticClient.count({
        index: index,
        type: type,
        body: query
    });
    return result;
}