import PyPDF2

def extract_text_from_pdf(pdf_file: str) -> [str]:
    with open(pdf_file, 'rb') as pdf_file:
        reader = PyPDF2.PdfReader(pdf_file, strict=False)

        pdf_text = []

        for page in reader.pages:
            content = page.extract_text()
            pdf_text.append(content)

        return pdf_text

if __name__ == '__main__':
    extracted = extract_text_from_pdf('../pdfs/sample.pdf')

    for text in extracted:
        print(text)