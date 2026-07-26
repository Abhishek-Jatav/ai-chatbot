"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { loadMediaPipeScripts } from "@/lib/mediapipe-loader";
import { createGestureSocket } from "@/lib/websocket";

export function useVisionSystem() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const cameraRef = useRef<any>(null);
  const initializedRef = useRef(false);

  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let faceMesh: any;

    async function init() {
      try {
        setStatus("Loading AI Models...");

        // ✅ Load MediaPipe scripts
        await loadMediaPipeScripts();

        // Wait until FaceMesh is available on window
        if (!(window as any).FaceMesh) {
          throw new Error("FaceMesh not loaded on window");
        }

        if (!videoRef.current) return;

        setStatus("Starting Camera...");

        // ✅ Initialize FaceMesh safely
        const { FaceMesh } = window as any;

        faceMesh = new FaceMesh({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        // ✅ WebSocket
        wsRef.current = createGestureSocket();

        wsRef.current.onopen = () => {
          setStatus("Connected");
          toast.success("Vision System Connected");
        };

        wsRef.current.onerror = () => {
          setStatus("Connection Failed");
          toast.error("WebSocket Connection Failed");
        };

        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (!data.gesture) return;

          const container = document.getElementById("pdf-container");

          if (data.gesture === "BLINK") {
            toast("Scroll Down", { icon: "⬇️" });
            container?.scrollBy({ top: 300, behavior: "smooth" });
          }

          if (data.gesture === "LONG_BLINK") {
            toast("Scroll Up", { icon: "⬆️" });
            container?.scrollBy({ top: -300, behavior: "smooth" });
          }
        };

        // ✅ FaceMesh Results
        faceMesh.onResults((results: any) => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          canvas.width = results.image.width;
          canvas.height = results.image.height;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

          if (!results.multiFaceLandmarks?.length) return;

          const landmarks = results.multiFaceLandmarks[0];

          (window as any).drawConnectors(
            ctx,
            landmarks,
            (window as any).FACEMESH_TESSELATION,
            { color: "#00FFFF", lineWidth: 1 },
          );

          const leftEyeIndices = [33, 160, 158, 133, 153, 144];
          const rightEyeIndices = [362, 385, 387, 263, 373, 380];

          const left_eye = leftEyeIndices.map((i) => [
            landmarks[i].x,
            landmarks[i].y,
          ]);
          const right_eye = rightEyeIndices.map((i) => [
            landmarks[i].x,
            landmarks[i].y,
          ]);

          if (wsRef.current?.readyState === 1) {
            wsRef.current.send(JSON.stringify({ left_eye, right_eye }));
          }
        });

        // ✅ Camera
        cameraRef.current = new (window as any).Camera(videoRef.current, {
          onFrame: async () => {
            if (faceMesh) {
              await faceMesh.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        await cameraRef.current.start();
      } catch (error) {
        console.error("Vision System Error:", error);
        setStatus("Initialization Failed");
      }
    }

    init();

    return () => {
      wsRef.current?.close();
      cameraRef.current?.stop?.();
      faceMesh?.close?.();
    };
  }, []);

  return { videoRef, canvasRef, status };
}
