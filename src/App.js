import React, {Component} from 'react';
import StartPage from './components/StartPage';
import RecordingPage from './components/RecordingPage';
import fixWebmDuration from 'fix-webm-duration';

const recordingConfig = [
    'video/webm; codecs="vp9, opus"',
    'video/webm; codecs="vp8, opus"',
    'video/webm',
];

export default class App extends Component {
    state = {
        recording: false,
        finished: false,
        startTime: 0,
        currentTime: 0
    }

    chunks = [];
    stream = null;
    recorder = null;

    getCurrentTime = () => Math.floor(Date.now() / 1000);

    startRecording = async () => {
        this.stream = await navigator.mediaDevices.getDisplayMedia({video: true, audio: true});

        this.recorder = new MediaRecorder(this.stream, {mimeType: recordingConfig.find(config => MediaRecorder.isTypeSupported(config))});
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

    render() {
        return (!this.state.recording && !this.state.finished) ?
            <StartPage startRecording={() => this.startRecording()}/> :
            <RecordingPage finished={this.state.finished} getRecordingTime={() => this.getRecordingTime()} stopRecording={() => this.stopRecording()}/>;
    }
}
