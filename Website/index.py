from flask import Flask, render_template
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get/data/bible/kjv')
def get_bible_data():
    with open('data/kjv.jsonl', 'r',  encoding='utf-8') as file:
        data = file.read()
    return data

if __name__ == '__main__':
    app.run(debug=True)