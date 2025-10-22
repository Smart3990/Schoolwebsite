import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { NewsPost } from "@shared/schema";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Filter,
  Loader2,
} from "lucide-react";

export default function PostsList() {
  const { toast } = useToast();

  const { data: posts = [], isLoading } = useQuery<NewsPost[]>({
    queryKey: ["/api/news/all"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/news/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({
        title: "Post Deleted",
        description: "The post has been removed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">News Posts</h2>
            <p className="text-muted-foreground">Manage your news articles and announcements</p>
          </div>
          <Link href="/dashboard/posts/new">
            <Button className="hover-elevate active-elevate-2" data-testid="button-create-post">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-10"
                  data-testid="input-search-posts"
                />
              </div>
              <Button variant="outline" className="hover-elevate" data-testid="button-filter">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-semibold">Title</th>
                        <th className="text-left p-4 font-semibold">Category</th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        <th className="text-left p-4 font-semibold">Date</th>
                        <th className="text-right p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post, index) => (
                        <tr
                          key={post.id}
                          className="border-t hover:bg-muted/30 transition-colors"
                          data-testid={`row-post-${index}`}
                        >
                          <td className="p-4">
                            <div>
                              <div className="font-medium mb-1">{post.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {post.excerpt}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{post.category}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge
                              className={
                                post.status === "published"
                                  ? "bg-chart-3 text-white"
                                  : "bg-chart-2/20 text-chart-2"
                              }
                            >
                              {post.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {new Date(post.date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover-elevate"
                                data-testid={`button-view-${index}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Link href={`/dashboard/posts/${post.id}/edit`}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover-elevate"
                                  data-testid={`button-edit-${index}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10 hover-elevate"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this post?")) {
                                    deleteMutation.mutate(post.id);
                                  }
                                }}
                                disabled={deleteMutation.isPending}
                                data-testid={`button-delete-${index}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {posts.length === 0 && (
                  <div className="p-12 text-center">
                    <div className="text-muted-foreground mb-4">No posts found</div>
                    <Link href="/dashboard/posts/new">
                      <Button className="hover-elevate active-elevate-2">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Post
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
