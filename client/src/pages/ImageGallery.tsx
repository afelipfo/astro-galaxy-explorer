import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { Home, Upload, User } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const celestialTags = [
  "Sol", "Mercurio", "Venus", "Tierra", "Luna", "Marte",
  "Júpiter", "Saturno", "Urano", "Neptuno",
  "Cinturón de Asteroides", "Cometas", "Estrellas", "Nebulosas", "Galaxias"
];

export default function ImageGallery() {
  const { user, isAuthenticated } = useAuth();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const { data: allImages, isLoading, refetch } = trpc.images.getAll.useQuery();

  const uploadMutation = trpc.images.upload.useMutation({
    onSuccess: () => {
      toast.success("Imagen subida exitosamente");
      setIsUploadOpen(false);
      setImageUrl("");
      setDescription("");
      setSelectedTag("");
      refetch();
    },
    onError: (error) => {
      toast.error("Error al subir imagen: " + error.message);
    },
  });

  const handleUpload = () => {
    if (!imageUrl.trim()) {
      toast.error("Por favor ingresa una URL de imagen");
      return;
    }

    uploadMutation.mutate({
      imageUrl: imageUrl.trim(),
      celestialObjectTag: selectedTag || undefined,
      description: description.trim() || undefined,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen milky-way-bg flex items-center justify-center">
        <Card className="max-w-md bg-slate-900 border-blue-900">
          <CardHeader>
            <CardTitle className="text-blue-400">Acceso Restringido</CardTitle>
            <CardDescription className="text-gray-300">
              Debes iniciar sesión para acceder a la galería de imágenes.
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

  return (
    <div className="min-h-screen milky-way-bg">
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-blue-900/50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-400">Galería de Imágenes</h1>
          <div className="flex gap-3">
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Imagen
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-blue-900 text-white">
                <DialogHeader>
                  <DialogTitle className="text-blue-400">Subir Nueva Imagen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="imageUrl" className="text-gray-300">URL de la Imagen</Label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="bg-slate-800 border-blue-900 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tag" className="text-gray-300">Etiqueta de Objeto Celeste</Label>
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger className="bg-slate-800 border-blue-900 text-white">
                        <SelectValue placeholder="Selecciona un objeto celeste" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-blue-900">
                        {celestialTags.map((tag) => (
                          <SelectItem key={tag} value={tag} className="text-white">
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gray-300">Descripción (Opcional)</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe tu imagen..."
                      className="bg-slate-800 border-blue-900 text-white"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {uploadMutation.isPending ? "Subiendo..." : "Subir Imagen"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Link href="/">
              <Button variant="outline" className="border-blue-500 text-blue-400">
                <Home className="mr-2 h-4 w-4" />
                Inicio
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8">
        {isLoading ? (
          <div className="text-center text-white">Cargando imágenes...</div>
        ) : allImages && allImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allImages.map((image) => (
              <Card key={image.id} className="bg-slate-900 border-blue-900 overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt={image.description || "Imagen astronómica"}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-4">
                  {image.celestialObjectTag && (
                    <div className="mb-2">
                      <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {image.celestialObjectTag}
                      </span>
                    </div>
                  )}
                  {image.description && (
                    <p className="text-gray-300 text-sm mb-3">{image.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <User className="h-3 w-3" />
                    <span>Usuario: {image.userId}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-white py-12">
            <p className="text-xl mb-4">No hay imágenes en la galería aún</p>
            <p className="text-gray-400">Sé el primero en compartir una imagen astronómica</p>
          </div>
        )}
      </div>
    </div>
  );
}

