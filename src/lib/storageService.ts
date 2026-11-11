const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface StorageResponse {
  success: boolean;
  message?: string;
  publicUrl?: string;
  path?: string;
  error?: string;
}

export class StorageService {
  private static baseUrl = `${SUPABASE_URL}/functions/v1/storage-manager`;

  private static async callFunction(data: unknown): Promise<StorageResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Storage service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async createBucket(bucketName: string, isPublic: boolean = true): Promise<StorageResponse> {
    return this.callFunction({
      action: 'create_bucket',
      bucketName,
      isPublic,
    });
  }

  static async uploadFile(
    bucketName: string,
    filePath: string,
    file: File
  ): Promise<StorageResponse> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = async () => {
        const base64Data = reader.result as string;
        const base64String = base64Data.split(',')[1]; // Remove data:image/xxx;base64, prefix

        const result = await this.callFunction({
          action: 'upload_file',
          bucketName,
          filePath,
          fileData: base64String,
          contentType: file.type,
        });

        resolve(result);
      };

      reader.onerror = () => {
        resolve({
          success: false,
          error: 'Failed to read file',
        });
      };

      reader.readAsDataURL(file);
    });
  }

  static async listFiles(bucketName: string): Promise<StorageResponse> {
    return this.callFunction({
      action: 'list_files',
      bucketName,
    });
  }

  static async deleteFile(bucketName: string, filePath: string): Promise<StorageResponse> {
    return this.callFunction({
      action: 'delete_file',
      bucketName,
      filePath,
    });
  }

  static getPublicUrl(bucketName: string, filePath: string): string {
    return `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${filePath}`;
  }
}
