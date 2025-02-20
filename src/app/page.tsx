import { ArrowRight, Code2, Trophy, Gift, User, Brain, Target, Sparkles, Crown, Menu } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

import { Button } from "@/components/ui/button"
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
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TechCraft</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link to="#challenges" className="text-black transition-colors hover:text-primary">
              Coding Challenges
            </Link>
            <Link to="#leaderboard" className="text-black transition-colors hover:text-primary">
              Leaderboard
            </Link>
            <Link to="#rewards" className="text-black transition-colors hover:text-primary">
              Rewards
            </Link>
            <Link to="#profile" className="text-black transition-colors hover:text-primary">
              Mi Perfil
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/login')} className="hidden sm:inline-flex">
              Iniciar Sesión
            </Button>
            <Button onClick={() => navigate('/register')} className="hidden sm:inline-flex">
              Registrarse
            </Button>
            
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div ref={menuRef} className="md:hidden border-t">
            <div className="container flex flex-col space-y-4 py-4 px-4">
              <Link 
                to="#challenges" 
                className="text-black transition-colors hover:text-primary px-2 py-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Coding Challenges
              </Link>
              <Link 
                to="#leaderboard" 
                className="text-black transition-colors hover:text-primary px-2 py-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>
              <Link 
                to="#rewards" 
                className="text-black transition-colors hover:text-primary px-2 py-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Rewards
              </Link>
              <Link 
                to="#profile" 
                className="text-black transition-colors hover:text-primary px-2 py-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mi Perfil
              </Link>
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
                    Mejora tus habilidades,{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                      gana recompensas
                    </span>
                  </h1>
                  <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    La plataforma exclusiva para programadores de Tech Mahindra México donde los desafíos de código se
                    convierten en oportunidades de crecimiento y reconocimiento.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="gap-2" onClick={() => navigate('/login')}>
                    Comienza a Codificar <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Ver Desafíos
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8">
                  <div className="space-y-2">
                    <h4 className="text-4xl font-bold text-primary">100+</h4>
                    <p className="text-sm text-muted-foreground">Desafíos Activos</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-4xl font-bold text-primary">500+</h4>
                    <p className="text-sm text-muted-foreground">Desarrolladores</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-4xl font-bold text-primary">10k</h4>
                    <p className="text-sm text-muted-foreground">TechCoins Ganados</p>
                  </div>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-3xl" />
                <div className="relative bg-card rounded-2xl border p-6 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">Desafío Destacado</h3>
                        <p className="text-sm text-muted-foreground">Algoritmos Avanzados</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver Desafío
                      </Button>
                    </div>
                    <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">Difícil</span>
                          <span className="flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-primary" />
                            <span className="text-sm">500 TechCoins</span>
                          </span>
                        </div>
                        <h4 className="font-medium">Optimización de Microservicios</h4>
                        <div className="flex gap-2">
                          <span className="bg-muted px-2 py-1 rounded-full text-xs">Algoritmos</span>
                          <span className="bg-muted px-2 py-1 rounded-full text-xs">System Design</span>
                        </div>
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
              Características Principales
            </h2>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6 space-y-2">
                  <Brain className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Coding Challenges</h3>
                  <p className="text-sm text-muted-foreground">
                    Desafíos personalizados con temáticas de Tech Mahindra, evaluados por Judge0 y SonarQube.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-2">
                  <Target className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Sistema de XP</h3>
                  <p className="text-sm text-muted-foreground">
                    Gana experiencia y TechCoins resolviendo desafíos. ¡Sube de nivel y desbloquea recompensas!
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-2">
                  <Gift className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    Canjea tus TechCoins por premios exclusivos y reconocimientos dentro de Tech Mahindra.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="leaderboard" className="py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Top Developers</h2>
              <p className="text-xl text-muted-foreground max-w-[42rem] mx-auto">
                Los desarrolladores más destacados de esta semana en Tech Mahindra México.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  {[1, 2, 3, 4, 5].map((position) => (
                    <div key={position} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-lg font-bold ${position === 1 ? "text-primary" : "text-muted-foreground"}`}
                        >
                          {position === 1 && <Crown className="h-5 w-5 inline mr-1" />}#{position}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">Developer_{position}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{6000 - position * 1000} XP</span>
                        <span className="text-sm text-primary">{1000 - position * 100} TC</span>
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
                    <h3 className="font-bold">Tech Trivia</h3>
                    <p className="text-sm text-muted-foreground">
                      Pon a prueba tus conocimientos técnicos con preguntas de opción múltiple y gana TechCoins extra.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex gap-4">
                  <Sparkles className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Torneos en Vivo</h3>
                    <p className="text-sm text-muted-foreground">
                      Compite en tiempo real contra otros desarrolladores en desafíos especiales.
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
            © Imanol Coorporations. Algunos derechos reservados.
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

