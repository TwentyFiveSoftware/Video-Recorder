import React from 'react';

export default ({getRecordingTime, stopRecording, finished, recordingProfile, recordingSettings}) => (
    <div className={'app'}>
        <video id={'video'} autoPlay={true} muted={true}/>

        <div className={'video-caption'}>
            {!finished && <div>{recordingProfile} | {recordingSettings.frameRate} FPS | {recordingSettings.width}x{recordingSettings.height}</div>}
            {!finished && <div>RECORDING... {getRecordingTime()}s</div>}

            {finished && <div>RECORDING ENDED: Clip duration: {getRecordingTime()}s</div>}
        </div>

        <div className={'buttons'}>
            {!finished && <div className={'button'} onClick={() => stopRecording()}>Stop Recording</div>}
        </div>
    </div>
);

