import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons';

export default class Dropdown extends Component {
    state = {
        selectedIndex: 0,
        open: false
    }

    options = [
        ['High Quality (VP9)', 'high'],
        ['Medium Quality (H.264)', 'medium']
    ];

    componentDidMount = () => this.props.select(this.options[0][1]);

    select = index => {
        this.setState({selectedIndex: index, open: false});
        this.props.select(this.options[index][1]);
    }

    render() {
        return (
            <div className={'dropdown'}>
                <div className={'dropdown__selected'} onClick={() => this.setState({open: !this.state.open})}>
                    <div>{this.options[this.state.selectedIndex][0]}</div>
                    <FontAwesomeIcon icon={this.state.open ? faAngleUp : faAngleDown}/>
                </div>
                {this.state.open &&
                <div className={'dropdown__options'}>
                    {this.options.map((option, index) =>
                        <div className={'dropdown__option'} key={index} onClick={() => this.select(index)}>{option[0]}</div>)}
                </div>
                }
            </div>
        );
    }
}
