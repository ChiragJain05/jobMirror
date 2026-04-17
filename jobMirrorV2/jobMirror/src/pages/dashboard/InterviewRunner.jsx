// src/pages/dashboard/InterviewRunner.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoRecorder from "../../components/dashboard/VideoRecorder";

/**
 * InterviewRunner (controlled flow)
 * Flow:
 * 1) User clicks "Enable Camera & Voice" -> triggers camera permission + prepares recorder
 * 2) Once prepared, UI shows "Start Interview" button (enabled only when prepared)
 * 3) User clicks "Start Interview" -> 3..2..1 countdown -> actual recording starts
 * 4) User can Stop to end recording
 */

const QUESTIONS = {
  technical:
    "Implement a function to detect cycles in a directed graph. Explain your approach and state the time and space complexity.",
  behavioral:
    "Tell me about a time you faced conflict in a team and how you resolved it using the STAR method. Describe the situation, the task, the actions you took, and the results.",
  case: "Design a queueing system that supports delayed tasks for millions of users. Walk through high-level components, scaling considerations, and trade-offs.",
};

export default function InterviewRunner() {
  const { type } = useParams(); // 'technical' | 'behavioral' | 'case'
  const navigate = useNavigate();
  const recorderRef = useRef(null);

  const [lastBlob, setLastBlob] = useState(null);

  // speech state
  const synthRef = useRef(window.speechSynthesis);
  const utterRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  const [voiceName, setVoiceName] = useState(null);

  // flow states
  const [prepared, setPrepared] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  // transcript toggle
  const [showTranscript, setShowTranscript] = useState(false);

  const humanTitle = () => {
    if (type === "behavioral") return "Behavioral Interview";
    if (type === "case") return "Case / System Design Interview";
    return "Technical Interview";
  };

  const getQuestion = () => QUESTIONS[type] ?? QUESTIONS.technical;

  // speech helpers
  const createUtterance = (text) => {
    if (!("speechSynthesis" in window)) return null;
    const u = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices?.() || [];
    const preferred =
      voices.find((v) => /en-(us|gb)|google/i.test(v.lang + v.name)) ||
      voices[0];
    if (preferred) {
      u.voice = preferred;
      setVoiceName(preferred.name);
    }
    u.rate = 1;
    u.pitch = 1;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    return u;
  };

  const speakQuestion = (stopFirst = true) => {
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis not supported in this browser.");
      return;
    }
    try {
      if (stopFirst) synthRef.current.cancel();
      const u = createUtterance(getQuestion());
      if (!u) return;
      utterRef.current = u;
      synthRef.current.speak(u);
    } catch (e) {
      console.error("speech error", e);
    }
  };

  const stopSpeaking = () => {
    try {
      synthRef.current.cancel();
      utterRef.current = null;
      setSpeaking(false);
    } catch (e) {
      console.warn("stopSpeaking", e);
    }
  };

  // Called when user presses "Enable Camera & Voice"
  const handleEnable = async () => {
    setIsPreparing(true);
    // Speak the question once (non-blocking)
    speakQuestion(true);

    // Ask camera/mic permission and prepare recorder
    const ok = await recorderRef.current.startCameraPrepare();
    setIsPreparing(false);
    setPrepared(!!ok);
    // if prepared true, UI shows Start Interview button
  };

  // Start interview: countdown then start recording (guarded by isPrepared)
  const handleStartInterview = () => {
    const isPrepared = recorderRef?.current?.isPrepared?.() ?? false;
    if (!isPrepared) {
      speakQuestion(true);
      alert(
        "Please enable camera & microphone first (click 'Enable Camera & Voice')."
      );
      return;
    }

    if (isRecording) return;

    // Play short countdown (3..2..1)
    setCountdown(3);
    let c = 3;
    countdownRef.current = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(countdownRef.current);
        setCountdown(0);
        // start actual recording
        recorderRef.current.startRecording();
        setIsRecording(true);
      }
    }, 1000);
  };

  const handleStopInterview = () => {
    recorderRef.current.stopRecording();
    setIsRecording(false);
  };

  // Called by VideoRecorder via onRecorded
  const handleRecorded = (blob) => {
    setLastBlob(blob);
    setIsRecording(false);
  };

  // Stop speaking when unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      clearInterval(countdownRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{humanTitle()}</h2>
          <p className="text-sm text-gray-400">
            Follow the flow: enable camera & voice, then start the interview
            when you're ready.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              stopSpeaking();
              navigate("/dashboard/interviews");
            }}
            className="px-3 py-2 rounded-md border border-gray-700 text-gray-200"
          >
            Back
          </button>
        </div>
      </div>

      {/* layout */}
      <div className="grid grid-cols-1  gap-4">
        {/* left: instructions + speech controls + transcript toggle */}
        <div className="lg:col-span-2 bg-gradient-to-b from-[#071226] to-[#061226] p-6 rounded-xl border border-gray-800 flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Instructions</h3>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>
                  Click <strong>Enable Camera & Voice</strong> to grant camera &
                  mic permissions and hear the question.
                </li>
                <li>
                  When ready, click <strong>Start Interview</strong>. A 3-second
                  countdown plays before recording begins.
                </li>
                <li>
                  Speak clearly, be structured, and keep answers focused. You
                  can re-record if needed.
                </li>
              </ul>
            </div>

            <div className="ml-auto text-sm text-gray-400">
              <div
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md ${
                  speaking
                    ? "bg-green-900 text-green-300"
                    : "bg-gray-900 text-gray-400"
                }`}
              >
                {speaking ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    Speaking
                  </>
                ) : (
                  <>Idle</>
                )}
              </div>

              <div className="text-xs text-gray-500 mt-2">
                Voice:{" "}
                <span className="text-gray-300 ml-1">
                  {voiceName ?? "default"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 items-center">
            {/* If not yet prepared, show Enable button */}
            {!prepared ? (
              <button
                onClick={handleEnable}
                disabled={isPreparing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold shadow"
                title="Click to allow camera & microphone"
              >
                {isPreparing ? "Preparing…" : "Enable Camera & Voice"}
              </button>
            ) : (
              <>
                {/* Start Interview button is visible and enabled only when recorder reports prepared */}
                <button
                  onClick={handleStartInterview}
                  disabled={
                    isRecording || !recorderRef?.current?.isPrepared?.()
                  }
                  className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md text-white font-bold shadow
                    ${isRecording ? "opacity-60 cursor-not-allowed" : ""}
                    ${
                      !recorderRef?.current?.isPrepared?.()
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                    }`}
                  title={
                    isRecording
                      ? "Interview is in progress"
                      : recorderRef?.current?.isPrepared?.()
                      ? "Start Interview"
                      : "Enable camera first"
                  }
                >
                  {isRecording ? "Recording…" : "Start Interview"}
                </button>

                {!isRecording ? (
                  <>
                    <button
                      onClick={() => speakQuestion(true)}
                      className="px-3 py-2 rounded-md border border-gray-700 text-gray-200"
                    >
                      Replay Question
                    </button>

                    <button
                      onClick={() => {
                        recorderRef.current &&
                          recorderRef.current.discardRecording();
                        window.location.reload();
                      }}
                      className="px-3 py-2 rounded-md bg-white/5 text-white"
                    >
                      Reset
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStopInterview}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-bold"
                  >
                    Stop Interview
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => setShowTranscript((s) => !s)}
              className="ml-auto px-3 py-2 rounded-md bg-white/5 text-white"
            >
              {showTranscript ? "Hide Transcript" : "Show Transcript"}
            </button>

            {/* countdown indicator */}
            {countdown > 0 && (
              <div className="ml-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-2xl font-bold text-white">
                {countdown}
              </div>
            )}
          </div>

          {/* transcript */}
          {showTranscript && (
            <div className="mt-4 bg-black/30 p-4 rounded-md border border-gray-800 text-gray-200">
              <div className="text-sm leading-relaxed">{getQuestion()}</div>
              <div className="text-xs text-gray-400 mt-2">
                Transcript (visible for accessibility)
              </div>
            </div>
          )}
        </div>

        {/* right: recorder */}
        <aside className="bg-gradient-to-b from-[#071226] to-[#061226] p-6 rounded-xl border border-gray-800">
          <h4 className="text-md font-semibold mb-2">Session</h4>
          <p className="text-sm text-gray-400 mb-3">
            Record your oral answer. You can retry as many times as you want.
          </p>

          <VideoRecorder
            ref={recorderRef}
            onRecorded={handleRecorded}
            maxDuration={180}
          />

          {lastBlob && (
            <div className="mt-4 p-3 bg-black/30 rounded-md border border-gray-800 text-sm text-gray-300">
              Last recording ready. Use the preview panel to download or upload.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
