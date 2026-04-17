/* src/App.jsx */
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Webcam from 'react-webcam';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { Mic, MicOff, Upload, CheckCircle, BarChart2, MessageSquare, User } from 'lucide-react';
import { generateInterviewQuestions, analyzeCandidateAnswer } from './gemini';

// --- PDF WORKER ---
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

// --- AVATAR COMPONENT ---
function Avatar({ isSpeaking }) {
  const { scene } = useGLTF('/avatar.glb');
  
  const headRef = useRef(null);
  const jawCandidates = useRef([]); 
  const leftArmRef = useRef(null);
  const rightArmRef = useRef(null);

  useEffect(() => {
    if (scene) {
      jawCandidates.current = []; // Reset list

      scene.traverse((child) => {
        if (child.isBone) {
          const name = child.name.toLowerCase();

          // 1. FIND ARMS
          if (name.includes('arm') || name.includes('shoulder')) {
             if (name.includes('left') && !name.includes('fore')) leftArmRef.current = child;
             if (name.includes('right') && !name.includes('fore')) rightArmRef.current = child;
          }

          // 2. FIND HEAD
          if (name.includes('head')) {
            headRef.current = child;
            
            // 3. FIND JAW CANDIDATES (Children of Head)
            child.children.forEach((grandchild) => {
              if (grandchild.isBone) {
                const gcName = grandchild.name.toLowerCase();
                // Filter out Eyes/Ears, keep Jaw/Teeth/Tongue
                if (!gcName.includes('eye') && !gcName.includes('lid') && !gcName.includes('brow') && !gcName.includes('ear')) {
                  jawCandidates.current.push(grandchild);
                }
              }
            });
          }
        }
      });
    }
  }, [scene]);

  // Set Arms Down
  useEffect(() => {
    if (leftArmRef.current) leftArmRef.current.rotation.z = -1.3; 
    if (rightArmRef.current) rightArmRef.current.rotation.z = 1.3; 
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // ANIMATE JAW (Z-AXIS / VERTICAL)
    if (isSpeaking) {
      const openAmount = Math.abs(Math.sin(time * 15)) * 0.2 + 0.05;
      
      jawCandidates.current.forEach(bone => {
         bone.rotation.x = openAmount-0.13;
         bone.rotation.y = openAmount; 
      });
    } else {
      // Close jaw
      jawCandidates.current.forEach(bone => {
         bone.rotation.x = 0;
      });
    }

    // ANIMATE HEAD (Nodding)
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(time * 0.5) * 0.02;
      if (isSpeaking) {
        headRef.current.rotation.x = Math.sin(time * 10) * 0.05;
      } else {
        headRef.current.rotation.x = 0;
      }
    }
  });

  return <primitive object={scene} scale={2.8} position={[0, -9, 0]} rotation={[0, 0, 0]} />;
}

// --- MAIN APP ---
export default function App() {
  const recognitionRef = useRef(null);
  const [step, setStep] = useState('upload');
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (step === 'interview' && questions[currentQIndex]) {
      // 500ms delay before speaking to let UI render
      setTimeout(() => speak(questions[currentQIndex]), 500);
    }
  }, [step, currentQIndex, questions]);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setStep('scanning');
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const typedarray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map(s => s.str).join(" ");
        }
        startInterview(fullText);
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => startInterview(e.target.result);
      reader.readAsText(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] } });

  const startInterview = async (text) => {
    const aiQuestions = await generateInterviewQuestions(text);
    setQuestions(aiQuestions);
    setStep('interview');
  };

  // --- SAFE SPEAK FUNCTION (Fixes Message Channel Error) ---
  const speak = (text) => {
    // 1. Cancel previous speech
    window.speechSynthesis.cancel();

    // 2. Add 50ms delay to prevent browser extension conflicts
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      // Try to find a good English voice
      utterance.voice = voices.find(v => v.lang.includes('en-US')) || voices[0];
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      // Catch errors so they don't break the app
      utterance.onerror = (e) => {
        console.warn("Speech warning:", e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }, 50);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) return alert("Use Chrome");
    if (recognitionRef.current) recognitionRef.current.stop();
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = () => { setIsListening(true); setUserAnswer(''); };
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) finalTranscript += event.results[i][0].transcript;
      setUserAnswer(finalTranscript);
    };
    recognition.onerror = (event) => { if (event.error === 'not-allowed') setIsListening(false); };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTimeout(() => analyzeAnswer(userAnswer), 500);
    }
  };

  const analyzeAnswer = async (answer) => {
    setStep('feedback');
    const result = await analyzeCandidateAnswer(questions[currentQIndex], answer);
    setAiFeedback(result);
    speak(result.feedback);
  };

  const nextQuestion = () => {
    setStep('interview');
    setAiFeedback(null);
    setUserAnswer('');
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      alert("Interview Finished!");
      setStep('upload');
      setCurrentQIndex(0);
    }
  };

  // --- STYLES ---
  const styles = {
    container: { display: 'flex', height: '100vh', width: '100vw', background: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif', overflow: 'hidden' },
    sidebar: { width: '250px', background: 'rgba(15, 23, 42, 0.95)', borderRight: '1px solid #1e293b', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 },
    main: { flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
    card: { background: 'rgba(30, 41, 59, 0.9)', borderRadius: '16px', border: '1px solid #334155', padding: '20px', overflow: 'hidden', position: 'relative' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '600px', paddingBottom: '50px' },
    button: { padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' },
    transcriptBox: { background: 'rgba(15, 23, 42, 0.8)', borderRadius: '8px', padding: '15px', height: '150px', overflowY: 'auto', border: '1px solid #334155', marginTop: '10px', fontSize: '0.95rem', lineHeight: '1.5', color: '#cbd5e1' }
  };

  return (
    <div style={styles.container}>
      {/* UI LAYER */}
      <div style={styles.sidebar}>
        <h2 style={{ color: '#3b82f6', fontSize: '1.5rem', fontWeight: 'bold' }}>JobMirror</h2>
        <div style={{ color: '#94a3b8', display: 'flex', gap: '10px', alignItems: 'center' }}><BarChart2 size={20} /> Dashboard</div>
        <div style={{ color: '#fff', background: '#1e293b', padding: '10px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}><MessageSquare size={20} /> Interview</div>
        <div style={{ color: '#94a3b8', display: 'flex', gap: '10px', alignItems: 'center' }}><User size={20} /> Profile</div>
      </div>

      <div style={styles.main}>
        {step === 'upload' && (
          <div style={{ ...styles.card, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', width: '100%', minHeight: '500px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Start Your Mock Interview</h1>
            <div {...getRootProps()} style={{ border: '2px dashed #475569', padding: '60px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.8)', cursor: 'pointer', maxWidth: '600px', width: '100%' }}>
              <input {...getInputProps()} />
              <Upload size={50} style={{ color: '#3b82f6', marginBottom: '15px' }} />
              <p style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>Drag & drop your Resume (PDF)</p>
              <p style={{ color: '#64748b', marginTop: '10px' }}>AI will analyze it and generate custom questions.</p>
            </div>
          </div>
        )}

        {step === 'scanning' && (
          <div style={{ ...styles.card, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <h2>🤖 Reading Resume & Preparing Questions...</h2>
          </div>
        )}

        {(step === 'interview' || step === 'feedback') && (
          <div style={styles.grid}>
            {/* LEFT COLUMN: AVATAR & CAMERA BACKGROUND */}
            <div style={{ ...styles.card, display: 'flex', flexDirection: 'column', minHeight: '600px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', zIndex: 2 }}>
                <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>AI Interviewer</span>
                <div style={{ background: isSpeaking ? '#22c55e' : '#64748b', width: '10px', height: '10px', borderRadius: '50%' }}></div>
              </div>

              <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                {/* WEBCAM AS BACKGROUND */}
                <Webcam audio={false} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
                <Canvas camera={{ position: [0, 0, 5], fov: 35 }} style={{ zIndex: 1 }}>
                  <ambientLight intensity={1.5} />
                  <pointLight position={[10, 10, 10]} />
                  <Suspense fallback={null}>
                    <Avatar isSpeaking={isSpeaking} />
                  </Suspense>
                </Canvas>
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#0f172a', borderRadius: '12px', borderLeft: '4px solid #3b82f6', zIndex: 2 }}>
                <h3 style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>Current Question:</h3>
                <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{questions[currentQIndex]}</p>
              </div>
            </div>

            {/* RIGHT COLUMN: USER */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ ...styles.card, height: '350px', padding: '0', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                <Webcam audio={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '15px', left: '15px', background: 'rgba(0,0,0,0.6)', padding: '5px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                  Candidate (You)
                </div>
              </div>

              <div style={{ ...styles.card, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Your Answer</h3>
                  <button
                    onClick={isListening ? stopListening : startListening}
                    style={{ ...styles.button, background: isListening ? '#ef4444' : '#3b82f6', color: 'white' }}
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    {isListening ? "Stop & Submit" : "Start Answering"}
                  </button>
                </div>
                <div style={styles.transcriptBox}>
                  {userAnswer || <span style={{ color: '#64748b', fontStyle: 'italic' }}>Listening... Speak clearly...</span>}
                </div>
                {step === 'feedback' && aiFeedback && (
                  <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ color: '#22c55e', margin: 0, display: 'flex', gap: '5px' }}><CheckCircle size={18} /> Analysis</h4>
                      <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>{aiFeedback.score}/100</span>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '5px' }}>{aiFeedback.feedback}</p>
                    <button onClick={nextQuestion} style={{ ...styles.button, background: '#1e293b', border: '1px solid #475569', color: '#fff', marginTop: '10px', width: '100%', justifyContent: 'center' }}>
                      Next Question →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}