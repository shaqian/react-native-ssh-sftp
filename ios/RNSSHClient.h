#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <NMSSH/NMSSH.h>

#import "SSHClient.h"

@interface RNSSHClient: RCTEventEmitter <RCTBridgeModule, NMSSHChannelDelegate, SSHClientDelegate>
@end
