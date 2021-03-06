import React, {useEffect, useState} from 'react';
import { Button,Segmented, Page, Navbar, Block, Chip, CardHeader,CardContent, Card, CardFooter, Link, BlockTitle, Icon } from 'framework7-react';
import axios from 'axios';
import { format, compareAsc, parseISO } from 'date-fns'
var _ = require('lodash');
var dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)


const AgendaPage = (props) => {


  function switchFilter(filter) {
      console.log("filters clicked: ", filter)
      let tempFilters = filters
      tempFilters[filter] = !tempFilters[filter]
      // console.log("new filters: ",tempFilters)
      setFilters({...filters,...tempFilters})
  }

  function toggleMyEvents(bool) {
    setMyEvents(bool)
  }

  const  {events, user, f7route, f7router} = props
  
  const [days, setDays] = useState()
  const [filters,setFilters] = useState()
  const [myEvents, setMyEvents] = useState(false)
  const [filteredEvents, setFilteredEvents] = useState()

  // setup filters
  useEffect(() => {
    let myFilters = {}
    _.uniq(
        events.filter(event=> {
          if(myEvents) { return true }
          else if(
            event.fields.Type === "Transportation" ||
            event.fields.Type === "GET IN" ||
            event.fields.Type === "SOUNDCHECK" ||
            event.fields.Type === "CHANGE-OVER"
          ) { return false }
          else {return true}
        }).map( event => {
            return(
                event.fields["Type"]
            )
        }))
        .map( filter => {
            myFilters[filter] = true
        }
    )
    console.log("myFilters: ", myFilters)
    setFilters(myFilters)
  },[myEvents,setMyEvents])



  useEffect(() => {
    if(myEvents && filters){
      setFilteredEvents(events.filter(event => {
        return(JSON.stringify(event).indexOf(user.id) > -1)
      }).filter(event => {return(filters[event.fields["Type"]])}))
    } else if(myEvents) {
      setFilteredEvents(events.filter(event => {
        return(JSON.stringify(event).indexOf(user.id) > -1)
      }))
    } else if(filters){
      setFilteredEvents( events.filter(event => {
        if(event.fields.Type === "Transportation") {return false}
        if(event.fields.Type === "GET IN") {return false}
        if(event.fields.Type === "SOUNDCHECK") {return false}
        if(event.fields.Type === "CHANGE-OVER") {return false}
        if(event.fields.Type === "VIP Activity") {return false}
        else {
          return(filters[event.fields["Type"]])
        }
      }) )
    }

  },[filters,setFilters, myEvents, setMyEvents])  

  // group events by date
  useEffect(() => {
    if(filteredEvents){
      let tempDays = Object.entries(_.groupBy(filteredEvents.map(event => {
        // const timeZone = 'Europe/Oslo' 
        event.date = dayjs(new Date(event.fields["Start time"].slice(0,10))).format('D MMM')
        return(event)
      }), 'date')).sort((a,b)=> {return new Date(a[0]) - new Date(b[0]);})
      setDays(tempDays)
    }
  },[filteredEvents,setFilteredEvents])

  // useEffect(() => {
  //   console.log("my agenga clicked: ", myEvents)
  // },[myEvents,setMyEvents])

  // useEffect(() => {
    // console.log("props events: ", events)
    // console.log("props user: ", user)
    // f7route.query?.user && getUser(f7route.query?.user)
  // },[])

  // useEffect(() => {
  //   console.log("filters changed: ", filters)
  // }, [filters,setFilters])

  useEffect(() => {console.log("days changed: ", days),[days,setDays]})
  useEffect(() => {console.log("filteredData changed: ", filteredEvents),[filteredEvents,setFilteredEvents]})

  return (
    <Page>
        <Navbar title={"Trevarefest Agenda - "+user.fields["Name"]}> 
        </Navbar>
        {/* <!--
        Additional "timeline-horizontal" className to enable Horizontal timeline
        Additional "col-50" to define column width (50%)
        Additional "tablet-20" to define column width for tablets (20%)
        --> */}
        {/* <BlockTitle slot="fixed">{"Trevarefest Agenda - "+user.fields["Name"]}</BlockTitle> */}
        <Block >
          <Segmented raised  tag="p">
            <Button outline color="blue" active={!myEvents} textColor="white" onClick={()=> toggleMyEvents(false)}>All events</Button>
            <Button outline color="blue" active={myEvents} textColor="white" onClick={()=> toggleMyEvents(true)}>My events</Button>
          </Segmented>
        </Block>
        <Block >
            {filters && Object.entries(filters).map((filter, id) => {
                return(
                  <Link key={id} onClick={()=> {switchFilter(filter[0])}}>
                    <Chip color="blue"  outline={!filter[1]} textColor="white"   text={filter[0]}></Chip>  
                  </Link>
            )})}
        </Block>
        
        <div className="timeline timeline-horizontal col-70 tablet-30">
            {/* <!-- Timeline Item (Day) --> */}
            {days && days.map((date, id) => {return(<TimeLineDay router={f7router} filters={filters} user={user} key={id} date={date[0]} events={date[1]}/>)})}
        </div>
    </Page>
  );
}

export default AgendaPage;

const TimeLineDay = (props) => {
  const {router, date, events, filters, user} = props;
  const [sortedEvents, setSortedEvents] = useState([])
  useEffect(()=>{
    console.log("day: ", date)
    setSortedEvents(_.orderBy(events, i => {
        let date = new Date(i.fields["Start time"])
        console.log("date: ",date)
        return date
      }
      , 'asc'))
  },[events])
  useEffect(() => {
    console.log("sortedEvents: ",sortedEvents)
  },[sortedEvents])

  return (
    <div className="timeline-item">
      <div className="timeline-item-date">{dayjs(date).format("D MMM")}</div>
      <div className="timeline-item-content">
        {sortedEvents.map((event, id)=> {return(<TimeLineEvent key={id} router={router} user={user} event={event}/>)})}
      </div>
    </div>
  )
} 

const TimeLineEvent = (props) => {
  const {router, event, user} = props;
  // useEffect(()=>{
  //   console.log("event: ",event )
  // },[])

  function toggleFollowing(action,event,user) {
    
    let followers = event.fields?.Followers || []
    
    if(action === "follow") 
      {followers.push(user.id)}
    else
      {followers = followers.filter(userId => {return userId !== user.id})}
    let data =  {
      records: [{
        id: event.id,
        fields: {
          Followers: followers
        }
      }]
    }
    console.log("data: ",data)
    axios({
      url: "https://api.airtable.com/v0/appw2hvpKRTQCbB4O/tblqOcPguzuv5UhkG",
      method: "patch",
      headers: {
        "Authorization": "Bearer keyYNFILTvHzPsq1B"
      },
      data
    })
    .then(res => {
      console.log(res)
      router.refreshPage()
    })
    .catch(err => {console.log(err)})
  }

  function checkFollower(userId) {
    if(event.fields?.Followers?.includes(userId)) {return true}
    // return false
  }

  const timeZone = 'Europe/Oslo' 
  // event.date = dayjs(event.fields["Start time"], {timeZone}).format('D MMM')

  return(
    <Card className="demo-card-header-pic">
      <CardHeader
        className="no-border"
        valign="bottom"
        style={{
          backgroundImage: `url(${event.fields["Image"]?.[0]?.thumbnails?.large?.url || ""})`,
          height: '300px',          
        }}
      >
      </CardHeader>
      <CardContent>
        {event.fields?.["Artist name"] && <h2>{event.fields["Artist name"]}</h2>}
        {event.fields?.["Activity Type"]?.[0] && <h2>{event.fields["Activity Type"][0]}</h2>}
        <Chip text={dayjs(event.fields["Start time"].replace("000Z",""), {timeZone}).add(0,"hours").format("HH:mm")}></Chip>
        <Chip text={event.fields["Type"]}></Chip>
        {event.fields?.["Location name"] && <Chip text={event.fields["Location name"]}></Chip>}
        {/* {event.fields.Type === "Transportation" && event.fields?.["From Name"] && <Chip text={"From: "+event.fields["From Name"]}></Chip>}
        {event.fields.Type === "Transportation" && event.fields?.["To Name"] && <Chip text={"To: "+event.fields["To Name"]}></Chip>} */}
        
        {/* <p>{event.fields["Running order ID"]}</p> */}
      </CardContent>
      <CardFooter>
        <Button 
          outline 
          raised 
          round 
          small 
          icon="eye_fill" 
          fill={checkFollower(user.id)} 
          color={checkFollower(user.id) ? "blue" : "white"} 
          // textColor={checkFollower(user.id) ? "black" : "white"}
          textColor="white"
          onClick={()=> toggleFollowing(checkFollower(user.id) ? "unfollow": "follow",event,user)}
        >
          {checkFollower(user.id) ? "Unfollow" : "Follow"}
        </Button>
        {/* <Link>Read more</Link> */}
      </CardFooter>
    </Card>
  )
}
