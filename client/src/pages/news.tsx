import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { NewsPost } from "@shared/schema";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";

export default function News() {
  const { data: posts = [], isLoading } = useQuery<NewsPost[]>({
    queryKey: ["/api/news"],
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary text-primary-foreground py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-white rounded-full p-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">NVTI</span>
              </div>
            </div>
            <div>
              <h1 className="font-bold text-xl">NVTI Kanda</h1>
              <p className="text-xs opacity-90">Career Training Institute</p>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:underline" data-testid="link-home">Home</Link>
            <Link href="/news" className="font-semibold underline" data-testid="link-news">News</Link>
            <Link href="/dashboard" className="hover:underline" data-testid="link-dashboard">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Latest News & Updates
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed about the latest developments, events, and announcements from NVTI Kanda
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-lg font-medium mb-2">No news posts available</div>
              <div className="text-muted-foreground">Check back later for updates</div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                data-testid={`card-news-${post.id}`}
              >
                {post.featuredImage && (
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      data-testid={`img-news-${post.id}`}
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" data-testid={`badge-category-${post.id}`}>
                      {post.category}
                    </Badge>
                    {post.status === "published" && (
                      <Badge variant="default" className="bg-green-500">Published</Badge>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 line-clamp-2" data-testid={`title-news-${post.id}`}>
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`excerpt-news-${post.id}`}>
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full group" data-testid={`button-read-${post.id}`}>
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-muted mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 NVTI Kanda. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
