import os

def load_training_files(directory: str) -> str:
 
    contents = []
    for filename in os.listdir(directory):
        if filename.endswith(".txt"):
            filepath = os.path.join(directory, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                contents.append(f.read())

    return "\n\n".join(contents)
