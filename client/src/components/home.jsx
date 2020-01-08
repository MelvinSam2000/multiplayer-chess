import React from 'react'
import { Route } from 'react-router-dom'

export default class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userField: ""
        }
    }

    textChangeHandler = (evt) => {
        this.setState({userField: evt.target.value})
    }

    render() {
        return (
            <div>
                <Route render={() => (
                    <form onSubmit={() => { 
                        this.props.history.push({
                            pathname: "/lobby",
                            state: {
                                user: this.state.userField
                            }
                        })
                    }}>
                        <div>
                            Enter a username! <br/>
                        </div>
                        <input type="text" 
                            value={this.state.userField} 
                            onChange={this.textChangeHandler}/>
                        <input type="submit" />
                    </form>
                )} />
            </div>
        )
    }
}