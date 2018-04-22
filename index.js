import {
  Platform,
  NativeModules,
  NativeEventEmitter,
  DeviceEventEmitter
} from 'react-native';

const { RNSSHClient } = NativeModules;

const RNSSHClientEmitter = new NativeEventEmitter(RNSSHClient);

class SSHClient {
  // passwordOrKey: password or {privateKey: value, [publicKey: value, passphrase: value]}
	constructor(host, port, username, passwordOrKey, callback) {
    this._key = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    this.handlers = {};
    this.host = host;
    this.port = port;
    this.username = username;
    this.passwordOrKey = passwordOrKey;
    this.connect(callback);
	}

  _handleEvent (event) {
    if (this.handlers.hasOwnProperty(event.name) && this._key === event.key) {
      this.handlers[event.name](event.value);
    }
  }

  on(event, handler) {
    this.handlers[event] = handler;
  }

  connect(callback) {
    if (Platform.OS === "android") {
      if (typeof this.passwordOrKey === "string")
        RNSSHClient.connectToHostByPassword(this.host, this.port, this.username, this.passwordOrKey, this._key,
          (error) => {
            callback && callback(error);
          });
      else
        RNSSHClient.connectToHostByKey(this.host, this.port, this.username, this.passwordOrKey, this._key,
          (error) => {
            callback && callback(error);
          });
    } else {
      RNSSHClient.connectToHost(this.host, this.port, this.username, this.passwordOrKey, this._key,
        (error) => {
          callback && callback(error);
        });
    }
  }

  execute(command, callback) {
    RNSSHClient.execute(command, this._key, (error, response) => {
      callback && callback(error, response);
    });
  }

  // ptyType: vanilla, vt100, vt102, vt220, ansi, xterm
	startShell(ptyType, callback) {
    if (Platform.OS === 'ios') {
      this.shellListener = RNSSHClientEmitter.addListener('Shell', this._handleEvent.bind(this));
    } else {
      this.shellListener = DeviceEventEmitter.addListener('Shell', this._handleEvent.bind(this));
    }
    RNSSHClient.startShell(this._key, ptyType, (error, response) => {
      callback && callback(error, response);
    });
  }

  writeToShell(command, callback) {
    RNSSHClient.writeToShell(command, this._key, (error, response) => {
      callback && callback(error, response);
    });
  }

  closeShell() {
    if (this.shellListener) {
      this.shellListener.remove();
      this.shellListener = null;
    }
    RNSSHClient.closeShell(this._key);
  }

  connectSFTP(callback) {
    RNSSHClient.connectSFTP(this._key, (error) => {
      callback && callback(error);
      if (Platform.OS === 'ios') {
        this.downloadProgressListener = RNSSHClientEmitter.addListener('DownloadProgress', this._handleEvent.bind(this));
        this.uploadProgressListener = RNSSHClientEmitter.addListener('UploadProgress', this._handleEvent.bind(this));
      } else {
        this.downloadProgressListener = DeviceEventEmitter.addListener('DownloadProgress', this._handleEvent.bind(this));
        this.uploadProgressListener = DeviceEventEmitter.addListener('UploadProgress', this._handleEvent.bind(this));
      }
    });
  }

  sftpLs(path, callback) {
    RNSSHClient.sftpLs(path, this._key, (error, response) => {
      callback && callback(error, response);
    });
  }

  sftpRename(oldPath, newPath, callback) {
    RNSSHClient.sftpRename(oldPath, newPath, this._key, (error) => {
      callback && callback(error);
    });
  }

  sftpMkdir(path, callback) {
    RNSSHClient.sftpMkdir(path, this._key, (error) => {
      callback && callback(error);
    });
  }

  sftpRm(path, callback) {
    RNSSHClient.sftpRm(path, this._key, (error) => {
      callback && callback(error);
    });
  }

  sftpRmdir(path, callback) {
    RNSSHClient.sftpRmdir(path, this._key, (error) => {
      callback && callback(error);
    });
  }

  sftpUpload(filePath, path, callback) {
    RNSSHClient.sftpUpload(filePath, path, this._key, (error) => {
      callback && callback(error);
    });
  }

  sftpCancelUpload() {
    RNSSHClient.sftpCancelUpload(this._key);
  }

  sftpDownload(path, toPath, callback) {
    RNSSHClient.sftpDownload(path, toPath, this._key, (error, response) => {
      callback && callback(error, response);
    });
  }

  sftpCancelDownload() {
    RNSSHClient.sftpCancelDownload(this._key);
  }

  disconnectSFTP() {
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

  disconnect() {
    if (this.shellListener)
      this.shellListener.remove();
    if (this.downloadProgressListener)
      this.downloadProgressListener.remove();
    if (this.uploadProgressListener)
      this.uploadProgressListener.remove();
    RNSSHClient.disconnect(this._key);
  }
}

export default SSHClient;
