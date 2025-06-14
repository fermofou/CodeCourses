import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { csharp } from "@replit/codemirror-lang-csharp";
import { cpp } from "@codemirror/lang-cpp";
import { LanguageOption } from "../types";

export const languageOptions: LanguageOption[] = [
  { value: "javascript", label: "JavaScript", extension: javascript },
  { value: "python", label: "Python", extension: python },
  { value: "cpp", label: "C++", extension: cpp },
  { value: "csharp", label: "C#", extension: csharp },
];

export const startingCodeTemplates = {
  javascript: `// Write your solution here
function solution(input) {
  // Your code here
  
  return result;
}`,
  python: `# Write your solution here
def solution(input):
    # Your code here
    
    return result`,
  cpp: `// Write your solution here
#include <iostream>
using namespace std;
int main(){
  std::cout << "Hello, World!" << std::endl;
  return 0;
}

  `,
  csharp: `using System;

class Program
{
    static string Solution(string input)
    {
        // Your code here
        string result = input.ToUpper(); // Example modification
        return result;
    }

    static void Main()
    {
        Console.WriteLine(Solution("Hello"));
    }
}
`,
}; 