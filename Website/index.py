from flask import Flask, request, redirect, render_template, session, jsonify
from flask_jwt_extended import JWTManager, create_access_token
import json
import back_logic

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = '799dd6ee-d842-4821-bc23-6c122f73c215'
jwt = JWTManager(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/request-login', methods=['POST'])
def request_login():
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    
    if username == 'admin' and password == 'admin':
        access_token = create_access_token(identity=username)
        return jsonify({'access_token':access_token})
    else:
        return jsonify({'error': 'Invalid credentials'})

@app.route('/request-signup', methods=['POST'])
def request_signup():
    # data = request.get_json()
    
    # username = data.get('username')
    # password = data.get('password')
    
    return jsonify({'message': 'Signup successful'})

@app.route('/start-chatting')
def start_chatting():
    return render_template('chat.html')

@app.route('/ask-question', methods=['POST'])
def ask_question():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    question = data.get('text')
    include_reference = data.get('includeReference')
    chapter = data.get('chapter')
    first_verse = data.get('firstVerse')
    last_verse = data.get('lastVerse')
    
    if None in [question, include_reference]:
        return jsonify({'error': 'No question provided'}), 400
    
    if include_reference == 'true':
        if None in [chapter, first_verse, last_verse]:
            return jsonify({'error': 'No reference provided'}), 400
    
    print("Received question:", question)
    print("Include reference:", include_reference)
    print("Chapter:", chapter)
    print("First verse:", first_verse)
    print("Last verse:", last_verse)

    # Make a request to the OpenAI API
    
    result = {
        'answer': 'This is the answer the the question'
    }
    return jsonify(result), 200

@app.route('/ask-follow-up-question', methods=['POST'])
def ask_followup_question():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    chat_array = data.get('chats')
    include_reference = data.get('includeReference')
    chapter = data.get('chapter')
    first_verse = data.get('firstVerse')
    last_verse = data.get('lastVerse')
    
    if None in [chat_array, include_reference]:
        return jsonify({'error': 'No question provided'}), 400
    
    if include_reference == 'true':
        if None in [chapter, first_verse, last_verse]:
            return jsonify({'error': 'No reference provided'}), 400
    
    print("Received chats:", chat_array)
    print("Include reference:", include_reference)
    print("Chapter:", chapter)
    print("First verse:", first_verse)
    print("Last verse:", last_verse)
    
    # Process the chats 
    messages = back_logic.process_chats(chat_array)
    print("Processed messages:", messages)
    
    # Make a request to the OpenAI API
    
    result = {
        'answer': 'This is the answer the the question'
    }
    return jsonify(result), 200

@app.route('/get/data/bible/kjv')
def get_bible_data():
    with open('data/kjv.jsonl', 'r',  encoding='utf-8') as file:
        data = file.read()
    return data

if __name__ == '__main__':
    app.run(debug=True)