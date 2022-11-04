import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Router, { useRouter } from "next/router";
import React from 'react';
import { MdArrowForward, MdDateRange, MdFilterListAlt, MdPlace, MdSearch, MdWork } from 'react-icons/md';
import useSWR from 'swr';
import style from '../styles/Home.module.css';

interface PageProps {
  data: {
    title: string,
    date: string,
    entries: string,
    company: {
      name: string,
      id: string
    },
    location: {
      city: string,
      state: string
    },
    jobs: any,
    found: number,
    total: number,
    remaining: number

  }
}

interface Query {
  title?: string,
  date?: string,
  entries?: string,
  city?: string,
  state?: string,
  company?: string
}

export default function Home( {data}: PageProps ) {

  // Loading feedback, for better user experience
  const [isLoading, setLoading] = React.useState(false)
  React.useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);


  // Search options (filter) and drop-down element control
  const [showOptions, setShowOptions] = React.useState(false);
  const toggleHandler = (e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); setShowOptions(!showOptions) };
  // controlled input values
  const [jobTitle, setJobTitle] = React.useState(data.title);
  const [dateFilter, setDateFilter] = React.useState(data.date);
  const [locationFilter, setLocationFilter] = React.useState(data.location);
  const [entriesFilter, setEntriesFilter] = React.useState(data.entries);
  const [companyFilter, setCompanyFilter] = React.useState(data.company); // company search was not implemented

  // card navigation control (details)
  const [jobIndex, setJobIndex] = React.useState(0);
  const indexHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => setJobIndex(parseInt(e.currentTarget.id));


  const router = useRouter()
  const queryHandler = (): void => {
  const query: Query = {
    title: jobTitle,
    date: dateFilter,
    entries: entriesFilter,
    city: locationFilter.city,
    state: locationFilter.state,
    company: "" //companyFilter.id,
  }
  setJobIndex(0); // card navigation reset
  // keep url parameters clean
  if (query.title === "") delete query.title
  if (query.date === "7d") delete query.date
  if (query.entries === "10") delete query.entries
  if (query.city === "") delete query.city
  if (query.state === "") delete query.state
  if (query.company === "") delete query.company

  router.push({ query: { ...query } })
}
  // job search input change handler, and click handlers for option (filter) buttons
  const jobTitleChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => setJobTitle(e.target.value);
  const dateSetHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => setDateFilter(e.currentTarget.value);
  const entriesSetHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => setEntriesFilter(e.currentTarget.value);
  const locationChangeHandler = (city: string, state: string) => setLocationFilter({city, state});

  // useEffect for updating search parameters
  React.useEffect(()=>{
    queryHandler();
}, [dateFilter, entriesFilter, locationFilter])

  // autocomplete and suggestions
  const { data: jobs } = useSWR(jobTitle, (search)=> axios.get('https://www.zippia.com/autocomplete/source/?searchString=' + search).then(res => res.data))
  const { data: jobTitleDataList } = 
    useSWR(jobTitle, (search)=>
      axios.get('https://www.zippia.com/autocomplete/source/?searchString=' + search)
      .then(res => res.data)
  )
  //const { data: locationDataList } = useSWR(locationFilter.city, (search)=> axios.get('https://www.zippia.com/autocomplete/location/?searchString=' + search).then(res => res.data))
  //const { data: companyDataList } = useSWR(companyFilter.name, (search)=> axios.get('https://www.zippia.com/autocomplete/company/?searchString=' + search + '&indexableOnly=true').then(res => res.data))

  return (<>

  <Head>
    <title>Job Search</title>
    <meta name="description" content="Next App" />
    <link rel="icon" href="/favicon.ico" />
  </Head>

  <header className={style.header}>
    <div className={style.container}>
      <h1>JOB SEARCH</h1>
      <hr/>
      <p>{isLoading ? "Searching for jobs..." : "Jobs found: " + data.total}</p>
    </div>
  </header>

  <nav className={style.nav}>
    <div className={style.container}>
      <ul>
        <li className={style.options}>
          <span>
            <input type="text" value={jobTitle} placeholder="Job Title" list="joblist" onChange={jobTitleChangeHandler}/>
            <button onClick={queryHandler}>Search</button>
            <button onClick={toggleHandler}>Filters</button>
          </span>
          <datalist id="joblist">
          {jobTitleDataList?.map((item: any, index: number)=><option key={index} value={item.name} />)}
          </datalist>

          {showOptions ? <>
          <div className={style.filters}>
            <div className={style.date}>
              <span><MdDateRange/> Date</span>
              <button value="1d" className={dateFilter === "1d" ? style.on : style.off} onClick={dateSetHandler}>Past Day</button>
              <button value="3d" className={dateFilter === "3d" ? style.on : style.off} onClick={dateSetHandler}>Past 3 Days</button>
              <button value="7d" className={dateFilter === "7d" ? style.on : style.off} onClick={dateSetHandler}>Past Week</button>
              <button value="30d" className={style.disabled} disabled>Past Month</button>
            </div>
            <hr/>
            <div className={style.location}>
              <span><MdPlace/> Location</span>
              <button className={locationFilter.city === "" && locationFilter.state === "" ? style.on : style.off}  onClick={()=>setLocationFilter({city: "", state: ""})}>All Cities</button>
              {locationFilter.city !== "" && locationFilter.state !== "" ? 
              <button className={style.on}  onClick={queryHandler}>{locationFilter.city}, {locationFilter.state}</button> : null }
            </div>
            <hr/>
            <div className={style.location}>
              <span><MdFilterListAlt/> Limit</span>
              <button value="10" className={entriesFilter === "10" ? style.on : style.off} onClick={entriesSetHandler}>10 Results</button>
              <button value="25" className={entriesFilter === "25" ? style.on : style.off} onClick={entriesSetHandler}>25 Results</button>
              <button value="50" className={style.disabled} disabled>50 Results</button>
              <button value="100" className={style.disabled} disabled>100 Results</button>
            </div>
            <hr/>
            <div className={style.location}>
              <span><MdWork/> Company</span>
              <button onClick={queryHandler}>All Companies</button>
            </div>
            <hr/>
            <div className={style.location}>
              <span>Click "FILTERS" to hide this menu.</span>
            </div>
          </div>
          </> : null }
        </li>
        <li>Find jobs near you</li>
      </ul>
    </div>
  </nav>

  <main className={isLoading ? style.fade : style.main}>
    <div className={style.container2}>
      <section className={style.cards}>
        {data.jobs?.length > 0 ? data.jobs.map((item: any, index: number)=>
          <article key={index} id={index.toString()} onClick={indexHandler} className={jobIndex === index ? style.selected : ""}>
            <p className={style.jobtitle}>{item.jobTitle}</p>
            <p className={style.comapanyname}><MdWork/> {item.companyName}</p>
            <p className={style.location}><MdPlace/>{item.OBJcity}, {item.OBJstateCode}</p>
          </article>) : <p>Not found</p>}

      </section>
      <section className={style.info}>
        <header>
          <p className={style.jobtitle}>{data.jobs[jobIndex]?.jobTitle}</p>
          <p className={style.comapanyname}> Company: {data.jobs[jobIndex]?.companyName} ({data.jobs[jobIndex]?.OBJcity}, {data.jobs[jobIndex]?.OBJstateCode})</p>
          <button className={style.location} onClick={()=>setLocationFilter({city: data.jobs[jobIndex].OBJcity, state: data.jobs[jobIndex]?.OBJstateCode })}> Find more jobs in {data.jobs[jobIndex]?.OBJcity}, {data.jobs[jobIndex]?.OBJstateCode} <MdArrowForward/></button>
        </header>
        <article className={style.description}>
            <p>{data.jobs[jobIndex]?.jobDescription.replace(/<\/?[^>]+(>|$)/g, "")}</p>
        </article>
        <footer>
          {jobTitleDataList ? <div className={style.suggestions}><MdSearch/> You may also try: {jobTitleDataList.map((item: any)=><a>{item.name}</a>)}</div> : null}
      </footer>
      </section>
    </div>
  </main>

  <footer className={style.footer}>
    <div className={style.disclaimer}>Disclaimer | Contact</div>
  </footer>
  </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { title = "", date = "", entries = "", company = "", id = "", city = "", state = "" } = context.query;

  let titleParam = Array.isArray(title) && title.length > 0 ? title[0] : title;
  let dateParam = Array.isArray(date) && date.length > 0 ? date[0] : date;
  let entriesParam = Array.isArray(entries) && entries.length > 0 ? entries[0] : entries;
  let companyParam = Array.isArray(company) && company.length > 0 ? company[0] : company;
  let idParam = Array.isArray(id) && id.length > 0 ? id[0] : id;
  let cityParam = Array.isArray(city) && city.length > 0 ? city[0] : city;
  let stateParam = Array.isArray(state) && state.length > 0 ? state[0] : state;

  // Verify company id
  if (companyParam !== "" && idParam !== "") {
    const getCompany = await axios.post('https://www.zippia.com/api/getCompanyDataById/',
      {"companyId": companyParam }).then(res =>{
        console.log("what",res)
        return { company: res.data.companyName, id: res.data.companyID };
    });
    if (getCompany.company !== companyParam) {
      companyParam = "";
      idParam = ""
    }
  }

  const response = await axios.post('https://www.zippia.com/api/jobs/',
  {
    "postingDateRange": date,
    "companySkills": true,			
    "dismissedListingHashes": [],
    "fetchJobDesc": true,
    "jobTitle": titleParam,
    "locations": [{"city": cityParam, "state": stateParam}],
    "numJobs": parseInt(entriesParam as string),
    "previousListingHashes": []
    }).then(res =>{
      console.log("what",res)
      return res.data
    })

  /*
  End-point for Companiy search:

  https://www.zippia.com/api/getJobsFromSearchAPI/
  {
  "numJobs": 20,
  "userOld": true,
  "companyIDs": [487],
  "snippetPriority": ["company", "location", "title"],
  "fetchJobDesc": true,
  "locationSort": false,
  "dismissedListingHashes": [],
  "previousListingHashes": [],
  "titles": ["Developer"],
  "locations": [{"city": "Houston", "state": "TX"}]
  }

  */


    return {
    props: {
      data: { 
        title: titleParam,
        date: dateParam, 
        entries: entriesParam,
        company: { name: companyParam, id: idParam },
        location: { city: cityParam, state: stateParam },
        jobs: response.jobs ?? [],
        found: response.jobs?.length ?? 0, 
        total: response.totalJobs ?? 0,
        remaining: response.remainingJobs ?? 0
      }
    },
  }
}

