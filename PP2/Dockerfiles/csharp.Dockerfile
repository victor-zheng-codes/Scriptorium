# Dockerfile for .NET SDK 8.0 (C#)
FROM mcr.microsoft.com/dotnet/sdk:8.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the user's C# project files into the container
COPY tmp .

# Restore, build, and run the application
RUN dotnet restore
RUN dotnet build

# Command to run the C# application (assuming it's a console app)
CMD ["dotnet", "run"]
