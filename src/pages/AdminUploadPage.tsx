import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { StorageService } from '../lib/storageService';

interface FileUploadStatus {
  name: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  message?: string;
  publicUrl?: string;
}

const BUCKET_NAME = 'soto-assets';

const REQUIRED_FILES = [
  {
    id: 'logo-header',
    name: 'Logo Header',
    fileName: 'logo-header.png',
    description: 'Logo para la navegación principal (fondo claro)',
    specs: 'PNG transparente, 400x100px mínimo, <200KB',
    path: 'logos/logo-header.png',
  },
  {
    id: 'logo-footer',
    name: 'Logo Footer',
    fileName: 'logo-footer.png',
    description: 'Logo para el footer (letras blancas, fondo oscuro)',
    specs: 'PNG transparente, 400x100px mínimo, <200KB',
    path: 'logos/logo-footer.png',
  },
  {
    id: 'photo-katia',
    name: 'Foto Katia Soto',
    fileName: 'katia-soto.jpg',
    description: 'Foto de perfil - Gerente',
    specs: 'JPG, 400x400px (cuadrada), <150KB',
    path: 'team/katia-soto.jpg',
  },
  {
    id: 'photo-carol',
    name: 'Foto Carol Soto',
    fileName: 'carol-soto.jpg',
    description: 'Foto de perfil - Coordinadora',
    specs: 'JPG, 400x400px (cuadrada), <150KB',
    path: 'team/carol-soto.jpg',
  },
];

const AdminUploadPage = () => {
  const [bucketStatus, setBucketStatus] = useState<'idle' | 'creating' | 'ready' | 'error'>('idle');
  const [fileStatuses, setFileStatuses] = useState<Record<string, FileUploadStatus>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});

  const initializeBucket = async () => {
    setBucketStatus('creating');
    const result = await StorageService.createBucket(BUCKET_NAME, true);

    if (result.success) {
      setBucketStatus('ready');
    } else {
      setBucketStatus('error');
      console.error('Failed to create bucket:', result.error);
    }
  };

  const handleFileSelect = (fileId: string, file: File) => {
    setSelectedFiles(prev => ({ ...prev, [fileId]: file }));
    setFileStatuses(prev => ({
      ...prev,
      [fileId]: { name: file.name, status: 'pending' }
    }));
  };

  const uploadFile = async (fileConfig: typeof REQUIRED_FILES[0]) => {
    const file = selectedFiles[fileConfig.id];
    if (!file) return;

    setFileStatuses(prev => ({
      ...prev,
      [fileConfig.id]: { name: file.name, status: 'uploading' }
    }));

    const result = await StorageService.uploadFile(BUCKET_NAME, fileConfig.path, file);

    if (result.success && result.publicUrl) {
      setFileStatuses(prev => ({
        ...prev,
        [fileConfig.id]: {
          name: file.name,
          status: 'success',
          message: 'Subido correctamente',
          publicUrl: result.publicUrl
        }
      }));
    } else {
      setFileStatuses(prev => ({
        ...prev,
        [fileConfig.id]: {
          name: file.name,
          status: 'error',
          message: result.error || 'Error al subir'
        }
      }));
    }
  };

  const uploadAllFiles = async () => {
    for (const fileConfig of REQUIRED_FILES) {
      if (selectedFiles[fileConfig.id]) {
        await uploadFile(fileConfig);
      }
    }
  };

  React.useEffect(() => {
    initializeBucket();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Panel de Carga de Archivos
          </h1>
          <p className="text-gray-600 mb-8">
            Sube los archivos de imagen y logos para almacenamiento permanente en Supabase Storage
          </p>

          {/* Bucket Status */}
          <div className="mb-8 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Estado del Bucket</h2>
            <div className="flex items-center space-x-2">
              {bucketStatus === 'creating' && (
                <>
                  <Loader className="w-5 h-5 text-blue-500 animate-spin" />
                  <span className="text-gray-700">Creando bucket de almacenamiento...</span>
                </>
              )}
              {bucketStatus === 'ready' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Bucket listo: <code className="bg-gray-200 px-2 py-1 rounded">{BUCKET_NAME}</code></span>
                </>
              )}
              {bucketStatus === 'error' && (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-gray-700">Error al crear bucket</span>
                </>
              )}
            </div>
          </div>

          {/* Files Upload */}
          {bucketStatus === 'ready' && (
            <>
              <div className="space-y-6 mb-8">
                {REQUIRED_FILES.map((fileConfig) => {
                  const status = fileStatuses[fileConfig.id];
                  const file = selectedFiles[fileConfig.id];

                  return (
                    <div key={fileConfig.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{fileConfig.name}</h3>
                          <p className="text-sm text-gray-600">{fileConfig.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            <strong>Especificaciones:</strong> {fileConfig.specs}
                          </p>
                          <p className="text-xs text-gray-500">
                            <strong>Ruta:</strong> <code>{fileConfig.path}</code>
                          </p>
                        </div>
                        {status && (
                          <div>
                            {status.status === 'pending' && (
                              <span className="text-yellow-600">⏳ Pendiente</span>
                            )}
                            {status.status === 'uploading' && (
                              <span className="text-blue-600">📤 Subiendo...</span>
                            )}
                            {status.status === 'success' && (
                              <span className="text-green-600">✅ Completado</span>
                            )}
                            {status.status === 'error' && (
                              <span className="text-red-600">❌ Error</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <input
                          type="file"
                          accept={fileConfig.fileName.endsWith('.png') ? 'image/png' : 'image/jpeg,image/jpg'}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(fileConfig.id, file);
                          }}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-lg file:border-0
                            file:text-sm file:font-semibold
                            file:bg-[#223e28] file:text-white
                            hover:file:bg-[#28352b]
                            file:cursor-pointer cursor-pointer"
                        />

                        {file && (
                          <div className="text-sm text-gray-600">
                            Archivo seleccionado: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                          </div>
                        )}

                        {status?.publicUrl && (
                          <div className="mt-2">
                            <a
                              href={status.publicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#223e28] hover:underline"
                            >
                              Ver archivo subido
                            </a>
                          </div>
                        )}

                        {status?.message && (
                          <div className={`text-sm ${status.status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                            {status.message}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={uploadAllFiles}
                  disabled={Object.keys(selectedFiles).length === 0}
                  className="flex items-center space-x-2 bg-[#223e28] text-white px-6 py-3 rounded-lg hover:bg-[#28352b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-5 h-5" />
                  <span>Subir Todos los Archivos</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUploadPage;
