import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

export default function SpeechRecognitionButton({ onTranscript, isListening, setIsListening }) {
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript.trim()) {
        onTranscript(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.warn('[Speech Recognition] Error:', event.error);
      if (setIsListening) setIsListening(false);
    };

    recognition.onend = () => {
      if (setIsListening) setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscript, setIsListening]);

  const toggleListening = () => {
    if (!supported) {
      alert('Speech-to-Text is not supported by your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      if (setIsListening) setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        if (setIsListening) setIsListening(true);
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        isListening
          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-500/20'
          : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750 border border-slate-700'
      }`}
      title={isListening ? "Stop voice dictation" : "Dictate your answer with voice"}
    >
      {isListening ? (
        <>
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <Mic className="w-3.5 h-3.5 text-rose-400" />
          <span>Listening (Speak now)...</span>
        </>
      ) : (
        <>
          <Mic className="w-3.5 h-3.5 text-indigo-400" />
          <span>Voice Dictation (Mic)</span>
        </>
      )}
    </button>
  );
}
