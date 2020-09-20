import React, {Component} from 'react';
import fixWebmDuration from 'fix-webm-duration';

import StartPage from './components/StartPage';
import RecordingPage from './components/RecordingPage';

const RECORDING_CONFIGS = {
    high: 'video/webm; codecs="vp9, opus',
    medium: 'video/webm; codecs="h264, opus',
    fallbacks: [
        'video/webm; codecs="vp8, opus"',
        'video/webm',
    ]
}

export default class App extends Component {
    state = {
        recording: false,
        finished: false,
        startTime: 0,
        currentTime: 0,

        recordingSettings: {
            profile: '',
            width: '',
            height: '',
            frameRate: ''
        }
    }

    chunks = [];
    stream = null;
    recorder = null;

    getCurrentTime = () => Math.floor(Date.now() / 1000);

    getRecordingConfig = () => {
        let config = '';

        if (this.state.recordingSettings.profile === 'High Quality (VP9)')
            config = RECORDING_CONFIGS.high;
        else if (this.state.recordingSettings.profile === 'Medium Quality (H.264)')
            config = RECORDING_CONFIGS.medium;

        if (!MediaRecorder.isTypeSupported(config))
            for (let c of RECORDING_CONFIGS.fallbacks)
                if (MediaRecorder.isTypeSupported(c)) {
                    config = c;
                    break;
                }

        return config;
    }

    getValidatedRecordingSetting = value => (value === '' || isNaN(Number(value)) || Number(value) <= 0) ? undefined : Number(value);

    getVideoTrackSettings = () => this.stream !== null && this.stream.getVideoTracks().length > 0 ? this.stream.getVideoTracks()[0].getSettings() : {};

    startRecording = async () => {
        const {width, height, frameRate} = this.state.recordingSettings;

        this.stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                width: this.getValidatedRecordingSetting(width),
                height: this.getValidatedRecordingSetting(height),
                frameRate: this.getValidatedRecordingSetting(frameRate)
            },
            audio: true
        });

        this.recorder = new MediaRecorder(this.stream, {mimeType: this.getRecordingConfig()});
        this.recorder.start();

        this.recorder.ondataavailable = e => this.chunks.push(e.data);

        this.recorder.onstop = async () => {
            const blob = new Blob(this.chunks);

            const duration = await this.loadDurationMetadata(URL.createObjectURL(blob)) * 1000;

            fixWebmDuration(blob, duration, fixedBlob =>
                this.createDownloadButton(URL.createObjectURL(fixedBlob))
            );

            clearInterval(this.timer);

            if (this.stream !== null) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            }

            this.setState({recording: false, finished: true});
        }

        this.setState({recording: true, startTime: this.getCurrentTime()});

        document.getElementById('video').srcObject = this.stream;

        this.timer = setInterval(() => this.setState({currentTime: this.getCurrentTime()}), 1000);
    }

    loadDurationMetadata = async url => new Promise(resolve => {
        const videoElement = document.getElementById('video');
        videoElement.srcObject = null;
        videoElement.src = url;

        videoElement.onloadedmetadata = () => {
            if (videoElement.duration !== Infinity) return;

            videoElement.currentTime = 1e101;
            videoElement.ontimeupdate = () => {
                resolve(videoElement.duration);

                videoElement.currentTime = 0;
                videoElement.src = null;
            }
        }
    });

    createDownloadButton = url => {
        const a = document.createElement('a');
        document.querySelector('.buttons').appendChild(a);
        a.classList.add('button');
        a.href = url
        a.download = 'video.webm';
        a.innerText = 'Save Recording';
    }

    stopRecording = async () => this.recorder.stop();

    getRecordingTime = () => Math.max(0, this.state.currentTime - this.state.startTime);

    setRecordingSettings = delta => this.setState({recordingSettings: ({...this.state.recordingSettings, ...delta})});

    render() {
        return (!this.state.recording && !this.state.finished) ?
            <StartPage startRecording={() => this.startRecording()} recordingSettings={this.state.recordingSettings} setRecordingSettings={delta => this.setRecordingSettings(delta)}/> :
            <RecordingPage
                finished={this.state.finished}
                recordingProfile={this.state.recordingSettings.profile}
                recordingSettings={this.getVideoTrackSettings()}
                getRecordingTime={() => this.getRecordingTime()}
                stopRecording={() => this.stopRecording()}
            />;
    }
}
