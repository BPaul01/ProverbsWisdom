from openai import OpenAI
import json


def process_chats(chats):
    system_role = {
        "role": "system",
        "content": "You are a helpful assistant giving biblically accurate answers relying as much as possible on the book of Proverbs."
    }
    messages = []
    messages.append(system_role)
    
    for chat in chats:
        if chat['role'] == 'user':
            messages.append({"role": "user", "content": chat['text']})
        else:
            messages.append({"role": "assistant", "content": chat['text']})

    return messages

def get_first_answer(question, include_reference, chapter, first_verse, last_verse):
    if include_reference == 'true':
        # extract the reference
        with open('data/proverbs_formatted.json', 'r',  encoding='utf-8') as file:
            book = json.load(file)
            
        reference_text = ""
        current_verse = int(first_verse)
        while(current_verse <= int(last_verse)):
            reference_text += str(current_verse) + ". " + book[chapter][current_verse - 1] + "\n"
            current_verse += 1
        
        question = question + '\n' + reference_text
    
    client = OpenAI()
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant giving biblically accurate answers relying as much as possible to the book of Proverbs."},
            {"role": "user", "content": question}
        ]
    )
    answer = completion.choices[0].message.content
    
    return answer

def get_answer(messages):
    client = OpenAI()
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    answer = completion.choices[0].message.content
    
    return answer

def generate_summary(messages):
    convo = ""
    for m in messages:
        convo += m['role'] + ': ' + m['text'] + '\n'
    
    gpt_messages=[
        {"role": "system", "content": "You are a helpful assistant that summarizes conversations."},
        {"role": "user", "content": "Summarize in less that 15 words the following conversation:\n" + convo},
    ]
    
    client = OpenAI()
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=gpt_messages
    )
    summary = completion.choices[0].message.content
    
    return summary