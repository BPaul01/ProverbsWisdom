from pdfminer.high_level import extract_pages, extract_text

for page_layout in extract_pages('../pdfs/sample.pdf'):
    for element in page_layout:
        print(element)

text = extract_text('../pdfs/sample.pdf')
print(text)