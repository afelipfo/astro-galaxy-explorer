import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Check, X, RotateCcw } from "lucide-react";

const quizQuestions = [
  {
    question: "¿Cuál es el planeta más grande del Sistema Solar?",
    options: ["Saturno", "Júpiter", "Neptuno", "Urano"],
    correct: 1,
  },
  {
    question: "¿Cuántos planetas tiene el Sistema Solar?",
    options: ["7", "8", "9", "10"],
    correct: 1,
  },
  {
    question: "¿Qué planeta es conocido como el 'Planeta Rojo'?",
    options: ["Venus", "Mercurio", "Marte", "Júpiter"],
    correct: 2,
  },
  {
    question: "¿Cuál es la estrella más cercana a la Tierra?",
    options: ["Próxima Centauri", "Sirio", "El Sol", "Betelgeuse"],
    correct: 2,
  },
  {
    question: "¿Qué es una nebulosa?",
    options: [
      "Un tipo de estrella",
      "Una nube de gas y polvo en el espacio",
      "Un planeta pequeño",
      "Un satélite natural"
    ],
    correct: 1,
  },
  {
    question: "¿Cuál es el planeta más caliente del Sistema Solar?",
    options: ["Mercurio", "Venus", "Marte", "Tierra"],
    correct: 1,
  },
  {
    question: "¿Qué planeta tiene los anillos más espectaculares?",
    options: ["Júpiter", "Saturno", "Urano", "Neptuno"],
    correct: 1,
  },
  {
    question: "¿Cuánto tarda la luz del Sol en llegar a la Tierra?",
    options: ["8 segundos", "8 minutos", "8 horas", "8 días"],
    correct: 1,
  },
  {
    question: "¿Qué es la Vía Láctea?",
    options: [
      "Un planeta",
      "Una estrella",
      "Nuestra galaxia",
      "Un cometa"
    ],
    correct: 2,
  },
  {
    question: "¿Cuál es el satélite natural de la Tierra?",
    options: ["Fobos", "Titán", "Luna", "Europa"],
    correct: 2,
  },
];

export default function QuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const saveProgressMutation = trpc.games.saveProgress.useMutation({
    onSuccess: () => {
      toast.success("¡Progreso guardado!");
    },
  });

  const handleAnswer = () => {
    if (selectedAnswer === null) return;

    setAnswered(true);
    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correct;

    if (isCorrect) {
      setScore(score + 1);
      toast.success("¡Respuesta correcta!");
    } else {
      toast.error("Respuesta incorrecta");
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setShowResult(true);
      saveProgressMutation.mutate({
        gameType: "quiz",
        score: `${score}/${quizQuestions.length}`,
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (showResult) {
    const percentage = (score / quizQuestions.length) * 100;
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-900 border-blue-900">
          <CardHeader>
            <CardTitle className="text-blue-400 text-center">Resultados del Cuestionario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="text-6xl font-bold text-blue-400">
              {score}/{quizQuestions.length}
            </div>
            <div className="text-2xl text-white">
              {percentage >= 80 ? "¡Excelente!" : percentage >= 60 ? "¡Bien hecho!" : "Sigue practicando"}
            </div>
            <Progress value={percentage} className="h-4" />
            <p className="text-gray-300">
              Has respondido correctamente {score} de {quizQuestions.length} preguntas ({percentage.toFixed(0)}%)
            </p>
            <Button onClick={resetQuiz} className="bg-blue-600 hover:bg-blue-700">
              <RotateCcw className="mr-2 h-4 w-4" />
              Intentar de Nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-slate-900 border-blue-900">
        <CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Pregunta {currentQuestion + 1} de {quizQuestions.length}</span>
              <span>Puntuación: {score}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <CardTitle className="text-blue-400 text-xl mt-4">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            disabled={answered}
          >
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correct;
              const showFeedback = answered;

              return (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all ${
                    showFeedback
                      ? isCorrect
                        ? "border-green-500 bg-green-500/10"
                        : isSelected
                        ? "border-red-500 bg-red-500/10"
                        : "border-slate-700 bg-slate-800"
                      : isSelected
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 bg-slate-800 hover:border-blue-500/50"
                  }`}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-white"
                  >
                    {option}
                  </Label>
                  {showFeedback && isCorrect && <Check className="h-5 w-5 text-green-500" />}
                  {showFeedback && isSelected && !isCorrect && <X className="h-5 w-5 text-red-500" />}
                </div>
              );
            })}
          </RadioGroup>

          <div className="flex justify-end gap-2">
            {!answered ? (
              <Button
                onClick={handleAnswer}
                disabled={selectedAnswer === null}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Responder
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                {currentQuestion < quizQuestions.length - 1 ? "Siguiente" : "Ver Resultados"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

