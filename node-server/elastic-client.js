const es = require("elasticsearch")

const esClient = new es.Client({
    host: 'elasticsearch',
    log: 'trace',
})

const createIndex = async function (index) {
    try {
        return await esClient.indices.get({ index })
    } catch (error) {
        return await esClient.indices.create({ index })
    }
}

const sendData = async function (data) {
    esClient.ping({ requestTimeout: 1000 }, async function (error) {
        if (error) {
            console.log('Elasticsearch\'e erişilmiyor')
            return
        }

        console.log('Elasticsearch ayakta')
        try {
            
        } catch (error) {

        }
    })

}

module.exports = {
    esClient,
    createIndex,
}