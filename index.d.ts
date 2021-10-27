declare module "react-native-ssh-sftp" {
  export type FileList = {
    filename: string;
    isDirectory: number;
    modificationDate: string;
    lastAccess: string;
    fileSize: number;
    ownerUserID: number;
    ownerGroupID: number;
    permissions: string;
    flags: number;
  };
  export type Handler = (output: string) => void;
  export type PtyType = "vanilla" | "vt100" | "vt102" | "vt220" | "ansi" | "xterm";
  export type Event = "Shell" | "UploadProgress" | "DownloadProgress";
  class SSHClient {
    constructor(
      address: string,
      port: number,
      username: string,
      credential: string | { privateKey?: string; publicKey?: string; passphrase?: string }
    );
    startShell: (ptyType: PtyType) => Promise<string>;
    writeToShell: (command: string) => Promise<string>;
    on: (event: Event, handler: Handler) => void;
    closeShell: () => void;
    connect: () => Promise<void>;
    connectSFTP: () => Promise<void>;
    sftpLs: (path: string) => Promise<FileList[]>;
    sftpRename: (oldPath: string, newPath: string) => Promise<void>;
    sftpMkdir: (path: string) => Promise<void>;
    sftpRm: (path: string) => Promise<void>;
    sftpRmdir: (path: string) => Promise<void>;
    sftpUpload: (filePath: string, path: string) => Promise<void>;
    sftpCancelUpload: () => void;
    sftpDownload: (path: string, toPath: string) => Promise<string>;
    sftpCancelDownload: () => void;
    disconnectSFTP: () => void;
    disconnect: () => void;
    execute: (command: string) => Promise<string>;
  }

  export default SSHClient;
}
