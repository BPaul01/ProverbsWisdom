import json

# with open('kjv.txt', 'r') as input_file, open('kjv.jsonl', 'a') as output_file:
#     for line in input_file:
#         content = line.strip().split()
#         if content[0] == 'Proverbs':
#             verse_start_index = line.strip().find(content[2])
#             verse = line.strip()[verse_start_index:].replace('â€™', "'") # some weird characters in the original text
#
#             data = {
#                 'Book': content[0],
#                 'Reference': content[1],
#                 'Verse': verse
#             }
#
#             json.dump(data, output_file)
#             output_file.write('\n')


# with open('erv.txt', 'r') as input_file, open('erv.jsonl', 'a') as output_file:
#     for line in input_file:
#         content = line.strip().split()
#         if content[0] == 'Proverbs':
#             verse_start_index = line.strip().find(content[2])
#             verse = line.strip()[verse_start_index:].replace('â€™', "'") # some weird characters in the original text
#
#             data = {
#                 'Book': content[0],
#                 'Reference': content[1],
#                 'Verse': verse
#             }
#
#             json.dump(data, output_file)
#             output_file.write('\n')


with open('ylt.txt', 'r') as input_file, open('ylt.jsonl', 'a') as output_file:
    for line in input_file:
        content = line.strip().split()
        if content[0] == 'Proverbs':
            verse_start_index = line.strip().find(content[2] + ' ' + content[3])
            verse = line.strip()[verse_start_index:].replace('â€”', "-").replace('â€˜', "'").replace('â€™', "'")

            data = {
                'Book': content[0],
                'Reference': content[1],
                'Verse': verse
            }

            json.dump(data, output_file)
            output_file.write('\n')