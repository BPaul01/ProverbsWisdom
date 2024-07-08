import json

with open('openAI\\ReRefinedTrainingData.jsonl', 'r') as file, open('openAI\\FinalTrainingData.jsonl', 'a', encoding='utf-8') as refined_file:
    # Iterate over the lines in the file
    for index, line in enumerate(file):
        # Parse the line as a JSON object
        obj = json.loads(line)
        
        print(f"=============== Processing question # {index} ===============")
        
        question = obj.get("Question")
        answer = obj.get("Answer")
        
        # Save info to accepted template 
        data = {
            "messages" : [
                {
                    "role": "system",
                    "content" : "You are a helpful assistant giving biblically accurate answers relying as much as possible on the book of Proverbs."
                },
                {
                    "role": "user",
                    "content" : question
                },
                {
                    "role": "assistant",
                    "content" : answer
                }
            ]
        }
        
        refined_file.write(json.dumps(data) + '\n')