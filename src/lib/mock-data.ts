export type Category =
  | 'Gibis'
  | 'Eletrônicos'
  | 'Instrumentos'
  | 'Livros'
  | 'Outros'

export interface Item {
  id: string
  nome: string
  categoria: Category
  marcaModelo: string
  estado: string
  funciona: string
  defeitos: string
  acessorios: string
  cidade: string
  aceitaEnvio: string
  preco: number
  urgencia: string
  observacoes: string
  status: string
  score: number
}

const baseGibis = [
  'Sandman Edição Definitiva Vol I',
  'Sandman Edição Definitiva Vol II',
  'Sandman Edição Definitiva Vol III',
  'Sandman Edição Definitiva Vol IV',
  'Sandman Edição Definitiva Vol V',
  'Habibi',
  'Saga Vol 1',
  'Saga Vol 2',
  'Saga Vol 3',
  'Saga Vol 4',
  'Saga Vol 5',
  'Batman: O Cavaleiro das Trevas',
  'Batman: A Piada Mortal',
  'Loki: Jornada ao Mistério 1',
  'Loki: Jornada ao Mistério 2',
  'V de Vingança',
  'Watchmen',
  'Maus',
  'Retalhos',
  'O Incal',
  'Akira Vol 1',
  'Akira Vol 2',
  'Akira Vol 3',
  'Akira Vol 4',
  'Akira Vol 5',
  'Akira Vol 6',
  'Preacher Vol 1',
  'Preacher Vol 2',
  'Y: O Último Homem Vol 1',
  'Y: O Último Homem Vol 2',
  'Homem-Aranha: A Última Caçada de Kraven',
  'Demolidor: A Queda de Murdock',
]

const generateGibis = (): Item[] => {
  return baseGibis.map((nome, index) => {
    let preco = 0
    if (index >= 5 && index < 13) preco = 30 // 8 items * 30 = 240
    if (index >= 13 && index < 17) preco = 20 // 4 items * 20 = 80
    if (index === 17) preco = 24 // 1 item * 24 = 24. Total = 344

    // Make most items high urgency to reach the 29 KPI
    const urgencia = index < 27 ? 'Alta' : 'Baixa'

    return {
      id: `gibi-${index + 1}`,
      nome,
      categoria: 'Gibis',
      marcaModelo: 'Várias',
      estado: 'Como novo',
      funciona: 'N/A',
      defeitos: 'Nenhum',
      acessorios: 'Nenhum',
      cidade: 'Maringá-PR',
      aceitaEnvio: 'Sim',
      preco,
      urgencia,
      observacoes: '',
      status: 'Disponível',
      score: index < 5 ? 10 : Math.floor(Math.random() * 5) + 4,
    }
  })
}

export const MOCK_INVENTORY: Item[] = [
  {
    id: 'eletro-1',
    nome: 'Purificador Blue OXI HE',
    categoria: 'Eletrônicos',
    marcaModelo: 'TopLyfe Blue OXI HE',
    estado: 'Novo',
    funciona: 'Sim',
    defeitos: 'Nenhum',
    acessorios: 'Garantia 2 anos',
    cidade: 'Maringá-PR',
    aceitaEnvio: 'Sim',
    preco: 600,
    urgencia: 'Alta',
    observacoes: '',
    status: 'Disponível',
    score: 7,
  },
  {
    id: 'eletro-2',
    nome: 'PS Vita',
    categoria: 'Eletrônicos',
    marcaModelo: 'Sony PCH-2001 Slim 8GB',
    estado: 'Como novo',
    funciona: 'Sim',
    defeitos: 'Nenhum',
    acessorios: 'Carregador case PS All-Stars',
    cidade: 'Maringá-PR',
    aceitaEnvio: 'Sim',
    preco: 1650,
    urgencia: 'Alta',
    observacoes: '',
    status: 'Disponível',
    score: 11,
  },
  ...generateGibis(),
]
