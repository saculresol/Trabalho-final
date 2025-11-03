const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

export async function fetchMeals(filter = '') {
  try {
    const response = await fetch(API_URL + encodeURIComponent(filter));
    const json = await response.json();
    if (json.meals) {
    
      return json.meals.map(meal => ({
        id: meal.idMeal,
        nome: meal.strMeal,
        descricao: meal.strInstructions,   
        imagem: meal.strMealThumb,
        preco:  (Math.random() * 10 + 2).toFixed(2), 
        categoria: meal.strCategory,
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Erro ao buscar pratos:', error);
    return [];
  }
}
