import { useState } from 'react'
import { Link } from 'react-router-dom'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Clock, Brain, PlayCircle, CheckCircle2, XCircle, Coins } from "lucide-react"
import { SignedIn, UserButton } from "@clerk/clerk-react"

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

export default function ChallengePage() {
  const [code, setCode] = useState(sampleChallenge.startingCode)
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
    } catch (error) {
      setResults({ success: false, message: `Error: ${error.message}` })
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
      <div className="container py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          {/* Code Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Tu Solución</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setCode(sampleChallenge.startingCode)}
                  className="focus:z-10 focus:outline-none focus-visible:outline-none focus-visible:ring-0 hover:outline-none hover:ring-0 hover:border-input"
                >
                  Reiniciar
                </Button>
                <Button 
                  onClick={handleRunCode} 
                  className="gap-2 focus:z-10 focus:outline-none focus-visible:outline-none focus-visible:ring-0 hover:outline-none hover:ring-0 hover:border-transparent"
                >
                  <PlayCircle className="h-4 w-4" />
                  Ejecutar
                </Button>
              </div>
            </div>

            <Card className="border-2">
              <CodeMirror
                value={code}
                height="500px"
                theme={vscodeDark}
                extensions={[javascript({ jsx: true })]}
                onChange={(value) => setCode(value)}
                className="text-sm"
              />
            </Card>

            {results && (
              <Card className={`p-4 ${results.success ? 'border-green-500' : 'border-red-500'}`}>
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
        </div>
      </div>
    </div>
  )
} 