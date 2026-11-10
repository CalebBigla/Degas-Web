'use client'

import { useId, useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser'
import { MEDIA_BUCKET } from '@/lib/supabase/config'
import { cn } from '@/lib/utils'
import { buttonClass } from '@/components/admin/ui'

const MAX_BYTES = 5 * 1024 * 1024
const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml']

/**
 * Uploads an image straight from the browser to Supabase Storage (bucket
 * "media") using the admin's session, then stores the public URL in a hidden
 * input named `name` so it is submitted with the form.
 */
export function ImageField({
  name,
  label,
  help,
  error,
  defaultValue,
  folder,
  aspect = 'video',
  contain,
}: {
  name: string
  label: string
  help?: string
  error?: string
  defaultValue?: string | null
  /** Storage folder, e.g. "projects". */
  folder: string
  aspect?: 'video' | 'square' | 'wide'
  /** Fit the whole image (logos) instead of cropping (photos). */
  contain?: boolean
}) {
  const inputId = useId()
  const fileInput = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState(defaultValue ?? '')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setUploadError(null)
    if (!ACCEPTED.includes(file.type)) {
      setUploadError('Use a PNG, JPG, WebP, AVIF or SVG image.')
      return
    }
    if (file.size > MAX_BYTES) {
      setUploadError('Images must be 5 MB or smaller.')
      return
    }

    setUploading(true)
    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'png'
      const path = `${folder}/${crypto.randomUUID()}.${extension}`
      const supabase = getSupabaseBrowserClient()
      const { error: uploadErr } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { cacheControl: '31536000', contentType: file.type })
      if (uploadErr) throw uploadErr
      const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
      setUrl(data.publicUrl)
    } catch (err) {
      console.error('[admin] Upload failed:', err)
      setUploadError('Upload failed. Check your connection and try again.')
    } finally {
      setUploading(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  const shownError = uploadError ?? error

  return (
    <div className="flex flex-col gap-1.5">
      <span id={`${inputId}-label`} className="text-sm font-medium text-foreground">
        {label}
      </span>
      <input type="hidden" name={name} value={url} />

      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden rounded-lg border border-dashed bg-secondary/60',
          shownError ? 'border-destructive' : 'border-border',
          aspect === 'video' && 'aspect-video',
          aspect === 'square' && 'aspect-square max-w-48',
          aspect === 'wide' && 'aspect-[3/1]',
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files?.[0]
          if (file) void handleFile(file)
        }}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className={cn('h-full w-full', contain ? 'object-contain p-4' : 'object-cover')}
          />
        ) : (
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ImagePlus className="h-6 w-6" />
            <span>Click to upload or drag an image here</span>
          </button>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-6 w-6 animate-spin text-accent" aria-label="Uploading" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInput}
          type="file"
          accept={ACCEPTED.join(',')}
          className="sr-only"
          aria-labelledby={`${inputId}-label`}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleFile(file)
          }}
        />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className={cn(buttonClass('secondary'), 'h-8 px-3 text-xs')}
        >
          <Upload className="h-3.5 w-3.5" />
          {url ? 'Replace' : 'Upload'}
        </button>
        {url && (
          <button
            type="button"
            onClick={() => setUrl('')}
            disabled={uploading}
            className={cn(buttonClass('ghost'), 'h-8 px-3 text-xs')}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        )}
      </div>

      {shownError ? (
        <p className="text-xs text-destructive" role="alert">
          {shownError}
        </p>
      ) : (
        help && <p className="text-xs leading-relaxed text-muted-foreground">{help}</p>
      )}
    </div>
  )
}
