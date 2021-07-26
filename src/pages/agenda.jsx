import React, {useEffect, useState} from 'react';
import { Button, Page, Navbar, Block, Chip, CardHeader,CardContent, Card, CardFooter, Link, BlockTitle } from 'framework7-react';
var _ = require('lodash');
var dayjs = require('dayjs')

const AgendaPage = (props) => {

  function switchFilter(filter) {
      console.log("filters clicked: ", filter)
      let tempFilters = filters
      tempFilters[filter] = !tempFilters[filter]
      // console.log("new filters: ",tempFilters)
      setFilters({...filters,...tempFilters})
  }

  const  {data, f7route, f7router} = props
  
  const [days, setDays] = useState()
  const [user, setUser] = useState()
  const [filters,setFilters] = useState()
  const [filteredData, setFilteredData] = useState()

  useEffect(() => {
    let myFilters = {}
    _.uniq(
        data.map( event => {
            return(
                event.fields["Type"]
            )
        }))
        .map( filter => {
            myFilters[filter] = true
        }
    )
    setFilters(myFilters)
  },[])

  useEffect(() => {
    console.log("data: ", data)
    if(filters){
      setFilteredData( data.filter(event => {return(filters[event.fields["Type"]])}) )
    }
    
  },[filters, setFilters]) 

  useEffect(() => {
    setUser(f7route.query?.user)
  },[])

  useEffect(() => {
    if(filteredData){
      let tempDays = Object.entries(_.groupBy(filteredData.map(event => {
        event.date = dayjs(event.fields["Play date"])
        return(event)
      }), 'date'))
      
      setDays(tempDays)
    }
  },[filteredData])

  useEffect(() => {
    console.log("filters changed: ", filters)
  }, [filters,setFilters])

  useEffect(() => {console.log("days changed: ", days),[days,setDays]})
  useEffect(() => {console.log("filteredData changed: ", filteredData),[filteredData,setFilteredData]})

  return (
    <Page>
          <Navbar title="Trevarefest Agenda"/>
        {/* <!--
        Additional "timeline-horizontal" className to enable Horizontal timeline
        Additional "col-50" to define column width (50%)
        Additional "tablet-20" to define column width for tablets (20%)
        --> */}
        <BlockTitle>Filters</BlockTitle>
        <Block>
            {filters && Object.entries(filters).map((filter, id) => {
                return(
                  <Link key={id} onClick={()=> {switchFilter(filter[0])}}>
                    <Chip color="blue"  outline={!filter[1]} textColor="white"   text={filter[0]}></Chip>  
                  </Link>
                
            )})}
        </Block>
        <div className="timeline timeline-horizontal col-50 tablet-20">
            {/* <!-- Timeline Item (Day) --> */}
            {days && days.map((date, id) => {return(<TimeLineDay filters={filters} key={id} date={date[0]} events={date[1]}/>)})}
        </div>
    </Page>
  );
}

export default AgendaPage;

const TimeLineDay = (props) => {
  const {date, events, filters} = props;
  
  // const orderedEvents = events.sort((a,b) => {return(new Date(a.fields["Start time"]) - new Date(b.fields["Start time"]))})

  useEffect(()=>{
    // console.log("day: ", date)
    console.log("events: ", events)
  },[])

  return (
    <div className="timeline-item">
      <div className="timeline-item-date">{dayjs(date).format("D MMM")}</div>
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
