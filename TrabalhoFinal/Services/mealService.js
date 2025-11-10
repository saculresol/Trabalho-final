export async function fetchMeals() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();

    const meals = data.meals?.slice(0, 5).map(meal => ({
      id: meal.idMeal,
      nome: meal.strMeal,
      descricao: meal.strInstructions,
      imagem: meal.strMealThumb,
      preco: Math.floor(Math.random() * 20) + 10,
    })) || [];

    return meals;
  } catch (error) {
    console.error('Erro ao buscar pratos:', error);
    return [];
  }
}
