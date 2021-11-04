# react-native-ssh-sftp

SSH and SFTP client library for React Native.

## Installation

```
npm install react-native-ssh-sftp --save

yarn add react-native-ssh-sftp --save
```

##### Demo (deprecated)

## Usage

### Create a client using password authentication

```javascript
import SSHClient from "react-native-ssh-sftp";

let client = new SSHClient("10.0.0.10", 22, "user", "password");
await client.connect();
```

### Create a client using public key authentication

```javascript
import SSHClient from "react-native-ssh-sftp";

let client = new SSHClient("10.0.0.10", 22, "user", { privateKey: "-----BEGIN RSA......" });

await client.connect();
```

- Public key authentication also supports:

```
{privateKey: '-----BEGIN RSA......'}
{privateKey: '-----BEGIN RSA......', publicKey: 'ssh-rsa AAAAB3NzaC1yc2EA......'}
{privateKey: '-----BEGIN RSA......', publicKey: 'ssh-rsa AAAAB3NzaC1yc2EA......', passphrase: 'Password'}
```

### Close client

```javascript
client.disconnect();
```

### Execute SSH command

```javascript
var command = "ls -l";
const output = await client.execute(command);
```

### Shell

#### Start shell:

- Supported ptyType: vanilla, vt100, vt102, vt220, ansi, xterm

```javascript
var ptyType = "vanilla";
await client.startShell(ptyType);
```

#### Read from shell:

```javascript
await client.on("Shell");
```

#### Write to shell:

```javascript
var str = "ls -l\n";
await client.writeToShell(str);
```

#### Close shell:

```javascript
client.closeShell();
```

### SFTP

#### Connect SFTP

```javascript
await client.connectSFTP();
```

#### List directory:

```javascript
var path = ".";
const response = await client.sftpLs(path);
```

#### Create directory:

```javascript
await client.sftpMkdir("/tmp/dirName");
```

#### Rename file or directory:

```javascript
await client.sftpRename("/tmp/test.tar.gz", "/tmp/test1.tar.gz");
```

#### Remove directory:

```javascript
await client.sftpRmdir("/tmp");
```

#### Remove file:

```javascript
await client.sftpRm("/tmp/test.tar.gz");
```

#### Download file:

```javascript
// Download progress
client.on("DownloadProgress", (percentage) => {
  console.warn(percentage);
});

const downloadedFilePath = await client.sftpDownload(
  "[path-to-remote-file]",
  "[path-to-local-direcotry]"
);

// Cancel download:
client.sftpCancelDownload();
```

#### Upload file:

```javascript
// Upload progress
client.on("UploadProgress", (percentage) => {
  console.warn(percentage);
});

await client.sftpUpload("[path-to-local-file]", "[path-to-remote-directory]");

// Cancel upload:
client.sftpCancelUpload();
```

#### Close SFTP (Android only):

```javascript
client.disconnectSFTP();
```

## Credits

- iOS SSH library: [NMSSH](https://github.com/NMSSH/NMSSH)
- Android SSH library: [JSch](http://www.jcraft.com/jsch/)
