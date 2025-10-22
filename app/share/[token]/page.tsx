'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { insforge } from '@/lib/insforge';
import { FileRecord } from '@/lib/types';
import { formatFileSize, getFileIcon } from '@/lib/file-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Cloud, Download, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const FILE_TYPE_LABELS: Record<string, string> = {
  'pdf': 'PDF Document',
  'png': 'PNG Image',
  'jpg': 'JPEG Image',
  'jpeg': 'JPEG Image',
  'gif': 'GIF Image',
  'mp4': 'MP4 Video',
  'mp3': 'MP3 Audio',
  'txt': 'Text File',
  'zip': 'ZIP Archive',
  'csv': 'CSV File',
  'doc': 'Word Document',
  'docx': 'Word Document',
  'xls': 'Excel File',
  'xlsx': 'Excel File',
  'ppt': 'PowerPoint Presentation',
  'pptx': 'PowerPoint Presentation',
};

export default function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const [file, setFile] = useState<FileRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const { data, error } = await insforge.database
          .from('files')
          .select('*')
          .eq('share_token', resolvedParams.token)
          .eq('is_public', true)
          .single();

        if (error || !data) setNotFound(true);
        else setFile(data as FileRecord);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, [resolvedParams.token]);

  const handleDownload = async () => {
    if (!file) return;
    setDownloading(true);
    try {
      await insforge.database
        .from('files')
        .update({ download_count: file.download_count + 1 })
        .eq('id', file.id);

      window.open(file.storage_url, '_blank');
      toast.success('Download started!');
      setFile({ ...file, download_count: file.download_count + 1 });
    } catch {
      toast.error('Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  const getFileTypeLabel = (type: string) => {
    const ext = type.split('/')[1]?.toLowerCase() || 'file';
    return FILE_TYPE_LABELS[ext] || ext.toUpperCase();
  };

  if (loading) {
    return (
      <div className="gradient-bg flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="mt-4 text-subtle font-medium">Loading file...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-card sticky top-0 z-20 backdrop-blur-lg bg-white/10 border-b border-white/20 shadow-md">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="icon-rounded bg-white/20 p-2 rounded-full">
              <Cloud className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-title">CloudeStorage</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-body hover:bg-white/30 rounded-xl px-4 py-2">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="btn-primary text-white font-semibold px-6 py-2.5 rounded-xl">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto space-y-6">
          {notFound ? (
            <Card className="glass-card rounded-2xl shadow-soft p-6 text-center space-y-6">
              <Alert className="bg-accent/10 border-accent/20 rounded-xl flex items-center justify-center gap-3">
                <AlertCircle className="h-5 w-5 text-accent" />
                <AlertDescription className="text-body">This file does not exist or is no longer available.</AlertDescription>
              </Alert>
              <Link href="/">
                <Button className="btn-primary text-white rounded-xl px-6 py-3">Go to Home</Button>
              </Link>
            </Card>
          ) : file && (
            <Card className="glass-card rounded-2xl shadow-soft overflow-hidden">
              <CardHeader className="flex flex-col sm:flex-row items-center gap-4 p-6">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                  <span className="text-4xl">{getFileIcon(file.file_type)}</span>
                </div>
                <div className="flex-1 text-center sm:text-left mt-3 sm:mt-0">
                  <CardTitle className="text-2xl font-bold text-title">{file.original_filename}</CardTitle>
                  <CardDescription className="text-subtle mt-1">{getFileTypeLabel(file.file_type)}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white/20 backdrop-blur rounded-xl text-center sm:text-left">
                  <div>
                    <p className="text-sm text-subtle">File Size</p>
                    <p className="text-lg font-semibold text-title">{formatFileSize(file.file_size)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-subtle">Uploaded</p>
                    <p className="text-lg font-semibold text-title">{new Date(file.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-subtle">Downloads</p>
                    <p className="text-lg font-semibold text-primary">{file.download_count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-subtle">Type</p>
                    <p className="text-lg font-semibold text-title">{getFileTypeLabel(file.file_type)}</p>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="btn-primary w-full text-white rounded-xl h-14 text-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  <Download className="h-5 w-5" />
                  {downloading ? 'Downloading...' : 'Download File'}
                </Button>

                <p className="text-center text-sm text-subtle mt-2">
                  This file is shared publicly and can be downloaded by anyone with this link.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-white/20 mt-auto py-8">
        <div className="container mx-auto text-center text-subtle">
          &copy; 2025 CloudeStorage. Built with Next.js and InsForge.
        </div>
      </footer>
    </div>
  );
}
