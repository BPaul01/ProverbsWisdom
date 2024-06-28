import json
from openai import OpenAI


def make_request():
    client = OpenAI()

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
        {"role": "system", "content": "You will help me create a dataset for generating questions based on a paragraph of text. The questions should not be about the author's perspective. The questions should not contain remarks like 'according to the text'. The response should not contain questions like 'what does the text ...', 'how does the text ...' or 'why does the text ...'."},
        {"role": "user", "content": "Generate 5 questions based on the following text: So  Solomon's  purpose  is  to  give  wisdom  in  order  to  bring  harmony  to  the kingdom. Proverbs 1:2 clearly states the purpose of the book-to impart wisdom to the reader. But what is wisdom besides the necessary means to rule? Solomon uses several words to help us grasp all that wisdom entails."},
        {"role": "assistant", "content": "1. How does Solomon's intention to impart wisdom align with the pursuit of harmony within the kingdom?\n2. What linguistic strategies does Solomon employ in Proverbs to convey the multifaceted nature of wisdom?\n3. Beyond governance, how does Solomon define wisdom within the context of his teachings?\n4. Can we discern a hierarchy or prioritization among the various elements that Solomon associates with wisdom?\n5. What does Proverbs 1:2 states?"},
        {"role": "user", "content": "Generate 5 questions based on the following text: And when Jesus of Nazareth bursts onto the scene, he grows in wisdom and in stature and in favor with God and people (Luke 2:52). He's called greater than Solomon (Matt 12) and the \"wisdom of God\" for us (1 Cor 1:24,30). \"In him are hidden all the treasures of wisdom and knowledge\" (Col 2:3). "}
        ]
    )

    questions = completion.choices[0].message.content.split("\n")

    for q in questions:
        print(q)
    
    return questions


def first_letter_index(text):
    for i, char in enumerate(text):
        if char.isalpha():
            return i
    return -1


def save_questions(questions, answer):
    with open('GetTrainningData\\TrainingData.jsonl', 'a', encoding='utf-8') as file:
        for question in questions:
            # Find the index of the first letter in the question
            index = first_letter_index(question)
            if index == -1:
                continue
            
            refined_question = question[index:]
            
            # Save refined_question and answer to JSON
            data = {
                "Question": refined_question,
                "Answer": answer
            }
            
            file.write(json.dumps(data) + '\n')


if __name__ == "__main__":
    questions = "1. How does Solomon's intention to impart wisdom align with the pursuit of harmony within the kingdom?\n2. What linguistic strategies does Solomon employ in Proverbs to convey the multifaceted nature of wisdom?\n3. Beyond governance, how does Solomon define wisdom within the context of his teachings?\n4. Can we discern a hierarchy or prioritization among the various elements that Solomon associates with wisdom?\n5. What does Proverbs 1:2 states?"
    questions = questions.split("\n")
    
    save_questions(questions, "Answer")