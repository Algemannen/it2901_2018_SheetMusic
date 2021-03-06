import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';

import 'firebase/firestore';
import 'firebase/auth';

class App extends React.Component {
    state = {
        user: {},
        band: {},
        score: {},
        pdf: {},
        setlist: {},
        componentLoaded: {}
    };

    _componentLoaded = {};

    page2Component = {
        members: 'Home',
        scores: 'Home',
        setlists: 'Home',
        pdfs: 'Home',
        pdf: 'PDF',
        score: 'Score',
        setlist: 'Setlist',
        signin: 'SignIn'
    };

    constructor() {
        super();

        firebase.initializeApp({
            apiKey: "AIzaSyC1C3bHfQnCea25zRBCabhkahtYLhTTHyg",
            authDomain: "scores-butler.firebaseapp.com",
            databaseURL: "https://scores-butler.firebaseio.com",
            projectId: "scores-butler",
            storageBucket: "scores-butler.appspot.com",
            messagingSenderId: "124262758995"
        });

        firebase.auth().onAuthStateChanged(user => this._onUserStateChanged(user));
        window.addEventListener('hashchange', () => this._onHashChange());
    }

    async _onUserStateChanged(user) {
        let hash = (() => {
            if (user && window.location.hash === '#/signin') {
                return '#/scores';
            } else if (!user && window.location.hash !== '#/signin') {
                return '#/signin';
            } else {
                return window.location.hash;
            }
        })();

        if (hash === window.location.hash) {
            window.dispatchEvent(new HashChangeEvent("hashchange"));
        } else {
            window.location.hash = hash;
        }
    }

    async _onHashChange() {
        const hash = window.location.hash || '#/scores';

        let [page, detail] = hash.split('/').slice(1);

        try {
            const component = (await import(`./containers/${this.page2Component[page]}.js`)).default;

            this.setState({Component: component}, () => {
                this.setState({page: page, detail: detail, componentLoaded: this._componentLoaded}, () => {
                    this._componentLoaded[this.page2Component[page]] = true;
                });
            });
        } catch (err) {
            console.log(err);
            // Already imported or doesn't exists
        }
    }

    render() {
        const {page, detail, Component, componentLoaded} = this.state;

        if (!Component) return null;

        return <Component {...this.props} page={page} detail={detail} loaded={componentLoaded[this.page2Component[page]]}/>
    }
}

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#ffffff',
            main: '#ffffff',
            contrastText: 'rgb(115, 115, 115)',
        },
        secondary: {
            light: '#448AFF',
            main: '#448AFF',
            contrastText: '#fff',
        },
    },
    overrides: {
        MuiPickersToolbar: {
            toolbar: {
                backgroundColor: "#448AFF",
            },
        },
        MuiPickersDay: {
            day: {
                color: "black",
            },
            selected: {
                backgroundColor: "#448AFF",
            },
            current: {
                color: "#448AFF",
            },
        },
    }
});


ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <App/>
        </MuiPickersUtilsProvider>
    </MuiThemeProvider>,
    document.getElementById('root')
);
