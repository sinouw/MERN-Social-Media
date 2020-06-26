import React, { Component, Fragment } from "react";
import axios from 'axios';

import { Bar, Line } from 'react-chartjs-2';
export default class StatsPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataGroupedByDate: '',
      Loading: true,
      chartPerDate: {
        labels: [],
        datasets: [
          {
            label: 'message',
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: []
          }
        ]
      },
      chartPerConversation : {
        labels: [],
        datasets: [
          {
            label: 'Mounth',
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: []
          }
        ]
      }

    }
  }

  async componentDidMount() {
    axios.get('https://graph.facebook.com/v7.0/103718324649806/conversations?access_token=EAADoZBAD37iEBAOJZCIfYEkP991C1dVZBrXkQCr1SjnJZBB74JGEYDulfiEZC5STRQIvZAgBB4ZBMJNnZBsxsqgN5xawWq2WNWUZBgrvrh6WvIlprG9w4j9BhZBhBFFtGwb2r1u2sclNQnBvNHX60fmCkLrLsFFMHI1CZBKA3CiWAczuBCz3d0C0YNOFZAb8jJGZBBAkZD&fields=messages', { headers: { "Authorization": `Bearer ${this.state.token}` } })
      .then(res => {
        this.setState({
          dataGroupedByDate: res.data.data
        });
        let values = []
        let idsList = []
        let labels = []
        let datas = []
        let labelsIds = []
        let datasIds = []
        let body = this.state.chartPerDate
        let bodyids = this.state.chartPerConversation
        
        let occ
        let idsOcc
        
        let dataPerDate = this.state.dataGroupedByDate.map(x => x.messages.data)
        this.state.dataGroupedByDate.map((x,i) => {
          labelsIds.push("conversation: "+i)
          datasIds.push(x.messages.data.length)
        
        })
        debugger
        dataPerDate.map(x => x.map(y => {
          values.push(new Date(y.created_time).toISOString().split("T")[0])
          occ = values.reduce((acc, it) => { if (Object.keys(acc).some(item => item == it)) return acc; else return { ...acc, [it]: values.filter(item => it == item).length }; }, {})
          Object.entries(occ).map((e) => {
            
            labels.push(e[0])
            datas.push(e[1])
            body = {
              labels: labels,
              datasets: [
                {
                  label: 'message',
                  backgroundColor: 'rgba(75,192,192,1)',
                  borderColor: 'rgba(0,0,0,1)',
                  borderWidth: 2,
                  data: datas
                }
              ]
            }
          });
        }))


            bodyids = {
              labels: labelsIds,
              datasets: [
                {
                  label: 'message',
                  backgroundColor: 'rgba(75,192,192,1)',
                  borderColor: 'rgba(0,0,0,1)',
                  borderWidth: 2,
                  data: datasIds
                }
              ]
            }

        



        this.setState({
          chartPerDate: body,
          chartPerConversation: bodyids
        });
        console.log("chartPerDate : ", this.state.chartPerDate)
        console.log("chartPerDate : ", this.state.chartPerDate)

      })
      .catch((error) => {
        console.log(error);
      })
  }



  render() {
    return (
      <div>
        <Bar
          data={this.state.chartPerDate}
          options={{
            title: {
              display: true,
              text: 'Messages Grouped By Date',
              fontSize: 20
            },
            legend: {
              display: true,
              position: 'right'
            }
          }}
        />


        <div>
          <Line
            data={this.state.chartPerConversation}
            options={{
              title: {
                display: true,
                text: 'Messages Grouped By Conversation',
                fontSize: 20
              },
              legend: {
                display: true,
                position: 'right'
              }
            }}
          />
        </div>
      </div>
    );
  }
}
