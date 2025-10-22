import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Media } from "@shared/schema";
import {
  Search,
  Upload,
  Trash2,
  Download,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

export default function MediaLibrary() {
  const { toast } = useToast();

  const { data: media = [], isLoading } = useQuery<Media[]>({
    queryKey: ["/api/media"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: { filename: string; url: string; size: string }) => {
      return await apiRequest("POST", "/api/media", {
        ...data,
        uploadDate: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      toast({
        title: "Media Uploaded",
        description: "File has been uploaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload media",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/media/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      toast({
        title: "Media Deleted",
        description: "File has been removed from library",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete media",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          uploadMutation.mutate({
            filename: file.name,
            url: reader.result as string,
            size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this media file?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Media Library</h2>
            <p className="text-muted-foreground">Manage your images and files</p>
          </div>
          <label htmlFor="media-upload">
            <Button className="hover-elevate active-elevate-2" data-testid="button-upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
            <input
              id="media-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              data-testid="input-media-upload"
            />
          </label>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media files..."
                className="pl-10"
                data-testid="input-search-media"
              />
            </div>
          </CardContent>
        </Card>

        {/* Media Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {media.map((item, index) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover-elevate transition-all duration-300 hover:-translate-y-1"
                  data-testid={`card-media-${index}`}
                >
                  <div className="aspect-square bg-muted relative group">
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="hover-elevate"
                        data-testid={`button-download-${index}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteMutation.isPending}
                        className="hover-elevate"
                        data-testid={`button-delete-media-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium truncate mb-1">{item.filename}</div>
                    <div className="text-xs text-muted-foreground">{item.size}</div>
                  </CardContent>
                </Card>
              ))}

              {/* Upload Placeholder */}
              <label
                htmlFor="media-upload-2"
                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors min-h-[200px] hover-elevate"
                data-testid="label-upload-placeholder"
              >
                {uploadMutation.isPending ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload Files</span>
                  </>
                )}
                <input
                  id="media-upload-2"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploadMutation.isPending}
                />
              </label>
            </div>

            {media.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="text-lg font-medium mb-2">No media files</div>
                  <div className="text-muted-foreground mb-4">Upload images to get started</div>
                  <label htmlFor="media-upload-empty">
                    <Button className="hover-elevate active-elevate-2" disabled={uploadMutation.isPending}>
                      {uploadMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Your First File
                        </>
                      )}
                    </Button>
                    <input
                      id="media-upload-empty"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploadMutation.isPending}
                    />
                  </label>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
