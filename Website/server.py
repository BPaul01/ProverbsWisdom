from flask import Flask, request, redirect, render_template, session, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt, get_jwt_identity
from datetime import timedelta
import back_logic
import database_manager

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = '799dd6ee-d842-4821-bc23-6c122f73c215'
jwt = JWTManager(app)
db_manager = database_manager.DatabaseManager()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/old_conversation')
def old_conversation():
    return render_template('oldConversation.html')

@app.route('/request-login', methods=['POST'])
def request_login():
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    
    result = db_manager.check_credentials(username, password)
    
    if result:
        access_token = create_access_token(
            identity=username,
            expires_delta=timedelta(days=7)
        )
        return jsonify({'access_token':access_token}), 200
    
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/request-signup', methods=['POST'])
def request_signup():
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    
    result = db_manager.create_user(username, password)
    
    if result:
        access_token = create_access_token(
            identity=username,
            expires_delta=timedelta(days=7)
        )
        return jsonify({'access_token':access_token}), 200
    
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/start-chatting')
def start_chatting():
    return render_template('chat.html')

@app.route('/book.html')
def book():
    return render_template('book.html')

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
    # answer = back_logic.get_first_answer(question, include_reference, chapter, first_verse, last_verse)
    
    result = {
        'answer': "Now here comes the answer",
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
    answer = back_logic.get_answer(messages)
    
    result = {
        'answer': answer
    }
    return jsonify(result), 200

@app.route('/save/conversation', methods=['POST'])
@jwt_required()
def save_conversation():
    current_user = get_jwt_identity()
    print("Saving latest conversation of the user:", current_user)

    # Save the conversation to the database
    data = request.get_json()
    
    response = db_manager.save_conversation(current_user, data)
    
    if response:
        return jsonify({'success': 'Conversation saved successfully'}), 201
    else:
        return jsonify({'error': 'Failed to save conversation'}), 500

@app.route('/get/older/conversations')
@jwt_required()
def get_older_conversations():
    current_user = get_jwt_identity()
    print(current_user)

    # Get older conversations from the database
    older_conversations = db_manager.get_older_conversations_header(current_user)

    return jsonify(older_conversations), 200

@app.route('/get/old/conversation')
@jwt_required()
def get_old_conversation():
    current_user = get_jwt_identity()
    position_of_conversation = request.args.get('positionOfConvoToFetch')
    
    print('Received positionOfConvoToFetch:', position_of_conversation)

    # Get older conversations from the database
    old_conversation = db_manager.get_old_conversation(current_user, position_of_conversation)

    print('Older conversation:', old_conversation)

    return jsonify(old_conversation), 200

@app.route('/get/data/bible/kjv')
def get_bible_data():
    with open('data/kjv.jsonl', 'r',  encoding='utf-8') as file:
        data = file.read()
    return data

if __name__ == '__main__':
    app.run(debug=True)