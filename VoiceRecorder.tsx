import React, { useState, useRef, useEffect } from 'react';
import Button from './ui/Button';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onTranscriptionStart?: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  onTranscriptionStart,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);
  
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onRecordingComplete(audioBlob);
        if (onTranscriptionStart) {
          onTranscriptionStart();
        }
        
        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col items-center p-6 card">
      <div className="w-full mb-6 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
        {isRecording ? (
          <div className="flex flex-col items-center">
            <div className="flex space-x-1 mb-2">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i}
                  className="w-1 bg-primary"
                  style={{
                    height: `${Math.random() * 40 + 10}px`,
                    animationDuration: `${Math.random() * 0.5 + 0.2}s`,
                    animationName: 'pulse',
                    animationIterationCount: 'infinite',
                    animationDirection: 'alternate',
                  }}
                ></div>
              ))}
            </div>
            <div className="text-lg font-semibold">{formatTime(recordingTime)}</div>
          </div>
        ) : (
          <div className="text-gray-400">
            {audioURL ? 'Recording complete' : 'Ready to record'}
          </div>
        )}
      </div>
      
      <div className="flex space-x-4">
        {!isRecording ? (
          <Button 
            onClick={startRecording}
            disabled={!!audioURL}
          >
            Start Recording
          </Button>
        ) : (
          <Button 
            variant="secondary"
            onClick={stopRecording}
          >
            Stop Recording
          </Button>
        )}
        
        {audioURL && (
          <div className="mt-4">
            <audio controls src={audioURL} className="w-full"></audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
