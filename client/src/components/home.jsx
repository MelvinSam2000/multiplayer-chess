import React from 'react'
import { Route } from 'react-router-dom'
import '../css/home.css'

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
            <div className="Form">
                <Route render={() => (
                    <form onSubmit={() => { 
                        this.props.history.push({
                            pathname: "/lobby",
                            state: {
                                user: this.state.userField
                            }
                        })
                    }}>
                        <h1>
                            Enter a username! <br/>
                        </h1>
                        <input 
                            type="text" 
                            value={this.state.userField} 
                            onChange={this.textChangeHandler}/>
                        <input type="submit" />
                    </form>
                )} />
            </div>
        )
    }
}