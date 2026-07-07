'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const PANEL_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const FADE_IN_DURATION = 0.6;
const FADE_IN_START = 0.3;

const HOLD_UNTIL = 2.85;

const FADE_OUT_DURATION = 0.4;

const PANEL_START = 3.4;
const PANEL_STAGGER = 0.08;
const PANEL_DURATION = 0.45;
const PANEL_COUNT = 5;

const UNMOUNT_AT = 4.3;

interface PageLoaderProps {
  onComplete?: () => void;
}

export function PageLoader({
  onComplete,
}: PageLoaderProps) {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const fadeOutTimer = setTimeout(() => setPhase('out'), HOLD_UNTIL * 1000);
    const unmountTimer = setTimeout(() => {
      document.body.style.overflow = '';
      setVisible(false);
      onComplete?.();
    }, UNMOUNT_AT * 1000);

    return () => {
      document.body.style.overflow = '';
      clearTimeout(fadeOutTimer);
      clearTimeout(unmountTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
        >
          {/* Vertical panels — these ARE the black background */}
          {Array.from({ length: PANEL_COUNT }).map((_, i) => {
            // Rightmost panel (i=4) slides first
            const slideDelay =
              PANEL_START - HOLD_UNTIL + (PANEL_COUNT - 1 - i) * PANEL_STAGGER;

            return (
              <motion.div
                key={`panel-${i}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${i * 20}%`,
                  width: 'calc(20% + 1px)',
                  background: '#FFFFFF',
                  willChange: 'transform',
                }}
                animate={{ y: phase === 'out' ? '-100%' : 0 }}
                transition={{
                  duration: PANEL_DURATION,
                  ease: PANEL_EASE ,
                  delay: phase === 'out' ? slideDelay : 0,
                }}
              />
            );
          })}

          {/* Centered logo */}
          <motion.img
            src="/images/ncw.svg"
            alt=""
            style={{
              position: 'relative',
              zIndex: 1,
              height: 'clamp(80px, 12vw, 140px)',
              width: 'auto',
              willChange: 'opacity',
            }}
            initial={{ opacity: 0 }}
            animate={phase === 'in' ? { opacity: 0.8 } : { opacity: 0 }}
            transition={
              phase === 'in'
                ? { duration: FADE_IN_DURATION, ease: EASE, delay: FADE_IN_START }
                : { duration: FADE_OUT_DURATION, ease: EASE }
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
