import React, { Component } from 'react';
import { Typography, Divider, Spin, Row, Col, Card, message } from 'antd';
import axios from 'axios';
import StockCard from './StockCard'

const queryString = require('query-string');

const {Title, Paragraph, Text} = Typography;

class ResultApp extends Component {

    state = {
        amount: 0,
        strategyList: [],
        loading: true,
        strategyResponse: [],
        amountResponse: [],
        stocks: [],
        left: [0,0]
    };


    async componentDidMount() {
        
        message.loading({ content: 'Loading...', key: 'updatable' });
        const values = queryString.parse(this.props.location.search)

        this.setState({amount: parseInt(values.amount), strategyList: values.strategy})

        //API call to server to fetch information

        let postBody = {}
        postBody.Amount = parseInt(values.amount);
        postBody.Strategies = [];
        if (values.strategy.length === 2) {
            postBody.Strategies = [...values.strategy]
        }
        else {
            postBody.Strategies.push(values.strategy)
        }

        console.log(postBody);


        let response = await axios.post(`https://radiant-brook-77612.herokuapp.com/getData`, postBody)


        console.log(response);
        console.log(JSON.stringify(response));

        this.setState({loading: false});

        let strategiesResponse = [];
        response.data.strategiesResponse[0].sort((a,b) => {
            return b.latestPrice - a.latestPrice;
        })
        if (response.data.strategiesResponse[1]) {
            response.data.strategiesResponse[1].sort((a,b) => {
                return b.latestPrice - a.latestPrice;
            })
            strategiesResponse = ([...response.data.strategiesResponse[0], ...response.data.strategiesResponse[1]]);
        }
        else {
            strategiesResponse = ([...response.data.strategiesResponse[0]]);
        }

        let amountResponse1 = [];
        let amountResponse2 = [];
        let stocks = [];
        let left1 = 0;
        let left2 = 0;

        console.clear();
        let resp = response.data.amountResponse.map(v => v);
        let state = this.state;
        resp.forEach((v,i,arr) => {
            const stock = Math.floor(v / strategiesResponse[i].latestPrice);
            state.amountResponse.push(strategiesResponse[i].latestPrice * stock);
            state.strategyResponse.push(strategiesResponse[i]);
            state.stocks.push(stock);
            if(i === arr.length - 1){
                state.left[0] = v - strategiesResponse[i].latestPrice * stock;
            }else{
                arr[i+1] += v - strategiesResponse[i].latestPrice * stock;
            }
        })

        if(strategiesResponse.length > 3){
            resp = response.data.amountResponse.map(v => v);
            resp.forEach((v,i,arr) => {
                const stock = Math.floor(v / strategiesResponse[i + 3].latestPrice);
                state.amountResponse.push(strategiesResponse[i + 3].latestPrice * stock);
                state.strategyResponse.push(strategiesResponse[i + 3]);
                state.stocks.push(stock);
                if(i === arr.length - 1){
                    state.left[1] = v - strategiesResponse[i + 3].latestPrice * stock;
                }else{
                    arr[i+1] += v - strategiesResponse[i + 3].latestPrice * stock;
                }
            })
        }
        this.setState(state);

        console.log(this.state.amountResponse);
        console.log(amountResponse2);
        console.log(left1);
        console.log(left2);
        console.log(stocks);


        // if (response.data.strategiesResponse[1]) {
        //     this.setState({strategyResponse: [...response.data.strategiesResponse[0], ...response.data.strategiesResponse[1]]});
        // }
        // else {
        //     this.setState({strategyResponse: [...response.data.strategiesResponse[0]]});
        // }

        // this.setState({amountResponse: response.data.amountResponse});

        console.log("this.state.strategyResponse");
        console.log(this.state.strategyResponse);
        message.success({ content: 'Loaded!', key: 'updatable'});

    }

    render() {
        const {strategyList} = this.state;
        let isSecondStrategyPresent = false;

        let formatedSelectedItems;
        if (strategyList.length === 2) {
            formatedSelectedItems = strategyList.join(" & ");
            isSecondStrategyPresent = true;
        }
        else {
            formatedSelectedItems = strategyList;
        }

        return (
            <div className="ResultApp">
                <div className="box effect1">
                    <Typography>
                        <div style={{textAlign: 'center'}}>

                            <Title level={3}> <a href="/">Stock Portfolio Suggestion Engine </a></Title>

                        </div>
                        <Divider/>
                    </Typography>
                    <Spin tip="Loading..." spinning={this.state.loading}>
                        <div>
                            <Text strong>Amount: </Text> <Text>$ {this.state.amount}</Text>

                            <div style={{float: 'right'}}>
                                <Text strong>Investing Strategies: </Text><Text>{formatedSelectedItems}</Text>
                            </div>
                        </div>
                        <Divider/>

                        {!isSecondStrategyPresent &&
                        <div>
                            <div style={{textAlign: 'center'}}><Title level={4}>{strategyList} </Title></div>
                            <br/>
                            <div style={{padding: '30px'}}>
                                <Row gutter={16}>
                                    <StockCard data={this.state.strategyResponse[0]}
                                               amount={this.state.amountResponse[0]}
                                               quantity={this.state.stocks[0]}/>
                                    <StockCard data={this.state.strategyResponse[1]}
                                               amount={this.state.amountResponse[1]}
                                               quantity={this.state.stocks[1]}/>
                                    <StockCard data={this.state.strategyResponse[2]}
                                               amount={this.state.amountResponse[2]}
                                               quantity={this.state.stocks[2]}/>
                                </Row>
                                <div style={{textAlign: 'right', marginTop: 15}}><Text strong>Remaining Ammount: $ {this.state.left[0].toFixed(2)} </Text></div>
                            </div>
                        </div>
                        }

                        {isSecondStrategyPresent &&
                        <div>
                            <div style={{textAlign: 'center'}}><Title level={4}>{strategyList[0]} </Title></div>
                            <br/>
                            <div style={{padding: '30px'}}>
                                <Row gutter={16}>
                                    <StockCard data={this.state.strategyResponse[0]}
                                               amount={this.state.amountResponse[0]}
                                               quantity={this.state.stocks[0]}/>
                                    <StockCard data={this.state.strategyResponse[1]}
                                               amount={this.state.amountResponse[1]}
                                               quantity={this.state.stocks[1]}/>
                                    <StockCard data={this.state.strategyResponse[2]}
                                               amount={this.state.amountResponse[2]}
                                               quantity={this.state.stocks[2]}/>
                                </Row>
                                <div style={{textAlign: 'right', marginTop: 15}}><Text strong>Remaining Ammount: $ {this.state.left[0].toFixed(2)} </Text></div>
                            </div>
                            <Divider/>
                            <div style={{textAlign: 'center'}}><Title level={4}>{strategyList[1]} </Title></div>
                            <div style={{padding: '30px'}}>
                                <Row gutter={16}>
                                    <StockCard data={this.state.strategyResponse[3]}
                                               amount={this.state.amountResponse[3]}
                                               quantity={this.state.stocks[3]}/>
                                    <StockCard data={this.state.strategyResponse[4]}
                                               amount={this.state.amountResponse[4]}
                                               quantity={this.state.stocks[4]}/>
                                    <StockCard data={this.state.strategyResponse[5]}
                                               amount={this.state.amountResponse[5]}
                                               quantity={this.state.stocks[5]}/>
                                </Row>
                            <div style={{textAlign: 'right', marginTop: 15}}><Text strong>Remaining Ammount: $ {this.state.left[1].toFixed(2)} </Text></div>
                            </div>
                        </div>
                        }

                    </Spin>
                </div>
            </div>
        );
    }
}


export default ResultApp;
