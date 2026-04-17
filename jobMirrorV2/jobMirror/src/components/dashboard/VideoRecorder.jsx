// src/components/dashboard/VideoRecorder.jsx
import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";

/**
 * VideoRecorder (controlled by parent via ref)
 * Exposes methods:
 *  - startCameraPrepare() -> starts camera and prepares MediaRecorder (does not start recording)
 *  - startRecording() -> starts recording immediately (assumes prepared)
 *  - stopRecording()
 *  - discardRecording()
 *  - isPrepared() -> returns boolean
 *
 * Props:
 *  - onRecorded(blob)
 *  - mimeType (default "video/webm;codecs=vp9,opus")
 *  - maxDuration (seconds) optional, default 180
 */
const VideoRecorder = forwardRef(
  (
    { onRecorded, mimeType = "video/webm;codecs=vp9,opus", maxDuration = 180 },
    ref
  ) => {
    const liveVideoRef = useRef(null);
    const playbackRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);

    const [permissionState, setPermissionState] = useState("idle"); // idle|pending|granted|denied
    const [prepared, setPrepared] = useState(false); // camera + media recorder created
    const [recording, setRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [error, setError] = useState(null);

    // timing
    const [elapsed, setElapsed] = useState(0);
    const elapsedRef = useRef(0);
    const timerRef = useRef(null);

    // utility: start camera (getUserMedia)
    const startCamera = async () => {
      setError(null);
      try {
        setPermissionState("pending");
        const s = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" },
          audio: true,
        });
        streamRef.current = s;
        if (liveVideoRef.current) liveVideoRef.current.srcObject = s;
        setPermissionState("granted");
        return s;
      } catch (e) {
        setError(e?.message || String(e));
        setPermissionState("denied");
        throw e;
      }
    };

    // prepare media recorder but DO NOT start recording
    const prepareMediaRecorder = (s) => {
      try {
        if (!s) throw new Error("No media stream to prepare from.");
        chunksRef.current = [];
        // create MediaRecorder instance but don't start
        const mr = new MediaRecorder(s, { mimeType });
        mediaRecorderRef.current = mr;
        mr.ondataavailable = (ev) => {
          if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
        };
        mr.onstop = () => {
          const blob = new Blob(chunksRef.current, {
            type: mimeType.split(";")[0] || "video/webm",
          });
          setRecordedBlob(blob);
          if (onRecorded) onRecorded(blob);
        };
        setPrepared(true);
      } catch (e) {
        setError(e?.message || String(e));
        setPrepared(false);
        console.error("prepareMediaRecorder error", e);
      }
    };

    // public: start camera + prepare
    const startCameraPrepare = async () => {
      try {
        const s = await startCamera();
        prepareMediaRecorder(s);
        return true;
      } catch (e) {
        return false;
      }
    };

    // recording controls
    const startTimer = () => {
      clearInterval(timerRef.current);
      elapsedRef.current = 0;
      setElapsed(0);
      timerRef.current = setInterval(() => {
        elapsedRef.current += 1;
        setElapsed(elapsedRef.current);
        if (elapsedRef.current >= maxDuration) {
          // auto-stop when reaching max
          stopRecording();
        }
      }, 1000);
    };

    const stopTimer = () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };

    const startRecording = () => {
      if (!prepared || !mediaRecorderRef.current) {
        setError("Recorder not prepared. Start camera first.");
        return;
      }
      try {
        chunksRef.current = [];
        mediaRecorderRef.current.start(200); // timeslice
        setRecording(true);
        startTimer();
      } catch (e) {
        setError(e?.message || String(e));
        console.error("startRecording error", e);
      }
    };

    const stopRecording = () => {
      try {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === "recording"
        ) {
          mediaRecorderRef.current.stop();
        }
      } catch (e) {
        console.warn("stopRecording", e);
      } finally {
        setRecording(false);
        stopTimer();
      }
    };

    const discardRecording = () => {
      setRecordedBlob(null);
      if (playbackRef.current) {
        playbackRef.current.pause();
        playbackRef.current.src = "";
      }
      setElapsed(0);
      chunksRef.current = [];
    };

    // preview setup when blob changes
    useEffect(() => {
      if (!recordedBlob || !playbackRef.current) return;
      const url = URL.createObjectURL(recordedBlob);
      playbackRef.current.src = url;
      playbackRef.current.load();
      return () => URL.revokeObjectURL(url);
    }, [recordedBlob]);

    // cleanup
    useEffect(() => {
      return () => {
        try {
          mediaRecorderRef.current?.state === "recording" &&
            mediaRecorderRef.current?.stop();
        } catch {}
        streamRef.current?.getTracks?.()?.forEach((t) => t.stop());
        stopTimer();
      };
    }, []);

    // methods exposed to parent via ref
    useImperativeHandle(ref, () => ({
      startCameraPrepare,
      startRecording,
      stopRecording,
      discardRecording,
      isPrepared: () => prepared,
      isRecording: () => recording,
      getRecordedBlob: () => recordedBlob,
    }));

    const formatTime = (s) => {
      const mm = String(Math.floor(s / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      return `${mm}:${ss}`;
    };

    const progressPct = Math.min(
      100,
      Math.round((elapsed / Math.max(1, maxDuration)) * 100)
    );

    return (
      <div className="space-y-4">
        {error && <div className="text-sm text-red-400">Error: {error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Live camera */}
          <div className="bg-gradient-to-b from-[#061027] to-[#071226] border border-gray-800 rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-400">Live Camera</div>
                {recording ? (
                  <div className="inline-flex items-center gap-2 text-red-400 font-semibold">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    Recording
                  </div>
                ) : prepared ? (
                  <div className="text-xs text-green-300">Ready</div>
                ) : (
                  <div className="text-xs text-gray-400">Idle</div>
                )}
              </div>

              <div className="text-xs text-gray-400">
                Format:{" "}
                <span className="text-gray-200 ml-1">
                  {mimeType.split(";")[0]}
                </span>
              </div>
            </div>

            <div className="relative rounded-md overflow-hidden bg-black border border-gray-900">
              <video
                ref={liveVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-64 object-cover bg-black"
              />
              {!streamRef.current && permissionState !== "denied" && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Camera inactive
                </div>
              )}
              {permissionState === "denied" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <div className="text-red-400 mb-2">Camera access denied</div>
                  <div className="text-xs text-gray-400">
                    Allow camera & mic in your browser settings.
                  </div>
                </div>
              )}
            </div>

            {/* status / timer */}
            <div className="mt-4 flex items-center gap-3">
              {!prepared ? (
                <div className="text-sm text-gray-400">
                  Click 'Enable Camera & Voice' above to prepare.
                </div>
              ) : (
                <>
                  <div className="text-sm text-gray-300">
                    <div>
                      Elapsed:{" "}
                      <span className="font-semibold text-white ml-1">
                        {formatTime(elapsed)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Limit: {formatTime(maxDuration)}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* progress bar */}
            <div className="mt-3">
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Playback and controls */}
          <div className="bg-gradient-to-b from-[#061027] to-[#071226] border border-gray-800 rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-400">Recording Preview</div>
              <div className="text-xs text-gray-500">
                {recordedBlob ? "Saved" : "No recording"}
              </div>
            </div>

            <div className="relative rounded-md overflow-hidden bg-black border border-gray-900 flex-1 flex items-center justify-center">
              {!recordedBlob ? (
                <div className="text-gray-500 text-sm">
                  No recording yet — record your answer and preview here
                </div>
              ) : (
                <video
                  ref={playbackRef}
                  controls
                  className="w-full h-64 object-contain bg-black"
                />
              )}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => {
                  if (recordedBlob) {
                    const url = URL.createObjectURL(recordedBlob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `jobmirror_interview_${Date.now()}.webm`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  }
                }}
                disabled={!recordedBlob}
                className="px-3 py-2 rounded-lg bg-white/5 text-white border border-gray-700"
              >
                Download
              </button>

              <button
                onClick={async () => {
                  if (!recordedBlob) return;
                  try {
                    const fd = new FormData();
                    fd.append(
                      "file",
                      recordedBlob,
                      `interview_${Date.now()}.webm`
                    );
                    // TODO: replace with real API call
                    await new Promise((r) => setTimeout(r, 800));
                    alert("Upload simulated — replace with real API call");
                  } catch (e) {
                    setError(e?.message || String(e));
                  }
                }}
                disabled={!recordedBlob}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white"
              >
                Upload
              </button>

              <button
                onClick={discardRecording}
                disabled={!recordedBlob}
                className="ml-auto px-3 py-2 rounded-lg bg-white/3 text-gray-200 border border-gray-700"
              >
                Discard
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-400">
              Tip: Download to keep a local copy, or Upload to send to your
              backend for processing.
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default VideoRecorder;
