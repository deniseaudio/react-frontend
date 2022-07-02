/* eslint class-methods-use-this: "off" */
import { captureException } from "@sentry/react";

import type { APISong } from "@/interfaces/api.interfaces";
import { getSongStream } from "@/api";
import { EventEmitter } from "./EventEmitter";

// eslint-disable-next-line unicorn/prefer-event-target
class AudioManager extends EventEmitter {
  private audioContext: AudioContext | null = null;

  private audioBufferSource: AudioBufferSourceNode | null = null;

  /** Current song playing. */
  private song: APISong | null = null;

  /** Interval ID reference (used with `clearInterval`). */
  private currentTimeInterval: number | null = 0;

  /** Current song time in ms. */
  private currentTime: number = 0;

  /** Last update with current time loop to calculate delta. */
  private currentTimeLastUpdate: number | null = null;

  /** Volume gain node attached to the `audioBufferSource`. */
  private volumeGainNode: GainNode | null = null;

  /** Volume gain node value. */
  private volumeGainNodeValue: number = 0.5;

  /** Retrieve the AudioContext. */
  public getAudioContext() {
    return this.audioContext;
  }

  /** Set the `audioContext`, emit `"updated-audio-context" event.` */
  public setAudioContext(audioContext: AudioContext | null) {
    this.audioContext = audioContext;
    this.emit("updated-audio-context", this.audioContext);
  }

  /** Retrieve the AudioBufferSourceNode. */
  public getAudioBufferSource() {
    return this.audioBufferSource;
  }

  /**
   * Update volume gain-node.
   *
   * @param value GainNode value.
   */
  public setVolumeGainNodeValue(value: number) {
    this.volumeGainNodeValue = value;

    if (this.volumeGainNode) {
      this.volumeGainNode.gain.value = value - 1;

      console.log("[AudioManager] Updated gain-node volume value:", value);
      console.log(
        "[AudioManager] Computed gain-node value:",
        this.volumeGainNode.gain.value
      );
    }
  }

  /**
   * Load a song stream and start playing it once ready.
   *
   * @param song Song.
   * @param token API authorization token.
   */
  public async loadSong(song: APISong, token: string) {
    this.clean();

    this.song = song;
    this.setAudioContext(new AudioContext());

    const buffer = await this.fetchSongStream(song.id, token);
    const audioBuffer = await this.decodeAudioBuffer(
      this.audioContext!,
      buffer
    );

    const { audioBufferSource, volumeGainNode } = this.playAudioBuffer(
      this.audioContext!,
      audioBuffer
    );

    this.audioBufferSource = audioBufferSource;
    this.volumeGainNode = volumeGainNode;

    this.currentTimeInterval = window.setInterval(
      () => this.currentTimeLoop(),
      1000 / 30
    );

    this.emit("song-playing", song);
  }

  /**
   * Clean audio-context, audio buffer source, volume gain-node, song and
   * current-time interval.
   */
  public clean() {
    if (this.currentTimeInterval) {
      console.log("[AudioManager] Clearing current-time interval.");

      window.clearInterval(this.currentTimeInterval);

      this.currentTime = 0;
      this.currentTimeInterval = 0;
      this.currentTimeLastUpdate = null;
    }

    if (this.audioContext) {
      console.log("[AudioManager] Closing audio-context.");

      this.audioContext.suspend().catch((error) => captureException(error));
      this.audioContext.close().catch((error) => captureException(error));
      this.setAudioContext(null);
    }

    if (this.audioBufferSource) {
      console.log("[AudioManager] Closing audio buffer source.");

      this.audioBufferSource.stop();
      this.audioBufferSource = null;
    }

    if (this.volumeGainNode) {
      this.volumeGainNode.disconnect();
      this.volumeGainNode = null;
    }

    if (this.song) {
      console.log("[AudioManager] Removing song reference.");

      this.song = null;
    }
  }

  /**
   * When seeking into the song, create a new `AudioBufferSourceNode` from the
   * original buffer and start playing this buffer with an offset of the
   * current `time`.
   *
   * Also re-attach the `GainNode` used to control the volume value, to the
   * new `AudioBufferSourceNode`
   *
   * @param time Time in seconds to start playing from.
   */
  public seek(time: number) {
    // Clear interval, set it to seek time.
    if (this.currentTimeInterval) {
      window.clearInterval(this.currentTimeInterval);

      this.currentTime = time;
      this.currentTimeInterval = 0;
      this.currentTimeLastUpdate = null;
    }

    if (this.audioContext && this.audioBufferSource) {
      const newSource = this.audioContext.createBufferSource();
      newSource.buffer = this.audioBufferSource.buffer;

      this.audioBufferSource.stop();
      this.audioBufferSource.disconnect();

      // Re-attach volume gain-node to the new source.
      if (this.volumeGainNode) {
        newSource.connect(this.volumeGainNode);
      }

      newSource.connect(this.audioContext.destination);
      // Start playing the new source with an offset equal to the seek time.
      newSource.start(0, time);

      this.audioBufferSource = newSource;
      this.currentTime = time * 1000;

      this.currentTimeInterval = window.setInterval(
        () => this.currentTimeLoop(),
        1000 / 5
      );
    }
  }

  /**
   * Fetch a song-stream and get information about the download progression.
   *
   * @param songId Song ID.
   * @param token API authorization token.
   * @returns ArrayBuffer.
   */
  private async fetchSongStream(songId: string, token: string) {
    const response = await getSongStream(songId, token);
    const reader = response.body?.getReader();
    const contentLength = response.headers.get("Content-Length")!;
    // Store all chunks, because we cannot use `response.arrayBuffer()` as the
    // response reader is already locked by the `while` loop (`reader.read()`).
    const chunks: Uint8Array[] = [];

    let receivedLength = 0;

    console.log(
      "[AudioManager] Fetching song stream of content-length:",
      contentLength
    );

    while (true && reader) {
      // eslint-disable-next-line no-await-in-loop
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
      receivedLength += value.length;

      this.emit("updated-song-loading-progression", {
        contentLength,
        receivedLength,
      });
    }

    console.log(
      "[AudioManager] Fetched song stream, assembling buffer chunks."
    );

    // Concatenate chunks into a single `Uint8Array`.
    const allChunks = new Uint8Array(receivedLength);
    let position = 0;

    chunks.forEach((chunk) => {
      allChunks.set(chunk, position);
      position += chunk.length;
    });

    console.log("[AudioManager] Buffer chunks assembled.");

    return allChunks.buffer;
  }

  /**
   * Decode an ArrayBufferLike into an AudioBuffer.
   *
   * @param audioContext Audio-context.
   * @param buffer Original buffer to decode from.
   * @returns An AudioBuffer.
   */
  private async decodeAudioBuffer(
    audioContext: AudioContext,
    buffer: ArrayBufferLike
  ) {
    return audioContext.decodeAudioData(buffer);
  }

  /**
   * Create an `AudioBufferSourceNode` for the given `AudioContext`. Also create
   * a `GainNode` that will be attached to the `AudioBufferSourceNode`.
   *
   * @param audioContext Audio-context.
   * @param audioBuffer Audio buffer.
   * @returns
   */
  private playAudioBuffer(
    audioContext: AudioContext,
    audioBuffer: AudioBuffer
  ) {
    const audioBufferSource = audioContext.createBufferSource();
    const volumeGainNode = audioContext.createGain();

    volumeGainNode.gain.value = this.volumeGainNodeValue - 1;
    volumeGainNode.connect(audioContext.destination);

    audioBufferSource.buffer = audioBuffer;
    audioBufferSource.connect(audioContext.destination);
    audioBufferSource.connect(volumeGainNode);
    audioBufferSource.start(0);

    return { audioBufferSource, volumeGainNode };
  }

  /**
   * Loop called inside `setInterval` which calculates delta time with the
   * latest loop call. Used to provide a `currentTime` variable.
   */
  private currentTimeLoop() {
    if (this.audioContext && this.audioContext.state === "running") {
      if (
        this.currentTimeInterval &&
        this.song &&
        this.currentTime / 1000 >= this.song.length
      ) {
        window.clearInterval(this.currentTimeInterval);
        this.emit("song-ended", this.song);
        return;
      }

      const now = Date.now();
      const delta = this.currentTimeLastUpdate
        ? now - this.currentTimeLastUpdate
        : 0;

      this.currentTime += delta;
      this.currentTimeLastUpdate = now;

      this.emit("current-time-updated", this.currentTime);
    }
    // When audio-context is suspended, make sure to keep up with the last
    // updated time.
    else if (this.audioContext && this.audioContext.state === "suspended") {
      this.currentTimeLastUpdate = Date.now();
    }
  }
}

console.log("[AudioManager] AudioManager initialized");

export const audioManager = new AudioManager();

if (process.env.NODE_ENV === "development") {
  console.log(
    "[AudioManager] AudioManager is accessible from `window.audioManager` in development mode."
  );

  // @ts-ignore
  window.audioManager = audioManager;
}
