import json

# Initialize the book dictionary
book = {}

# Read the JSONL file
with open('openAI\\kjv.jsonl', 'r') as file:
    for line in file:
        verse_data = json.loads(line)
        chapter, verse_num = map(int, verse_data['Reference'].split(':'))
        
        # Ensure the chapter exists in the book dictionary
        if chapter not in book:
            book[chapter] = []
        
        # Extend the chapter's verse list if necessary
        while len(book[chapter]) < verse_num:
            book[chapter].append("")
        
        # Add the verse to the appropriate position
        book[chapter][verse_num - 1] = verse_data['Verse']

# Convert the book dictionary to the desired format
formatted_book = {str(i): chapter for i, chapter in enumerate(book.values(), 1)}

# Save the formatted book to a JSON file
with open('openAI\\proverbs_formatted.json', 'w') as outfile:
    json.dump(formatted_book, outfile, indent=4)