require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name             = 'RNSSHClient'
  s.version          = package['version']
  s.summary          = 'SSH and SFTP client library for React Native.'
  s.license          = package['license']
  s.homepage         = 'https://github.com/shaqian/react-native-ssh-sftp'
  s.authors          = 'Qian Sha'
  s.source           = { :git => 'https://github.com/shaqian/react-native-ssh-sftp.git', :tag => s.version }
  s.source_files     = 'ios/**/*.{h,m}'
  s.requires_arc     = true
  s.platforms        = { :ios => "8.0", :tvos => "9.2" }
  s.dependency         'React'
end
