import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://japjjntjoimcywydogiu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphcGpqbnRqb2ltY3l3eWRvZ2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDY4MTcsImV4cCI6MjA3NzEyMjgxN30.ZjlqXA98BMujOgBEicbSQ5Wz3XNs-xW6fb1FqMDWrzw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchMealsFromSupabase() {
  const { data, error } = await supabase
    .from('cardapio')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Erro ao buscar cardápio:', error.message);
    return [];
  }

  return data;
}

export async function fetchMealById(id) {
  const { data, error } = await supabase
    .from('cardapio')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar item:', error.message);
    return null;
  }

  return data;
}

export async function saveMealToSupabase(meal) {
  const { error } = await supabase
    .from('cardapio')
    .insert([
      {
        nome: meal.nome,
        descricao: meal.descricao,
        preco: meal.preco,
        imagem_url: meal.imagem_url,
      },
    ]);

  if (error) {
    console.error('Erro ao salvar item:', error.message);
    return false;
  }

  return true;
}

export async function updateMealInSupabase(id, meal) {
  const { error } = await supabase
    .from('cardapio')
    .update({
      nome: meal.nome,
      descricao: meal.descricao,
      preco: meal.preco,
      imagem_url: meal.imagem_url,
    })
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar item:', error.message);
    return false;
  }

  return true;
}

export async function deleteMealFromSupabase(id) {
  const { error } = await supabase
    .from('cardapio')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar item:', error.message);
    return false;
  }

  return true;
}

export async function uploadMealImage(fileUri) {
  try {
    const fileName = `cardapio_${Date.now()}.jpg`;

    const response = await fetch(fileUri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from('cardapio-imagens')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.error('Erro ao enviar imagem:', error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('cardapio-imagens')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;

  } catch (err) {
    console.error('Erro no upload:', err);
    return null;
  }
}
