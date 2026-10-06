# 🛡️ DeepGuard: Multimodal Deepfake & Synthetic Media Detector

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0%2B-ee4c2c)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688)
![Manifest](https://img.shields.io/badge/Extension-Manifest%20V3-brightgreen)

DeepGuard is an end-to-end AI security tool that detects AI-generated deepfakes and audio cloning directly inside your browser using a dual Vision Transformer (ViT) and Wav2Vec2 backend.

---

## 📌 Features

- **Dual-Modality Analysis:** Evaluates facial/frame visual anomalies and acoustic voice-cloning signatures simultaneously.
- **Cross-Browser Extension:** Manifest V3 extension for Firefox and Chrome with context-menu triggers and quick popup UI.
- **Async Backend:** Powered by FastAPI, OpenCV, and Librosa for asynchronous media parsing.
- **Detailed Scoring:** Returns composite fraud probability alongside visual and audio sub-scores.

---

## 🛠️ Tech Stack

- **Machine Learning:** PyTorch, Hugging Face (`ViT-Base`, `Wav2Vec2`)
- **Backend API:** FastAPI, Uvicorn, Asyncio
- **Media Processing:** OpenCV, Librosa, FFmpeg
- **Frontend:** Vanilla JavaScript (MV3), HTML5, CSS3

---

## 🚀 Quickstart

### 1. Backend Setup

```bash
git clone [https://github.com/your-username/deepguard.git](https://github.com/your-username/deepguard.git)
cd deepguard

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
