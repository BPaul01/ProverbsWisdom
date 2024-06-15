"""Trim data from JSONL file so that it only contains questions under 100 characters."""
import json

with open('RefinedTrainingData.jsonl', 'r') as file, open('TrimmedTrainingData.jsonl', 'a', encoding='utf-8') as trimmed_file:
    for line in file:
        data = json.loads(line)
        
        question = data.get("Question")
        if question and len(question) < 100:
            json.dump(data, trimmed_file, ensure_ascii=False)
            trimmed_file.write('\n')