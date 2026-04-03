from cryptography.fernet import Fernet
import sys

# generate key (later we store this properly)
key = Fernet.generate_key()
cipher = Fernet(key)

file_path = sys.argv[1]

# read file
with open(file_path, "rb") as f:
    data = f.read()

# encrypt
encrypted = cipher.encrypt(data)

# save encrypted file
with open(file_path, "wb") as f:
    f.write(encrypted)

print("ENCRYPTED")
