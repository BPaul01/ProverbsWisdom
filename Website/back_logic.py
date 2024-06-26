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