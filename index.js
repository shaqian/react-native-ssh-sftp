import { Platform, NativeModules, NativeEventEmitter, DeviceEventEmitter } from "react-native";

const { RNSSHClient } = NativeModules;

const RNSSHClientEmitter = new NativeEventEmitter(RNSSHClient);

class SSHClient {
  // passwordOrKey: password or {privateKey: value, [publicKey: value, passphrase: value]}
  constructor(host, port, username, passwordOrKey) {
    this._key = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    this.handlers = {};
    this.host = host;
    this.port = port;
    this.username = username;
    this.passwordOrKey = passwordOrKey;
  }

  _handleEvent(event) {
    if (this.handlers.hasOwnProperty(event.name) && this._key === event.key) {
      this.handlers[event.name](event.value);
    }
  }

  on(event, handler) {
    this.handlers[event] = handler;
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (Platform.OS === "android") {
        if (typeof this.passwordOrKey === "string")
          RNSSHClient.connectToHostByPassword(
            this.host,
            this.port,
            this.username,
            this.passwordOrKey,
            this._key,
            (error) => {
              error ? reject(error) : resolve();
            }
          );
        else
          RNSSHClient.connectToHostByKey(
            this.host,
            this.port,
            this.username,
            this.passwordOrKey,
            this._key,
            (error) => {
              error ? reject(error) : resolve();
            }
          );
      } else {
        RNSSHClient.connectToHost(
          this.host,
          this.port,
          this.username,
          this.passwordOrKey,
          this._key,
          (error) => {
            error ? reject(error) : resolve();
          }
        );
      }
    });
  }

  execute(command) {
    return new Promise((resolve, reject) => {
      RNSSHClient.execute(command, this._key, (error, response) => {
        error ? reject(error) : resolve(response);
      });
    });
  }

  // ptyType: vanilla, vt100, vt102, vt220, ansi, xterm
  startShell(ptyType) {
    return new Promise((resolve, reject) => {
      if (Platform.OS === "ios") {
        this.shellListener = RNSSHClientEmitter.addListener("Shell", this._handleEvent.bind(this));
      } else {
        this.shellListener = DeviceEventEmitter.addListener("Shell", this._handleEvent.bind(this));
      }
      RNSSHClient.startShell(this._key, ptyType, (error, response) => {
        error ? reject(error) : resolve(response);
      });
    });
  }

  writeToShell(command) {
    return new Promise((resolve, reject) => {
      RNSSHClient.writeToShell(command, this._key, (error, response) => {
        error ? reject(error) : resolve(response);
      });
    });
  }

  closeShell() {
    if (this.shellListener) {
      this.shellListener.remove();
      this.shellListener = null;
    }
    RNSSHClient.closeShell(this._key);
  }

  connectSFTP() {
    return new Promise((resolve, reject) => {
      RNSSHClient.connectSFTP(this._key, (error) => {
        error ? reject(error) : resolve();
        if (Platform.OS === "ios") {
          this.downloadProgressListener = RNSSHClientEmitter.addListener(
            "DownloadProgress",
            this._handleEvent.bind(this)
          );
          this.uploadProgressListener = RNSSHClientEmitter.addListener(
            "UploadProgress",
            this._handleEvent.bind(this)
          );
        } else {
          this.downloadProgressListener = DeviceEventEmitter.addListener(
            "DownloadProgress",
            this._handleEvent.bind(this)
          );
          this.uploadProgressListener = DeviceEventEmitter.addListener(
            "UploadProgress",
            this._handleEvent.bind(this)
          );
        }
      });
    });
  }

  sftpLs(path) {
    return new Promise((resolve, reject) => {
      RNSSHClient.sftpLs(path, this._key, (error, response) => {
        const resultArray = [];
        for (let i = 0; i < response.length; i++) {
          resultArray.push(JSON.parse(response[i]));
        }
        error ? reject(error) : resolve(resultArray);
      });
    });
  }

  sftpRename(oldPath, newPath) {
    return new Promise((resolve, reject) => {
      RNSSHClient.sftpRename(oldPath, newPath, this._key, (error) => {
        error ? reject(error) : resolve();
      });
    });
  }

  sftpMkdir(path) {
    return new Promise((resolve, reject) => {
      RNSSHClient.sftpMkdir(path, this._key, (error) => {
        error ? reject(error) : resolve();
      });
    });
  }

  sftpRm(path) {
    return new Promise((resolve, reject) => {
      RNSSHClient.sftpRm(path, this._key, (error) => {
        error ? reject(error) : resolve();
      });
    });
  }

  sftpRmdir(path) {
    return new Promise((resolve, reject) => {
      RNSSHClient.sftpRmdir(path, this._key, (error) => {
        error ? reject(error) : resolve();
      });
    });
  }

  sftpUpload(filePath, path) {
    return new Promise((resolve, reject) => {
      RNSSHClient.sftpUpload(filePath, path, this._key, (error) => {
        error ? reject(error) : resolve();
      });
    });
  }

  sftpCancelUpload() {
    RNSSHClient.sftpCancelUpload(this._key);
  }

  sftpDownload(path, toPath) {
    return new Promise((resolve, reject) => {
      RNSSHClient.sftpDownload(path, toPath, this._key, (error, response) => {
        error ? reject(error) : resolve(response);
      });
    });
  }

  sftpCancelDownload() {
    RNSSHClient.sftpCancelDownload(this._key);
  }

  disconnectSFTP() {
    if (Platform.OS !== "ios") {
      if (this.downloadProgressListener) {
        this.downloadProgressListener.remove();
        this.downloadProgressListener = null;
      }
      if (this.uploadProgressListener) {
        this.uploadProgressListener.remove();
        this.uploadProgressListener = null;
      }
      RNSSHClient.disconnectSFTP(this._key);
    }
  }

  disconnect() {
    if (this.shellListener) this.shellListener.remove();
    if (this.downloadProgressListener) this.downloadProgressListener.remove();
    if (this.uploadProgressListener) this.uploadProgressListener.remove();
    RNSSHClient.disconnect(this._key);
  }
}

export default SSHClient;
