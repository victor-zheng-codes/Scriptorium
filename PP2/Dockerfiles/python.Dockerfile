# Dockerfile for Python 3.10
FROM python:3.10

# Set the working directory inside the container
WORKDIR /usr/src/app/tmp

# Copy the user's code into the container
COPY . .

# Install any Python dependencies (optional)
# RUN pip install --no-cache-dir -r requirements.txt

# Command to run the Python file
CMD ["python3", "main.py", "<", "input.txt"]
