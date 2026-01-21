import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBlogSchema, type CreateBlogRequest } from "@shared/schema";
import { useCreateBlog } from "@/hooks/use-blogs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CreateBlogDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createBlog = useCreateBlog();

  const form = useForm<CreateBlogRequest>({
    resolver: zodResolver(insertBlogSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      coverImage: "",
      category: [],
    },
  });

  function onSubmit(data: CreateBlogRequest) {
    createBlog.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Blog Published!",
          description: "Your new blog post has been created successfully.",
        });
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  }

  // Helper to handle comma-separated categories input
  const handleCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value;
    const categories = value.split(',').map(c => c.trim()).filter(Boolean);
    field.onChange(categories);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
          <Plus className="mr-2 h-4 w-4" /> Create Blog
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-primary">Write New Story</DialogTitle>
          <DialogDescription>
            Share your thoughts with the world. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a captivating title..." className="h-11 rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Categories</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Tech, Design, Life (comma separated)" 
                        className="h-11 rounded-xl"
                        onChange={(e) => handleCategoriesChange(e, field)}
                        // Don't bind value directly for array field with string input
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Cover Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://unsplash.com/..." className="h-11 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Short Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="A brief summary to hook readers..." 
                      className="resize-none rounded-xl min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Start writing your story here..." 
                      className="min-h-[200px] rounded-xl font-body leading-relaxed" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full md:w-auto rounded-xl font-semibold"
                disabled={createBlog.isPending}
              >
                {createBlog.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  "Publish Story"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
