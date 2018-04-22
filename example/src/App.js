import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SegmentedControls } from 'react-native-radio-buttons'
import { TextField } from 'react-native-material-textfield';

import SSHClient from 'react-native-ssh-sftp';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      host: 'sshtest.com',
      port: '22',
      username: 'sha',
      password: '',
      privateKey: '\
-----BEGIN RSA PRIVATE KEY-----\n\
MIIEpAIBAAKCAQEA2DdFSeWG8wOHddRpOhf4FRqksJITr59iXdNrXq+n79QFN1g4\n\
bvRG9zCDmyLb8EF+gah78dpJsGZVIltmfYWpsk7ok9GT/foCB1d2E6DbEU6mBIPe\n\
OLxYOqyiea8mi7iGt9BvAB4Mj+v2LnhK4O2BB6PTU4KLjSgMdqtV/EGctLdK+JEU\n\
5Vo/tDvtF8jmUYGV57V8VovgQJHxOWcT9Mgz+c5EcyVvhwvA/88emYkZ49cn4N0A\n\
az7YsOTHItvbhxf9xI3bBwxoPvfLx/G0n48TeY33D0qu/qjAloOfqPMHwj+upn/K\n\
RrAawl2N1MObCc5/q1WYTftd5+uoQsB1RN7ptQIDAQABAoIBAQCzKBkhwi6v7pyv\n\
5fHLUVEfK5SLOn9VZpv7YtP1AVgGQYiQ82jPh1nGOUzTn27fBWXtyc3p+RZWNHUW\n\
ouWp3LdgKEJPObmHGUHVE4OjgAYFsUWfOCVKncX92E5IxfkKjTwT04Imdr+yAbNb\n\
jhF9j077JaRV7jX0INsy+YWmIDfZBQHdR4gpip6ye70yc4p0M7DbrhjEFi6cvf5b\n\
OaSsbKAunxZte42RYY1ap6GmEii5B/wWe37176jBUrCeQzN9poTSFEv99+Av6M3R\n\
yyBD1PyawR+dPCAicvIY88ME4fAJSi6Gp8Kmievq7bXnGw8ICWggVSnl0TBYhwSY\n\
SN8mBr2BAoGBAPNNQ+77kEkwsA0pzZljbwDhJ03jATsWpA4yN4S3Gz456ZUDxode\n\
lbHERy7RR8l6EunSRdlWGVW9d/8uXBKsvp78hZnJkUE1fLCP+5UH1DVYn+hSYhjj\n\
g9lnQXbKpXm5tpABiM7+sMq+pC2N6K8yQ7P33TXCcRCWpjK0OJcEVxq/AoGBAOOA\n\
HNlZe8gQeH3OrQWKEJjgF6oQ9pGdRgJJctdSHDsqP8cPV7BuiYaTh/Q+R+HIueJ+\n\
3abGLkRqxbNb5FIgX7HJRYLGlusccjd0L4OJ5upGDQJgJzQOryPFofihLvvNbY1K\n\
zLLNvvYoaWtXhSGusj5N9T6DuA6qxMs+0OwPeZyLAoGBAPHIjwInrTOO1uW97TvJ\n\
vL47Ajw8ozR9Q3t4HAQfk0s7cg1MOza7oDeQvsyf3Z8zWShUdmWNUpAKQf2trIJC\n\
eQy2Fm7GCTusU8WC0JlBtnltITxW4nWpY5XhLwVGTTuyeuKRI8vQ/w/8dFtw8xNn\n\
+DAY2hRartG1ZGRvBO3OumExAoGAeJuar7+417+joU7Ie39OfT2QTiDgFyKB0wSN\n\
VYm6XcNwPF/t5SM01ZuxH9NE2HZJ1cHcUGYQcUUJuqSkzsVK9j32E/akW9Cg3LVD\n\
20BooxqwGupO3lJKl3RXAjCxb9zgj19wVfqtmmKiQL4NXmX3KQC7W4EJOv1dh0Ku\n\
D/fESTECgYBwWv9yveto6pP6/xbR9k/Jdgr+vXQ3BJVU3BOsD38SeSrZfMSNGqgx\n\
eiukCOIsRHYY7Qqi2vCJ62mwbHJ3RhSKKxcGpgzGX7KoGZS+bb5wb7RGNYK/mVaI\n\
pFkz72+8eA2cnbWUqHt9WqMUgUBYZTMESzQrTf7+q+0gWf49AZJ/QQ==\n\
-----END RSA PRIVATE KEY-----',
      selectedOption: 'Execute',
      command: 'ps',
      exeOutput: '',
      shellOutput: '',
      sftpOutput: [],
      currentPath: ''
    }
  }

  connect() {
    let { 
      host, 
      port, 
      username, 
      password,
      privateKey,
      selectedOption, 
      command, 
      exeClient, 
      exeOutput, 
      shellClient, 
      shellOutput, 
      sftpClient, 
      sftpOutput
    } = this.state;

    switch(selectedOption) {
      case 'Execute':
        if (!exeClient) {
          let exeClient = new SSHClient(host, parseInt(port), username, password.length > 0 ? password : {privateKey}, (error) => {
            if (!error) {
              exeClient.execute(command, (error, output) => {
                this.setState({ exeClient, exeOutput: error ? error : output });
              });
            } else {
              this.setState({ exeOutput: error });
            }
          });
        } else {
          exeClient.execute(command, (error, output) => {
            this.setState({ exeOutput: error ? error : output });
          });
        }
        break;
      case 'Shell':
        if (!shellClient) {
          let shellClient = new SSHClient(host, parseInt(port), username, password.length > 0 ? password : {privateKey}, (error) => {
            if (!error) {
              this.setState({ shellClient });
              shellClient.startShell("vanilla", (error) => {
                if (error) this.setState({ shellOutput : error });
              });
              shellClient.on('Shell', (event) => {
                let { shellOutput } = this.state;
                this.setState({ shellOutput: shellOutput + event });
              });
            } else {
              this.setState({ shellOutput: error });
            }
          });
        }
        break;
      default:
        if (!sftpClient) {
          let sftpClient = new SSHClient(host, parseInt(port), username, password.length > 0 ? password : {privateKey}, (error) => {
            if (!error) {
              this.setState({ sftpClient });
              sftpClient.connectSFTP((error) => {
                if (error) {
                  console.warn(error);
                } else {
                  this.listDirectory('.');
                  this.setState({ currentPath: './' });

                  // sftpClient.sftpMkdir('testMkdir', (error) => {
                  //   if (error)
                  //     console.warn(error);
                  // });

                  // sftpClient.sftpRename('testMkdir', 'testRename', (error) => {
                  //   if (error)
                  //     console.warn(error);
                  // });

                  // sftpClient.sftpRmdir('testRename', (error) => {
                  //   if (error)
                  //     console.warn(error);
                  // });

                  // sftpClient.sftpRm('test', (error) => {
                  //   if (error)
                  //     console.warn(error);
                  // });

                  // sftpClient.sftpDownload('testUpload', '/storage/emulated/0', (error, response) => {
                  //   if (error)
                  //     console.warn(error);
                  //   if (response) {
                  //     console.warn(response);
                  //     sftpClient.sftpUpload(response, '.', (error) => {
                  //       if (error)
                  //         console.warn(error);
                  //     });
                  //   }
                  // });

                  // sftpClient.on('DownloadProgress', (event) => {
                  //   console.warn(event);
                  // });

                  // sftpClient.on('UploadProgress', (event) => {
                  //   console.warn(event);
                  // });
                }
              });
            } else {
              console.warn(error);
            }
        });
      }
    }
  }

  writeToShell(event) {
    let { shellClient, shellOutput } = this.state;
    if (shellClient) {
      shellClient.writeToShell(event.nativeEvent.text + '\n', (error) => {
        if (error) this.setState({ shellOutput: shellOutput + error });
      });
    }
    this.textInput.clear()
  }

  enterDirectory(dir) {
    let { currentPath } = this.state;
    var newPath = currentPath + dir;
    this.setState({ currentPath: newPath });
    this.listDirectory(newPath);
  }

  listDirectory(path) {
    let { sftpClient } = this.state;
    if (sftpClient) {
      sftpClient.sftpLs(path, (error, response) => {
        if (error) {
          console.warn(error);
        } else {
          this.setState({ sftpOutput: response });
        }
      });
    }
  }

  goBack() {
    let { currentPath } = this.state;
    var newPath = currentPath.substring( 0, currentPath.slice(0, -1).lastIndexOf( "/" ) + 1);
    this.setState({ currentPath: newPath });
    this.listDirectory(newPath);
  }

  componentWillUnmount() {
    let { exeClient, shellClient, sftpClient } = this.state;
    if (exeClient) exeClient.disconnect();
    if (shellClient) shellClient.disconnect();
    if (sftpClient) sftpClient.disconnect();
  }

  render() {
    const options = [
      'Execute',
      'Shell',
      'SFTP'
    ];

    let { 
      host, 
      port, 
      username, 
      password,
      privateKey,
      selectedOption, 
      command, 
      exeOutput, 
      shellOutput, 
      shellClient, 
      sftpOutput, 
      currentPath
    } = this.state;

    var renderSFTP = () => {
      if (sftpOutput.length > 0)
        return sftpOutput.map((file, id) => {
          var f = JSON.parse(file);
          return (
            <View key={id}>
              {
                f['isDirectory'] === 1 ?
                <TouchableOpacity onPress={this.enterDirectory.bind(this, f["filename"])}>
                  <Text style={styles.directory}>{f["filename"]}</Text>
                </TouchableOpacity>
                : <Text style={styles.file}>{f["filename"]}</Text>
              }
            </View>
          );
        });
    }

    return (
      <ScrollView
        style={styles.container}
        ref={ref => this.scrollView = ref}
        onContentSizeChange={(contentWidth, contentHeight)=>{        
            this.scrollView.scrollToEnd({animated: true});
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 2, marginRight: 10}}>
            <TextField
              labelHeight={15}
              label='Host'
              value={host}
              onChangeText={ (host) => this.setState({ host }) }
            />
          </View>
          <View style={{flex: 1}}>
            <TextField
              labelHeight={15}
              label='Port'
              value={port}
              onChangeText={ (port) => this.setState({ port }) }
            />
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, marginRight: 10}}>
            <TextField
              labelHeight={15}
              label='Username'
              value={username}
              onChangeText={ (username) => this.setState({ username }) }
            />
          </View>
          <View style={{flex: 1}}>
            <TextField
              labelHeight={15}
              label='Password'
              value={password}
              onChangeText={ (password) => this.setState({ password }) }
            />
          </View>
        </View>
        <TextField
          labelHeight={15}
          fontSize={privateKey.length < 1 ? 16 : 8}
          label='Private Key'
          value={privateKey}
          multiline={true}
          onChangeText={ (privateKey) => this.setState({ privateKey }) }
        />
        <View style={{marginTop: 10}} />
        <SegmentedControls
          options={ options }
          onSelection={ (selectedOption) => this.setState({ selectedOption }) }
          selectedOption={selectedOption}
        />
        {
          selectedOption === 'Execute' ?
          <TextField
            labelHeight={20}
            label='Command'
            value={command}
            autoCapitalize='none'
            onChangeText={ (command) => this.setState({ command }) }
          /> : 
          <View style={{marginTop: 10}} />
        }
        <TouchableOpacity style={styles.button} onPress={this.connect.bind(this)}>
          <Text style={styles.buttonText}>{ selectedOption === 'Execute' ? 'Run' : 'Connect' }</Text>
        </TouchableOpacity>
        {
          selectedOption === 'Execute' ?
          <View style={styles.outputContainer}>
            <Text>{exeOutput}</Text>
          </View>
          : 
          selectedOption === 'Shell' ?
          <View style={styles.outputContainer}>
            <Text style={{fontSize: 12}}>{shellOutput}</Text>
            {
              shellClient ?
              <TextInput 
                underlineColorAndroid="transparent" 
                ref={input => { this.textInput = input }}
                autoFocus={true} 
                autoCapitalize='none'
                style={styles.shellInput} 
                onSubmitEditing={this.writeToShell.bind(this)}
              /> : undefined
            }
          </View>
          : 
          selectedOption === 'SFTP' ?
          <View style={styles.outputContainer}>
            <TouchableOpacity onPress={this.goBack.bind(this)}>
              <Text style={{padding: 4}}>{currentPath}</Text>
            </TouchableOpacity>
            <View>
              {renderSFTP()}
            </View>
          </View> : undefined
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    padding: 20,
  },
  buttonText: {
    fontSize: 16,
    alignSelf: 'center',
    color: '#007AFF',
  },
  button: {
    height: 36,
    marginTop: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  outputContainer: {
    flex: 1,
    marginTop: 15,
    marginBottom: 20
  },
  shellInput: {
    backgroundColor: '#eee',
    fontSize: 11,
    marginBottom: 20
  },
  file: {
    padding: 4,
    color: 'grey'
  },
  directory: {
    padding: 4,
    color: 'black'
  },
});
