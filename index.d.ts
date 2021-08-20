declare module "react-native-ssh-sftp" {
  type Callback = (error: string | any, output?: string) => void;
  export type Handler = (output: string) => void;
  export type PtyType = "vanilla" | "vt100" | "vt102" | "vt220" | "ansi" | "xterm";
  export type Event = "Shell";
  class SSHClient {
    constructor(
      address: string,
      port: number,
      username: string,
      credential: string | { privateKey?: string; publicKey?: string; passphrase?: string },
      callback?: Callback
    );
    startShell: (ptyType: PtyType, callback: Callback) => void;
    writeToShell: (command: string, callback: Callback) => void;
    on: (event: Event, handler: Handler) => void;
    closeShell: () => void;
    connect: (callback: Callback) => void;
    connectSFTP: (callback: Callback) => void;
    sftpLs: (path: string, callback: Callback) => void;
    sftpRename: (oldPath: string, newPath: string, callback: Callback) => void;
    sftpMkdir: (path: string, callback: Callback) => void;
    sftpRm: (path: string, callback: Callback) => void;
    sftpRmdir: (path: string, callback: Callback) => void;
    sftpUpload: (filePath: string, path: string, callback: Callback) => void;
    sftpCancelUpload: () => void;
    sftpDownload: (path: string, toPath: string, callback: Callback) => void;
    sftpCancelDownload: () => void;
    disconnectSFTP: () => void;
    disconnect: () => void;
    execute: (command: string, callback: Callback) => void;
  }

  export default SSHClient;
}
