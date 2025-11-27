import { supabase } from './supabaseService'; 

export async function getCardapio() {
    const { data, error } = await supabase
        .from('cardapio')
        .select('*');

    if (error) {
        console.error('Erro ao buscar cardápio:', error.message);
        return [];
    }

    return data;
}

export async function createCardapioItem(item) {
    const { data, error } = await supabase
        .from('cardapio')
        .insert([item])
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar item:', error.message);
        return null;
    }

    return data;
}

export async function updateCardapioItem(id, updates) {
    const { data, error } = await supabase
        .from('cardapio')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Erro ao atualizar item:', error.message);
        return null;
    }

    return data;
}

export async function uploadImage(uri) {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const fileName = `${Date.now()}_${uri.split('/').pop()}`;
        const { data, error } = await supabase.storage
            .from('cardapio-imagens')
            .upload(fileName, blob);

        if (error) {
            console.error('Erro ao enviar imagem:', error.message);
            return null;
        }

        const { publicURL, error: urlError } = supabase.storage
            .from('cardapio-imagens')
            .getPublicUrl(fileName);

        if (urlError) {
            console.error('Erro ao obter URL da imagem:', urlError.message);
            return null;
        }

        return publicURL;
    } catch (err) {
        console.error('Erro uploadImage:', err.message);
        return null;
    }
}
