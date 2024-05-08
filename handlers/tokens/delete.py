import json

def handler(event, context):
    return {
        'statusCode': 204,
        'headers': {
            'Content-Type': 'application/json'
        },
    }
