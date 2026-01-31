import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuizStore } from '@/store/quizStore';
import type { RealtimeChannel } from '@supabase/supabase-js';

const CHANNEL_NAME = 'quiz-sync';

export const useQuizSync = (_isHost: boolean = false) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const store = useQuizStore();

  useEffect(() => {
    // Create a broadcast channel for real-time sync
    const channel = supabase.channel(CHANNEL_NAME, {
      config: {
        broadcast: { self: false }, // Don't receive own broadcasts
      },
    });

    channelRef.current = channel;

    // Listen for state updates from co-host
    channel
      .on('broadcast', { event: 'state-update' }, ({ payload }) => {
        console.log('[QuizSync] Received state update:', payload);
        
        // Apply the state update
        if (payload.action && payload.data !== undefined) {
          applyStateUpdate(payload.action, payload.data);
        }
      })
      .subscribe((status) => {
        console.log('[QuizSync] Channel status:', status);
      });

    return () => {
      console.log('[QuizSync] Cleaning up channel');
      channel.unsubscribe();
    };
  }, []);

  // Function to broadcast state changes (used by co-host)
  const broadcastAction = (action: string, data?: any) => {
    if (!channelRef.current) {
      console.warn('[QuizSync] Channel not ready');
      return;
    }

    console.log('[QuizSync] Broadcasting:', action, data);
    channelRef.current.send({
      type: 'broadcast',
      event: 'state-update',
      payload: { action, data },
    });
  };

  return { broadcastAction };
};

// Apply state updates received from broadcast - uses store directly
function applyStateUpdate(action: string, data: any) {
  const store = useQuizStore.getState();
  
  switch (action) {
    case 'startGame':
      store.startGame();
      break;
    case 'startRound':
      store.startRound();
      break;
    case 'nextRound':
      store.nextRound();
      break;
    case 'previousRound':
      store.previousRound();
      break;
    case 'goToRound':
      store.goToRound(data.index);
      break;
    case 'showScores':
      store.showScores();
      break;
    case 'showTransition':
      store.showTransition();
      break;
    case 'showFinal':
      store.showFinal();
      break;
    case 'startTimer':
      store.startTimer();
      break;
    case 'pauseTimer':
      store.pauseTimer();
      break;
    case 'resetTimer':
      store.resetTimer(data?.duration);
      break;
    case 'updateTeamScore':
      store.updateTeamScore(data.teamId, data.roundIndex, data.score);
      break;
    case 'addToTeamScore':
      store.addToTeamScore(data.teamId, data.points);
      break;
    case 'advanceF1Car':
      store.advanceF1Car(data.teamId, data.amount);
      break;
    case 'toggleAnswer':
      store.toggleAnswer();
      break;
    case 'nextQuestion':
      store.nextQuestion();
      break;
    case 'previousQuestion':
      store.previousQuestion();
      break;
    case 'resetGame':
      store.resetGame();
      break;
    default:
      console.warn('[QuizSync] Unknown action:', action);
  }
}
