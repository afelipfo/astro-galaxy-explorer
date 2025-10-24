import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Shuffle } from "lucide-react";

const words = ["JUPITER", "MARTE", "VENUS", "TIERRA", "LUNA", "SOL", "ESTRELLA", "GALAXIA"];

const generateGrid = () => {
  const size = 12;
  const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(""));
  
  // Colocar palabras
  words.forEach((word) => {
    let placed = false;
    while (!placed) {
      const direction = Math.floor(Math.random() * 3); // 0: horizontal, 1: vertical, 2: diagonal
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      
      if (canPlaceWord(grid, word, row, col, direction, size)) {
        placeWord(grid, word, row, col, direction);
        placed = true;
      }
    }
  });
  
  // Rellenar espacios vacíos
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!grid[i][j]) {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }
  
  return grid;
};

const canPlaceWord = (grid: string[][], word: string, row: number, col: number, direction: number, size: number) => {
  if (direction === 0) { // horizontal
    if (col + word.length > size) return false;
    for (let i = 0; i < word.length; i++) {
      if (grid[row][col + i] && grid[row][col + i] !== word[i]) return false;
    }
  } else if (direction === 1) { // vertical
    if (row + word.length > size) return false;
    for (let i = 0; i < word.length; i++) {
      if (grid[row + i][col] && grid[row + i][col] !== word[i]) return false;
    }
  } else { // diagonal
    if (row + word.length > size || col + word.length > size) return false;
    for (let i = 0; i < word.length; i++) {
      if (grid[row + i][col + i] && grid[row + i][col + i] !== word[i]) return false;
    }
  }
  return true;
};

const placeWord = (grid: string[][], word: string, row: number, col: number, direction: number) => {
  for (let i = 0; i < word.length; i++) {
    if (direction === 0) {
      grid[row][col + i] = word[i];
    } else if (direction === 1) {
      grid[row + i][col] = word[i];
    } else {
      grid[row + i][col + i] = word[i];
    }
  }
};

export default function WordSearchGame() {
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);

  const saveProgressMutation = trpc.games.saveProgress.useMutation({
    onSuccess: () => {
      toast.success("¡Progreso guardado!");
    },
  });

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setGrid(generateGrid());
    setFoundWords([]);
    setSelectedCells([]);
  };

  const handleCellClick = (row: number, col: number) => {
    const cellId = `${row}-${col}`;
    if (selectedCells.includes(cellId)) {
      setSelectedCells(selectedCells.filter(id => id !== cellId));
    } else {
      setSelectedCells([...selectedCells, cellId]);
    }
  };

  const checkWord = () => {
    const selectedLetters = selectedCells
      .map(id => {
        const [row, col] = id.split("-").map(Number);
        return grid[row][col];
      })
      .join("");

    const foundWord = words.find(word => 
      word === selectedLetters || word === selectedLetters.split("").reverse().join("")
    );

    if (foundWord && !foundWords.includes(foundWord)) {
      setFoundWords([...foundWords, foundWord]);
      toast.success(`¡Encontraste: ${foundWord}!`);
      setSelectedCells([]);

      if (foundWords.length + 1 === words.length) {
        saveProgressMutation.mutate({
          gameType: "wordsearch",
          score: foundWords.length.toString(),
        });
        toast.success("¡Completaste la sopa de letras!");
      }
    } else {
      setSelectedCells([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-slate-900 border-blue-900">
        <CardHeader>
          <CardTitle className="text-blue-400 text-center">Sopa de Letras Astronómica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              {words.map((word) => (
                <Badge
                  key={word}
                  variant={foundWords.includes(word) ? "default" : "outline"}
                  className={foundWords.includes(word) ? "bg-green-600" : "border-blue-500 text-blue-400"}
                >
                  {word}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={checkWord} disabled={selectedCells.length === 0} className="bg-green-600 hover:bg-green-700">
                Verificar
              </Button>
              <Button onClick={resetGame} variant="outline" className="border-blue-500 text-blue-400">
                <Shuffle className="mr-2 h-4 w-4" />
                Nueva Partida
              </Button>
            </div>
          </div>

          <div className="grid gap-1 justify-center" style={{ gridTemplateColumns: `repeat(12, minmax(0, 1fr))` }}>
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const cellId = `${rowIndex}-${colIndex}`;
                const isSelected = selectedCells.includes(cellId);
                return (
                  <button
                    key={cellId}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`w-8 h-8 flex items-center justify-center text-xs font-bold border transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-400"
                        : "bg-slate-800 text-gray-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {cell}
                  </button>
                );
              })
            )}
          </div>

          <p className="text-center text-gray-400 text-sm">
            Selecciona las letras para formar las palabras y haz clic en "Verificar"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

