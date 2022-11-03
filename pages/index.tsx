import Head from 'next/head';
import Router from "next/router";
import React from 'react';
import style from '../styles/Home.module.css';

interface PageProps {
  data: {
    date?: string[], 
    entries?: string[],
    company: string[],
    location: string[],
    info: []
  }
}

export default function Home( {data}: PageProps ) {


  // Loading feedback
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

  // Search options
  const [showOptions, setShowOptions] = React.useState(false);
  const toggleHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowOptions(!showOptions)
  };


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
      <p>Search jobs {isLoading ? "loading" : "loaded"}</p>
    </div>
  </header>

  <nav className={style.nav}>
    <div className={style.container}>
      <ul>
        <li className={style.options}>
          <span>
            <input type="text" placeholder="Job Title"/>
            <button>Search</button>
            <button onClick={toggleHandler}>Filters</button>
          </span>
          {showOptions ? <div className={style.filters}></div> : null }
        </li>
        <li>Find jobs near you</li>
      </ul>
    </div>
  </nav>

  <main className={style.main}>
    <div className={style.container2}>
      <section className={style.cards}>
        <article>Card</article>
        <article>Card</article>
        <article>Card</article>
        <article>Card</article>
        <article>Card</article>
        <article>Card</article>
        <article>Card</article>
        <article>Card</article>
      </section>
      <section className={style.info}>
        <header></header>
        <article className={style.description}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </article>
        <footer></footer>
      </section>
    </div>
  </main>

  <footer className={style.footer}>
    <div className={style.disclaimer}>Disclaimer | Contact</div>
  </footer>
  </>
  )
}
