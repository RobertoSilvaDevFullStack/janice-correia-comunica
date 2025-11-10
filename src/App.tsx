import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ContactModalProvider } from "@/contexts/ContactModalContext";
import { ContactModal } from "@/components/ContactModal";
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import Index from "./pages/Index";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import LeadsList from "./pages/admin/LeadsList";
import BlogList from "./pages/admin/BlogList";
import BlogPostForm from "./pages/admin/BlogPostForm";
import TestimonialsList from "./pages/admin/TestimonialsList";
import TestimonialForm from "./pages/admin/TestimonialForm";
import PalestrasList from "./pages/admin/PalestrasList";
import MentoriasList from "./pages/admin/MentoriasList";
import Settings from "./pages/admin/Settings";
import MediaLibrary from "./pages/admin/MediaLibrary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ContactModalProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ContactModal />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="leads" element={<LeadsList />} />
                <Route path="blog" element={<BlogList />} />
                <Route path="blog/new" element={<BlogPostForm />} />
                <Route path="blog/edit/:slug" element={<BlogPostForm />} />
                <Route path="testimonials" element={<TestimonialsList />} />
                <Route path="testimonials/new" element={<TestimonialForm />} />
                <Route path="testimonials/edit/:id" element={<TestimonialForm />} />
                <Route path="palestras" element={<PalestrasList />} />
                <Route path="mentorias" element={<MentoriasList />} />
                <Route path="settings" element={<Settings />} />
                <Route path="media" element={<MediaLibrary />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ContactModalProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
