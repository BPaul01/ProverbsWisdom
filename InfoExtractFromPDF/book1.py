import json
import jsonlines
from pdfminer.high_level import extract_pages

def get_raw_text_from_LTComponent(component):
    str_representation = repr(component)

    if 'LTTextBoxHorizontal' in str_representation:
        return str_representation
    else:
        return ""


def get_refined_text(source):
    contents = source.strip().split(' ')
    if len(contents) >= 2:
        start_index = source.find(contents[2])

        return source[start_index + 1: -2].replace('\\t', ' ').replace('\\n', ' ').replace('—', '-').replace("’", "'").replace('“', '"').replace("”", '"').replace("–", "-")
    else:
        return ""


def process_jsonl(input_file, output_file):
    with jsonlines.open(input_file, 'r') as reader, jsonlines.open(output_file, 'w') as writer:
        prev_obj = None
        for obj in reader:
            if prev_obj is not None and obj['Text'][0].islower():
                new_obj = {
                    'Page': prev_obj['Page'],
                    'Paragraph': prev_obj['Paragraph'],
                    'Paragraph #': prev_obj['Paragraph #'],
                    'Text': prev_obj['Text'] + obj['Text']
                }
                writer.write(new_obj)
                prev_obj = None
            else:
                if prev_obj is not None:
                    writer.write(prev_obj)
                prev_obj = obj
        if prev_obj is not None:
            writer.write(prev_obj)


if __name__ == '__main__':
    extracted = extract_pages('pdfs/Christ-Centered Exposition Commentary.pdf')

    # with open('extractedInfo/Christ-Centered Exposition Commentary.jsonl', 'a') as output_file:
    #     page_number = 0
    #     paragraph_counter = 0
    #
    #     for page in extracted:
    #         page_number += 1
    #         paragraph_number = 0
    #
    #         if page_number <= 303:
    #             print("Extracting page " + str(page_number))
    #             info = dict()
    #
    #             for element in page:
    #                 raw_text = get_raw_text_from_LTComponent(element)
    #
    #                 # Filter the Reflection and Discussions page
    #                 if 'Reflect\\tand\\tDiscuss\\n' in raw_text:
    #                     break
    #
    #                 refined_text = get_refined_text(raw_text)
    #
    #                 paragraph_number += 1
    #                 paragraph_counter += 1
    #
    #                 if refined_text == "":
    #                     break
    #
    #                 data = {
    #                     'Page': page_number,
    #                     'Paragraph': paragraph_number,
    #                     'Paragraph #': paragraph_counter,
    #                     'Text': refined_text
    #                 }
    #
    #                 json.dump(data, output_file)
    #                 output_file.write("\n")
    #         else:
    #             break

    process_jsonl("extractedInfo/Christ-Centered Exposition Commentary.jsonl",
                  "extractedInfo/Processed Christ-Centered Exposition Commentary.jsonl")

    print("Processing complete.")