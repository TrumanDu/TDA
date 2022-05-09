declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        myPing(): void;
        showContextMenu(position: string): void;
        loadTreeData(): void;
        send(channel: string, ...args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
