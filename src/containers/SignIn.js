import React, {Component} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from 'material-ui/styles';
import firebase from "firebase";

export const signIn = prov => async dispatch => {
    let provider;

    if(prov === 'google') {
        provider = new firebase.auth.GoogleAuthProvider();
    } else if(prov === 'facebook') {
        provider = new firebase.auth.FacebookAuthProvider();
    }

    try {
        let result = await firebase.auth().signInWithPopup(provider);

        dispatch({type: 'SIGN_IN_SUCCESS', user: result.user});

        let userSnapshot = await firebase.firestore().doc(`users/${result.user.uid}`).get();

        if (!userSnapshot.exists) {
            await userSnapshot.ref.set({name: result.user.displayName});
            dispatch({type: 'USER_CREATE_SUCCESS'});
        }
    } catch (err) {
        dispatch({type: 'SIGN_IN_FAILURE', error: err});
    }
};

const styles = {
    root: {
    }
};

class SignIn extends Component {
    componentWillMount() {
    }

    _onSignIn(provider) {
        this.props.dispatch(signIn(provider));
    }

    render() {
        const {classes} = this.props;

        return (
            <div>
                <div onClick={() => this._onSignIn('google')}>Sign in with google</div>
                <div onClick={() => this._onSignIn('facebook')}>Sign in with facebook</div>
            </div>
        );
    }
}


export default compose(connect(state => ({
    user: state.default.user,
})), withStyles(styles))(SignIn);