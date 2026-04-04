import { useState, useEffect, useRef } from 'react';
import * as OTPAuth from 'otpauth';

interface TotpState {
  code: string;
  secondsLeft: number;
  progress: number; // 0-100 for countdown bar
}

export function useTotp(secret: string): TotpState {
  const totpRef = useRef<OTPAuth.TOTP | null>(null);

  const getState = (): TotpState => {
    try {
      if (!totpRef.current) {
        totpRef.current = new OTPAuth.TOTP({
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
          secret: OTPAuth.Secret.fromBase32(secret.replace(/\s/g, '').toUpperCase()),
        });
      }
      const now = Math.floor(Date.now() / 1000);
      const secondsLeft = 30 - (now % 30);
      const code = totpRef.current.generate();
      const progress = (secondsLeft / 30) * 100;
      return { code, secondsLeft, progress };
    } catch {
      return { code: '------', secondsLeft: 30, progress: 100 };
    }
  };

  const [state, setState] = useState<TotpState>(getState);

  useEffect(() => {
    totpRef.current = null; // reset when secret changes
    setState(getState());

    const interval = setInterval(() => {
      setState(getState());
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secret]);

  return state;
}
