import React from 'react';
import Dropdown from "./Dropdown";

export default ({startRecording, recordingSettings, setRecordingSettings}) => (
    <div className={'app'}>
        <div className={'options'}>
            <div className={'options__title'}>Options</div>

            <div className={'input-field'}>
                <div className={'input-field__name'}>Width</div>
                <div className={'input-field__description'}>Determines the width of the resolution.</div>
                <input className={'input-field__input'} placeholder={'native'} value={recordingSettings.width} onChange={e => setRecordingSettings({width: e.target.value})}/>
            </div>

            <div className={'input-field'}>
                <div className={'input-field__name'}>Height</div>
                <div className={'input-field__description'}>Determines the height of the resolution.</div>
                <input className={'input-field__input'} placeholder={'native'} value={recordingSettings.height} onChange={e => setRecordingSettings({height: e.target.value})}/>
            </div>

            <div className={'input-field'}>
                <div className={'input-field__name'}>FPS</div>
                <div className={'input-field__description'}>Determines the FPS.</div>
                <input className={'input-field__input'} placeholder={'native'} value={recordingSettings.frameRate} onChange={e => setRecordingSettings({frameRate: e.target.value})}/>
            </div>

            <div className={'dropdown-field'}>
                <div className={'input-field__name'}>Video Encoding (Quality)</div>
                <div className={'input-field__description'}>Determines the video encoding (compression) which affects the video quality.</div>
                <Dropdown select={value => setRecordingSettings({profile: value})}/>
            </div>

            <hr/>
        </div>

        <div className={'buttons'}>
            <div className={'button'} onClick={() => startRecording()}>Start Recording</div>
        </div>
    </div>
);
