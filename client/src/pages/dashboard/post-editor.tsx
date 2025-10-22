import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { NewsPost } from "@shared/schema";
import {
  Save,
  Eye,
  Upload,
  Calendar,
  X,
  Loader2,
} from "lucide-react";

export default function PostEditor() {
  const params = useParams();
  const postId = params.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Announcements");
  const [status, setStatus] = useState("draft");
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);

  // Fetch existing post if editing
  const { data: existingPost, isLoading: isLoadingPost } = useQuery<NewsPost>({
    queryKey: ["/api/news", postId],
    enabled: !!postId,
  });

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setContent(existingPost.content);
      setExcerpt(existingPost.excerpt);
      setCategory(existingPost.category);
      setStatus(existingPost.status);
      setFeaturedImage(existingPost.featuredImage || null);
    }
  }, [existingPost]);

  const saveMutation = useMutation({
    mutationFn: async (data: { status: string }) => {
      const postData = {
        title,
        content,
        excerpt: excerpt || content.substring(0, 160),
        featuredImage,
        category,
        status: data.status,
        date: new Date().toISOString().split('T')[0],
        author: "Admin",
      };

      if (postId) {
        return await apiRequest("PUT", `/api/news/${postId}`, postData);
      } else {
        return await apiRequest("POST", "/api/news", postData);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/news/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({
        title: variables.status === "published" ? "Post Published" : "Draft Saved",
        description: `Your post has been ${variables.status === "published" ? "published successfully" : "saved as a draft"}`,
      });
      setLocation("/dashboard/posts");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (saveStatus: string) => {
    saveMutation.mutate({ status: saveStatus });
  };

  if (postId && isLoadingPost) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {postId ? "Edit News Post" : "Create News Post"}
            </h2>
            <p className="text-muted-foreground">Write and publish news articles</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation("/dashboard/posts")}
            className="hover-elevate"
            data-testid="button-back"
          >
            Cancel
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Title *
                  </label>
                  <Input
                    id="title"
                    placeholder="Enter post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg"
                    data-testid="input-title"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-2">
                    Content *
                  </label>
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Write your post content here... Use the toolbar above to format your text with headings, bold, italic, lists, and more."
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Use the formatting toolbar to style your content
                  </p>
                </div>

                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
                    Excerpt
                  </label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief summary for preview..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    data-testid="input-excerpt"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Brief description shown in post previews (optional - auto-generated if left empty)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                {featuredImage ? (
                  <div className="relative">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-48 object-cover rounded-lg"
                      data-testid="img-featured"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setFeaturedImage(null)}
                      data-testid="button-remove-image"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    data-testid="label-upload-image"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload featured image
                    </span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      data-testid="input-image-upload"
                    />
                  </label>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Announcements">Announcements</SelectItem>
                      <SelectItem value="Events">Events</SelectItem>
                      <SelectItem value="Achievements">Achievements</SelectItem>
                      <SelectItem value="News">News</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Publish Date
                  </label>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start hover-elevate"
                  data-testid="button-preview"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start hover-elevate active-elevate-2"
                  onClick={() => handleSave("draft")}
                  disabled={saveMutation.isPending || !title || !content}
                  data-testid="button-save-draft"
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Draft
                </Button>
                <Button
                  className="w-full justify-start hover-elevate active-elevate-2"
                  onClick={() => handleSave("published")}
                  disabled={saveMutation.isPending || !title || !content}
                  data-testid="button-publish"
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {postId ? "Update Post" : "Publish Post"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-primary truncate">
                    {title || "Post Title"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    nvtikanda.edu.gh/news/{title.toLowerCase().replace(/\s+/g, "-") || "post-slug"}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {excerpt || content.substring(0, 160) || "Post excerpt will appear here..."}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
