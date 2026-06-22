import { useState, useCallback } from 'react';
import supabase from '../lib/supabase';

/**
 * Rele holatini Supabase orqali masofadan boshqaradi.
 * Web -> relay_commands jadvaliga INSERT -> ESP32 o'qib bajaradi.
 */
export function useRelayControl() {
  const [pending, setPending] = useState(false);
  const [error,   setError]   = useState(null);

  const timeoutRef = { current: null };

  const setRelay = useCallback(async (newState) => {
    setError(null);
    setPending(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const { error: sbErr } = await supabase
      .from('relay_commands')
      .insert({ relay_state: newState, acknowledged: false });

    if (sbErr) {
      setError(sbErr.message);
      setPending(false);
      return false;
    }

    // ESP32 tasdiqlashini 12 soniya kutamiz
    timeoutRef.current = setTimeout(() => setPending(false), 12_000);
    return true;
  }, []);

  const clearPending = useCallback(() => {
    setPending(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return { pending, error, setRelay, clearPending };
}
