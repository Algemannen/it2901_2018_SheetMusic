import React, {Component} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import firebase from 'firebase';

// Creating Action creators.
const fetchBandArrangments = (bandId) => async dispatch => {
    let snapshot =  await firebase.firestore().collection(`bands/${bandId}/arrangements`).get();
    let recieved_arrangements = snapshot.docs.map(async doc => {
        const arrDoc = await doc.data.ref.get();
        return {id: arrDoc.id, ...arrDoc.data()};
    });

    return {type:"BAND_ARRANGEMENTS_FETCH_RESPONSE", arrangements: recieved_arrangements};
}


const styles = {
    root: {
    }
};

class Setlist extends Component {

    requestBandArrangements(){
        let bandId = this.props.pathname.split('/')[2];
        dispatch(fetchBandArrangments(bandId));
    }


    componentWillMount() {
        console.log(this.props);
        this.requestBandArrangements();
    }

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                            Setlist
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div>

                </div>
            </div>
        );
    }
}




export default compose(connect(state => ({
    user: state.default.user,
})), withStyles(styles))(Setlist);