import { useState } from 'react'
import { Link } from 'react-router-dom'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Clock, Brain, PlayCircle, CheckCircle2, XCircle, Coins, Code } from "lucide-react"
import { SignedIn, UserButton } from "@clerk/clerk-react"
import { Container, Section, Bar } from '@column-resizer/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const sampleChallenge = {
  title: "Inversión de Cadenas",
  difficulty: "Fácil",
  timeLimit: "1s",
  memoryLimit: "128MB",
  description: `Implementa una función que invierta una cadena de texto sin utilizar métodos incorporados de inversión.

Entrada:
Una cadena S (1 ≤ |S| ≤ 100) conteniendo letras y números.

Salida:
La cadena S invertida.

Ejemplo de Entrada:
"TechMahindra2024"

Ejemplo de Salida:
"4202ardnihaMhceT"`,
  startingCode: `function reverseString(str) {
  // Tu código aquí
  
}`,
  testCases: [
    { input: '"TechMahindra2024"', expectedOutput: '"4202ardnihaMhceT"' },
    { input: '"Hello123"', expectedOutput: '"321olleH"' },
  ]
}

// Add language options
const languageOptions = [
  { value: 'javascript', label: 'JavaScript', extension: javascript },
  { value: 'python', label: 'Python', extension: python },
  { value: 'java', label: 'Java', extension: java },
  { value: 'cpp', label: 'C++', extension: cpp },
]

const startingCodeTemplates = {
  javascript: `function reverseString(str) {
  // Tu código aquí
  
}`,
  python: `def reverse_string(s):
    # Tu código aquí
    pass`,
  java: `public class Solution {
    public String reverseString(String str) {
        // Tu código aquí
        return "";
    }
}`,
  cpp: `string reverseString(string str) {
    // Tu código aquí
    return "";
}`
}

export default function ChallengePage() {
  const [code, setCode] = useState(startingCodeTemplates.javascript)
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0])
  const [results, setResults] = useState<{success: boolean, message: string} | null>(null)

  const handleRunCode = () => {
    // Mock test execution
    try {
      const fn = new Function(`
        ${code}
        return reverseString("TechMahindra2024");
      `)
      const result = fn()
      
      if (result === "4202ardnihaMhceT") {
        setResults({ success: true, message: "¡Prueba superada! La función funciona correctamente." })
      } else {
        setResults({ success: false, message: "El resultado no coincide con la salida esperada." })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setResults({ success: false, message: `Error: ${errorMessage}` })
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {/* Logo section */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 border border-black rounded-md">
                <div className="flex items-center">
                  <span className="text-[#6D6C71] text-lg font-bold leading-none">T</span>
                  <span className="text-[#ED2831] text-lg font-bold leading-none">M</span>
                </div>
              </div>
            </Link>
            <div className="h-4 w-px bg-border" />
            <Button 
              variant="ghost" 
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link to="/challenges">Problem Set</Link>
            </Button>
          </div>

          {/* Center Buttons */}
          <div className="flex-1 flex justify-center">
            <div className="isolate flex -space-x-px">
              <Button 
                variant="outline" 
                className="rounded-r-none focus:z-10 focus:outline-none focus-visible:outline-none focus-visible:ring-0 hover:outline-none hover:ring-0 hover:border-input"
                onClick={handleRunCode}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Run Code
              </Button>
              <Button 
                className="rounded-l-none focus:z-10 focus:outline-none focus-visible:outline-none focus-visible:ring-0 hover:outline-none hover:ring-0 bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
                onClick={() => {/* Handle submission */}}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Submit
              </Button>
            </div>
          </div>

          {/* User Section */}
          <SignedIn>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">2,500 MC</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Nivel 12</span>
                </div>
              </div>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full ring-2 ring-primary/10 hover:ring-primary/30 transition-all",
                    userButtonTrigger: "ring-0 outline-0"
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>
      </header>

      {/* Main Content */}
      <Container 
        style={{ 
          width: '100%',
          height: 'calc(100vh - 56px)', // 56px is the header height (h-14)
          display: 'flex',
          minHeight: 0 // This is important for Firefox
        }}
      >
        <Section 
          minSize={400}
          defaultSize={50}
          style={{ minHeight: 0 }} // This is important for Firefox
          className="overflow-hidden"
        >
          <div className="h-full py-2 pl-2">
            {/* Wrapped the content in a Card */}
            <Card className="h-full flex flex-col border-2">
              <div className="bg-muted/50 p-4 border-b">
                <h2 className="font-semibold flex items-center gap-1.5 text-sm">
                  <Brain className="h-3.5 w-3.5" />
                  Descripción del Reto
                </h2>
              </div>
              
              <div className="p-6 overflow-y-auto">
                {/* Challenge Description */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold">{sampleChallenge.title}</h1>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="inline-flex items-center gap-1 text-sm">
                        <Brain className="h-4 w-4" />
                        {sampleChallenge.difficulty}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4" />
                        {sampleChallenge.timeLimit}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm">
                        <Trophy className="h-4 w-4 text-primary" />
                        500 MC
                      </span>
                    </div>
                  </div>

                  <Card className="p-6">
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap text-sm">
                        {sampleChallenge.description}
                      </pre>
                    </div>
                  </Card>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Casos de Prueba</h3>
                    <div className="grid gap-4">
                      {sampleChallenge.testCases.map((testCase, index) => (
                        <Card key={index} className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Entrada:</p>
                              <pre className="mt-1 text-sm">{testCase.input}</pre>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Salida Esperada:</p>
                              <pre className="mt-1 text-sm">{testCase.expectedOutput}</pre>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        <Bar 
          size={4} 
          className="bg-transparent hover:bg-primary/50 transition-colors"
          style={{ cursor: 'col-resize' }} 
        />

        <Section 
          minSize={400}
          defaultSize={50}
          style={{ minHeight: 0 }}
          className="overflow-hidden"
        >
          <div className="h-full py-2 pr-2">
            <Card className="h-full flex flex-col border-2 overflow-hidden">
              <div className="bg-muted/50 p-4 border-b">
                <h2 className="font-semibold flex items-center gap-1.5 text-sm">
                  <Code className="h-3.5 w-3.5" />
                  Código
                </h2>
              </div>
              
              <div className="border-b bg-background p-4">
                <div className="flex justify-between items-center">
                  <Select
                    value={selectedLanguage.value}
                    onValueChange={(value) => {
                      const language = languageOptions.find(l => l.value === value)
                      if (language) {
                        setSelectedLanguage(language)
                        setCode(startingCodeTemplates[value as keyof typeof startingCodeTemplates])
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border">
                      {languageOptions.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCode(startingCodeTemplates[selectedLanguage.value as keyof typeof startingCodeTemplates])}
                    size="sm"
                  >
                    Reiniciar código
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-h-0 relative overflow-hidden">
                <CodeMirror
                  value={code}
                  height="100%"
                  theme={vscodeDark}
                  extensions={[selectedLanguage.extension({ jsx: true })]}
                  onChange={(value) => setCode(value)}
                  className="text-sm absolute inset-0 overflow-hidden"
                />
              </div>
            </Card>

            {results && (
              <Card className={`p-4 mt-4 ${results.success ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex items-center gap-2">
                  {results.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <p className="text-sm">{results.message}</p>
                </div>
              </Card>
            )}
          </div>
        </Section>
      </Container>
    </div>
  )
} 