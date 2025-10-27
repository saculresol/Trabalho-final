import { supabase } from './supabase'

export async function criarUsuario(nome, email, senha, tipo = 'comum') {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nome, email, senha, tipo }])
    .select()
  
  if (error) throw error
  return data[0]
}

export async function loginUsuario(email, senha) {
  console.log('Tentando logar com:', email, senha)
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .eq('senha', senha)
    .single()

  if (error || !data) throw new Error('Credenciais inválidas')
  return data
}

export async function listarUsuarios() {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .order('nome', { ascending: true })

  if (error) throw error
  return data
}
