import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Explorer from './components/Explorer';

const styles = theme => ({
  section: {
    padding: theme.spacing.unit * 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  setting: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      infuraKey: "",
      complete: false,
    }
  }

  handleChange(e) {
    const newState = Object.assign({}, this.state, {infuraKey: e.target.value});
    this.setState(newState);
  }

  handleClick() {
    const newState = Object.assign({}, this.state, {complete: true});
    this.setState(newState);
  }

  render() {
    const { classes } = this.props
    return (
      <div className="App">
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="title" color="inherit">
              My Ethereum Explorer
            </Typography>
          </Toolbar>
        </AppBar>
        <section className={classes.section}>
        {
          this.state.complete ? (
            <Explorer infuraKey={this.state.infuraKey}/>
          ) : (
            <div className={classes.setting}>
              <Typography variant="title">
                Setting
              </Typography>
              <Typography variant="subheading">
                Enter Infura API key to communicate with Ethereum Node.<br/>
                Get API key here: <br/>
                <a href="https://infura.io/" target="_blank" rel="noopener noreferrer">https://infura.io/</a>
              </Typography>
              <form>
                <TextField label="Infura API Key" value={this.state.infuraKey} onChange={e => this.handleChange(e)} margin="normal"/>
                <Button onClick={() => this.handleClick()} color="primary">Done</Button>
              </form>
            </div>
          )
        }
        </section>
      </div>
    );
  }
}

export default withStyles(styles)(App);
