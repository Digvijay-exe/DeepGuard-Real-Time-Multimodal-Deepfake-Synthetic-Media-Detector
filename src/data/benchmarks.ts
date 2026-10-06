import { BenchmarkSample } from '../types/detection';

export const BENCHMARK_SAMPLES: BenchmarkSample[] = [
  {
    id: 'sample_fake_1',
    title: 'Executive Deepfake Face-Swap & Voice Clone',
    category: 'Synthetic Video',
    type: 'video',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    expectedFake: true,
    description: 'High-resolution deepfake featuring facial warp boundary blending along jawline and HiFi-GAN vocoder spectral cliff.',
    sampleKeyframes: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=224&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=224&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=224&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=224&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=224&auto=format&fit=crop&q=80'
    ],
    audioWaveformSample: [0.12, 0.45, 0.82, 0.95, 0.88, 0.62, 0.31, 0.15, 0.78, 0.91, 0.44, 0.22, 0.65, 0.85, 0.92, 0.71, 0.38, 0.12, 0.49, 0.68]
  },
  {
    id: 'sample_fake_2',
    title: 'Diffusion-Generated Photorealistic Portrait',
    category: 'Diffusion Image',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    expectedFake: true,
    description: 'Generative portrait exhibiting corneal specular reflection mismatch, unnatural ear cartilage symmetry, and texture smoothing.',
    sampleKeyframes: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=224&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=224&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=224&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=224&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=224&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'sample_fake_3',
    title: 'Synthetic Voice Cloning Urgent Wire Transfer Scam',
    category: 'Voice Clone',
    type: 'audio',
    url: 'https://actions.google.com/sounds/v1/speech/person_speaking.ogg',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&auto=format&fit=crop&q=80',
    expectedFake: true,
    description: 'Neural cloned audio stream displaying constant pitch cadence without organic biological respiration breaks.',
    sampleKeyframes: [],
    audioWaveformSample: [0.05, 0.18, 0.72, 0.89, 0.91, 0.88, 0.85, 0.79, 0.82, 0.88, 0.90, 0.86, 0.81, 0.84, 0.89, 0.87, 0.82, 0.75, 0.60, 0.20]
  },
  {
    id: 'sample_real_1',
    title: 'Authentic C-SPAN Public Briefing Broadcast',
    category: 'Authentic Media',
    type: 'video',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    expectedFake: false,
    description: 'Natural broadcast footage with authentic micro-saccades, physical lens depth-of-field blur, and room acoustic reverberation.',
    sampleKeyframes: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=224&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=224&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=224&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=224&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=224&auto=format&fit=crop&q=80'
    ],
    audioWaveformSample: [0.02, 0.15, 0.42, 0.78, 0.35, 0.12, 0.08, 0.25, 0.55, 0.72, 0.48, 0.19, 0.05, 0.14, 0.38, 0.65, 0.32, 0.11, 0.04, 0.01]
  }
];

export const ROC_CURVE_DATA = [
  { fpr: 0.00, tpr: 0.00, threshold: 1.00 },
  { fpr: 0.01, tpr: 0.28, threshold: 0.95 },
  { fpr: 0.02, tpr: 0.52, threshold: 0.90 },
  { fpr: 0.03, tpr: 0.71, threshold: 0.85 },
  { fpr: 0.04, tpr: 0.82, threshold: 0.75 },
  { fpr: 0.06, tpr: 0.89, threshold: 0.65 },
  { fpr: 0.08, tpr: 0.94, threshold: 0.50 },
  { fpr: 0.12, tpr: 0.96, threshold: 0.40 },
  { fpr: 0.18, tpr: 0.98, threshold: 0.30 },
  { fpr: 0.25, tpr: 0.99, threshold: 0.20 },
  { fpr: 0.40, tpr: 0.995, threshold: 0.10 },
  { fpr: 1.00, tpr: 1.00, threshold: 0.00 },
];
