import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Mic, CheckCircle2, ArrowRight, Play, Square, RotateCcw } from 'lucide-react';
import { QuestionData } from '../types';
import { speakText, stopSpeech, sfx, isSpeechRecognitionSupported } from '../utils/audio';

interface ReadAlongModalProps {
  question: QuestionData;
  pageNumber: number;
  totalPages: number;
  onContinue: () => void;
  isMuted: boolean;
}

export const ReadAlongModal: React.FC<ReadAlongModalProps> = ({
  question,
  pageNumber,
  totalPages,
  onContinue,
  isMuted,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);

  // Recording and playback states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecordedVoice, setIsPlayingRecordedVoice] = useState(false);
  const [spokenFeedback, setSpokenFeedback] = useState<string | null>(null);
  const [recordError, setRecordError] = useState<string | null>(null);

  // References for MediaRecorder and Audio player
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordedAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const recordTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const words = question.fullAnswer.split(' ');

  // Auto-play model audio on open
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isMuted) {
        handlePlayAudio();
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      stopSpeech();
      stopRecordingCleanup();
      if (recordedAudioPlayerRef.current) {
        recordedAudioPlayerRef.current.pause();
      }
    };
  }, []);

  const stopRecordingCleanup = () => {
    if (recordTimeoutRef.current) {
      clearTimeout(recordTimeoutRef.current);
    }
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => track.stop());
      activeStreamRef.current = null;
    }
  };

  // Play model speech synthesis
  const handlePlayAudio = () => {
    // If playing recorded voice, pause it
    if (recordedAudioPlayerRef.current) {
      recordedAudioPlayerRef.current.pause();
      setIsPlayingRecordedVoice(false);
    }

    setIsPlayingAudio(true);
    let currentIdx = 0;
    setActiveWordIndex(0);

    const interval = setInterval(() => {
      currentIdx += 1;
      if (currentIdx < words.length) {
        setActiveWordIndex(currentIdx);
      } else {
        clearInterval(interval);
      }
    }, 400);

    speakText(question.fullAnswer, {
      rate: 0.88,
      onEnd: () => {
        clearInterval(interval);
        setIsPlayingAudio(false);
        setActiveWordIndex(null);
      },
    });
  };

  // Start voice recording with MediaRecorder
  const handleStartRecording = async () => {
    sfx.playPop();
    stopSpeech();
    setIsPlayingAudio(false);
    setRecordError(null);

    // Stop existing playback
    if (recordedAudioPlayerRef.current) {
      recordedAudioPlayerRef.current.pause();
      setIsPlayingRecordedVoice(false);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      activeStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        setIsRecording(false);
        stopRecordingCleanup();
        sfx.playCorrect();
        setSpokenFeedback("Great job! Now tap 'Hear My Voice' below to listen! 🎧");
      };

      mediaRecorder.start();
      setIsRecording(true);
      setSpokenFeedback("🎙️ Recording... Say the sentence out loud!");

      // Also trigger SpeechRecognition if available for word check
      if (isSpeechRecognitionSupported()) {
        try {
          const SpeechRecognitionClass =
            (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
            (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

          const recognition = new SpeechRecognitionClass();
          recognition.lang = 'en-US';
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;

          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            const target = question.targetPreposition.toLowerCase();
            if (transcript.includes(target)) {
              setSpokenFeedback(`Awesome! Perfect pronunciation of "${question.targetPreposition}"! 🎉`);
            }
          };
          recognition.start();
        } catch {
          // Ignore recognition error; audio recording is active
        }
      }

      // Auto-stop after 6 seconds to prevent runaway recording
      recordTimeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          handleStopRecording();
        }
      }, 6000);
    } catch (err: any) {
      setIsRecording(false);
      setRecordError("Please allow microphone access in your browser to record your voice.");
    }
  };

  const handleStopRecording = () => {
    sfx.playPop();
    if (recordTimeoutRef.current) {
      clearTimeout(recordTimeoutRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  // Play back the listener's recorded voice
  const handlePlayRecordedVoice = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingRecordedVoice) {
      if (recordedAudioPlayerRef.current) {
        recordedAudioPlayerRef.current.pause();
      }
      setIsPlayingRecordedVoice(false);
      return;
    }

    sfx.playPop();
    stopSpeech();
    setIsPlayingAudio(false);

    if (recordedAudioPlayerRef.current) {
      recordedAudioPlayerRef.current.pause();
    }

    const audio = new Audio(recordedAudioUrl);
    recordedAudioPlayerRef.current = audio;

    audio.onended = () => {
      setIsPlayingRecordedVoice(false);
    };

    audio.onerror = () => {
      setIsPlayingRecordedVoice(false);
    };

    audio.play().then(() => {
      setIsPlayingRecordedVoice(true);
    }).catch(() => {
      setIsPlayingRecordedVoice(false);
    });
  };

  const handleFinish = () => {
    stopSpeech();
    stopRecordingCleanup();
    if (recordedAudioPlayerRef.current) {
      recordedAudioPlayerRef.current.pause();
    }
    sfx.playPop();
    onContinue();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-amber-200 flex flex-col items-center animate-scaleUp max-h-[92vh] overflow-y-auto">
        {/* Header Character Badge */}
        <div className="flex items-center gap-3 mb-4 w-full">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-xs">
            {question.character.avatarIcon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base">
                Read-Along with {question.character.name}
              </span>
              <span className="text-emerald-700 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Correct!
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Listen to the sentence, record your voice, and re-hear how you sound!
            </p>
          </div>
        </div>

        {/* Sentence Display with Karaoke highlight */}
        <div className="w-full bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 sm:p-5 mb-4 text-center min-h-[85px] flex items-center justify-center">
          <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-900">
            {words.map((w, idx) => {
              const isHighlighted = activeWordIndex === idx;
              const isTargetPreposition =
                w.toLowerCase().includes(question.targetPreposition.toLowerCase());

              return (
                <span
                  key={idx}
                  className={`inline-block mx-1 transition-all duration-200 rounded px-1.5 py-0.5 ${
                    isHighlighted
                      ? 'bg-amber-300 text-amber-950 scale-105 font-bold shadow-xs'
                      : isTargetPreposition
                      ? 'text-amber-800 font-bold underline decoration-amber-500 decoration-2 underline-offset-4'
                      : 'text-slate-800'
                  }`}
                >
                  {w}
                </span>
              );
            })}
          </p>
        </div>

        {/* Feedback banner */}
        {spokenFeedback && (
          <div className="w-full mb-3 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-900 text-center font-medium animate-fadeIn">
            {spokenFeedback}
          </div>
        )}

        {/* Microphone permission error if encountered */}
        {recordError && (
          <div className="w-full mb-3 px-3.5 py-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 text-center font-medium">
            {recordError}
          </div>
        )}

        {/* Action Controls: 1. Model Audio | 2. Record Microphone */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-3">
          {/* Button 1: Listen to story model */}
          <button
            onClick={handlePlayAudio}
            disabled={isPlayingAudio || isRecording}
            className={`min-h-[46px] px-3 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
              isPlayingAudio
                ? 'bg-amber-200/80 text-amber-950 border-amber-300 animate-pulse'
                : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-200 shadow-xs'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-800" />
            <span>{isPlayingAudio ? 'Playing...' : 'Listen Again'}</span>
          </button>

          {/* Button 2: Record Voice (Start / Stop) */}
          {isRecording ? (
            <button
              onClick={handleStopRecording}
              className="min-h-[46px] px-3 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border bg-red-600 hover:bg-red-700 text-white border-red-700 animate-pulse shadow-xs"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Recording</span>
            </button>
          ) : (
            <button
              onClick={handleStartRecording}
              className="min-h-[46px] px-3 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border bg-amber-600 hover:bg-amber-700 text-white border-amber-700 shadow-xs active:scale-98 transition-all"
            >
              <Mic className="w-4 h-4" />
              <span>{recordedAudioUrl ? 'Record Again' : 'Record My Voice'}</span>
            </button>
          )}
        </div>

        {/* Re-Hear Spoken Voice Section (when voice is recorded) */}
        {recordedAudioUrl && (
          <div className="w-full bg-amber-100/60 border border-amber-300/80 rounded-2xl p-3.5 mb-5 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎙️</span>
              <div>
                <div className="text-xs font-bold text-amber-950">
                  Your Voice is Recorded!
                </div>
                <div className="text-[11px] text-slate-600">
                  Tap below to re-hear how you pronounced the sentence
                </div>
              </div>
            </div>

            <button
              onClick={handlePlayRecordedVoice}
              className={`min-h-[42px] px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs ${
                isPlayingRecordedVoice
                  ? 'bg-amber-800 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isPlayingRecordedVoice ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Playing Voice...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Hear My Voice</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Continue to Next Page */}
        <button
          onClick={handleFinish}
          className="w-full h-12 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] transition-all focus-visible:outline-2 focus-visible:outline-amber-950"
        >
          <span>
            {pageNumber < totalPages ? `Continue to Page ${pageNumber + 1}` : 'See Final Results'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
