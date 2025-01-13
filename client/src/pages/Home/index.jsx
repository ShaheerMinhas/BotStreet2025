import React from 'react'
import LogoDiv from '../../components/LogoDiv'
import Section2 from '../../components/main-section2'
import Navbar from '../../components/Navbar'
import Section1 from '../../components/main-section1'
import Contact from '../../components/contact-section'
import Footer from '../../components/footer'
import Articles from '../../components/main-section3'
import Section4 from '../../components/main-section4'
import FollowUs from '../../components/ArticlePage/FollowUs'



const Home = () => {
  return (
    <div>
        <LogoDiv/>
        <Section1/>
        <Articles/>
        <Contact/>
        <Footer />
    </div>
  )
}

export default Home