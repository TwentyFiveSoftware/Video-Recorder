import React, {Component} from 'react';

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
        const displayMediaOptions = {
            video: true,
            audio: true
        }

        this.stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

        this.recorder = new MediaRecorder(this.stream, {mimeType: recordingConfig.find(config => MediaRecorder.isTypeSupported(config))});
        this.recorder.start();

        this.recorder.ondataavailable = e => this.chunks.push(e.data);

        this.recorder.onstop = e => {
            const blob = new Blob(this.chunks, {type: recordingConfig});
            this.downloadBlob(blob);
        }

        this.setState({recording: true, startTime: this.getCurrentTime()});

        document.getElementById('video').srcObject = this.stream;

        this.timer = setInterval(() => this.setState({currentTime: this.getCurrentTime()}), 1000);
    }

    downloadBlob = blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.querySelector('.buttons').appendChild(a);
        a.classList.add('button');
        a.href = url
        a.download = 'video.webm';
        a.innerText = 'Save Recording';
        // window.URL.revokeObjectURL(url);
        // a.click();
        // document.body.removeChild(a);
    }

    stopRecording = async () => {
        if (this.stream === null) return;

        clearInterval(this.timer);

        this.recorder.stop();

        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;

        document.getElementById('video').srcObject = null;
        this.setState({recording: false, finished: true});
    }

    getRecordingTime = () => Math.max(0, this.state.currentTime - this.state.startTime);

    render() {
        if (!this.state.recording && !this.state.finished)
            return (
                <div className={'app'}>
                    <div className={'buttons'}>
                        <div className={'button'} onClick={() => this.startRecording()}>Start Recording</div>
                    </div>
                </div>
            );

        return (
            <div className={'app'}>
                <video id={'video'} autoPlay={true} muted={true}/>
                {this.state.finished ?
                    <div>RECORDING ENDED: Clip duration: {this.getRecordingTime()}s</div> :
                    <div>RECORDING... {this.getRecordingTime()}s</div>}

                <div className={'buttons'}>
                    {!this.state.finished && <div className={'button'} onClick={() => this.stopRecording()}>Stop Recording</div>}
                </div>
            </div>
        );
    }
}
