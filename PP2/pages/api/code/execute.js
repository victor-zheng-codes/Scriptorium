import { exec as execCallback } from "child_process";
import util from "util";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from 'path';

// const allowedLanguages = ["python", "javascript", "java", "c", "cpp"];
const TIMEOUT = 10; // 10 seconds
const MEMORY_LIMIT = 512; // 512 MB

// Code to promisify exec generated by ChatGPT
const exec = util.promisify(execCallback);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed`, output: ""  });
    }
    // check pre requisites before executing
    let { code, language, input = "" } = req.body;
    if (!language ) {
        return res.status(404).json({ error: "Missing language required param", output: "" });
    }
    else if (!code ) {
        return res.status(404).json({ error: "Missing code required param", output: ""  });
    }
    else if (typeof code !== "string" || typeof language !== "string" || typeof input !== "string") {
        return res.status(400).json({ error: "code, language, and input must be strings", output: ""  });
    }

    // we do this below now
    // } else if (!allowedLanguages.includes(language.toLowerCase())) {
    //     return res.status(400).json({ error: "Invalid language. Accepted languages: python, javascript, java, c, cpp", output: ""   });
    // }

    const dockerImages = {
        python: "python:3.10",
        javascript: "node:20",
        java: "openjdk:20",
        cpp: "gcc:12",
        c: "gcc:12",
        ruby: "ruby:3.3",
        php: "php:8.2-cli",
        perl: "perl:5.36",
        lua: "lua",
        rust:"rust:1.73",
    };

    const image = dockerImages[language];
    if (!image) return res.status(404).json({
            error: "Unsupported language",
            output: "",
    });


    if (!input.endsWith("\n")) {
        input = input + "\n"; // Add newline to the end of standard input if no newline present
    }

    let runCommand, compileCommand;
    // code = code.replace(/"/g, '\\"'); // Escape double quotes to prevent syntax errors when running
    // input = input.replace(/"/g, '\\"');
    // code = code.replace(/`/g, '\\`').replace(/\$/g, '\\$');

    
    // Create directory with unique ID
    const uniqueId = uuidv4();
    const dirPath = path.join(process.cwd(), 'tmp', uniqueId);
    fs.mkdirSync(dirPath, { recursive: true });

    let codeFilePath;
    const inputFilePath = path.join(dirPath, 'input.txt');
    

    // instructions for running
    // let instructions = '';

    // Switch statement and execution logic generated by ChatGPT, with some modification
    switch (language.toLowerCase()) {
        case "python":
            const pythonFilePath = "main.py";
            codeFilePath = path.join(dirPath, pythonFilePath);

            runCommand = `python3 ${pythonFilePath}`;
            break;

        case "javascript":
            const jsFilePath = "main.js";
            codeFilePath = path.join(dirPath, jsFilePath);

            runCommand = `node "${jsFilePath}"`;
            break;

        case "java":
            const classNameMatch = code.match(/public\s+class\s+(\w+)/); // Get first public class name
            const javaFilePath = classNameMatch ? classNameMatch[1] : 'Main';
            codeFilePath = path.join(dirPath, `${javaFilePath}.java`);

            runCommand = `javac ${javaFilePath}.java && java ${javaFilePath}`;
            break;
            
        case "c":
            const cFilePath = `main.c`;
            const cExecutablePath = `main`;

            codeFilePath = path.join(dirPath, `${cFilePath}`);

            runCommand = `gcc -Wall main.c -o main && ./${cExecutablePath}`;
            break;
            
        case "cpp":
            const cppFilePath = `main.cpp`;
            const cppExecutablePath = `main`;

            codeFilePath = path.join(dirPath, `${cppFilePath}`);

            runCommand = `g++ -Wall main.cpp -o main && ./${cppExecutablePath}`;
            break;

        case "lua":
            const luaFilePath = "main.lua";

            codeFilePath = path.join(dirPath, luaFilePath);

            runCommand = `lua ${luaFilePath}`;
            break;

        case "perl":
            const perlFilePath = `main.pl`;

            codeFilePath = path.join(dirPath, perlFilePath);
            
            runCommand = `perl ${perlFilePath}`;
            break; 

        case "php":
            const phpFilePath = `main.php`;

            codeFilePath = path.join(dirPath, phpFilePath);

            runCommand = `php ${phpFilePath}`;
            break;

        case "ruby":
            const rubyFilePath = `main.rb`;

            codeFilePath = path.join(dirPath, rubyFilePath);

            runCommand = `ruby ${rubyFilePath}`;
            break;

        case "rust":
            const rustFilePath = `main.rs`;
            const rustExecutablePath = `main`;

            codeFilePath = path.join(dirPath, rustFilePath);

            runCommand = `rustc ${rustFilePath} -o main && ./${rustExecutablePath}`;
            break;

        default: 
            return res.status(400).json({
                output: "",
                error: "Unsupported language"
            })
    }
    
    fs.writeFileSync(codeFilePath, code);
    fs.writeFileSync(inputFilePath, input);
    
    // Redirect stdin to file containing given user input, and stderr to stdout so both can be returned to user
    runCommand += " < input.txt 2>&1"
    const runCommandWithShell = `bash -c "timeout ${TIMEOUT}s ${runCommand}"`

    // current directory
    const command = `docker run --rm -v ${dirPath}:/app -w /app --memory="${MEMORY_LIMIT}m" ${image} ${runCommandWithShell}`;

    console.log("running: " + command)
    
    try {
        const { stdout, stderr } = await exec(command);

        return res.status(201).json({
            error: stderr,
            output: stdout,
        });
    } catch (error) {
        console.log("Error message " + error)

        if (error.code === 124) { // Timed out
            return res.status(200).json({
                error: 'Execution timed out (limit exceeded)',
                output: error.stdout || '',
            });
        }


        if (error.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER') { // Memory limit exceeded
            return res.status(200).json({
                error: "Output buffer length exceeded",
                output: "",
            });
        }

        if (error.code === 137) { // Memory limit exceeded
            return res.status(200).json({
                error: "Memory limit exceeded",
                output: "",
            });
        }

        
        return res.status(200).json({
            error: error.stderr,
            output: error.stdout || "",
        });
    } finally {
        fs.rmSync(dirPath, { recursive: true, force: true });
    }
}
