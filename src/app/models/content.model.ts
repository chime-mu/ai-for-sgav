export interface Slide {
  id: string;
  slideNumber: number;
  title: string;
  keywords: string;
  details: string;
  image: string;
  imageAlt: string;
  duration?: string;
  speakerNotes?: string;
}

export interface Exercise {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  shortDescription: string;
  fullDescription: string;
  estimatedTime?: string;
  resources?: Resource[];
}

export interface Resource {
  title: string;
  url: string;
}

export interface Metadata {
  version: string;
  lastUpdated: string;
  workshopDuration: string;
}

export interface Content {
  metadata: Metadata;
  slides: Slide[];
  exercises: Exercise[];
  angularJokes: string[];
}

export interface BuildHistoryMetadata {
  lastUpdated: string;
  totalCommits: number;
  extractedBy: string;
}

export interface Commit {
  sha: string;
  shaShort: string;
  author: string;
  timestamp: string;
  timestampReadable: string;
  summary: string;
  fullMessage: string;
  prompt: string | null;
  filesChanged?: number;
  insertions?: number;
  deletions?: number;
  phase: string;
}

export interface BuildHistory {
  metadata: BuildHistoryMetadata;
  commits: Commit[];
}
