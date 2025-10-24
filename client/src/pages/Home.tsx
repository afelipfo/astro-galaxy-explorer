import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import MilkyWayViewer from "@/components/MilkyWayViewer";
import { Link } from "wouter";
import { Gamepad2, Image, MessageCircle, LogOut, User } from "lucide-react";
import { useState } from "react";
import ChatBot from "@/components/ChatBot";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Barra de navegación superior */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-blue-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-blue-400">{APP_TITLE}</h1>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/games">
                    <Button variant="ghost" className="text-white hover:text-blue-400">
                      <Gamepad2 className="mr-2 h-4 w-4" />
                      Juegos
                    </Button>
                  </Link>

                  <Link href="/gallery">
                    <Button variant="ghost" className="text-white hover:text-blue-400">
                      <Image className="mr-2 h-4 w-4" />
                      Galería
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    className="text-white hover:text-blue-400"
                    onClick={() => setIsChatOpen(!isChatOpen)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chatbot
                  </Button>

                  <div className="flex items-center gap-2 text-white">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user?.name || "Usuario"}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logout()}
                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Salir
                  </Button>
                </>
              ) : (
                <a href={getLoginUrl()}>
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                    Iniciar Sesión
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Visualizador de la Vía Láctea */}
      <MilkyWayViewer />

      {/* Chatbot flotante */}
      {isAuthenticated && isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <ChatBot onClose={() => setIsChatOpen(false)} />
        </div>
      )}

      {/* Instrucciones flotantes */}
      <div className="absolute bottom-6 left-6 z-40 bg-slate-900/90 backdrop-blur-md p-4 rounded-lg border border-blue-900/50 max-w-md">
        <h3 className="text-lg font-semibold text-blue-400 mb-2">
          Bienvenido a Astro Galaxy Explorer
        </h3>
        <p className="text-sm text-gray-300">
          Haz clic en cualquier objeto celeste para explorar información detallada sobre planetas,
          estrellas, nebulosas y más. Inicia sesión para acceder a juegos educativos, subir
          imágenes y usar el chatbot astronómico.
        </p>
      </div>
    </div>
  );
}

