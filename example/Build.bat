
SET InfinniUIPath=..
SET FromInfinniUiToProjectPath=example

pushd %InfinniUIPath%
call grunt build:{override\:{less\:{'pl-override-platform-variables-path'\:'\"../../%FromInfinniUiToProjectPath%/styles/platform-variables.less\"','pl-override-bootstrap-variables-path'\:'\"../../%FromInfinniUiToProjectPath%/styles/bootstrap-variables.less\"','pl-bootstrap-theme-path'\:'\"../../%FromInfinniUiToProjectPath%/styles/bootstrap-theme.less\"','pl-extension-path'\:'\"../../%FromInfinniUiToProjectPath%/styles/extensions.less\"'}}}
popd

xcopy %InfinniUIPath%\out\* www\compiled\platform\ /s /y /r

call grunt build
