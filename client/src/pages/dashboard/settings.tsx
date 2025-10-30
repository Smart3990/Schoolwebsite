import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SiteSettings, Media } from "@shared/schema";
import { Save, ImageIcon, Loader2, ExternalLink, KeyRound, Upload } from "lucide-react";
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
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentUploadField, setCurrentUploadField] = useState<ImageField | null>(null);

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

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { username: string; oldPassword: string; newPassword: string }) => {
      const response = await apiRequest("POST", "/api/change-password", data);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to update password");
      }
      
      if (!result.success) {
        throw new Error(result.error || "Failed to update password");
      }
      
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please check your current password.",
        variant: "destructive",
      });
    },
  });

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    const userJson = localStorage.getItem("dashboard_user");
    const username = userJson ? JSON.parse(userJson).username : "admin";
    changePasswordMutation.mutate({ username, oldPassword, newPassword });
  };

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: ImageField) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        updateMutation.mutate({ [field]: base64 });
        toast({
          title: "Image Uploaded",
          description: "Your image has been saved successfully.",
        });
      };
      reader.readAsDataURL(file);
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
                  <div className="flex gap-2">
                    <label htmlFor={`upload-${field}`}>
                      <Button
                        variant="default"
                        size="sm"
                        className="hover-elevate"
                        data-testid={`button-upload-${field}`}
                        asChild
                      >
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </span>
                      </Button>
                      <input
                        id={`upload-${field}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, field)}
                      />
                    </label>
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
                          Or Browse
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
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-48 h-32 rounded-lg border-2 overflow-hidden bg-muted shadow-sm">
                      {settings?.[field] ? (
                        <img
                          src={settings[field]}
                          alt={`Preview of ${label}`}
                          className="w-full h-full object-cover"
                          data-testid={`preview-${field}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-8 w-8 opacity-20" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      {settings?.[field] ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="bg-green-500">
                              ✓ Uploaded
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Image is set and will display on your website
                          </p>
                          <a
                            href={settings[field]!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs hover:text-primary inline-flex items-center gap-1 text-muted-foreground"
                          >
                            View full size
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          <p>No image uploaded yet</p>
                          <p className="text-xs mt-1">Click "Upload" to add an image</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {settings?.[field] && (
                    <div className="bg-muted/50 rounded-lg p-3 border">
                      <p className="text-xs font-medium mb-1">Website Display Preview:</p>
                      <p className="text-xs text-muted-foreground">
                        {field === "heroBannerImage" && "→ This appears as the main background on your homepage hero section"}
                        {field === "aboutSectionImage" && "→ This appears in the About Us section of your homepage"}
                        {field.startsWith("galleryImage") && `→ This appears in the facilities gallery (position ${field.replace("galleryImage", "")})`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your admin account password for better security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Current Password</Label>
              <Input
                id="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                data-testid="input-old-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                data-testid="input-new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                data-testid="input-confirm-password"
              />
            </div>
            <Button
              onClick={handlePasswordChange}
              disabled={changePasswordMutation.isPending}
              className="hover-elevate"
              data-testid="button-change-password"
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
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
