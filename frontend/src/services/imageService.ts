import { supabase } from '../lib/supabase';

// Nombre de tu bucket en Supabase (asegúrate de haberlo creado)
const BUCKET_NAME = 'forum-assets';

export const imageService = {
  
  /**
   * Sube una imagen y devuelve su URL pública.
   * @param file El archivo del input
   * @param folder La carpeta donde guardarlo ('icons', 'banners', 'avatars')
   */
  async uploadImage(file: File, folder: string): Promise<string | null> {
    try {
      // 1. Limpiar el nombre del archivo y hacerlo único
      // (Evita que dos usuarios suban 'image.jpg' y se sobrescriban)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // 2. Subir a Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error de subida a Supabase:', uploadError);
        throw uploadError;
      }

      // 3. Obtener la URL pública para guardarla en Mongo
      const { data } = supabase
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      return data.publicUrl;

    } catch (error) {
      console.error('Error en imageService:', error);
      return null;
    }
  }
};