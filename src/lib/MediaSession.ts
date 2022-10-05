import type { APISong } from "@/interfaces/api.interfaces";

type ActionHandlers = {
  play: () => void;
  pause: () => void;
  previoustrack: () => void;
  nexttrack: () => void;
};

let audioTag: HTMLAudioElement | null = null;

/**
 * Spoof the `MediaSession` API using a fake, silent audio tag that autoplay
 * in order to gain access to the `MediaSession` API using `AudioContext` and
 * `AudioSourceNode`.
 *
 * @see https://stackoverflow.com/q/58957895/3669565
 */
const setupAudioTag = () => {
  if (!audioTag) {
    console.log("[MediaSession] Creating audio tag to spoof MediaSession API");

    audioTag = document.createElement("audio");
    document.body.append(audioTag);
    audioTag.src = "/audio/15s.mp3";
    audioTag.loop = true;
    audioTag.play();
  }
};

/**
 * Setup metadata for the `MediaSession` API.
 *
 * @param song The current song playing.
 */
export const setupMediaSessionMetadata = (song: APISong, imageSrc: string) => {
  setupAudioTag();

  if (audioTag && navigator.mediaSession) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artists[0]?.name || "Unknown",
      album: song.album?.name || "Unknown",
      artwork: [{ src: imageSrc, type: "image/png" }],
    });

    navigator.mediaSession.playbackState = "playing";

    navigator.mediaSession.setPositionState({
      duration: song.length,
      playbackRate: 1,
      position: 0,
    });

    console.log(
      "[MediaSession] Successfully edited MediaSession metadata:",
      navigator.mediaSession.metadata
    );
  }
};

export const setupMediaSessionActionHandlers = (
  actionHandlers: ActionHandlers
) => {
  navigator.mediaSession.setActionHandler("play", actionHandlers.play);
  navigator.mediaSession.setActionHandler("pause", actionHandlers.pause);

  navigator.mediaSession.setActionHandler(
    "previoustrack",
    actionHandlers.previoustrack
  );

  navigator.mediaSession.setActionHandler(
    "nexttrack",
    actionHandlers.nexttrack
  );
};

export const pauseMediaSession = () => {
  if (audioTag && navigator.mediaSession) {
    console.log("[MediaSession] Paused MediaSession");
    audioTag.pause();
    navigator.mediaSession.playbackState = "paused";
  }
};

export const resumeMediaSession = () => {
  if (audioTag && navigator.mediaSession) {
    console.log("[MediaSession] Resumed MediaSession");
    audioTag.play();
    navigator.mediaSession.playbackState = "playing";
  }
};

export const updateMediaSessionPosition = (
  position: number,
  duration: number
) => {
  if (audioTag && navigator.mediaSession) {
    console.log("[MediaSession] Updated MediaSession position");
    navigator.mediaSession.setPositionState({
      position,
      duration,
      playbackRate: 1,
    });
  }
};

/**
 * Close `MediaSession` by pausing the audio tag and removing it from the DOM
 * and setting `navigator.mediaSession.metadata` to `null`.
 */
export const closeMediaSession = () => {
  if (audioTag && navigator.mediaSession) {
    audioTag.pause();
    audioTag.currentTime = 0;
    audioTag.remove();
    audioTag = null;

    navigator.mediaSession.playbackState = "none";
    navigator.mediaSession.metadata = null;
  }
};
