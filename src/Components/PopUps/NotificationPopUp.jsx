import { motion } from 'framer-motion'
import './NotificationPopUp.css'


function NotificationPopUp({close,children,className,style}) {
    const Variants = {
        in: {
            opacity:1,
            y:"0",
            x:"-50%"
        },
        out: {
            opacity:0,
            y: "-10vh",
            x:"-50%"
        }
      }
      const Transition = {
          type: "tween",
          ease: "anticipate",
          duration: 0.4,
      }

    return (
        
      <motion.div className={"notification-popup flex-center "+className} style={style}
      initial="out"
      animate="in"
      exit="out"
      variants={Variants}
      transition={Transition}>
        <p>{children}</p>
        <img src='/close-icon.svg' onClick={()=>close()} style={{cursor:"pointer"}}/>
      </motion.div>
    )
  }
  
  export default NotificationPopUp
  