import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { NewsPost, Media } from "@shared/schema";
import {
  FileText,
  Image as ImageIcon,
  Eye,
  Calendar,
  TrendingUp,
  PlusCircle,
  Upload,
  Loader2,
} from "lucide-react";

export default function DashboardOverview() {
  const { data: posts = [], isLoading: postsLoading } = useQuery<NewsPost[]>({
    queryKey: ["/api/news/all"],
  });

  const { data: media = [], isLoading: mediaLoading } = useQuery<Media[]>({
    queryKey: ["/api/media"],
  });

  const publishedPosts = posts.filter(p => p.status === "published");
  const draftPosts = posts.filter(p => p.status === "draft");
  const publishedPercent = posts.length > 0 ? Math.round((publishedPosts.length / posts.length) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">Welcome to the NVTI Kanda news management system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card data-testid="card-total-posts">
            <CardHeader className="pb-3">
              <CardDescription>Total Posts</CardDescription>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold">
                  {postsLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : posts.length}
                </CardTitle>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                All news posts
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-published">
            <CardHeader className="pb-3">
              <CardDescription>Published</CardDescription>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold">
                  {postsLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : publishedPosts.length}
                </CardTitle>
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">{publishedPercent}% of total</div>
            </CardContent>
          </Card>

          <Card data-testid="card-drafts">
            <CardHeader className="pb-3">
              <CardDescription>Drafts</CardDescription>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold">
                  {postsLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : draftPosts.length}
                </CardTitle>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">{100 - publishedPercent}% of total</div>
            </CardContent>
          </Card>

          <Card data-testid="card-media">
            <CardHeader className="pb-3">
              <CardDescription>Media Files</CardDescription>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold">
                  {mediaLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : media.length}
                </CardTitle>
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Images & files</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/dashboard/posts/new">
                <Button className="w-full justify-start h-auto py-4 hover-elevate active-elevate-2" data-testid="button-new-post">
                  <PlusCircle className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Create New Post</div>
                    <div className="text-xs text-muted-foreground">Write a new news article or announcement</div>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/media">
                <Button variant="outline" className="w-full justify-start h-auto py-4 hover-elevate active-elevate-2" data-testid="button-upload-media">
                  <Upload className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Upload Media</div>
                    <div className="text-xs text-muted-foreground">Add images to your media library</div>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/posts">
                <Button variant="outline" className="w-full justify-start h-auto py-4 hover-elevate active-elevate-2" data-testid="button-view-posts">
                  <FileText className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">View All Posts</div>
                    <div className="text-xs text-muted-foreground">Manage existing news posts</div>
                  </div>
                </Button>
              </Link>

              <Link href="/">
                <Button variant="outline" className="w-full justify-start h-auto py-4 hover-elevate active-elevate-2" data-testid="button-preview-website">
                  <Eye className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Preview Website</div>
                    <div className="text-xs text-muted-foreground">See how your content looks live</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates to your content</CardDescription>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {posts.slice(0, 4).map((post, index) => (
                  <div key={post.id} className="flex items-start gap-4 pb-4 border-b last:border-0" data-testid={`activity-${index}`}>
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {post.status === "published" ? "Published" : "Draft created"}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {posts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activity
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
