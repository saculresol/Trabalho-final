import { supabase } from './supabase'

export async function criarUsuario(nome, email, senha, tipo = 'comum') {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nome, email, senha, tipo, saldo: 0, tickets: 1 }])
    .select()
  
  if (error) throw error
  return data[0]
}

export async function loginUsuario(email, senha) {
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

export async function getUsuario(id) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function updateUserBalance(id, novoSaldo) {
  const { data, error } = await supabase
    .from('usuarios')
    .update({ saldo: novoSaldo })
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}

export async function updateUserTickets(id, novosTickets) {
  const { data, error } = await supabase
    .from('usuarios')
    .update({ tickets: novosTickets })
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}
