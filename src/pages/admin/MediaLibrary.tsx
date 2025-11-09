import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Search, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const MediaLibrary = () => {
  const [search, setSearch] = useState('');

  const media = [
    { id: '1', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2', name: 'palestra-1.jpg', size: '2.4 MB' },
    { id: '2', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978', name: 'palestra-2.jpg', size: '1.8 MB' },
    { id: '3', url: 'https://images.unsplash.com/photo-1577415124269-fc1140ec4bad', name: 'mentoria-1.jpg', size: '3.1 MB' },
  ];

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copiada!');
  };

  const handleDelete = () => {
    toast.success('Mídia removida!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Biblioteca de Mídia</h1>
          <p className="text-muted-foreground">Gerencie suas imagens e arquivos</p>
        </div>
        <Button className="btn-gradient">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar mídia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div key={item.id} className="group relative border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img src={item.url} alt={item.name} className="w-full h-40 object-cover" />
                <div className="p-3">
                  <p className="text-sm font-medium text-primary truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.size}</p>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopyUrl(item.url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaLibrary;
