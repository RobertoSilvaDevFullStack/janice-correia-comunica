import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import { toast } from 'sonner'

type Props = {
  value?: string
  onChange: (url: string) => void
  label?: string
  maxSizeMB?: number
}

export const ImageUploader: React.FC<Props> = ({ value, onChange, label = 'Imagem', maxSizeMB = 5 }) => {
  const [url, setUrl] = useState(value || '')
  const [preview, setPreview] = useState(value || '')
  const [fileName, setFileName] = useState('')

  const applyUrl = () => {
    if (!url) return toast.error('Informe uma URL válida')
    setPreview(url)
    onChange(url)
  }

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/jpeg','image/png','image/gif']
    if (!allowed.includes(file.type)) return toast.error('Formato inválido. Use JPG, PNG ou GIF')
    const max = maxSizeMB * 1024 * 1024
    if (file.size > max) return toast.error(`Arquivo excede ${maxSizeMB}MB`)
    setFileName(file.name)
    try {
      const form = new FormData()
      form.append('file', file)
      const { data } = await api.post('/media/upload', form)
      const secureUrl = (data.url || '').replace(/^http:\/\//, 'https://')
      setPreview(secureUrl)
      onChange(secureUrl)
      toast.success('Imagem enviada')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Falha no upload'
      toast.error(msg)
    }
  }

  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <Tabs defaultValue="url">
          <TabsList>
            <TabsTrigger value="url">Usar URL</TabsTrigger>
            <TabsTrigger value="upload">Enviar arquivo</TabsTrigger>
          </TabsList>
          <TabsContent value="url" className="space-y-2">
            <Input value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="https://exemplo.com/imagem.jpg" />
            <Button type="button" onClick={applyUrl}>Aplicar</Button>
          </TabsContent>
          <TabsContent value="upload" className="space-y-2">
            <Input type="file" accept="image/*" onChange={onFileSelect} />
            {fileName && <p className="text-xs text-muted-foreground">{fileName}</p>}
          </TabsContent>
        </Tabs>
        {preview && (
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded" />
        )}
      </CardContent>
    </Card>
  )
}