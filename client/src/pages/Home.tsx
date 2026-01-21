import { useState, useEffect } from "react";
import { useBlogs } from "@/hooks/use-blogs";
import { BlogCard } from "@/components/BlogCard";
import { CreateBlogDialog } from "@/components/CreateBlogDialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Calendar, Tag, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: blogs, isLoading } = useBlogs();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  // Select first blog by default on desktop once loaded
  useEffect(() => {
    if (blogs && blogs.length > 0 && !selectedId && window.innerWidth >= 768) {
      setSelectedId(blogs[0].id);
    }
  }, [blogs]);

  const selectedBlog = blogs?.find(b => b.id === selectedId);

  const handleSelectBlog = (id: number) => {
    setSelectedId(id);
    if (window.innerWidth < 768) {
      setMobileView('detail');
    }
  };

  const handleBackToList = () => {
    setMobileView('list');
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-none h-16 border-b bg-card/50 backdrop-blur-sm z-10 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-lg">B</span>
          </div>
          <h1 className="font-display font-bold text-xl md:text-2xl tracking-tight text-foreground">
            BlogSpace
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <CreateBlogDialog />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Left Panel - Blog List */}
        <div className={cn(
          "w-full md:w-[400px] lg:w-[450px] border-r bg-muted/30 flex flex-col transition-transform duration-300 absolute md:relative h-full z-10",
          mobileView === 'detail' ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        )}>
          <div className="p-4 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Latest Stories
            </h2>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4 pb-20 md:pb-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-3 p-4 border rounded-2xl bg-card">
                    <Skeleton className="h-4 w-24 rounded-full" />
                    <Skeleton className="h-6 w-3/4 rounded-md" />
                    <Skeleton className="h-16 w-full rounded-md" />
                  </div>
                ))
              ) : blogs?.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Tag className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg">No stories yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">Be the first to publish something amazing!</p>
                </div>
              ) : (
                blogs?.map((blog) => (
                  <BlogCard 
                    key={blog.id} 
                    blog={blog} 
                    isSelected={selectedId === blog.id}
                    onClick={() => handleSelectBlog(blog.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Blog Detail */}
        <div className={cn(
          "flex-1 bg-background overflow-y-auto w-full absolute md:relative h-full transition-transform duration-300 z-20 md:z-auto",
          mobileView === 'detail' ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}>
          {/* Mobile Back Button */}
          <div className="md:hidden sticky top-0 left-0 right-0 p-4 bg-background/80 backdrop-blur border-b flex items-center gap-2 z-50">
            <button onClick={handleBackToList} className="p-2 -ml-2 hover:bg-muted rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold">Back to stories</span>
          </div>

          <div className="max-w-3xl mx-auto py-8 px-6 md:py-12 md:px-12 pb-32">
            <AnimatePresence mode="wait">
              {selectedBlog ? (
                <motion.div
                  key={selectedBlog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  {/* Hero Image */}
                  <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl shadow-black/5 bg-muted relative">
                    {selectedBlog.coverImage ? (
                      <img 
                        src={selectedBlog.coverImage} 
                        alt={selectedBlog.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                        {/* descriptive comment for generic placeholder */}
                        {/* Abstract gradient placeholder */}
                        <div className="text-primary/20 font-display font-bold text-6xl">BlogSpace</div>
                      </div>
                    )}
                  </div>

                  {/* Header Content */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(selectedBlog.date), "MMMM d, yyyy")}</span>
                      </div>
                      <span className="text-muted-foreground/30">•</span>
                      <div className="flex items-center gap-2">
                        {selectedBlog.category.map((cat, i) => (
                          <Badge key={i} variant="outline" className="text-primary border-primary/20 bg-primary/5">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
                      {selectedBlog.title}
                    </h1>

                    <p className="text-xl text-muted-foreground font-light leading-relaxed border-l-4 border-primary/20 pl-4 py-1">
                      {selectedBlog.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-border via-border to-transparent" />

                  {/* Main Content */}
                  <div className="prose-content">
                    {selectedBlog.content.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 py-20">
                  <div className="w-24 h-24 rounded-full bg-muted/50 mb-6 flex items-center justify-center">
                    <div className="w-12 h-12 border-2 border-current rounded-md border-dashed opacity-50" />
                  </div>
                  <p className="text-xl font-medium">Select a story to start reading</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
