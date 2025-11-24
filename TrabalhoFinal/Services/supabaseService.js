import { supabase } from './supabase';

export async function fetchMealsFromSupabase() {
  const { data, error } = await supabase.from('cardapio').select('*');
  if (error) {
    console.error('Erro ao buscar cardápio:', error.message);
    return [];
  }
  return data;
}

export async function saveMealToSupabase(meal) {
  const { error } = await supabase.from('cardapio').insert([
    {
      nome: meal.strMeal,
      descricao: meal.strCategory,
      preco: Math.floor(Math.random() * 15) + 5, 
      imagem_url: meal.strMealThumb,
    },
  ]);
  if (error) console.error('Erro ao salvar item:', error.message);
}
