export async function fetchMeals() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    return data.meals.map(meal => ({
      id: meal.idMeal,
      nome: meal.strMeal,
      descricao: meal.strInstructions,
      preco: Math.floor(Math.random() * 20) + 10,
      imagem: meal.strMealThumb,
    }));
  } catch (error) {
    console.error('Erro ao buscar pratos:', error);
    return [];
  }
}
