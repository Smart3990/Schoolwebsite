import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SiteSettings, Media } from "@shared/schema";
import { Save, ImageIcon, Loader2, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type ImageField = 
  | "heroBannerImage"
  | "aboutSectionImage"
  | "galleryImage1"
  | "galleryImage2"
  | "galleryImage3"
  | "galleryImage4"
  | "galleryImage5"
  | "galleryImage6";

export default function Settings() {
  const { toast } = useToast();
  const [selectedField, setSelectedField] = useState<ImageField | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  // Fetch site settings
  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
  });

  // Fetch media library
  const { data: mediaItems = [] } = useQuery<Media[]>({
    queryKey: ["/api/media"],
  });

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<SiteSettings>) => {
      const response = await apiRequest("PUT", "/api/settings", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings Updated",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageSelect = (url: string) => {
    if (selectedField) {
      updateMutation.mutate({ [selectedField]: url });
      setSelectedField(null);
    }
  };

  const handleUrlUpdate = () => {
    if (selectedField && imageUrl.trim()) {
      updateMutation.mutate({ [selectedField]: imageUrl });
      setSelectedField(null);
      setImageUrl("");
    }
  };

  const imageFields: { field: ImageField; label: string; description: string }[] = [
    {
      field: "heroBannerImage",
      label: "Hero Banner Background",
      description: "Main background image for the homepage hero section (recommended: 1920x1080px)",
    },
    {
      field: "aboutSectionImage",
      label: "About Section Image",
      description: "Image displayed in the About Us section (recommended: 800x600px)",
    },
    {
      field: "galleryImage1",
      label: "Gallery Image 1",
      description: "First image in the facilities gallery",
    },
    {
      field: "galleryImage2",
      label: "Gallery Image 2",
      description: "Second image in the facilities gallery",
    },
    {
      field: "galleryImage3",
      label: "Gallery Image 3",
      description: "Third image in the facilities gallery",
    },
    {
      field: "galleryImage4",
      label: "Gallery Image 4",
      description: "Fourth image in the facilities gallery",
    },
    {
      field: "galleryImage5",
      label: "Gallery Image 5",
      description: "Fifth image in the facilities gallery",
    },
    {
      field: "galleryImage6",
      label: "Gallery Image 6",
      description: "Sixth image in the facilities gallery",
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Website Settings</h2>
          <p className="text-muted-foreground">
            Manage website images and placeholders for your homepage
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Image Placeholders
            </CardTitle>
            <CardDescription>
              Update images used throughout your website. Click "Change Image" to select from your media library or enter a custom URL.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {imageFields.map(({ field, label, description }) => (
              <div key={field} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-base font-semibold">{label}</Label>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                  </div>
                  <Dialog
                    open={selectedField === field}
                    onOpenChange={(open) => {
                      if (!open) {
                        setSelectedField(null);
                        setImageUrl("");
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedField(field)}
                        className="hover-elevate"
                        data-testid={`button-change-${field}`}
                      >
                        Change Image
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Select Image for {label}</DialogTitle>
                        <DialogDescription>
                          Choose from your media library or enter a custom URL
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            data-testid="input-image-url"
                          />
                          <Button
                            onClick={handleUrlUpdate}
                            disabled={!imageUrl.trim()}
                            className="hover-elevate"
                            data-testid="button-use-url"
                          >
                            Use URL
                          </Button>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-3">Media Library</h4>
                          <ScrollArea className="h-[400px] rounded-md border p-4">
                            {mediaItems.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground">
                                <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>No media files uploaded yet</p>
                                <p className="text-sm">Go to Media Library to upload images</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {mediaItems.map((media) => (
                                  <div
                                    key={media.id}
                                    className="group relative cursor-pointer border rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                                    onClick={() => handleImageSelect(media.url)}
                                    data-testid={`media-item-${media.id}`}
                                  >
                                    <img
                                      src={media.url}
                                      alt={media.filename}
                                      className="w-full h-32 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Button
                                        size="sm"
                                        className="hover-elevate"
                                      >
                                        Select
                                      </Button>
                                    </div>
                                    <div className="p-2 bg-background">
                                      <p className="text-xs truncate">{media.filename}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </ScrollArea>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-48 h-32 rounded border overflow-hidden bg-muted">
                    <img
                      src={settings?.[field] || ""}
                      alt={`Preview of ${label}`}
                      className="w-full h-full object-cover"
                      data-testid={`preview-${field}`}
                    />
                  </div>
                  {settings?.[field] && (
                    <div className="flex-1 text-sm text-muted-foreground break-all">
                      <a
                        href={settings[field]!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary inline-flex items-center gap-1"
                      >
                        {settings[field]!.substring(0, 60)}...
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>Hero Banner:</strong> Use a wide landscape image (1920x1080px or similar) for best results</p>
            <p>• <strong>About Section:</strong> A professional photo of your facilities or students works well</p>
            <p>• <strong>Gallery Images:</strong> Show different aspects of your campus and programs</p>
            <p>• <strong>Upload First:</strong> Go to Media Library to upload images before setting them here</p>
            <p>• <strong>External URLs:</strong> You can also use image URLs from other websites</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
