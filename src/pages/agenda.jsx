import React, {useEffect, useState} from 'react';
import { Button, Page, Navbar, Block, Chip, CardHeader,CardContent, Card, CardFooter, Link, BlockTitle } from 'framework7-react';
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

    let tempDays = Object.entries(_.groupBy(data.map(event => {
      event.date = dayjs(event.fields["Play date"])
      return(event)
    }), 'date'))
    
    setDays(tempDays)
  },[])

  useEffect(() =>{console.log("days: ", days),[days]})

  return (
    <Page>
          <Navbar title="Trevarefest Agenda"/>
        {/* <!--
        Additional "timeline-horizontal" className to enable Horizontal timeline
        Additional "col-50" to define column width (50%)
        Additional "tablet-20" to define column width for tablets (20%)
        --> */}
        <Block>Filters</Block>
        <div className="timeline timeline-horizontal col-50 tablet-20">
        {/* <!-- Timeline Item (Day) --> */}
        
        {days && days.map((date, id) => {return(<TimeLineDay key={id} date={date[0]} events={date[1]}/>)})}
        </div>
    </Page>
  );
}

export default AgendaPage;

const TimeLineDay = (props) => {
  const {date, events} = props;
  
  const orderedEvents = events.sort((a,b) => {return(new Date(a.fields["Start time"]) - new Date(b.fields["Start time"]))})

  useEffect(()=>{
    // console.log("day: ", date)
    console.log("events: ", events)
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
        <Chip text={dayjs(event.fields["Start time"]).format("HH:mm")}>
        </Chip>
        <Chip text={event.fields["Type"]}></Chip>
        <h2>{event.fields["Artist name"]}</h2>
        
        {/* <p>{event.fields["Running order ID"]}</p> */}
      </CardContent>
      <CardFooter>
        <Button color="white">Follow</Button>
        {/* <Link>Read more</Link> */}
      </CardFooter>
    </Card>
  )
}
