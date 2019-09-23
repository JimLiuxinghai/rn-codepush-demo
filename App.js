/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import CodePush from "react-native-code-push"; // 引入code-push

let codePushOptions = {
    //设置检查更新的频率
    //ON_APP_RESUME APP恢复到前台的时候
    //ON_APP_START APP开启的时候
    //MANUAL 手动检查
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME
};

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

type Props = {};

class App extends Component<Props> {
    constructor() {
        super();
        this.state = {restartAllowed: true};
    }
    //如果有更新的提示
    codePushStatusDidChange(syncStatus) {
        switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                this.setState({ syncMessage: "Checking for update." });
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                this.setState({ syncMessage: "Downloading package." });
                break;
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
                this.setState({ syncMessage: "Awaiting user action." });
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                this.setState({ syncMessage: "Installing update." });
                break;
            case CodePush.SyncStatus.UP_TO_DATE:
                this.setState({ syncMessage: "App up to date.", progress: false });
                break;
            case CodePush.SyncStatus.UPDATE_IGNORED:
                this.setState({ syncMessage: "Update cancelled by user.", progress: false });
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                this.setState({ syncMessage: "Update installed and will be applied on restart.", progress: false });
                break;
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                this.setState({ syncMessage: "An unknown error occurred.", progress: false });
                break;
        }
    }

    codePushDownloadDidProgress(progress) {
        this.setState({ progress });
    }

    toggleAllowRestart() {
        this.state.restartAllowed
            ? CodePush.disallowRestart()
            : CodePush.allowRestart();

        this.setState({ restartAllowed: !this.state.restartAllowed });
    }

    getUpdateMetadata() {
        CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING)
            .then((metadata: LocalPackage) => {
                this.setState({
                    syncMessage: metadata ? JSON.stringify(metadata) : "Running binary version",
                    progress: false
                });
            }, (error: any) => {
                this.setState({ syncMessage: "Error: " + error, progress: false });
            });
    }

    /** Update is downloaded silently, and applied on restart (recommended) */
    sync() {
        CodePush.sync(
            {},
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this)
        );
    }

    /** Update pops a confirmation dialog, and then immediately reboots the app */
    syncImmediate() {
        CodePush.sync(
            { installMode: CodePush.InstallMode.IMMEDIATE, updateDialog: true },
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this)
        );
    }

    render() {
        let progressView;

        if (this.state.progress) {
            progressView = (
                <Text
                    style={styles.messages}>{this.state.progress.receivedBytes} of {this.state.progress.totalBytes} bytes
                    received</Text>
            );
        }
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to CodePush!这是第20版！！！！fuck
                </Text>
                <TouchableOpacity onPress={this.sync.bind(this)}>
                    <Text style={styles.syncButton}>Press for background sync</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.syncImmediate.bind(this)}>
                    <Text style={styles.syncButton}>Press for dialog-driven sync</Text>
                </TouchableOpacity>
                {progressView}
                <TouchableOpacity onPress={this.toggleAllowRestart.bind(this)}>
                    <Text
                        style={styles.restartToggleButton}>Restart {this.state.restartAllowed ? "allowed" : "forbidden"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.getUpdateMetadata.bind(this)}>
                    <Text style={styles.syncButton}>Press for Update Metadata</Text>
                </TouchableOpacity>
                <Text style={styles.messages}>{this.state.syncMessage || ""}</Text>
            </View>
        );
    }
}

// 这一行必须要写
App = CodePush(codePushOptions)(App)

export default App

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
})
