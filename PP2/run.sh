# Script generated by ChatGPT
#!/bin/bash

# Start the server in production mode (for PP1)
# npm run build   # Build the application
# npm run start   # Start the production server

# using docker for PP2
docker build -t scriptorium .
docker run  --name scriptorium -p 3000:3000 scriptorium 