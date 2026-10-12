import { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Video, User, Activity } from 'lucide-react';

export default function WebcamSimulator({ candidateName = 'Candidate', isSpeaking = false }) {
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [userDisabled, setUserDisabled] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    let currentStream = null;

    if (!userDisabled) {
      navigator.mediaDevices?.getUserMedia({ video: { width: 480, height: 360 }, audio: false })
        .then((stream) => {
          currentStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.log('Video play error:', e));
          }
          setStreamActive(true);
          setCameraError(false);
        })
        .catch((err) => {
          console.warn('[Webcam] Camera permission not granted or device absent:', err.message);
          setCameraError(true);
          setStreamActive(false);
        });
    } else {
      setStreamActive(false);
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [userDisabled]);

  const toggleCamera = () => {
    setUserDisabled(prev => !prev);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl aspect-video flex items-center justify-center group">
      {/* Live Video Feed */}
      {streamActive ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform scale-x-[-1]"
        />
      ) : (
        /* Virtual Candidate Avatar */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-400">
          <div className="relative mb-3">
            <div className={`w-20 h-20 rounded-full bg-slate-800 border-2 ${isSpeaking ? 'border-indigo-400 shadow-lg shadow-indigo-500/30' : 'border-slate-700'} flex items-center justify-center text-slate-300 transition-all`}>
              <User className="w-10 h-10 text-indigo-400" />
            </div>
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white animate-pulse">
                <Activity className="w-3 h-3" />
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-300">{candidateName}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {cameraError ? 'Camera unavailable (Virtual Mode)' : 'Camera toggled off'}
          </p>
        </div>
      )}

      {/* Overlay Status Bar */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-medium text-slate-200">
          <span className={`w-2 h-2 rounded-full ${streamActive ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
          <span>{streamActive ? 'LIVE REC' : 'INTERVIEW READY'}</span>
        </div>
      </div>

      {/* Candidate Name Badge */}
      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
        <Video className="w-3 h-3 text-indigo-400" />
        <span>{candidateName}</span>
      </div>

      {/* Controls Button */}
      <div className="absolute bottom-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity">
        <button
          onClick={toggleCamera}
          className="p-2 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title={streamActive ? "Turn off camera" : "Turn on camera"}
        >
          {streamActive ? <CameraOff className="w-3.5 h-3.5 text-rose-400" /> : <Camera className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      </div>
    </div>
  );
}
