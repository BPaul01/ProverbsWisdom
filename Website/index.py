from flask import Flask, request, redirect, render_template, session, jsonify
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

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

@app.route('/ask-followup-question', methods=['POST'])


@app.route('/get/data/bible/kjv')
def get_bible_data():
    with open('data/kjv.jsonl', 'r',  encoding='utf-8') as file:
        data = file.read()
    return data

if __name__ == '__main__':
    app.run(debug=True)