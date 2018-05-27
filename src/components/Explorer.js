import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { withStyles } from '@material-ui/core/styles';
import Web3 from 'web3';
import dateformat from 'dateformat';

const styles = theme => ({
  metrics: {
    marginLeft: 'auto',
  },
  progress: {
    padding: theme.spacing.unit * 5,
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
});

class Explorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBlockNumber: 0,
      fetchingBlockNumber: true,
      blocks: []
    };
    this.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/"+props.infuraKey));
  }

  render() {
    const { classes } = this.props;
    if (this.state.fetchingBlockNumber) {
      return (
        <div className={classes.progress}>
          <CircularProgress/>
        </div>
      )
    } else {
      return (
        <div>
          <Toolbar disableGutters>
            <Button variant="flat" className={classes.button} color="primary" onClick={() => this.update()}><AutorenewIcon/>Update</Button>
            <div className={classes.metrics}>
              <Typography variant="heading">Last Block</Typography>
              <Typography variant="display2">{this.state.currentBlockNumber}</Typography>
            </div>
          </Toolbar>
          <Typography variant="heading">Recent Blocks</Typography>
          {
            this.state.blocks.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Block #</TableCell>
                    <TableCell>Hash</TableCell>
                    <TableCell>Parent Hash</TableCell>
                    <TableCell>Gas Limit</TableCell>
                    <TableCell>Gas Used</TableCell>
                    <TableCell>Difficulty</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.blocks.map((block, index) => (
                    <TableRow key={index}>
                      <TableCell numeric>{block.number}</TableCell>
                      <TableCell>{block.hash.slice(2,9)}</TableCell>
                      <TableCell>{block.parentHash.slice(2,9)}</TableCell>
                      <TableCell numeric>{block.gasLimit}</TableCell>
                      <TableCell numeric>{block.gasUsed}</TableCell>
                      <TableCell numeric>{block.difficulty}</TableCell>
                      <TableCell>{dateformat(new Date(block.timestamp*1000), "yyyy/mm/dd HH:MM:ss")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="display1">No Data</Typography>
            )
          }
        </div>
      )
    }
  }

  async update() {
    let newState
    const fetchingState = Object.assign({}, this.state, {
      fetchingBlockNumber: true,
      blocks: [],
    });
    this.setState(fetchingState);

    const blockNumber = await this.web3.eth.getBlockNumber().catch(err => err);
    if(blockNumber instanceof Error || blockNumber == null) {
      alert("Error occured in web3.eth.getBlockNumber:", blockNumber);
      newState = Object.assign({}, this.state, {
        fetchingBlockNumber: true,
      });
      this.setState(newState);
      return;
    }
    newState = Object.assign({}, this.state, {
      currentBlockNumber: blockNumber,
      fetchingBlockNumber: false,
    });
    this.setState(newState);

    const blockCount = 20;
    for (let n = blockNumber; n > blockNumber - blockCount; n--) {
      const block = await this.web3.eth.getBlock(n).catch(err => err);
      if(block instanceof Error || block == null) {
        alert("Error occured in web3.eth.getBlock:", block);
        break;
      }
      let newBlocks = new Array(...this.state.blocks);
      newBlocks.push(block);
      newState = Object.assign({}, this.state, {blocks: newBlocks});
      this.setState(newState);
    }
  }

  async componentDidMount(){
    await this.update();
  }
}

export default withStyles(styles)(Explorer);
