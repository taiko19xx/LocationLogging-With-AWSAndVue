const parser = require('lambda-multipart-parser');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

exports.handler = async (event, context) => {
    let result = await parser.parse(event);

    let image = '';
    if (result.files) {
        const S3 = new AWS.S3();

        for (let file of result.files) {
            let uuid = uuidv4();
            image = 'image/' + uuid + path.extname(file.filename);

            await S3.putObject({
                Body: file.content,
                Bucket: '（バケット名）',
                Key: image,
                ContentType: file.contentType
            }).promise();
        }
    }

    const dynamo = new AWS.DynamoDB.DocumentClient();
    const item = {
        'note_id': 'main_note',
        'datetime': Math.floor(Date.now() / 1000),
        'text': result.text,
        'lat': result.lat,
        'lon': result.lon,
        'image': image
    };
    const param = {
        TableName: 'locnote',
        Item: item
    };

    await dynamo.put(param).promise();

    return item;
};
