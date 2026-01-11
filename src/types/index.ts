export type ChoiceLetter = "A" | "B" | "C";

export interface Chain {
  id: string;
  slug: string;
  title: string;
  createdAt: Date;
  createdByDeviceId: string;
}

export interface Node {
  id: string;
  chainId: string;
  parentNodeId: string | null;
  parentGuessChoice: ChoiceLetter | null;
  creatorDeviceId: string;
  creatorName: string | null;
  creatorAvatar: string | null;
  statementA: string;
  statementB: string;
  statementC: string;
  lieChoice: ChoiceLetter;
  createdAt: Date;
  status: "active" | "removed" | "flagged";
}

export interface Guess {
  id: string;
  nodeId: string;
  guesserDeviceId: string;
  choice: ChoiceLetter;
  isCorrect: boolean;
  createdAt: Date;
}

export interface NodeWithChildren extends Node {
  children: NodeWithChildren[];
  guessCount: number;
  correctGuessCount: number;
}

export interface TreeData {
  root: NodeWithChildren;
  totalNodes: number;
  totalBranches: number;
}

export type GamePhase = 
  | "loading"
  | "guess"
  | "reveal"
  | "create"
  | "share"
  | "explore";

export interface GameState {
  phase: GamePhase;
  currentNode: Node | null;
  selectedChoice: ChoiceLetter | null;
  isCorrect: boolean | null;
  newNodeId: string | null;
}

export interface Statement {
  text: string;
  letter: ChoiceLetter;
}
