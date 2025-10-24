import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Home, Puzzle, Search, Brain } from "lucide-react";
import { useState } from "react";
import PuzzleGame from "@/components/games/PuzzleGame";
import WordSearchGame from "@/components/games/WordSearchGame";
import QuizGame from "@/components/games/QuizGame";

export default function Games() {
  const { isAuthenticated } = useAuth();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen milky-way-bg flex items-center justify-center">
        <Card className="max-w-md bg-slate-900 border-blue-900">
          <CardHeader>
            <CardTitle className="text-blue-400">Acceso Restringido</CardTitle>
            <CardDescription className="text-gray-300">
              Debes iniciar sesión para acceder a los juegos educativos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Volver al Inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedGame) {
    return (
      <div className="min-h-screen milky-way-bg">
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-blue-900/50 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-400">Juegos Educativos</h1>
            <Button
              variant="outline"
              onClick={() => setSelectedGame(null)}
              className="border-blue-500 text-blue-400"
            >
              Volver a Juegos
            </Button>
          </div>
        </nav>

        <div className="container mx-auto py-8">
          {selectedGame === "puzzle" && <PuzzleGame />}
          {selectedGame === "wordsearch" && <WordSearchGame />}
          {selectedGame === "quiz" && <QuizGame />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen milky-way-bg">
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-blue-900/50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-400">Juegos Educativos</h1>
          <Link href="/">
            <Button variant="outline" className="border-blue-500 text-blue-400">
              <Home className="mr-2 h-4 w-4" />
              Inicio
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="bg-slate-900 border-blue-900 hover:border-blue-500 transition-all cursor-pointer"
            onClick={() => setSelectedGame("puzzle")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Puzzle className="h-8 w-8 text-blue-400" />
                <CardTitle className="text-blue-400">Rompecabezas</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Arma imágenes de objetos celestes y aprende sobre ellos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Jugar
              </Button>
            </CardContent>
          </Card>

          <Card
            className="bg-slate-900 border-blue-900 hover:border-blue-500 transition-all cursor-pointer"
            onClick={() => setSelectedGame("wordsearch")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Search className="h-8 w-8 text-blue-400" />
                <CardTitle className="text-blue-400">Sopa de Letras</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Encuentra términos astronómicos ocultos en la cuadrícula
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Jugar
              </Button>
            </CardContent>
          </Card>

          <Card
            className="bg-slate-900 border-blue-900 hover:border-blue-500 transition-all cursor-pointer"
            onClick={() => setSelectedGame("quiz")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-blue-400" />
                <CardTitle className="text-blue-400">Cuestionario</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Pon a prueba tus conocimientos sobre astronomía
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Jugar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

