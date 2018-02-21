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
import {DatePicker} from 'material-ui-pickers';
import AddIcon from 'material-ui-icons/Add';
import MenuIcon from 'material-ui-icons/Menu';

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

export const getBandDetail = bandId => async dispatch => {
    let doc = await firebase.firestore().doc(`bands/${bandId}`).get();

    let band = doc.data();

    let snapshot = await firebase.firestore().collection(`bands/${bandId}/arrangements`).get();

    band.arrangements = await Promise.all(snapshot.docs.map(async doc => {
        const arrDoc = await doc.data().ref.get();
        return {id: arrDoc.id, ...arrDoc.data()};
    }));

    dispatch({type: 'BAND_FETCH_RESPONSE', band: band})
};


const styles = {
    root: {
    },
    flex: {
        flex: 1
    },

    dialogContent: {
        display: 'flex',
        flexDirection: 'column'
    },
    card: {
        width: 300,
        marginRight: 24,
        marginBottom: 24,
        cursor: 'pointer'
    },
    media: {
        height: 200,
    },
    grid: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: 24
    },
    banner: {
        background: 'url(https://4.bp.blogspot.com/-vq0wrcE-1BI/VvQ3L96sCUI/AAAAAAAAAI4/p2tb_hJnwK42cvImR4zrn_aNly7c5hUuQ/s1600/BandPeople.jpg) center center no-repeat',
        backgroundSize: 'cover',
        height: 144
    }
};

class Setlist extends Component {
    state = {
        anchorEl: null,
        addArrDialogOpen: false,
        addPauseDialogOpen: false,
        setlistDate: Date.now(),
        arrangementTitle: '',
        arrangementComposer: '',
        setlistName: ''
    };

    requestBandDetails(){
        let bandId = this.props.pathname.split('/')[2];
        //dispatch(fetchBandArrangments(bandId));
        this.props.dispatch(getBandDetail(bandId));
    }


    componentWillMount() {
        console.log(this.props);
        this.requestBandDetails();
    }
    _onDialogClose(type) {
        this.setState({[`${type}DialogOpen`]: false});
    }
    _onAddButtonClick(e) {
        this.setState({anchorEl: e.currentTarget});
    }

    _onMenuClose() {
        this.setState({anchorEl: null});
    }

    _onMenuClick(type) {
        this.setState({[`${type}DialogOpen`]: true});
        this.setState({anchorEl: null});
    }

    _onDialogSubmit(type){
        switch(type){
            case 'arrangement':
                break;
            case 'pause':
                break;
            case 'download':
                break;
            default:
                break;
        }
    }
    render() {
        const { anchorEl, addArrDialogOpen, addPauseDialogOpen} = this.state;
        console.log("Welcome, johhnyboi");
        const {classes, band={arrangements:[]}} = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" onClick={() => this._onMenuButtonClick()}>
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="title" color="inherit">
                            Setlist
                        </Typography>
                        <IconButton color="inherit" aria-label="Menu" onClick={e => this._onAddButtonClick(e)}>
                            <AddIcon/>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => this._onMenuClose()}
                        >
                            <MenuItem onClick={() => this._onMenuClick('addArr')}>Add Arrangement</MenuItem>
                            <MenuItem onClick={() => this._onMenuClick('addPause')}>Add Pause</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <div>

                </div>
                <Dialog open={addArrDialogOpen} onClose={() => this._onDialogClose('addArr')}>
                    <DialogTitle>Add Arrangment</DialogTitle>
                    <DialogContent>
                        {band.arrangements.map((arr, index) =>
                            <Card key={index} className={classes.card} elevation={1}>
                                <CardMedia
                                    className={classes.media}
                                    image="https://previews.123rf.com/images/scanrail/scanrail1303/scanrail130300051/18765489-musical-concept-background-macro-view-of-white-score-sheet-music-with-notes-with-selective-focus-eff.jpg"
                                    title=""
                                />
                                <CardContent>
                                    <Typography variant="headline" component="h2">
                                        {arr.title}
                                    </Typography>
                                    <Typography component="p">
                                        {arr.composer}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this._onDialogClose('addArr')}>Cancel</Button>
                        <Button color="primary" onClick={() => this._onDialogSubmit('addArr')} autoFocus>Add</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={addPauseDialogOpen} onClose={() => this._onDialogClose('addPause')}>
                    <DialogTitle>Add Pause</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Time"
                            margin="normal"
                            onChange={e => this.setState({bandCode: e.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this._onDialogClose('addPause')}>Cancel</Button>
                        <Button color="primary" onClick={() => this._onDialogSubmit('addPause')} autoFocus>Join</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}




export default compose(connect(state => ({
    user: state.default.user,
    band:state.default.band,
    pathname: state.router.location.pathname
})), withStyles(styles))(Setlist);

