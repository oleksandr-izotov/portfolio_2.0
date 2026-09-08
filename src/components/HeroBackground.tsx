import { useEffect, useRef, useState } from 'react';
import { ImageWithFallback } from './ui/ImageWithFallback';
import backgroundImage from '../assets/background.webp';
import heroVideoWebm from '../assets/hero-bg.webm';
import heroVideoMp4 from '../assets/hero-bg.mp4';

/**
 * The hero's animated backdrop: the same topographic still that has always been
 * there, with a looping video layered over it once we know the visitor wants it
 * and can afford it.
 *
 * The still is never removed. It is the poster, the fallback for anyone who does
 * not get the video, and what a crawler sees in the prerendered HTML — the
 * <video> element is only added after mount, so the first client render matches
 * the server markup.
 */
export const HeroBackground = () => {
  const [wantsVideo, setWantsVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Three reasons not to spend half a megabyte on decoration:
    // an explicit motion preference, a small screen (where the backdrop is
    // barely visible and the data is likely metered), and Data Saver.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smallScreen = window.matchMedia('(max-width: 767px)').matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const saveData = connection?.saveData === true;

    if (reducedMotion || smallScreen || saveData) return;

    // Let the page settle first: the video is decoration and must not compete
    // with the bundle or the LCP image for bandwidth.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => setWantsVideo(true), { timeout: 2500 })
      : window.setTimeout(() => setWantsVideo(true), 1200);

    return () => {
      if (window.cancelIdleCallback && typeof idle === 'number') window.cancelIdleCallback(idle);
      else window.clearTimeout(idle as number);
    };
  }, []);

  useEffect(() => {
    if (!wantsVideo) return;
    const el = videoRef.current;
    if (!el) return;

    // Some browsers refuse autoplay even muted; there is nothing to recover
    // from — the still image stays, which is a perfectly good backdrop.
    const attempt = el.play();
    if (attempt) attempt.catch(() => setVideoReady(false));
  }, [wantsVideo]);

  return (
    <>
      <ImageWithFallback
        src={backgroundImage}
        alt="Technical Background"
        className="w-full h-full object-cover grayscale blur-[2px]"
        loading="eager"
        fetchPriority="high"
      />

      {wantsVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover grayscale blur-[2px] transition-opacity duration-1000"
          style={{ opacity: videoReady ? 1 : 0 }}
          poster={backgroundImage}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
        >
          <source src={heroVideoWebm} type="video/webm" />
          <source src={heroVideoMp4} type="video/mp4" />
        </video>
      )}
    </>
  );
};
