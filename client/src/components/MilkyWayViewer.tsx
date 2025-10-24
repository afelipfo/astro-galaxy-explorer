import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";

interface CelestialObject {
  name: string;
  type: string;
  description: string;
  physical_characteristics?: Record<string, string>;
  composition?: string;
  atmosphere?: string;
  interesting_facts?: string[];
  youtube_resources?: string[];
  references?: string[];
  [key: string]: any;
}

interface CelestialData {
  celestial_objects: Record<string, CelestialObject>;
}

const celestialObjects = [
  { id: "sun", name: "Sol", x: 50, y: 50, size: 60, color: "#FDB813", glow: "#FFD700" },
  { id: "mercury", name: "Mercurio", x: 35, y: 48, size: 15, color: "#8C7853", glow: "#A0826D" },
  { id: "venus", name: "Venus", x: 30, y: 52, size: 22, color: "#FFC649", glow: "#FFD700" },
  { id: "earth", name: "Tierra", x: 25, y: 50, size: 24, color: "#4A90E2", glow: "#5DADE2" },
  { id: "moon", name: "Luna", x: 23, y: 48, size: 10, color: "#C0C0C0", glow: "#D3D3D3" },
  { id: "mars", name: "Marte", x: 18, y: 51, size: 18, color: "#CD5C5C", glow: "#E74C3C" },
  { id: "jupiter", name: "Júpiter", x: 75, y: 45, size: 50, color: "#DAA520", glow: "#F39C12" },
  { id: "saturn", name: "Saturno", x: 80, y: 55, size: 45, color: "#F4A460", glow: "#E67E22" },
  { id: "uranus", name: "Urano", x: 85, y: 48, size: 35, color: "#4FD1C5", glow: "#48C9B0" },
  { id: "neptune", name: "Neptuno", x: 90, y: 52, size: 34, color: "#4169E1", glow: "#3498DB" },
  { id: "asteroid_belt", name: "Cinturón de Asteroides", x: 60, y: 50, size: 25, color: "#808080", glow: "#95A5A6" },
  { id: "comets", name: "Cometas", x: 70, y: 35, size: 20, color: "#E0E0E0", glow: "#ECF0F1" },
  { id: "stars", name: "Estrellas", x: 15, y: 20, size: 28, color: "#FFFACD", glow: "#F9E79F" },
  { id: "nebulae", name: "Nebulosas", x: 85, y: 25, size: 32, color: "#FF69B4", glow: "#EC7063" },
  { id: "galaxies", name: "Galaxias", x: 10, y: 75, size: 38, color: "#9370DB", glow: "#AF7AC5" },
];

export default function MilkyWayViewer() {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [celestialData, setCelestialData] = useState<CelestialData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetch("/astronomical_content.json")
      .then((res) => res.json())
      .then((data) => setCelestialData(data))
      .catch((err) => console.error("Error loading astronomical data:", err));
  }, []);

  const handleObjectClick = (objectId: string) => {
    setSelectedObject(objectId);
    setIsDialogOpen(true);
  };

  const currentData = selectedObject && celestialData
    ? celestialData.celestial_objects[selectedObject]
    : null;

  return (
    <div className="relative w-full h-screen milky-way-bg">
      {/* Elementos celestes interactivos */}
      <div className="relative w-full h-full">
        {celestialObjects.map((obj) => (
          <button
            key={obj.id}
            onClick={() => handleObjectClick(obj.id)}
            className="absolute planet-glow animate-float cursor-pointer transition-all duration-300 hover:z-50"
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              width: `${obj.size}px`,
              height: `${obj.size}px`,
              transform: "translate(-50%, -50%)",
              color: obj.glow,
            }}
            aria-label={`Ver información sobre ${obj.name}`}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs shadow-2xl"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${obj.color}, ${obj.glow})`,
                boxShadow: `0 0 ${obj.size / 2}px ${obj.glow}`,
              }}
            >
              <span className="opacity-0 hover:opacity-100 transition-opacity duration-200 text-[10px] text-center px-1">
                {obj.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Modal de información detallada */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-900 text-white border-blue-500">
          {currentData && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-blue-400">
                  {currentData.name}
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  <Badge variant="outline" className="mt-2 border-blue-400 text-blue-300">
                    {currentData.type}
                  </Badge>
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="h-[60vh] pr-4">
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                    <TabsTrigger value="description">Descripción</TabsTrigger>
                    <TabsTrigger value="characteristics">Características</TabsTrigger>
                    <TabsTrigger value="facts">Datos Curiosos</TabsTrigger>
                    <TabsTrigger value="resources">Recursos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="space-y-4 mt-4">
                    <p className="text-gray-200 leading-relaxed">{currentData.description}</p>
                    
                    {currentData.composition && (
                      <div>
                        <h3 className="text-xl font-semibold text-blue-300 mb-2">Composición</h3>
                        <p className="text-gray-300">{currentData.composition}</p>
                      </div>
                    )}

                    {currentData.atmosphere && (
                      <div>
                        <h3 className="text-xl font-semibold text-blue-300 mb-2">Atmósfera</h3>
                        <p className="text-gray-300">{currentData.atmosphere}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="characteristics" className="space-y-3 mt-4">
                    {currentData.physical_characteristics && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(currentData.physical_characteristics).map(([key, value]) => (
                          <div key={key} className="bg-slate-800 p-3 rounded-lg border border-blue-900">
                            <p className="text-sm text-blue-300 font-semibold capitalize">
                              {key.replace(/_/g, " ")}
                            </p>
                            <p className="text-white mt-1">{value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="facts" className="space-y-3 mt-4">
                    {currentData.interesting_facts && (
                      <ul className="space-y-3">
                        {currentData.interesting_facts.map((fact: string, index: number) => (
                          <li key={index} className="flex items-start gap-3 bg-slate-800 p-3 rounded-lg">
                            <span className="text-blue-400 font-bold text-lg">•</span>
                            <span className="text-gray-200">{fact}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-4 mt-4">
                    {currentData.youtube_resources && currentData.youtube_resources.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-blue-300 mb-3">Videos de YouTube</h3>
                        <div className="space-y-2">
                          {currentData.youtube_resources.map((url: string, index: number) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors bg-slate-800 p-3 rounded-lg"
                            >
                              <ExternalLink size={16} />
                              <span>Video {index + 1}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentData.references && currentData.references.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-blue-300 mb-3">Referencias</h3>
                        <div className="space-y-2">
                          {currentData.references.map((url: string, index: number) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors bg-slate-800 p-3 rounded-lg break-all"
                            >
                              <ExternalLink size={16} />
                              <span className="text-sm">{url}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

