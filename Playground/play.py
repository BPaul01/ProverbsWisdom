from llama import BasicModelRunner

non_finetuned_model = BasicModelRunner("meta-llama/Llama-2-7b-hf")
finetuned_model = BasicModelRunner("meta-llama/Llama-2-7b-chat-hf")

non_finetuned_output = non_finetuned_model("What do you think of Mars?")
finetuned_output = finetuned_model("What do you think of Mars?")

print(f"Not finetuned model's answer:\n{non_finetuned_output}\n\n")
print(f"Finetuned model's answer:\n{finetuned_output}\n\n")