const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    const dynamo = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: 'locnote',
        KeyConditionExpression: 'note_id = :k ',
        ExpressionAttributeValues: {':k': 'main_note'},
        ScanIndexForward: false
    };

    const result = await dynamo.query(params).promise();

    return {'result': result};
};
