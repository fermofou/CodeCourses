import { ArrowRight, Trophy, Gift, User, Brain, Target, Sparkles, Crown, Menu, Coins } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"

import { Button } from "@/components/ui/custom-button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center space-x-2 text-black transition-colors hover:text-primary">
            <div className="flex items-center justify-center w-8 h-8 border border-black rounded-md">
              <div className="flex items-center">
                <span className="text-[#6D6C71] text-lg font-bold leading-none">T</span>
                <span className="text-[#ED2831] text-lg font-bold leading-none">M</span>
              </div>
            </div>
            <span className="text-xl font-bold">TechCraft</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link to="#challenges" className="text-black transition-colors hover:text-primary">
              Retos de Programación
            </Link>
            <Link to="#leaderboard" className="text-black transition-colors hover:text-primary">
              Tabla de Posiciones
            </Link>
            <Link to="#rewards" className="text-black transition-colors hover:text-primary">
              Recompensas
            </Link>
          </nav>

          {/* Updated Auth Section */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')} 
                className="hidden sm:inline-flex"
              >
                Iniciar Sesión
              </Button>
              <Button 
                onClick={() => navigate('/register')} 
                className="hidden sm:inline-flex"
              >
                Registrarse
              </Button>
            </SignedOut>
            
            <SignedIn>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-4">
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
            
            {/* Mobile Menu Button */}
            <Button 
              ref={buttonRef}
              variant="outline" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Updated Mobile Menu */}
        {isMobileMenuOpen && (
          <div ref={menuRef} className="md:hidden border-t">
            <div className="container flex flex-col space-y-4 py-4 px-4">
              <SignedIn>
                <div className="flex items-center justify-between p-2 mb-2 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Coins className="h-5 w-5 text-primary" />
                    <span className="font-medium">2,500 MC</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="font-medium">Nivel 12</span>
                  </div>
                </div>
              </SignedIn>
              
              <Link 
                to="#challenges" 
                className="text-black px-2 py-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Retos de Programación
              </Link>
              <Link 
                to="#leaderboard" 
                className="text-black px-2 py-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tabla de Posiciones
              </Link>
              <Link 
                to="#rewards" 
                className="text-black px-2 py-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Recompensas
              </Link>
              <Link 
                to="#profile" 
                className="text-black px-2 py-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mi Perfil
              </Link>

              <SignedOut>
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <Button variant="outline" onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}>
                    Iniciar Sesión
                  </Button>
                  <Button onClick={() => {
                    navigate('/register');
                    setIsMobileMenuOpen(false);
                  }}>
                    Registrarse
                  </Button>
                </div>
              </SignedOut>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          </div>

          <div className="container relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-24">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    Desarrolla tu talento,{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                      crece con nosotros
                    </span>
                  </h1>
                  <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    Tu plataforma exclusiva como Mahindra para mejorar tus habilidades de programación, 
                    participar en desafíos técnicos y obtener reconocimiento dentro de la empresa.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="gap-2" onClick={() => navigate('/login')}>
                    Comenzar Ahora <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Ver Retos
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8">
                  <div className="space-y-2">
                    <h4 className="text-4xl font-bold text-primary">50+</h4>
                    <p className="text-sm text-muted-foreground">Desafíos Internos</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-4xl font-bold text-primary">300+</h4>
                    <p className="text-sm text-muted-foreground">Mahindras Activos</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-4xl font-bold text-primary">5k</h4>
                    <p className="text-sm text-muted-foreground">MCoins Ganados</p>
                  </div>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-3xl" />
                <div className="relative bg-card rounded-2xl border p-6 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">Desafío Destacado</h3>
                        <p className="text-sm text-muted-foreground">Algoritmos y Estructuras</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                          <Coins className="h-3 w-3 inline mr-1" />
                          500 MC
                        </span>
                        <Button variant="outline" size="sm">
                          Resolver
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg bg-black/95 p-4 font-mono text-sm text-green-400 space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-muted pb-2">
                        <span>Inversión de Cadenas</span>
                        <div className="flex gap-2">
                          <span className="text-primary">Tiempo: 1s</span>
                          <span>Memoria: 128MB</span>
                        </div>
                      </div>
                      <pre className="space-y-2 overflow-x-auto">
                        <code>{`Problema:
Implementa una función que invierta una cadena de texto
sin utilizar métodos incorporados de inversión.

Input:
Una cadena S (1 ≤ |S| ≤ 100) conteniendo letras y números.

Output:
La cadena S invertida.

Ejemplo Input:
"TechMahindra2024"

Ejemplo Output:
"4202ardnihaMhceT"`}</code>
                      </pre>
                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-muted pt-2">
                        <span>Dificultad: Fácil</span>
                        <span>Tasa de éxito: 85%</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-primary" />
                          <span className="font-medium">500 MCoins</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>•</span>
                          <span>Intentos: 156</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-1">
                          <span className="text-muted-foreground">Complejidad esperada</span>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full w-[30%] bg-green-500 rounded-full" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">Nivel de optimización</span>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full w-[40%] bg-yellow-500 rounded-full" />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="bg-muted px-2 py-1 rounded-full text-xs">Strings</span>
                        <span className="bg-muted px-2 py-1 rounded-full text-xs">Arrays</span>
                        <span className="bg-muted px-2 py-1 rounded-full text-xs">Básico</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-muted/50 py-24">
          <div className="container space-y-12">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
              Beneficios para Mahindras
            </h2>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6 space-y-2">
                  <Brain className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Retos Técnicos</h3>
                  <p className="text-sm text-muted-foreground">
                    Desafíos diseñados por nuestros expertos, alineados con los proyectos y tecnologías de Tech Mahindra.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-2">
                  <Target className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Desarrollo Profesional</h3>
                  <p className="text-sm text-muted-foreground">
                    Gana MCoins y experiencia que se reflejarán en tu evaluación de desempeño y oportunidades de crecimiento.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-2">
                  <Gift className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Reconocimientos</h3>
                  <p className="text-sm text-muted-foreground">
                    Canjea tus MCoins por beneficios exclusivos como días libres, cursos premium y merchandising de la empresa.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="leaderboard" className="py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Top Mahindras</h2>
              <p className="text-xl text-muted-foreground max-w-[42rem] mx-auto">
                Los desarrolladores más destacados de esta semana en nuestra empresa.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  {[1, 2, 3, 4, 5].map((position) => (
                    <div 
                      key={position} 
                      className={`flex items-center justify-between py-4 px-4 border-b last:border-0 ${
                        position === 1 ? 'bg-primary/5 rounded-lg' : ''
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`text-2xl font-bold ${
                          "text-muted-foreground"
                        }`}>
                          {position === 1 && <Crown className="h-7 w-7 inline mr-2 text-primary" />}
                          {position}°
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            position === 1 ? "bg-zinc-200" :
                            "bg-muted"
                          }`}>
                            <User className={`h-6 w-6 ${

                              "text-muted-foreground"
                            }`} />
                          </div>
                          <div className="space-y-1">
                            <span className="font-semibold">Developer_{position}</span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Nivel {Math.floor(Math.random() * 10) + 20}</span>
                              <span>•</span>
                              <span>{Math.floor(Math.random() * 50)} desafíos</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{6000 - position * 1000} XP</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Coins className="h-4 w-4" />
                          <span className="font-medium">{1000 - position * 100} MC</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="coming-soon" className="bg-muted/50 py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <span className="text-primary text-sm font-medium">Próximamente</span>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Nuevas Funcionalidades</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 flex gap-4">
                  <Brain className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Tech Mahindra Trivia</h3>
                    <p className="text-sm text-muted-foreground">
                      Demuestra tu conocimiento sobre nuestras tecnologías y procesos internos.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex gap-4">
                  <Sparkles className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Torneos por Área</h3>
                    <p className="text-sm text-muted-foreground">
                      Compite con otros Mahindras de tu departamento en desafíos especializados.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 Tech Mahindra. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-4">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
              Términos
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacidad
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

