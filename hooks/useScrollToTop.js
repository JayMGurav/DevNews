import { useEffect, useState } from "react";

export default function useScrollToTop(){
  const [isBtnVisible, setIsBtnVisible] = useState(false);
  const [pageYOffset, setPageYOffset] = useState(0);

  useEffect(()=>{  
    const checkVisiblity = () => {
      setPageYOffset(window.pageYOffset)
      if(pageYOffset - 100 > window.innerHeight){
        setIsBtnVisible(true);
      }else{
        setIsBtnVisible(false);
      }
    }

    window.addEventListener('scroll', checkVisiblity);

    return () => window.removeEventListener('scroll', checkVisiblity);

  },[pageYOffset]);


  const scrollToTop = () => {
    if(window && isBtnVisible){
      window.scrollTo({
        top: 0,
        behavior:"smooth"
      });
    }
  }


  return [isBtnVisible, scrollToTop];
}