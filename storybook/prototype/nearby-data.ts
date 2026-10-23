// "Perto de mim" — usuários fictícios encontrados por geolocalização (nenhum dado real).
import house from "./assets/nearby-contact-house.jpg";
import woman from "./assets/nearby-contact-woman.jpg";
import purple from "./assets/nearby-contact-purple.jpg";
import man from "./assets/nearby-contact-man.jpg";

/** Área de busca (Figma › Perto de mim swipe): 300×401, origem no canto superior esquerdo. */
export const AREA = { w: 300, h: 401 };

interface Base { id: string; x: number; y: number; online?: boolean }
export interface KnownUser extends Base {
  kind: "contact"; name: string; photo: string; phone: string; pixKey: string;
  history: { title: string; kind: string; amount: number; date: string }[];
}
export interface OpenUser extends Base { kind: "open"; initials: string; phonePrefix: string }
export interface AnonUser extends Base { kind: "anon" }
export type NearbyUser = KnownUser | OpenUser | AnonUser;

// x/y = centro do avatar na área (posições do Figma)
export const NEARBY: NearbyUser[] = [
  { id: "c-man", kind: "contact", x: 111.5, y: 234, online: true, name: "Rafael Monteiro", photo: man, phone: "(11) 98765-4321", pixKey: "rafael.monteiro@email.com",
    history: [{ title: "Rafael Monteiro", kind: "Pix enviado", amount: -42.5, date: "18/out" }, { title: "Rafael Monteiro", kind: "Pix recebido", amount: 120, date: "02/out" }] },
  { id: "c-purple", kind: "contact", x: 165, y: 150.5, online: true, name: "Giuliana Cecilio", photo: purple, phone: "(15) 99812-3344", pixKey: "***.123.456-**",
    history: [{ title: "Giuliana Cecilio", kind: "Transferência por aproximação", amount: -25, date: "Hoje" }, { title: "Giuliana Cecilio", kind: "Pix enviado", amount: -15.9, date: "09/out" }] },
  { id: "c-woman", kind: "contact", x: 188.5, y: 215, name: "Ana Paula Souza", photo: woman, phone: "(11) 97654-1122", pixKey: "+55 11 97654-1122",
    history: [{ title: "Ana Paula Souza", kind: "Pix recebido", amount: 25, date: "Hoje" }] },
  { id: "c-house", kind: "contact", x: 140.5, y: 369.5, name: "Marcos Lima", photo: house, phone: "(15) 3212-4455", pixKey: "8f3c2a1e-4b7d-4e9a-9c11-2d5f6a7b8c90",
    history: [{ title: "Marcos Lima", kind: "Pix enviado", amount: -80, date: "28/set" }] },
  { id: "o-ls", kind: "open", x: 46.5, y: 72, initials: "LS", phonePrefix: "(15) 997..." },
  { id: "o-or", kind: "open", x: 253.5, y: 389.5, initials: "OR", phonePrefix: "(11) 983..." },
  { id: "a-1", kind: "anon", x: 70.5, y: 109.5 },
  { id: "a-2", kind: "anon", x: 87.5, y: 33.5 },
];
