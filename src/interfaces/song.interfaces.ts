/**
 * Used to define the song download progression.
 */
export type SongProgression = {
  totalLength: number;
  currentLength: number;
};

/**
 * Used to determine how the current song has been loaded.
 */
export enum SongInitiatorTypes {
  LIBRARY_BROWSER = "LIBRARY_BROWSER",
  QUEUE = "QUEUE",
  HISTORY = "HISTORY",
}
