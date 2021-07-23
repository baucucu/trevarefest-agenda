import React, {useEffect, useState} from 'react';
import { Page, Navbar, Block, CardHeader,CardContent, Card, CardFooter, Link, BlockTitle } from 'framework7-react';
var _ = require('lodash');
var dayjs = require('dayjs')

const AgendaPage = (props) => {
  const  {data, f7route, f7router} = props
  
  const [days, setDays] = useState()
  const [user, setUser] = useState()

  useEffect(() => {
    // console.log("data: ", data)
    // console.log("route: ", f7route)
    
    setUser(f7route.query?.user)

    let tempDays = _.groupBy(data.map(event => {
      event.date = dayjs(event.fields["Start time"]).format("d MMM")
      return(event)
    }), 'date')
    // console.log("days: ", tempDays)
    setDays(tempDays)
  },[])

  return (
    <Page>
      <Navbar title="Trevarefest Agenda"/>
      {/* <BlockTitle>Trevarefest Agenda</BlockTitle> */}
      {/* <!--
      Additional "timeline-horizontal" className to enable Horizontal timeline
      Additional "col-50" to define column width (50%)
      Additional "tablet-20" to define column width for tablets (20%)
      --> */}
    <div className="timeline timeline-horizontal col-50 tablet-20">
      {/* <!-- Timeline Item (Day) --> */}
      
      {days && Object.keys(days).map((date, id) => {return(<TimeLineDay key={id} date={date} events={days[date]}/>)})}
    </div>
    </Page>
  );
}

export default AgendaPage;

const TimeLineDay = (props) => {
  const {date, events} = props;

  useEffect(()=>{
    // console.log("day: ", date)
  },[])

  return (
    <div className="timeline-item">
      <div className="timeline-item-date">{date}</div>
      <div className="timeline-item-content">
        {events.map((event, id)=> {return(<TimeLineEvent key={id} event={event}/>)})}
      </div>
    </div>
  )
} 

const TimeLineEvent = (props) => {
  const {event} = props;
  useEffect(()=>{
    // console.log("event: ",event )
  },[])
  return(
    <Card className="demo-card-header-pic">
      <CardHeader
        className="no-border"
        valign="bottom"
        style={{
          backgroundImage: `url(${event.fields["Image"]?.[0].url})`,
          height: '160px',          
        }}
      >
      </CardHeader>
      <CardContent>
        <p className="date">{dayjs(event.fields["Start time"]).format("HH:mm")}</p>
        <p>{event.fields["Type"]}</p>
        <p>{event.fields["Artist name"]}</p>
        
        {/* <p>{event.fields["Running order ID"]}</p> */}
      </CardContent>
      <CardFooter>
        <Link>Follow</Link>
        {/* <Link>Read more</Link> */}
      </CardFooter>
    </Card>
  )
}
