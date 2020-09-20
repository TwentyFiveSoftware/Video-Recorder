import React from 'react';

export default ({startRecording}) => (
    <div className={'app'}>
        <div className={'button'} onClick={() => startRecording()}>Start Recording</div>
    </div>
);
