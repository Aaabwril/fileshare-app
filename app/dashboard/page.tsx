'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { insforge } from '@/lib/insforge';
import { FileRecord } from '@/lib/types';
import { formatFileSize, getFileIcon, generateShareToken, getShareUrl } from '@/lib/file-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Cloud, Upload, MoreVertical, Share2, Trash2, Download, Copy, LogOut, RefreshCw, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [shareDialogFile, setShareDialogFile] = useState<FileRecord | null>(null);

  const fetchFiles = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingFiles(true);
    try {
      const { data, error } = await insforge.database
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load files');
      } else {
        setFiles(data as FileRecord[]);
      }
    } catch (error) {
      toast.error('An error occurred while loading files');
    } finally {
      setIsLoadingFiles(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchFiles();
    }
  }, [user, loading, router, fetchFiles]);

  // Auto-refresh files every 5 seconds for real-time updates
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      fetchFiles();
    }, 5000);

    return () => clearInterval(interval);
  }, [user, fetchFiles]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Upload to storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: storageData, error: storageError } = await insforge.storage
        .from('files')
        .upload(fileName, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (storageError || !storageData) {
        toast.error('Failed to upload file');
        return;
      }

      // Save metadata to database
      const { data: fileRecord, error: dbError } = await insforge.database
        .from('files')
        .insert([{
          user_id: user.id,
          filename: storageData.key,
          original_filename: file.name,
          file_size: file.size,
          file_type: file.type || 'application/octet-stream',
          storage_url: storageData.url,
          storage_key: storageData.key,
          share_token: null,
          is_public: false,
          download_count: 0,
        }])
        .select()
        .single();

      if (dbError) {
        toast.error('Failed to save file metadata');
        return;
      }

      toast.success('File uploaded successfully!');
      fetchFiles();
    } catch (error) {
      toast.error('An error occurred during upload');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleDelete = async (fileId: string, storageKey: string) => {
    try {
      // Delete from storage
      await insforge.storage.from('files').remove(storageKey);

      // Delete from database
      const { error } = await insforge.database
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) {
        toast.error('Failed to delete file');
      } else {
        toast.success('File deleted successfully');
        fetchFiles();
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    }
  };

  const handleGenerateShareLink = async (file: FileRecord) => {
    try {
      const shareToken = generateShareToken();
      
      const { error } = await insforge.database
        .from('files')
        .update({ share_token: shareToken, is_public: true })
        .eq('id', file.id);

      if (error) {
        toast.error('Failed to generate share link');
      } else {
        toast.success('Share link generated!');
        fetchFiles();
        const updatedFile = { ...file, share_token: shareToken, is_public: true };
        setShareDialogFile(updatedFile);
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleCopyShareLink = (shareToken: string) => {
    const shareUrl = getShareUrl(shareToken);
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="gradient-bg flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-body font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-screen">
      {/* Header */}
      <header className="glass-card border-b border-white/20 sticky top-0 z-10 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="icon-rounded group animate-float">
              <Cloud className="h-6 w-6 text-primary group-hover:text-purple-500 transition-all" />
            </div>
            <div className="relative">
              <span className="text-xl sm:text-2xl font-bold text-title">CloudeStorage</span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-primary via-cyan-secondary to-coral-accent rounded-full"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/70 backdrop-blur rounded-full">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-primary to-cyan-secondary flex items-center justify-center text-white font-bold text-xs">
                {profile?.nickname?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm text-body font-medium max-w-[150px] truncate">
                {profile?.nickname || user.email}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={fetchFiles} 
              title="Refresh Files" 
              className="hover:bg-white/50 rounded-xl w-9 h-9 sm:w-10 sm:h-10 hover:rotate-180 transition-all duration-500"
            >
              <RefreshCw className="h-4 w-4 text-cyan-secondary" />
            </Button>
            <Button className="btn-secondary text-white rounded-xl px-3 sm:px-4 py-2 group" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-1 sm:mr-2 group-hover:translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-5 sm:py-8">
        {/* Upload Section */}
        <div className="glass-card rounded-2xl mb-6 sm:mb-8 shadow-soft overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-primary/10 to-cyan-secondary/10 rounded-bl-3xl -z-10"></div>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-title text-lg sm:text-xl flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-r from-purple-primary to-cyan-secondary flex items-center justify-center">
                    <Upload className="h-3 w-3 text-white" />
                  </div>
                  Cloude Storage
                </CardTitle>
                <CardDescription className="text-subtle mt-1">Upload your files securely</CardDescription>
              </div>
              <div className="hidden sm:flex items-center justify-center w-12 h-12 icon-secondary animate-pulse-slow">
                <Cloud className="h-6 w-6 text-cyan-secondary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            {isUploading ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent" />
                    <span className="text-body font-medium">Uploading your file...</span>
                  </div>
                  <span className="text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-md">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 bg-white/50" />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 relative overflow-hidden">
                <div className="relative flex-1">
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="cursor-pointer pb-10 rounded-xl border-gray-200 bg-white/50 backdrop-blur file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-primary/20 file:to-cyan-secondary/20 file:text-primary hover:file:from-purple-primary/30 hover:file:to-cyan-secondary/30 transition-all text-sm pl-10"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-60">
                    <Upload className="h-4 w-4" />
                  </div>
                </div>
                <Button disabled={isUploading} className="btn-primary text-white rounded-xl px-6 py-2.5 sm:py-0 min-w-[100px] whitespace-nowrap group">
                  <Upload className="h-4 w-4 mr-2 group-hover:translate-y-[-2px] transition-transform" />
                  Upload File
                </Button>
              </div>
            )}
          </CardContent>
        </div>

        {/* Files List */}
        <div className="glass-card rounded-2xl shadow-soft overflow-hidden relative">
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-secondary/10 to-coral-accent/5 rounded-br-3xl -z-10"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-primary/10 to-cyan-secondary/5 rounded-tl-3xl -z-10"></div>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <div>
                <CardTitle className="text-title text-lg sm:text-xl flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-r from-cyan-secondary to-coral-accent flex items-center justify-center">
                    <Download className="h-3 w-3 text-white" />
                  </div>
                  My Files
                </CardTitle>
                <CardDescription className="text-subtle mt-1">
                  <span className="text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-md">{files.length}</span> files in your storage
                </CardDescription>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-full bg-white/70 backdrop-blur text-xs font-medium text-primary">
                  <span className="inline-flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Today
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            {files.length === 0 ? (
              <div className="py-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-5 animate-float shadow-lg shadow-primary/10">
                  <Cloud className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-title font-semibold text-xl mb-3">Your cloud is empty</h3>
                <p className="text-subtle text-sm mb-5 max-w-sm mx-auto leading-relaxed">Start storing your files securely in the cloud by uploading your first file.</p>
                <Button className="btn-primary text-white rounded-xl px-6 py-2.5 group" onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}>
                  <div className="mr-2 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                    <Upload className="h-3 w-3 text-white group-hover:translate-y-[-2px] transition-transform" />
                  </div>
                  Upload Your First File
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 bg-white/50 backdrop-blur rounded-xl hover:bg-white/70 transition-all duration-200 shadow-sm border border-white/50 hover:border-white/80 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center shadow-md shadow-purple-primary/5 group-hover:shadow-purple-primary/20 transition-all">
                        <span className="text-lg sm:text-xl animate-pulse-slow">{getFileIcon(file.file_type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-title truncate text-sm sm:text-base">
                          {file.original_filename}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-xs sm:text-sm text-subtle">
                          <span>{formatFileSize(file.file_size)}</span>
                          <span className="hidden xs:inline">•</span>
                          <span className="hidden sm:inline">{new Date(file.created_at).toLocaleDateString()}</span>
                          {file.is_public && (
                            <>
                              <span className="hidden xs:inline">•</span>
                              <span className="bg-cyan-secondary/10 text-cyan-secondary font-medium px-1.5 py-0.5 rounded text-xs flex items-center gap-1">
                                <Share2 className="h-3 w-3" />
                                Shared
                              </span>
                            </>
                          )}
                          {file.download_count > 0 && (
                            <>
                              <span className="hidden xs:inline">•</span>
                              <span className="bg-purple-primary/10 text-purple-primary font-medium px-1.5 py-0.5 rounded text-xs flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {file.download_count}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:justify-end mt-2 sm:mt-0">
                      <div className="flex sm:hidden gap-2 mr-2">
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-white/80" onClick={() => window.open(file.storage_url, '_blank')}>
                          <Download className="h-4 w-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-white/80" onClick={() => file.share_token ? setShareDialogFile(file) : handleGenerateShareLink(file)}>
                          <Share2 className="h-4 w-4 text-secondary" />
                        </Button>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8 sm:w-9 sm:h-9 hover:bg-white/80 rounded-lg">
                            <MoreVertical className="h-4 w-4 text-muted" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl glass-card">
                          <DropdownMenuItem onClick={() => window.open(file.storage_url, '_blank')} className="rounded-lg hidden sm:flex">
                            <Download className="h-4 w-4 mr-2 text-primary" />
                            Download
                          </DropdownMenuItem>
                          {file.share_token ? (
                            <DropdownMenuItem onClick={() => setShareDialogFile(file)} className="rounded-lg hidden sm:flex">
                              <Share2 className="h-4 w-4 mr-2 text-secondary" />
                              View Share Link
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleGenerateShareLink(file)} className="rounded-lg hidden sm:flex">
                              <Share2 className="h-4 w-4 mr-2 text-secondary" />
                              Generate Share Link
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(file.id, file.storage_key)}
                            className="text-accent rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </div>
      </main>

      {/* Share Dialog */}
      <Dialog open={!!shareDialogFile} onOpenChange={(open) => !open && setShareDialogFile(null)}>
        <DialogContent className="rounded-2xl max-w-[95vw] sm:max-w-md w-full border border-white/50 bg-white/95 backdrop-blur-lg fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%] shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
          <DialogHeader className="px-3 sm:px-6 pt-4 pb-2 sm:pt-6 sm:pb-2">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-secondary to-purple-primary flex items-center justify-center">
                <Share2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-title text-lg sm:text-xl">Share File</DialogTitle>
                <DialogDescription className="text-subtle text-sm mt-1">
                  {shareDialogFile?.original_filename && (
                    <span className="font-medium text-primary">"{shareDialogFile.original_filename}"</span>
                  )}
                  <div className="mt-1">Anyone with this link can download this file</div>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {shareDialogFile?.share_token && (
            <div className="space-y-4 px-3 sm:px-6 pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <Input
                  value={getShareUrl(shareDialogFile.share_token)}
                  readOnly
                  className="flex-1 rounded-xl border-gray-200 bg-white/50 backdrop-blur h-11 sm:h-12 px-4 text-sm w-full mb-2 sm:mb-0"
                />
                <Button
                  size="icon"
                  onClick={() => handleCopyShareLink(shareDialogFile.share_token!)}
                  className="btn-primary text-white rounded-xl h-11 sm:h-12 w-full sm:w-12"
                >
                  <Copy className="h-4 w-4 sm:mr-0 mr-2" />
                  <span className="sm:hidden">Copy Link</span>
                </Button>
              </div>
              <Button
                className="w-full bg-white/80 hover:bg-white text-body rounded-xl h-11 sm:h-12 text-sm"
                variant="outline"
                onClick={() => window.open(getShareUrl(shareDialogFile.share_token!), '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Share Link
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
