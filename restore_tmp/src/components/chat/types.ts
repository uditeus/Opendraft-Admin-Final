export type ChatRole = "user" | "assistant";

export type ChatMessageType = "text" | "plan" | "document";

export interface ChatPlanData {
  angle: string;
  structure: string;
  audience: string;
  offer: string;
  objective: string;
  channel?: string;
}

export interface DocumentData {
  title: string;
  fileName: string;
  url: string;
  sizeBytes?: number;
  storagePath?: string;
}

export type TaskStepStatus = "pending" | "running" | "done" | "error";

export interface TaskStep {
  id: string;
  label: string;
  status: TaskStepStatus;
  tag?: string; // optional badge label
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;

  /**
   * V1: UI generativa no chat (ex.: plano). Fallback = "text".
   */
  type?: ChatMessageType;
  data?: ChatPlanData;

  /**
   * V2: Attachments (files, images)
   */
  attachments?: {
    id: string;
    type: "image" | "file";
    url: string;
    name: string;
  }[];

  metadata?: {
    thoughtTimeMs?: number;
    feedback?: 'like' | 'dislike' | null;
    aborted?: boolean;
    taskSteps?: TaskStep[];
    document?: DocumentData;
    suggestions?: string[] | null;
  };
}

export interface OpendraftResponse {
  stage: 'briefing' | 'thinking' | 'planning' | 'writing' | 'debrief';
  tasks: {
    id: number;
    title: string;
    status: 'pending' | 'active' | 'done';
    output: string | null;
  }[] | null;
  plan: {
    title: string;
    steps: {
      id: number;
      title: string;
      description: string;
      status: 'pending' | 'active' | 'done';
    }[];
  } | null;
  thinking: string | null;
  questions: {
    id: number;
    question: string;
    type: 'single' | 'multiple' | 'open' | 'single_with_other' | 'multiple_with_other';
    options?: string[];
  }[] | null;
  copy: string | null;
  debrief: string | null;
  suggestions: string[] | null;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];

  /**
   * V1: flag local (não persistente) para destacar projetos.
   */
  favorite?: boolean;

  /**
   * Flag local para controlar se mensagens foram carregadas.
   */
  messagesLoaded?: boolean;

  /**
   * Flag local para indicar se a IA está gerando resposta.
   */
  isTyping?: boolean;

  /**
   * Modo da geração atual (plan, analyze, write, etc.)
   */
  typingMode?: string;
}

export interface QuestionnaireOption {
  id: string;
  label: string;
  value: string;
  sublabel?: string;
}

export interface QuestionnaireStep {
  id: string;
  question: string;
  options: QuestionnaireOption[];
  type: "single" | "multiple";
  allowCustom?: boolean;
}

export interface QuestionnaireData {
  steps: QuestionnaireStep[];
}

// --- Composer Survey Types ---

export type SurveyQuestionType = "single" | "multi";

export interface SurveyQuestion {
  id: string;
  title: string;
  type: SurveyQuestionType;
  options: string[];
  allowOther?: boolean;
  otherLabel?: string;
}

export interface ComposerSurveyState {
  id: string; // unique survey instance id
  questions: SurveyQuestion[];
  answers: Record<string, string | string[]>; // questionId -> answer(s)
  currentQuestionIndex: number;
  isOpen: boolean;
  isSubmitting: boolean;
  context?: any;
}

export interface StartSurveyPayload {
  ui: "composer_survey";
  questions: SurveyQuestion[];
  context?: any; // extra context to pass back
}
