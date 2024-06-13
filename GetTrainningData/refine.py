import json

if __name__ == "__main__":
    # Open the .jsonl file for reading
    with open('TrainingData.jsonl', 'r') as file, open('RefinedTrainingData.jsonl', 'a', encoding='utf-8') as refined_file:
        # Iterate over the lines in the file
        for index, line in enumerate(file):
            # Parse the line as a JSON object
            obj = json.loads(line)
            
            question = obj.get("Question")
            
            # Filter the questions
            if ("according to the text" in question.lower()
                or "what does the text" in question.lower()
                or "how does the text" in question.lower()
                or "why does the text" in question.lower()
                or "in what ways does the text" in question.lower()
                or "in what way does the text" in question.lower()
                or "what consequences does the text suggest" in question.lower()
                or "what examples from the text" in question.lower()
                or "what is the text" in question.lower()
                or "what insights does the text" in question.lower()
                or "what consequences does the text" in question.lower()
                or "what implications does the text" in question.lower()
                or "what is the author" in question.lower()
                or "according to the author" in question.lower()
                or "what does the author" in question.lower()
                or "how does the author" in question.lower()
                or "why does the author" in question.lower()
                or "what consequences does the author suggest" in question.lower()
                ):
                continue
            
            answer = obj.get("Answer")
            
            # Save refined_question and answer to JSON
            data = {
                "Question": question,
                "Answer": answer
            }
            
            refined_file.write(json.dumps(data) + '\n')