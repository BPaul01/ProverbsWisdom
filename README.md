# Proverbs Wisdom

###### Chat-bot-ul capabil să răspundă la întrebări pe cartea Proverbe.

### Cum se folosește?

- Aplicația funcționează cu ajutorul interfeței web, similar cu orice aplicație de mesagerie.

- Pachetele necesare pentru funcționarea aplicației sunt specificate în fișierul **`requirements.txt`** a fiecărui folder al proiectelor iar versiunile python folosite pentru dezvoltarea acesteia sunt **`python 3.12.3`** pentru colectare procesare și analiză de date și **`python 3.12.4`** pentru aplicația propriu zisă.

- Ca soluție de bază de date am folosit posgreSQL. Schema bazei de date este disponibilă în fișierul **`databaseSchema.sql`**.

## Conținutul repertoriului:
- **`GetTrainingData:`** Acest proiect a avut scopul de a genera, procesa și analiza majoritatea datelor folosite ca și date de antrenament pentru modelele de inteligență artificială calibrate dar și pentru testarea iterativă a prompt-urilor folosite.

- **`InfoExtractFromPDF:`** Acest proiect a avut scopul de a extrage informațiile preliminare din materialele pdf. Include și procesări preliminare asupra datelor, exemple de utilizare a două librării și script-uri de extragere și conversie în jsonl a cărții Proverbe din fișiere cu altă extensie.

- **`Website:`** Acest folder găzduiește proiectul aplicației finale dezvoltată cu ajutorul librăriei Flask pentru python. Include de asemenea și script-ul pentru crearea bazei de date. Subfolderele `templates` și `static` găzduiesc paginile html respectiv script-urile în format Javascript și foile de stiluri pentru paginile web după șablonul Flask. 