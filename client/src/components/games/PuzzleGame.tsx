import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Shuffle, Check } from "lucide-react";

const puzzleImages = [
  { id: "jupiter", name: "Júpiter", url: "/pWuIN38IdvQl.jpg" },
  { id: "saturn", name: "Saturno", url: "/O3XH9vcul4SR.jpg" },
  { id: "nebula", name: "Nebulosa", url: "/VLgMjrd54DRe.jpg" },
];

export default function PuzzleGame() {
  const [selectedImage, setSelectedImage] = useState(puzzleImages[0]);
  const [pieces, setPieces] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const saveProgressMutation = trpc.games.saveProgress.useMutation({
    onSuccess: () => {
      toast.success("¡Progreso guardado!");
    },
  });

  useEffect(() => {
    shufflePuzzle();
  }, [selectedImage]);

  const shufflePuzzle = () => {
    const newPieces = Array.from({ length: 9 }, (_, i) => i);
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
    }
    setPieces(newPieces);
    setMoves(0);
    setIsComplete(false);
  };

  const handlePieceClick = (index: number) => {
    const emptyIndex = pieces.indexOf(8);
    const validMoves = [
      emptyIndex - 1,
      emptyIndex + 1,
      emptyIndex - 3,
      emptyIndex + 3,
    ];

    if (validMoves.includes(index)) {
      const newPieces = [...pieces];
      [newPieces[index], newPieces[emptyIndex]] = [newPieces[emptyIndex], newPieces[index]];
      setPieces(newPieces);
      setMoves(moves + 1);

      const isWin = newPieces.every((piece, idx) => piece === idx);
      if (isWin) {
        setIsComplete(true);
        saveProgressMutation.mutate({
          gameType: "puzzle",
          celestialObject: selectedImage.name,
          score: moves.toString(),
        });
        toast.success(`¡Completado en ${moves + 1} movimientos!`);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-slate-900 border-blue-900">
        <CardHeader>
          <CardTitle className="text-blue-400 text-center">Rompecabezas Astronómico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <p>Movimientos: <span className="text-blue-400 font-bold">{moves}</span></p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={shufflePuzzle}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Shuffle className="mr-2 h-4 w-4" />
                Nueva Partida
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 max-w-md mx-auto aspect-square">
            {pieces.map((piece, index) => (
              <button
                key={index}
                onClick={() => handlePieceClick(index)}
                className={`relative overflow-hidden border-2 transition-all ${
                  piece === 8
                    ? "bg-slate-800 border-slate-700"
                    : "border-blue-900 hover:border-blue-500"
                }`}
                disabled={isComplete}
              >
                {piece !== 8 && (
                  <div
                    className="w-full h-full bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url(${selectedImage.url})`,
                      backgroundPosition: `${(piece % 3) * -100}% ${Math.floor(piece / 3) * -100}%`,
                      backgroundSize: "300%",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {isComplete && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg">
                <Check className="h-5 w-5" />
                <span>¡Rompecabezas completado!</span>
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-center flex-wrap">
            {puzzleImages.map((img) => (
              <Button
                key={img.id}
                onClick={() => setSelectedImage(img)}
                variant={selectedImage.id === img.id ? "default" : "outline"}
                className={selectedImage.id === img.id ? "bg-blue-600" : "border-blue-500 text-blue-400"}
              >
                {img.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

