import json

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

        return source[start_index+1:-2].replace('\\t', ' ').replace('\\n', ' ').replace('—', '-').replace("’", "'").replace('“', '"').replace("”", '"').replace("–", "-")
    else:
        return ""


if __name__ == '__main__':

    extracted = extract_pages('pdfs/Christ-Centered Exposition Commentary.pdf')

    with open('extractedInfo/Christ-Centered Exposition Commentary.jsonl', 'a') as output_file:
        page_number = 0
        for page in extracted:
            page_number += 1

            if page_number <= 303:
                print("Extracting page " + str(page_number))
                info = ""
                for element in page:
                    raw_text = get_raw_text_from_LTComponent(element)

                    # Filter the Reflection and Discussions page
                    if 'Reflect\\tand\\tDiscuss\\n' in raw_text:
                        break

                    refined_text = get_refined_text(raw_text)
                    info += refined_text

                # if the page is not filtered or empty append the output file
                if info != "":
                    json_line = {
                        "Page": page_number,
                        "Info": info
                    }

                    json.dump(json_line, output_file)
                    output_file.write("\n")
            else:
                break
