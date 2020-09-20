import React from 'react';

export default ({getRecordingTime, stopRecording, finished}) => (
    <div className={'app'}>
        <video id={'video'} autoPlay={true} muted={true}/>
        {finished ?
            <div>RECORDING ENDED: Clip duration: {getRecordingTime()}s</div> :
            <div>RECORDING... {getRecordingTime()}s</div>}

        <div className={'buttons'}>
            {!finished && <div className={'button'} onClick={() => stopRecording()}>Stop Recording</div>}
        </div>
    </div>
);

