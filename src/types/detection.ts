export type MediaType = 'video' | 'image' | 'audio';

export interface DetectionResult {
  is_fake: boolean;
  confidence_score: number;
  visual_score: number;
  audio_score: number;
  frame_anomalies_detected: number;
  explanation: string;
  latency_ms?: number;
  model_breakdown?: {
    vit_patch_entropy: number;
    laplacian_variance: number;
    spectral_rolloff_khz: number;
    pitch_jitter_std: number;
    lip_sync_offset_ms: number;
  };
}

export interface BenchmarkSample {
  id: string;
  title: string;
  category: 'Synthetic Video' | 'Voice Clone' | 'Diffusion Image' | 'Authentic Media';
  type: MediaType;
  url: string;
  thumbnail: string;
  expectedFake: boolean;
  description: string;
  sampleKeyframes: string[];
  audioWaveformSample?: number[];
}

export interface RocPoint {
  fpr: number;
  tpr: number;
  threshold: number;
}
