import React, { Component } from 'react';
import { Typography, Divider, Spin, Row, Col, Card, Icon, Modal, Button } from 'antd';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label
} from 'recharts';
import axios from 'axios';

const queryString = require('query-string');

const {Title, Paragraph, Text} = Typography;


const cardPositive = {

    boxShadow: '0 3px 8px rgba(106, 204, 66, 0.65)',
};


const cardNegative = {

    boxShadow: '0 3px 8px rgba(238, 78, 90, 0.65)',
};

class StockCard extends Component {


    info = async () => {

        let response = await axios.get(`https://cloud.iexapis.com/stable/stock/${this.props.data.symbol}/chart/5d?token=pk_5f45975bb732477ea82e9562237c763e`)

        console.log(response.data);
        Modal.success({
            title: `Stock Details for ${this.props.data.companyName} (${this.props.data.symbol})`,
            width: 700,
            content: (
                <div className="tradingview-widget-container" id="stockChart">

                    <LineChart width={600} height={200} data={response.data}
                               margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="label">
                            <Label value="Date" offset={0} position="insideBottom"/>
                        </XAxis>
                        <YAxis label={{value: 'Price($)', angle: -90, position: 'insideLeft'}}/>
                        <Tooltip/>
                        <Line connectNulls={true} type='monotone' dataKey='close' stroke='#82ca9d' fill='#82ca9d'/>
                        <Line connectNulls={true} type='monotone' dataKey='open' stroke='#8884d8' fill='#8884d8'/>
                    </LineChart>

                </div>

            ),
            onOk() {
            },
        })

    }


    render() {
        let cardStyle = {};
        const props = this.props.data;
        let icon = "arrow-up";
        cardStyle = cardPositive;
        let iconColor = "#52c41a";
        if (props) {
            if (props.change < 0) {
                icon = "arrow-down";
                iconColor = "#ee4e5a"
                cardStyle = cardNegative;
            }
        }


        return (
            <div>
                {props
                &&
                <Col span={8}>
                    <Card title={props.companyName} bordered={false} className="stockCard" extra={<p>{props.symbol}</p>}
                          onClick={this.info}
                          hoverable
                          style={cardStyle}>
                        <Text strong>Price: </Text>{props.latestPrice} $
                        <br/>
                        <Text strong>Invest Amount: </Text>{Math.round(this.props.amount)} $
                        <br/>
                        <Icon type={icon} style={{
                            color: iconColor,
                            fontSize: 20
                        }}/> {props.change} $
                        <Text style={{fontSize: 10}}>( {(props.changePercent * 100).toFixed(2)} % )</Text>
                        <br/>
                        <div style={{textAlign: 'right'}}>
                            <Text style={{fontSize: 10}}>{props.latestTime} </Text>
                        </div>
                    </Card>
                </Col>
                }
            </div>
        );
    }
}


export default StockCard;
