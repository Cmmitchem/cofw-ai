import json
import aswgi
from flask_cors import CORS
from flask import Flask, jsonify, request

app = Flask(__name__)
CORS(app)

# Constant route variable with path prefix for all urls
BASE_ROUTE = "/embeddings"
# route that handeles that /embeddings/url and takes GET requests 
@app.route(BASE_ROUTE, methods=['GET'])
def list_songs():
    return jsonify(message="hello world")


#handler function
def handler(event, context):
    return awsgi.response(app, event, context)


'''def handler(event, context):
  print('received event:')
  print(event)
  
  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps('Hello from your new Amplify Python lambda!')
  }'''