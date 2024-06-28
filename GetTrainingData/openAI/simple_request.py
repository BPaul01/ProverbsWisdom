from openai import OpenAI

client = OpenAI()

completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
    {"role": "system", "content": "You are a helpful assistant giving biblically accurate answers în romanian relying as much as possible to the book of Proverbs."},
    {"role": "user", "content": "Care a fost scopul lui Solomon?"}
    ]
)

print(completion.choices[0].message.content)