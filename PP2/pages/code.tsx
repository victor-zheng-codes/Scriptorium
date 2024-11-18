import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Layout from "@/components/ui/layout";

const Code = () => {
  const [code, setCode] = useState<string>(""); // State to hold code from the textarea
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python"); // State to hold selected language
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading status
  const [output, setOutput] = useState<string>(""); // State to hold code execution output
  const [standardInput, setStandardInput] = useState<string>(""); // State to hold standard input

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault(); // Prevent default tab behavior
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert tab at the cursor
      textarea.value =
        textarea.value.substring(0, start) +
        "\t" +
        textarea.value.substring(end);

      // Move the cursor to the right of the inserted spaces
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value); // Update selected language
  };

  const handleRunButtonClick = async () => {
    setIsLoading(true);
    try {
      // Make a POST request to the backend
      const response = await fetch("/api/code/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: selectedLanguage,
          code: code,
          input: standardInput,
        }),
      });

      // Handle the response from the backend
      const result = await response.json();
      setOutput(result.output + result.error); // Set the output in the second textarea
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Reset loading state after request is done
    }
  };

  // Function to clear the output textarea
  const handleClearOutput = () => {
    setOutput(""); // Reset output to an empty string
  };

  return (
    <Layout>
      <div className="m-4 flex items-center space-x-2 text-gray-900 dark:text-gray-300 pl-8 pt-4 font-bold text-lg my-0">
        Code Execution
      </div>
      <div className="m-4 flex flex-col md:flex-row items-center space-x-2 text-gray-800 dark:text-gray-300 md:pl-8 pt-2 my-0 pb-2">
        <Label htmlFor="language-select" className="block text-md font-medium ">
          Programming Language:
        </Label>
        <select
          id="language-select"
          value={selectedLanguage} // Bind selectedLanguage state to select value
          onChange={handleLanguageChange} // Update selectedLanguage state on change
          className="p-2 w-48 bg-gray-100 dark:bg-gray-950 border border-gray-500 rounded-md text-lg"
        >
          <option value="python">Python3</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="csharp">C#</option>
          <option value="go">Golang</option>
          <option value="ruby">Ruby</option>
          <option value="perl">Perl</option>
          <option value="php">PHP</option>
          <option value="rust">Rust</option>
        </select>
        
        <div className="pt-2 md:pt-0">
          <span className="pr-1 pl-1">
          <Button
            onClick={handleRunButtonClick} // Call the function to execute the code
            disabled={isLoading} // Disable button while loading
            className={`text-sm py-1 px-4`}
          >
            {isLoading ? "Running..." : "Run"}
          </Button>
          </span>
          <span className="pr-1 pl-1">
          <Button onClick={handleClearOutput} className={`text-sm py-1 px-4 pr-4 pl-4`}>
            Clear Output
          </Button>
          </span>
        </div>
      </div>

      <div className="flex gap-1 text-gray-600 dark:text-gray-300 pr-8 pl-8">
        {/* Code textarea */}
        <textarea
          id="code-editor"
          className="w-1/2 h-[38rem] p-4 font-mono text-lg leading-6 bg-gray-100 dark:bg-gray-925 border border-gray-500 rounded-md resize-none placeholder-gray-400"
          value={code} // Bind code state to textarea value
          onChange={(e) => setCode(e.target.value)} // Update code state on change
          onKeyDown={handleKeyDown}
          placeholder="Write your code here"
        />

        <div className="flex flex-col w-1/2 gap-1">
          {/* Output textarea */}
          <textarea
            id="output-editor"
            className="w-full h-[24.75rem] p-4 font-mono text-lg leading-6 bg-gray-100 dark:bg-gray-925 border border-gray-500 rounded-md resize-none placeholder-gray-400"
            value={output}
            readOnly
            disabled
            placeholder="Program output"
          />

          {/* Standard input textarea */}
          <textarea
            id="input-editor"
            className="w-full h-[13rem] p-4 font-mono text-lg leading-6 bg-gray-100 dark:bg-gray-925 border border-gray-500 rounded-md resize-none placeholder-gray-400"
            value={standardInput}
            onChange={(e) => setStandardInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Standard input"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Code;