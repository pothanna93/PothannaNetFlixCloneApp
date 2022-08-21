import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'

import './index.css'

const FooterRoute = () => (
  <div className="footer-container">
    <div>
      <FaGoogle className="icon" />
      <FaTwitter className="icon" />
      <FaInstagram className="icon" />
      <FaYoutube className="icon" />
    </div>

    <p className="contact-us">Contact us</p>
  </div>
)
export default FooterRoute
