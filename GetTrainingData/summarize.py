import json
from openai import OpenAI

def askGPT(question, text):
    client = OpenAI()
    
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
        {"role": "system", "content": "Starting from the following text, provide an answer of maximum 400 characters long for the question."},
        {"role": "user", "content": "Text: " + text + "\nQuestion: " + question},
        ]
    )
    
    answer = completion.choices[0].message.content
    return question, answer

if __name__ == "__main__":
    with open('TrimmedTrainingData.jsonl', 'r') as file, open('SummarizedAnswerData.jsonl', 'a', encoding='utf-8') as refined_file:
        # Iterate over the lines in the file
        for index, line in enumerate(file):
            # Parse the line as a JSON object
            obj = json.loads(line)
            
            print(f"=============== Processing question # {index} ===============")
            
            question, text = askGPT(obj["Question"], obj["Answer"])
            
            data = {
                "Question": question,
                "Answer": text
            }
            
            refined_file.write(json.dumps(data) + '\n')