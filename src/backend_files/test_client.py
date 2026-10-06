#!/usr/bin/env python3
"""
DeepGuard API Test Client
Sends test payloads to verify /api/v1/detect and /health
"""

import sys
import json
import requests

API_BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"

def test_health():
    print(f"[*] Testing Health Endpoint: {API_BASE}/health")
    try:
        r = requests.get(f"{API_BASE}/health", timeout=5)
        print(f"    Status: {r.status_code}")
        print(f"    Body: {json.dumps(r.json(), indent=2)}")
    except Exception as e:
        print(f"    [!] Health check failed: {e}")

def test_detect():
    print(f"\n[*] Testing Detect Endpoint: {API_BASE}/api/v1/detect")
    payload = {
        "media_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "media_type": "video"
    }
    try:
        r = requests.post(f"{API_BASE}/api/v1/detect", json=payload, timeout=30)
        print(f"    Status: {r.status_code}")
        data = r.json()
        print(f"    Verdict is_fake: {data.get('is_fake')}")
        print(f"    Confidence: {data.get('confidence_score')}")
        print(f"    Visual Score: {data.get('visual_score')}")
        print(f"    Audio Score: {data.get('audio_score')}")
        print(f"    Explanation: {data.get('explanation')}")
    except Exception as e:
        print(f"    [!] Detect test failed: {e}")

if __name__ == "__main__":
    test_health()
    test_detect()
