export type MenuCategory =
  | "salgados"
  | "bebidas"
  | "doces"
  | "combos"
  | "acompanhamentos";

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image?: string;
  tags?: string[];
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "Hambúrguer Clássico",
    description: "Pão brioche, blend artesanal, queijo prato e molho especial.",
    price: 24.9,
    category: "salgados",
    tags: ["lanche", "carne"],
  },
  {
    id: 2,
    name: "Cheeseburger da Autoescola",
    description: "Hambúrguer com queijo duplo, bacon crocante e maionese da casa.",
    price: 28.5,
    category: "salgados",
    tags: ["lanche", "favorito"],
  },
  {
    id: 3,
    name: "Combo Aluno Expert",
    description: "Hambúrguer clássico + batata frita média + refrigerante lata.",
    price: 36.0,
    category: "combos",
    tags: ["combo", "lanche"],
  },
  {
    id: 4,
    name: "Batata Frita",
    description: "Porção generosa com tempero especial da Habilite.",
    price: 12.0,
    category: "acompanhamentos",
    tags: ["vegetariano"],
  },
  {
    id: 5,
    name: "Nuggets de Frango",
    description: "10 unidades com molho barbecue artesanal.",
    price: 18.5,
    category: "acompanhamentos",
    tags: ["frango"],
  },
  {
    id: 6,
    name: "Refrigerante Lata",
    description: "Escolha o seu sabor favorito: cola, guaraná ou laranja.",
    price: 6.5,
    category: "bebidas",
    tags: ["gelado"],
  },
  {
    id: 7,
    name: "Suco Natural",
    description: "Suco de laranja ou limão preparado na hora, sem conservantes.",
    price: 9.0,
    category: "bebidas",
    tags: ["natural", "sem açúcar"],
  },
  {
    id: 8,
    name: "Milk-shake",
    description: "Opções chocolate, morango ou baunilha com cobertura.",
    price: 14.5,
    category: "doces",
    tags: ["gelado", "cremoso"],
  },
  {
    id: 9,
    name: "Brownie com Sorvete",
    description: "Brownie quentinho com bola de sorvete de creme.",
    price: 16.9,
    category: "doces",
    tags: ["sobremesa"],
  },
  {
    id: 10,
    name: "Combo Revisão",
    description: "Cheeseburger da Autoescola + nuggets + refrigerante.",
    price: 42.0,
    category: "combos",
    tags: ["combo", "especial"],
  },
];

export function getMenuCategories(items: MenuItem[]) {
  return ["todos", ...new Set(items.map((item) => item.category))] as (
    | "todos"
    | MenuCategory
  )[];
}
