import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type Blog } from "@shared/schema";
import { motion } from "framer-motion";

interface BlogCardProps {
  blog: Blog;
  isSelected?: boolean;
  onClick: () => void;
}

export function BlogCard({ blog, isSelected, onClick }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        onClick={onClick}
        className={cn(
          "group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden",
          isSelected 
            ? "bg-primary/5 border-primary shadow-md shadow-primary/10" 
            : "bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
        )}
      >
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
        )}

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {blog.category.map((cat, i) => (
                <Badge 
                  key={i} 
                  variant={isSelected ? "default" : "secondary"}
                  className={cn(
                    "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors"
                  )}
                >
                  {cat}
                </Badge>
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground/80 tabular-nums">
              {format(new Date(blog.date), "MMM d, yyyy")}
            </span>
          </div>

          <div>
            <h3 className={cn(
              "font-display font-bold text-lg leading-tight mb-2 transition-colors",
              isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
            )}>
              {blog.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {blog.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
