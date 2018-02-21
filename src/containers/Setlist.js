import React, {Component} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import {
    Button, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem,
    Snackbar,
    TextField
} from "material-ui";

import firebase from 'firebase';

// Creating Action creators.
const fetchBandArrangments = (bandId) => async dispatch => {
    let snapshot =  await firebase.firestore().collection(`bands/${bandId}/arrangements`).get();
    let recieved_arrangements = snapshot.docs.map(async doc => {
        const arrDoc = await doc.data.ref.get();
        return {id: arrDoc.id, ...arrDoc.data()};
    });
    
    console.log(recieved_arrangements);

    //return {type:"BAND_ARRANGEMENTS_FETCH_RESPONSE", arrangements: recieved_arrangements};
}




const styles = {
    root: {
    }
};

class Setlist extends Component {

    requestBandArrangements(){
        let bandId = this.props.pathname.split('/')[2];
        //dispatch(fetchBandArrangments(bandId));
        fetchBandArrangments(bandId);
    }


    componentWillMount() {
        console.log(this.props);
        this.requestBandArrangements();
    }
    _onDialogClose(type) {
        this.setState({[`${type}DialogOpen`]: false});
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
    band:state.default.band,
    pathname: state.router.location.pathname
})), withStyles(styles))(Setlist);

{/* <Dialog open={addArrDialogOpen} onClose={() => this._onDialogClose('create')}>
<DialogTitle>Add Arrangment</DialogTitle>
<DialogContent>
    <TextField
        label="Name"
        margin="normal"
        onChange={e => this.setState({bandName: e.target.value})}
    />
</DialogContent>
<DialogActions>
    <Button color="primary" onClick={() => this._onDialogClose('create')}>Cancel</Button>
    <Button color="primary" onClick={() => this._onDialogSubmit('create')} autoFocus>Create</Button>
</DialogActions>
</Dialog>
<Dialog open={joinDialogOpen} onClose={() => this._onDialogClose('join')}>
<DialogTitle>Join Band</DialogTitle>
<DialogContent>
    <TextField
        label="Code"
        margin="normal"
        onChange={e => this.setState({bandCode: e.target.value})}
    />
</DialogContent>
<DialogActions>
    <Button color="primary" onClick={() => this._onDialogClose('join')}>Cancel</Button>
    <Button color="primary" onClick={() => this._onDialogSubmit('join')} autoFocus>Join</Button>
</DialogActions>
</Dialog> */}