import React, { useState } from 'react'
import { useEffect, useRef } from 'react'
import { useParams, useLoaderData } from 'react-router-dom';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import Calender from '../../Calender/Calender.jsx';
import Timer from '../../Timer/Timer.jsx';
import dayjs from 'dayjs';
import { months } from '../../Calender/calender.js';
import BlinkingText from '../../BlinkingText/BlinkingText.jsx';
import { fetchPlantIDAndPlantNameFromFirestore } from '../../../auth.js';
import close from '../../../assets/cancel-01-stroke-rounded.svg'
import battery from '../../../assets/battery.png'
import timer from '../../../assets/stop-watch-stroke-rounded.svg'
import pastTime from '../../../assets/time-past.png'
import arrow from '../../../assets/next.png'

const UserDashboard = ({ setProgress }) => {

  const { currUser } = useLoaderData();

  const route = `${import.meta.env.VITE_FLASK_API}`;

  ////////////////////////////////////////// 

  const [plantID, setPlantID] = useState("Plant0");
  const [plantName, setPlantName] = useState(" ");
  const [selectedTime, setSelectedTime] = useState({ hr: '01', min: '00', ampm: 'AM' });
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [allRobotData, setAllRobotData] = useState([]);
  const [allRobotKeys, setAllRobotKeys] = useState([]);
  const [robotStatus, setRobotStatus] = useState([{}]);
  const [robotError, setRobotError] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState([{}]);
  const [CD, setCD] = useState([]);
  const [displayError, setDisplayError] = useState([{}]);
  const [ONStatus, setONStatus] = useState([{}]);
  const [robotList, setRobotList] = useState([{}]);
  const [checkedScheduleDaily, setCheckedScheduleDaily] = useState(null)
  const [scheduleDailyCheckBox, setScheduleDailyCheckBox] = useState(false)
  const [rightVisibility, setRightVisibility] = useState(false)
  //////////////////////////////////////////

  const seperateDataAndKeysFromAPIRobotData = (apiData) => {
    let dataToBeSeperated = Object.fromEntries(apiData)
    let dataObj = {}
    let keyObj = {}

    Object.entries(dataToBeSeperated).forEach(([key, val]) => {
      Object.entries(val).forEach(([itmeKey, itemVal]) => {
        dataObj[key] = itemVal
        keyObj[key] = itmeKey
      })
    });
    return [keyObj, dataObj];
  }

  const funcRobotStatusAndErrorAndONStatus = () => {
    let statusOfRobots = {};
    let errorOfRobots = {};
    let networkErrorOfRobots = {};

    Object.entries(allRobotData).forEach(([robotID, robotData]) => {
      statusOfRobots[robotID] = robotData.ST;
    });

    Object.entries(allRobotData).forEach(([robotID, robotData]) => {
      errorOfRobots[robotID] = robotData.ER;
    });

    Object.entries(allRobotKeys).forEach(([robotID, lastDataTime]) => {

      let curr_date = new Date().getDate();
      let curr_month = new Date().getMonth();
      let curr_year = new Date().getFullYear();
      let curr_hour = new Date().getHours();
      let curr_min = new Date().getMinutes();
      // let curr_time = new Date(curr_year, curr_month, curr_date, curr_hour, curr_min).getTime();
      let curr_time = new Date().getTime();

      // let CD_date = parseInt(CD.DD);
      // let CD_month = parseInt(CD.MM);
      // let CD_year = parseInt(CD.YY);
      // let CD_hour = parseInt(CD.H);
      // let CD_min = parseInt(CD.M);
      // let CD_time = new Date(CD_year, CD_month - 1, CD_date, CD_hour, CD_min).getTime();
      // let CD_time_f = new Date(CD_year, CD_month - 1, CD_date, CD_hour, CD_min);

      console.log(typeof (lastDataTime))

      let lastDataTimeDate = parseInt(lastDataTime.split(' ')[0].split('-')[2]);
      let lastDataTimeMonth = parseInt(lastDataTime.split(' ')[0].split('-')[1]);
      let lastDataTimeYear = parseInt('20' + lastDataTime.split(' ')[0].split('-')[0]);
      let lastDataTimeHour = parseInt(lastDataTime.split(' ')[1].split(':')[0]);
      let lastDataTimeMinute = parseInt(lastDataTime.split(' ')[1].split(':')[1]);
      let lastDataTimeSeconds = parseInt(lastDataTime.split(' ')[1].split(':')[2]);
      let lastDataTime_time = new Date(lastDataTimeYear, lastDataTimeMonth - 1, lastDataTimeDate, lastDataTimeHour, lastDataTimeMinute, lastDataTimeSeconds).getTime();
      let lastDataTime_f = new Date(lastDataTimeYear, lastDataTimeMonth - 1, lastDataTimeDate, lastDataTimeHour, lastDataTimeMinute);

      console.log(lastDataTime_f);

      // console.log((CD_time - lastDataTime_time));
      // console.log(curr_time - lastDataTime_time);

      // networkErrorOfRobots[robotID] = (CD_time - lastDataTime_time > 2 * 60 * 1000) ? 1 : 0
      networkErrorOfRobots[robotID] = (curr_time - lastDataTime_time > 2 * 60 * 1000) ? 1 : 0
      console.log(curr_time - lastDataTime_time)
    });

    return [statusOfRobots, errorOfRobots, networkErrorOfRobots];
  };

  const fetchRobotList = async () => {
    if (plantID !== "Plant0") {
      console.log("fetching robot list");
      const res = await fetch(`${route}/robot-list/${plantID}`);
      const data = await res.json();
      setRobotList(data);
    }
  }

  const fetchAllRobotData = async () => {
    if (plantID !== "Plant0") {
      console.log("fetching all robot data")
      const res = await fetch(`${route}/all-robot-data/${plantID}`);
      const data = await res.json();
      let dataArr = Object.entries(data);
      dataArr.sort((a, b) => (a[0]).localeCompare(b[0], 'en', { numeric: true }));
      const [keyObj, dataObj] = seperateDataAndKeysFromAPIRobotData(dataArr);
      setAllRobotKeys(keyObj);
      setAllRobotData(dataObj);
      // setLoading(false);
    }
  };

  const fetchCD = async () => {
    if (plantID !== "Plant0") {
      console.log("fetching CD")
      const res = await fetch(`${route}/get-cd/${plantID}`);
      const data = await res.json();
      setCD(data);
      console.log(data);
    }
  }

  const checkStatus = () => {
    return Object.values(robotStatus).some(val => val === 1);
  };

  const handleCheckbox = async () => {
    const res = await fetch(`${route}/checkbox/${plantID}`)
    setScheduleDailyCheckBox(!scheduleDailyCheckBox);
  }

  useEffect(() => {
    if (CD.DD || CD.MM || CD.YY || CD.H || CD.M) {
      setLoading(false);
    }
    if (typeof (CD.SD) !== 'undefined') {
      if (CD.SD) {
        setCheckedScheduleDaily(true)
        setScheduleDailyCheckBox(true)
      } else {
        setCheckedScheduleDaily(false)
        setScheduleDailyCheckBox(false)
      }
    }
  }, [CD])

  // useEffect(async() => {
  //   const currUser = await getCurrentUser();
  //   if (currUser) {
  //     const fetchPlantID = await fetchPlantIDFromFirestore(currUser.uid);
  //     setplantID(fetchPlantID);
  //   }
  // }, [])


  useEffect(() => {
    const [status, error, networkError] = funcRobotStatusAndErrorAndONStatus();
    setRobotStatus(status);
    setRobotError(error);
    setNetworkError(networkError);
  }, [allRobotData, allRobotKeys, CD]);

  // if (robotStatus.R1 != null && robotError.R1 != null && networkError.R1 != null) {
  //   console.log("Status", robotStatus)
  //   console.log("Error", robotError)
  //   console.log("Network Error", networkError)
  // }

  useEffect(() => {
    const fetchPlantIDPlantNameAndUsername = async () => {
      if (currUser) {
        const { plantID, plantName } = await fetchPlantIDAndPlantNameFromFirestore(currUser.uid);
        setPlantID(plantID)
        setPlantName(plantName)
        console.log(plantID, plantName);
      }
    }
    fetchPlantIDPlantNameAndUsername();
  }, [])


  useEffect(() => {
    const fetchData = async () => {
      // setProgress(50)
      await fetchAllRobotData();
      await fetchRobotList();
      // setProgress(100)
    };
    fetchData();
  }, [plantID]);

  useEffect(() => {
    console.log(robotList);
    let initialONStatus = {};
    Object.values(robotList).forEach(robotID => {
      initialONStatus[robotID] = 'null';
    });
    setONStatus(initialONStatus);
  }, [robotList])

  useEffect(() => {
    console.log(ONStatus);
  }, [ONStatus])

  // useEffect(() => {

  //   if (CD.UID != 254 && typeof (CD.UID) !== 'undefined') {
  //     console.log("hellllllooo", CD.UID)
  //     setONStatus(prev => [{ ...prev, [`R${CD.UID}`]: false }]);
  //   }
  //   if (CD.UID == 254 && typeof (CD.UID !== 'undefined')) {
  //     console.log("byebyeeee", CD.UID)
  //     setONStatus(prev => {
  //       const updatedStatus = {};
  //       for (let key in prev) {
  //         updatedStatus[key] = true;
  //       }
  //       return updatedStatus;
  //     }); 
  //   }
  // }, [CD.UID])

  useEffect(() => {
    // console.log("isdofdjodsvddiovsadisofisaod")
    const interval2 = setTimeout(() => {
      let ONButtonStatus = localStorage.getItem('ONButtonClicked');

      if (ONButtonStatus === 'true') {
        if (CD.UID !== 254 && typeof (CD.UID) !== 'undefined') {
          // console.log("ONButtonStatus 254: ", ONButtonStatus); 
          if (!robotStatus[`R${CD.UID}`]) {
            setONStatus(prev => {
              const updatedStatus = {};
              for (let key in prev) {
                if (key === `R${parseInt(CD.UID)}`) {
                  // console.log(CD.UID)
                  updatedStatus[key] = 'connecting';
                } else {
                  updatedStatus[key] = 'disable';
                }
              }
              return updatedStatus;
            });
          }
        }
        if (CD.UID === 254 && typeof (CD.UID) !== 'undefined') {
          localStorage.setItem('ONButtonClicked', false);
          // console.log("ONButtonStatus second: ", ONButtonStatus);
          setONStatus(prev => {
            const updatedStatus = {};
            for (let key in prev) {
              updatedStatus[key] = 'null';
            }
            return updatedStatus;
          });
        }
      }

      else {
        // console.log("ONButtonStatus else: ", ONButtonStatus);
        setONStatus(prev => {
          const updatedStatus = {};
          for (let key in prev) {
            updatedStatus[key] = 'null';
          }
          return updatedStatus;
        });
      }


    }, 2000);

    return () => {
      clearTimeout(interval2);
    }
  }, [CD.UID])


  // useEffect(() => {
  //   if (CD.UID != 254 && typeof CD.UID !== 'undefined') {
  //     console.log("hello", CD.UID);
  //     setONStatus(prev => ({ ...prev, [`R${CD.UID}`]: false }));
  //   }
  //   if (CD.UID == 254 && typeof CD.UID !== 'undefined') {
  //     console.log("bye", CD.UID);
  //     const updatedStatus = {};
  //     for (let key in ONStatus) {
  //       // if (robotStatus[key] === !ONStatus[key]) {
  //         console.log(key);
  //         updatedStatus[key] = true;
  //       // }
  //     }
  //     setONStatus(prev => ({ ...prev, ...updatedStatus }));
  //   }
  // }, [CD.UID]);

  useEffect(() => {
    const intervalID = setInterval(async () => {
      await fetchCD();
    }, 5000);
    return () => clearInterval(intervalID);
  }, [plantID])

  useEffect(() => {
    const conditionForFetchingAllRobotData = async () => {
      let isUIDnot254 = localStorage.getItem("isUID!254")
      if (robotStatus) {
        if (checkStatus()) {
          console.log("status true");
          await fetchAllRobotData();
        }
        if (CD.UID != 254 && typeof (CD.UID) !== 'undefined') {
          console.log("UID changed");
          await fetchAllRobotData();
          localStorage.setItem("isUID!254", true);
        }
        if (CD.UID == 254 && typeof (CD.UID) !== 'undefined' && isUIDnot254 == 'true') {
          console.log("isUID!254 back to false");
          await fetchAllRobotData();
          localStorage.setItem("isUID!254", false);
        }

        // if(CD.UID == 254 && typeof(CD.UID) !== 'undefined') {
        //   console.log('fetching only one time when UID is 254 and all off');
        //   setTimeout(async() => {
        //     await fetchAllRobotData()            ;
        //   }, 1000);
        // } 

        let currentDate = new Date();
        let dt = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        let hr = currentDate.getHours();
        let min = currentDate.getMinutes();

        if (parseInt(CD.DD, 10) === dt && parseInt(CD.MM, 10) === month && parseInt(CD.YY, 10) === year && parseInt(CD.H, 10) === hr && parseInt(CD.M, 10) === min) {
          console.log("Time Matched");
          await fetchAllRobotData();
          localStorage.setItem("isUID!254", true);
          // setTimeout(async () => {
          //   await fetchAllRobotData();
          // }, 62000);
        } else {
          console.log("Time did not match");
        }
      }
    }
    conditionForFetchingAllRobotData();
  }, [CD])

  const handleTimeChange = (hr, min, ampm) => {
    setSelectedTime({ hr, min, ampm });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleONChange = async (robotID) => {

    const res = await fetch(`${route}/push-on/${plantID}/${robotID}`)
      .then(res => {
        // console.log(res)
        if (res.status === 200) {
          // console.log("haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
          // console.log(CD.UID)
          localStorage.setItem('ONButtonClicked', true);
          // console.log(localStorage.getItem('ONButtonClicked'))
        } else {
          // console.log("naanananan");
        }
      })
    setONStatus(prev => {
      const updatedStatus = {};
      for (let key in prev) {
        if (key === robotID) {
          updatedStatus[key] = 'connecting';
        } else {
          updatedStatus[key] = 'disable';
        }
      }
      return updatedStatus;
    });
  }

  const handleStopRobots = () => {
    let stop = confirm("Are you sure to STOP all the Robots?");
    if (stop) {
      const res = fetch(`${route}/push-stop/${plantID}`);
      if (res === "200") {
        console.log("All the Robot Stopped Successfully");
      }
    }
  }

  const handleSendTime = () => {

    const currentDate = new Date().getDate();
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const currentHour = new Date().getHours();
    const currentMin = new Date().getMinutes();
    const tempHr = (selectedTime.ampm === 'PM') ? parseInt(selectedTime.hr) === 12 ? parseInt(selectedTime.hr) : parseInt(selectedTime.hr) + 12 : parseInt(selectedTime.hr) === 12 ? 0 : parseInt(selectedTime.hr)

    console.log(selectedDate)

    let pastCheckFlag = 0;

    if (selectedDate.year() > currentYear) {
      pastCheckFlag = 1;
      // console.log("future year");
    }
    else if (selectedDate.year() === currentYear) {
      // console.log("curr year")
      if ((selectedDate.month() + 1) > currentMonth) {
        // console.log("future month")
        pastCheckFlag = 1;
      }
      else if ((selectedDate.month() + 1) === currentMonth) {
        // console.log("curr month")
        if (selectedDate.date() > currentDate) {
          // console.log("future date")
          pastCheckFlag = 1;
        }
        else if (selectedDate.date() === currentDate) {
          // console.log("curr day")
          if (tempHr > currentHour) {
            pastCheckFlag = 1;
            // console.log("future hour")
          }
          else if (tempHr === currentHour) {
            // console.log("curr hour")
            if (selectedTime.min >= currentMin) {
              // console.log("future or curr min")
              pastCheckFlag = 1;
            }
            else {
              // console.log("past min")
              pastCheckFlag = 0;
            }
          }
          else {
            // console.log("past hr")
            pastCheckFlag = 0;
          }
        }
        else {
          // console.log("past day")
          pastCheckFlag = 0;
        }
      }
      else {
        // console.log("past month")
        pastCheckFlag = 0;
      }
    }
    else {
      // console.log("past year")
      pastCheckFlag = 0;
    }

    // console.log("flag", pastCheckFlag)

    if (pastCheckFlag) {
      let schTime = confirm(`Are you sure about Scheduled Time: ${selectedDate.date()} ${months[selectedDate.month()]} ${selectedDate.year()} - ${selectedTime.hr}:${selectedTime.min} ${selectedTime.ampm} ?`);
      if (schTime) {
        let hour = parseInt(selectedTime.hr, 10);
        if (selectedTime.ampm === 'PM' && hour !== 12) {
          hour += 12;
        } else if (selectedTime.ampm === 'AM' && hour === 12) {
          // Special case: 12 AM should be converted to 00
          hour = 0;
        }

        const requestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hour: hour.toString().padStart(2, '0'),
            minute: selectedTime.min,
            // AM_PM: selectedTime.ampm,
            date: (selectedDate.date().toString().padStart(2, '0')),
            month: ((selectedDate.month() + 1).toString().padStart(2, '0')),
            year: selectedDate.year().toString(),
            scheduleDaily: checkedScheduleDaily
          }),
        };
        fetch(`${route}/push-time/${plantID}`, requestOptions)
          .then(response => response.json())
          .then(res => console.log("response", res));

        // fetch(`${route}/push-daily-report/${plantID}`)
        //   .then((res) => console.log("response", res))

        console.log("robots scheduled!")
        alert(`Robots are being Scheduled Successfully\nThe Daily Report for today will be generated probably after 2 hours of the Scheduled Time`)
      }
    }
    else {
      alert("You cannot schedule the Robots in the Past")
    }
  }

  const handleRightVisibility = () => {
    setRightVisibility(!rightVisibility)
  }

  // let calenderRef = useRef();

  // useEffect(() => {
  //   let handler = (e)=>{
  //     if(!calenderRef.current.contains(e.target)){
  //       setRightVisibility(false);
  //       console.log(calenderRef.current);
  //     }      
  //   };

  //   document.addEventListener("mousedown", handler);


  //   return() =>{
  //     document.removeEventListener("mousedown", handler);
  //   }

  // });

  const calenderRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calenderRef.current && !calenderRef.current.contains(event.target)) {
        setRightVisibility(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [calenderRef]);

  return (
    <div className='mx-auto'>

      <div className='flex justify-between w-[100%] mx-auto px-[3vw] items-center sticky top-[90px] z-10 bg-white pt-4 pb-2 max-[768px]:top-[80px] max-[768px]:pt-2'>
        <div className='max-[550px]:flex flex-col'>
          {/* <div className='flex items-center justify-between gap-10'> */}
          <div className='leading-tight max-[600px]:text-2xl max-[485px]:text-xl text-3xl'>{plantName}</div>
          {/* <div onClick={handleRightVisibility} className='bg-[#fea920] text-center py-2 px-4 min-[1151px]:hidden max-new:py-4 max-new:px-6 rounded-lg cursor-pointer max-[550px]:px-1 '>Schedule Robots</div> */}
          {/* </div> */}
          <div className='hidden max-[600px]:text-sm max-[485px]:text-md max-[485px]:font-semibold max-new:block'>
            <div className='flex items-center gap-1'>
              <span className='font-medium max-[485px]:hidden'>{`Scheduled Time:`}</span>
              <img src={pastTime} className='size-[15px] hidden max-[485px]:inline-block' />
              {
                (typeof (CD.DD) === 'undefined') ?
                  <span>Loading...</span>
                  : <span>{`${CD.DD} ${months[CD.MM - 1]} ${CD.YY} - ${CD.H > 12 ? CD.H - 12 : CD.H === "00" ? 12 : CD.H}:${CD.M} ${CD.H >= 12 ? "PM" : "AM"} `}</span>
              }
            </div>
          </div>
        </div>
        <div className='flex gap-4 min-[1151px]:mr-3 items-center'>
          <div className='flex gap-2 max-new:hidden'>
            <div className='font-medium '>{`Scheduled Time:`}</div>
            {
              (typeof (CD.DD) === 'undefined') ?
                <div>Loading...</div>
                : <div>{`${CD.DD} ${months[CD.MM - 1]} ${CD.YY} - ${CD.H > 12 ? CD.H - 12 : CD.H === "00" ? 12 : CD.H}:${CD.M} ${CD.H >= 12 ? "PM" : "AM"} `}</div>
            }
          </div>
          <div onClick={handleRightVisibility} className='bg-[#fea920] text-center py-2 px-4 min-[1151px]:hidden max-new:py-4 max-new:px-6 rounded-lg cursor-pointer max-[550px]:px-2 max-[550px]:text-sm max-[485px]:py-3'>Configure Robots</div>
        </div>
      </div>

      <div className='w-[95%] mx-auto mb-4 flex min-[2618px]:justify-between min-[1151px]:gap-3 relative'>
        <div className='w-[80%] max-[1150px]:w-full'>

          <div className='left w-full mb-7 max-[768px]:mb-6 flex flex-col items-center gap-3 min-[2618px]:w-[100%] relative overflow-y-auto max-[1130px]:w-full'>
            {
              <>
                <div className={`text-3xl ${(loading) ? "block" : "hidden"} flex items-center `}>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </div>
              </>
            }

            {!loading && Object.entries(allRobotData).map(([robotID, robotData]) => (

              ((!robotStatus[robotID])) ?
                <>
                  <div
                    className={`cards bg-[#cfcfcf] w-[100%] flex transition-colors duration-300 ${!displayError[robotID] ? 'py-3' : 'pb-0 pt-3'} justify-between items-center rounded-lg  max-[550px]:px-2 max-[550px]:py-2`}
                  >
                    <div className='flex-col w-full '>
                      <div className='flex justify-between items-center rounded-lg px-4 max-[550px]:px-1'>
                        <div>
                          <div className='text-xl max-[400px]:text-[17px]'>{`Robot ${parseInt(robotID.slice(1))}`}</div>
                          <div className='flex gap-1 min-[768px]:hidden'>
                            <div className='flex items-center gap-2'>
                              <img src={battery} className='size-5 max-[550px]:size-4' />
                              <div className='text-lg max-[550px]:text-sm transition-all duration-300'>
                                {(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'}
                              </div>
                            </div>
                            <div className='font-medium '>|</div>
                            <div className='flex items-center gap-2'>
                              <img src={timer} className='size-6 max-[550px]:size-4' />
                              <div className='text-lg max-[550px]:text-sm flex mt-[1px] items-center transition-all duration-300'>
                                {`${Math.floor(robotData.OT / 60)}`}
                                <span className='text-lg max-[550px]:text-sm'>mins</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center'>
                          <div className='flex gap-4 max-[768px]:hidden'>
                            <div className='flex flex-col items-end'>
                              <div className='text-sm font-semibold'>Battery Voltage</div>
                              <div className='text-3xl transition-all duration-300'>
                                {(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'}
                              </div>
                            </div>
                            <div className='flex flex-col items-end'>
                              <div className='text-sm font-semibold'>Operated Time</div>
                              <div className='text-3xl'>
                                {`${Math.floor(robotData.OT / 60)}`}
                                <span className='text-[25px]'>mins</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            {(robotError[robotID]) ?
                              // <div onMouseEnter={() => { setDisplayError(prev => ({ ...prev, [robotID]: 1 })) }} onMouseLeave={() => { setDisplayError(prev => ({ ...prev, [robotID]: 0 })) }} className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] cursor-pointer px-4 py-1 ml-3 flex items-center gap-2 rounded-md text-2xl w-fit min-h-[60%]'>
                              <div onClick={() => { setDisplayError(prev => ({ ...prev, [robotID]: !prev[robotID] })) }} className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] cursor-pointer px-4 py-1 max-[550px]:px-2 max-[550px]:py-3 max-[550px]:gap-1 ml-3 flex items-center gap-2 rounded-md text-2xl w-fit min-h-[60%]'>
                                <span className='max-[550px]:text-sm'>Errors</span>
                                <span className={`invert size-6 max-[550px]:size-4 ${displayError[robotID] ? "rotate-[270deg]" : "rotate-90"} transition-all duration-300`}><img src={arrow}></img></span>
                              </div> :
                              <div></div>
                            }
                          </div>
                          {
                            (ONStatus[robotID] == 'connecting') ?
                              <>
                                <div className={`text-xl flex items-center ml-3`}>
                                  <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span className='max-[768px]:hidden'>Connecting...</span>
                                </div>
                              </> :
                              (ONStatus[robotID] === 'null') ?
                                <div className='flex gap-4 items-center'>
                                  <div onClick={() => handleONChange(robotID)} className={`cursor-pointer bg-[#ffffff] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] ml-3  px-4 py-1 rounded-md hover:bg-black hover:text-white hover:transition-all hover:duration-300 text-2xl max-[550px]:px-3 max-[550px]:text-[18px] max-[550px]:py-[7px]`}>ON</div>
                                </div> :

                                (ONStatus[robotID] === 'disable') ?
                                  <div className='flex gap-4 items-center'>
                                    <div className="cursor-not-allowed bg-[#ffffff] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] ml-3  px-4 py-1 rounded-md text-2xl max-[550px]:text-[18px] max-[550px]:py-[7px]">ON</div>
                                  </div> : <div></div>
                          }
                        </div>
                      </div>
                      <div className={`flex justify-around rounded-md gap-3 relative transition-all duration-300 ${!displayError[robotID] ? 'opacity-0 h-0' : 'opacity-1 mt-2 h-fit'}`}>
                        {/* <div className='absolute top-[-10px] rotate-45 right-10 size-5 bg-white z-0'></div> */}
                        <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 1 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Low Battery</div>
                        <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 2 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Brush OC</div>
                        <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 3 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Wheel OC</div>
                        <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 4 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Robot Stuck</div>
                      </div>
                    </div>
                  </div></> :
                ((robotError[robotID] == 0) && (networkError[robotID] == 0)) ?
                  <BlinkingText
                    key={robotID}
                    data={{ BV: robotData.BV, OT: robotData.OT }}
                    color={"green"}
                    childElement={
                      <div
                        key={robotID}
                        className={`cards  w-[100%] flex transition-colors duration-300 justify-between items-center rounded-lg px-4 py-3 max-[550px]:px-3 max-[550px]:py-1`}
                      >
                        <div className='text-xl max-[400px]:text-[17px]'>{`Robot ${parseInt(robotID.slice(1))}`}</div>
                        <div className='flex gap-4'>
                          <div className='flex flex-col items-end'>
                            <div className='text-sm font-semibold max-[495px]:text-[12px]'>Battery Voltage</div>
                            <div className='text-3xl transition-all duration-300 max-[495px]:text-[25px]'>
                              {(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'}
                            </div>
                          </div>
                          <div className='flex flex-col items-end'>
                            <div className='text-sm font-semibold max-[495px]:text-[12px]'>Operational Time</div>
                            <div className='text-3xl transition-all duration-300 max-[495px]:text-[25px]'>
                              {/* <BlinkingText text={`${robotData.OT}s`} /> */}
                              {`${Math.floor(robotData.OT / 60)}`}
                              <span className='text-[25px] max-[495px]:text-[20px]'>mins</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  /> :
                  (!networkError[robotID]) ?
                    <div className='w-full flex gap-3 transition-all duration-300'>
                      <BlinkingText
                        key={robotID}
                        data={{ BV: robotData.BV, OT: robotData.OT }}
                        color={"red"}
                        childElement={
                          <div>
                            <div
                              key={robotID}
                              className={`cards w-[100%] flex transition-all duration-300 justify-between items-center rounded-lg px-4 py-3 max-[550px]:px-3 max-[550px]:py-2`}
                            >
                              <div className='flex flex-col'>
                                <div className='text-xl max-[400px]:text-[17px]'>{`Robot ${parseInt(robotID.slice(1))}`}</div>
                                <div className='flex gap-1 min-[768px]:hidden'>
                                  <div className='flex items-center gap-2'>
                                    <img src={battery} className='size-5 max-[550px]:size-4' />
                                    <div className='text-lg max-[550px]:text-sm transition-all duration-300'>
                                      {(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'}
                                    </div>
                                  </div>
                                  <div className='font-medium'>|</div>
                                  <div className='flex items-center gap-2'>
                                    <img src={timer} className='size-6 max-[550px]:size-4' />
                                    <div className='text-lg max-[550px]:text-sm flex mt-[1px] items-center transition-all duration-300'>
                                      {`${Math.floor(robotData.OT / 60)}`}
                                      <span className='text-lg max-[550px]:text-sm'>mins</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <><div className='flex gap-4'>
                                <div className='flex flex-col items-end  max-[768px]:hidden'>
                                  <div className='text-sm font-semibold'>Battery Voltage</div>
                                  <div className='text-3xl transition-all duration-300'>
                                    {/* <BlinkingText text={(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'} /> */}
                                    {(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'}
                                  </div>
                                </div>
                                <div className='flex flex-col items-end max-[768px]:hidden'>
                                  <div className='text-sm font-semibold'>Operational Time</div>
                                  <div className='text-3xl'>
                                    {/* <BlinkingText text={`${robotData.OT}s`} /> */}
                                    {`${Math.floor(robotData.OT / 60)}`}
                                    <span className='text-[25px]'>mins</span>
                                  </div>
                                </div>
                                <div className='flex gap-4 items-center'>
                                  {/* <div onMouseEnter={() => { setDisplayError(prev => ({ ...prev, [robotID]: 1 })) }} onMouseLeave={() => { setDisplayError(prev => ({ ...prev, [robotID]: 0 })) }} className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] cursor-pointer px-4 py-1 ml-3 flex items-center gap-2 rounded-md text-2xl w-full min-h-[60%]'> */}
                                  <div onClick={() => { setDisplayError(prev => ({ ...prev, [robotID]: !prev[robotID] })) }} className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] cursor-pointer px-4 py-1 max-[550px]:px-3 max-[550px]:py-3 max-[550px]:gap-1 ml-3 flex items-center gap-2 rounded-md text-2xl w-fit min-h-[60%]'>
                                    <span className='max-[550px]:text-sm'>Errors</span>
                                    <span className={`invert size-6 max-[550px]:size-4 ${displayError[robotID] ? "rotate-[270deg]" : "rotate-90"} transition-all duration-300`}><img src={arrow}></img></span>
                                  </div>
                                </div>
                              </div>
                              </>
                            </div>
                            <div className={`flex justify-around rounded-md gap-3  relative transition-all duration-300 ${!displayError[robotID] ? 'opacity-0 px-2 h-0' : 'opacity-1 mb-2 h-fit px-2'}`}>
                              {/* <div className='absolute top-[-10px] rotate-45 right-10 size-5 bg-white z-0'></div> */}
                              <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 1 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Low Battery</div>
                              <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 2 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Brush OC</div>
                              <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 3 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Wheel OC</div>
                              <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 4 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Robot Stuck</div>
                            </div>
                          </div>

                        } />
                    </div> :
                    <BlinkingText
                      key={robotID}
                      data={{ BV: robotData.BV, OT: robotData.OT }}
                      color={"red"}
                      childElement={
                        <div
                          key={robotID}
                          className={`cards w-[100%] flex transition-colors duration-300 justify-between items-center rounded-lg px-4 py-3 max-[550px]:px-3 max-[550px]:py-2`}
                        >
                          <div className='flex flex-col'>
                            <div className='text-xl max-[400px]:text-[17px]'>{`Robot ${parseInt(robotID.slice(1))}`}</div>
                            <div className='flex gap-1 min-[768px]:hidden'>
                              <div className='flex items-center gap-2'>
                                <img src={battery} className='size-5 max-[550px]:size-4' />
                                <div className='text-lg max-[550px]:text-sm transition-all duration-300'>
                                  {(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'}
                                </div>
                              </div>
                              <div className='font-medium mb-[3px]'>|</div>
                              <div className='flex items-center gap-2'>
                                <img src={timer} className='size-6 max-[550px]:size-4' />
                                <div className='text-lg max-[550px]:text-sm flex mt-[1px] items-center transition-all duration-300'>
                                  {`${Math.floor(robotData.OT / 60)}`}
                                  <span className='text-lg max-[550px]:text-sm'>mins</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='flex items-center'>
                            <div className='flex gap-4 '>
                              <div className='flex flex-col items-end max-[768px]:hidden '>
                                <div className='text-sm font-semibold'>Battery Voltage</div>
                                <div className='text-3xl transition-all duration-300'>
                                  {/* <BlinkingText text={(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'} /> */}
                                  {(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'}
                                </div>
                              </div>
                              <div className='flex flex-col items-end max-[768px]:hidden'>
                                <div className='text-sm font-semibold'>Operational Time</div>
                                <div className='text-3xl'>
                                  {/* <BlinkingText text={`${robotData.OT}s`} /> */}
                                  {`${Math.floor(robotData.OT / 60)}`}
                                  <span className='text-[25px]'>mins</span>
                                </div>
                              </div>
                              <div className='flex gap-4 items-center'>
                                <div className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] text-center px-3 py-1 ml-3 rounded-md text-2xl min-h-[60%] max-[550px]:text-sm max-[550px]:py-3'>Network Error</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      } />
            ))}
            {/* <><div

              className={`cards bg-[#cfcfcf] w-[100%] flex transition-colors duration-300 justify-between items-center rounded-lg px-4 py-5 max-[550px]:px-3 max-[550px]:py-2`}
            >
              <div className='text-xl'>{`Robot`}</div>
              <div className='flex gap-4'>
                <div className='bg-[#ffffff] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] px-4 py-1 rounded-md cursor-pointer hover:bg-black hover:text-white hover:transition-all hover:duration-300 text-2xl'>ON</div>
              </div>
            </div></>
            <><div

              className={`cards bg-[#cfcfcf] w-[100%] flex transition-colors duration-300 justify-between items-center rounded-lg px-4 py-5 max-[550px]:px-3 max-[550px]:py-2`}
            >
              <div className='text-xl'>{`Robot`}</div>
              <div className='flex gap-4'>
                <div className='bg-[#ffffff] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] px-4 py-1 rounded-md cursor-pointer hover:bg-black hover:text-white hover:transition-all hover:duration-300 text-2xl'>ON</div>
              </div>
            </div></>
            <><div

              className={`cards bg-[#cfcfcf] w-[100%] flex transition-colors duration-300 justify-between items-center rounded-lg px-4 py-5 max-[550px]:px-3 max-[550px]:py-2`}
            >
              <div className='text-xl'>{`Robot`}</div>
              <div className='flex gap-4'>
                <div className='bg-[#ffffff] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] px-4 py-1 rounded-md cursor-pointer hover:bg-black hover:text-white hover:transition-all hover:duration-300 text-2xl'>ON</div>
              </div>
            </div></>
            <><div

              className={`cards bg-[#cfcfcf] w-[100%] flex transition-colors duration-300 justify-between items-center rounded-lg px-4 py-5 max-[550px]:px-3 max-[550px]:py-2`}
            >
              <div className='text-xl'>{`Robot`}</div>
              <div className='flex gap-4'>
                <div className='bg-[#ffffff] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] px-4 py-1 rounded-md cursor-pointer hover:bg-black hover:text-white hover:transition-all hover:duration-300 text-2xl'>ON</div>
              </div>
            </div></>
            <><div

              className={`cards bg-[#cfcfcf] w-[100%] flex transition-colors duration-300 justify-between items-center rounded-lg px-4 py-5 max-[550px]:px-3 max-[550px]:py-2`}
            >
              <div className='text-xl'>{`Robot`}</div>
              <div className='flex gap-4'>
                <div className='bg-[#ffffff] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] px-4 py-1 rounded-md cursor-pointer hover:bg-black hover:text-white hover:transition-all hover:duration-300 text-2xl'>ON</div>
              </div>
            </div></>
            <><div

              className={`cards bg-[#cfcfcf] w-[100%] flex transition-colors duration-300 justify-between items-center rounded-lg px-4 py-5 max-[550px]:px-3 max-[550px]:py-2`}
            >
              <div className='text-xl'>{`Robot`}</div>
              <div className='flex gap-4'>
                <div className='bg-[#ffffff] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] px-4 py-1 rounded-md cursor-pointer hover:bg-black hover:text-white hover:transition-all hover:duration-300 text-2xl'>ON</div>
              </div>
            </div></>
            <><div

              className={`cards bg-[#cfcfcf] w-[100%] flex transition-colors duration-300 justify-between items-center rounded-lg px-4 py-5 max-[550px]:px-3 max-[550px]:py-2`}
            >
              <div className='text-xl'>{`Robot`}</div>
              <div className='flex gap-4'>
                <div className='bg-[#ffffff] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] px-4 py-1 rounded-md cursor-pointer hover:bg-black hover:text-white hover:transition-all hover:duration-300 text-2xl'>ON</div>
              </div>
            </div></>
            <><div

              className={`cards bg-[#cfcfcf] w-[100%] flex transition-colors duration-300 justify-between items-center rounded-lg px-4 py-5 max-[550px]:px-3 max-[550px]:py-2`}
            >
              <div className='text-xl'>{`Robot`}</div>
              <div className='flex gap-4'>
                <div className='bg-[#ffffff] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] px-4 py-1 rounded-md cursor-pointer hover:bg-black hover:text-white hover:transition-all hover:duration-300 text-2xl'>ON</div>
              </div>
            </div></>
            <><div

              className={`cards bg-[#cfcfcf] w-[100%] flex transition-colors duration-300 justify-between items-center rounded-lg px-4 py-5 max-[550px]:px-3 max-[550px]:py-2`}
            >
              <div className='text-xl'>{`Robot`}</div>
              <div className='flex gap-4'>
                <div className='bg-[#ffffff] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] px-4 py-1 rounded-md cursor-pointer hover:bg-black hover:text-white hover:transition-all hover:duration-300 text-2xl'>ON</div>
              </div>
            </div></>
            <><div

              className={`cards bg-[#cfcfcf] w-[100%] flex transition-colors duration-300 justify-between items-center rounded-lg px-4 py-5 max-[550px]:px-3 max-[550px]:py-2`}
            >
              <div className='text-xl'>{`Robot`}</div>
              <div className='flex gap-4'>
                <div className='bg-[#ffffff] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] px-4 py-1 rounded-md cursor-pointer hover:bg-black hover:text-white hover:transition-all hover:duration-300 text-2xl'>ON</div>
              </div>
            </div></>
            <><div

              className={`cards bg-[#cfcfcf] w-[100%] flex transition-colors duration-300 justify-between items-center rounded-lg px-4 py-5 max-[550px]:px-3 max-[550px]:py-2`}
            >
              <div className='text-xl'>{`Robot`}</div>
              <div className='flex gap-4'>
                <div className='bg-[#ffffff] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] px-4 py-1 rounded-md cursor-pointer hover:bg-black hover:text-white hover:transition-all hover:duration-300 text-2xl'>ON</div>
              </div>
            </div></> */}
          </div>
        </div>

        {
          rightVisibility ? (
            <div className='fixed top-0 left-0 z-20 bg-[#000000c1] w-[100vw] h-[100vh] flex items-center justify-center min-[1151px]:hidden'>
              <div className='relative w-fit h-fit'>
                <div className='bg-[#cfcfcf] rounded-xl'>
                  {/* <div onClick={handleRightVisibility} className=' cursor-pointer bg-white rounded-full absolute top-0 right-0 w-fit m-1 p-1'>
                    <img src={close} className='size-7' />
                  </div> */}
                  <div ref={calenderRef} className="flex flex-col justify-center items-center">
                    <Calender onDateChange={handleDateChange} />
                    <div className='flex justify-between items-center w-full px-4 gap-3 mt-4 max-14inch:flex-col'>
                      <Timer cd={CD} onTimeChange={handleTimeChange} />
                      <div onClick={handleSendTime} className='bg-[#fea920] hover:bg-[#fed220] py-3 px-5 transition-all duration-100 w-fit text-center rounded-xl text-lg cursor-pointer min-[2618px]:py-[27px] min-[2408px]:px-5 max-14inch:text-2xl max-14inch:w-full max-[768px]:hidden'>
                        Schedule Robots
                      </div>
                    </div>
                    <div className='w-full px-4 gap-3 flex items-center min-[768px]:hidden mx-auto my-3 h-[60px]'>
                      <div onClick={handleSendTime} className='bg-[#fea920] w-full justify-center px-2 flex items-center max-[768px]:text-sm h-full min-[768px]:hidden hover:bg-[#fed220] transition-all duration-300  text-center rounded-xl text-2xl cursor-pointer max-14inch:py-3'>
                        Schedule Robots
                      </div>
                      <div onClick={handleStopRobots} className='bg-[#fea920] w-full justify-center px-2 flex items-center max-[768px]:text-sm h-full hover:bg-[#fed220]  transition-all duration-300  text-center rounded-xl text-2xl cursor-pointer max-14inch:py-3'>
                        Stop all Robots
                      </div>
                    </div>
                    <div onClick={handleStopRobots} className='bg-[#fea920] max-[768px]:hidden hover:bg-[#fed220] py-[27px] my-4 transition-all duration-300 w-[90%] text-center rounded-xl text-2xl cursor-pointer max-14inch:py-3'>
                      Stop all Robots
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
            </div>
          )
        }
        <div className={`right sticky top-[152px] h-fit max-w-[900px] bg-[#cfcfcf]  flex flex-col mb-7 pb-4 items-center rounded-xl max-[1150px]:hidden transition-all duration-300`}>
          <Calender onDateChange={handleDateChange} />
          <div className='w-[100%] px-6'>
            <div className='flex justify-between items-end gap-2'>
              {/* <div className='text-xl mb-1 ml-1'>Set Time:</div> */}
              {/* <div className='my-3 w-fit px-2 py-2 rounded-lg cursor-pointer bg-[#fea920] hover:bg-[#fed220] transition-all duration-100'>Stop Schedule Daily</div> */}
              {/* <div className='flex items-center justify-between'>
                <div className='my-3 flex items-center gap-2 w-fit bg-white px-2 py-1 rounded-lg'>
                  {( checkedScheduleDaily == null) ?
                    <svg className="animate-spin ml-[2px] mb-[1px] h-3 w-3 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg> :
                    <label>
                      <input onChange={handleCheckbox} type="checkbox" defaultChecked={checkedScheduleDaily} className="accent-[#fea920] size-4 cursor-pointer mt-[5px]" />
                    </label>
                  }
                  <div className='font-semibold text-sm'>Schedule Daily</div>
                </div>
              </div> */}
            </div>
          </div>
          <div className='flex justify-between items-center w-full px-6 gap-3 mt-4 max-14inch:flex-col'>
            <Timer cd={CD} onTimeChange={handleTimeChange} />
            <div onClick={handleSendTime} className='bg-[#fea920] hover:bg-[#fed220] py-3 px-5 transition-all duration-100 w-fit text-center rounded-xl text-lg cursor-pointer min-[2660px]:py-[27px] min-[2408px]:px-5 max-14inch:text-2xl max-14inch:w-full'>
              Schedule Robots
            </div>
          </div>
          <div onClick={handleStopRobots} className='bg-[#fea920] hover:bg-[#fed220] py-[27px] mt-4 mx-3 transition-all duration-300 w-[90%] text-center rounded-xl text-2xl cursor-pointer max-14inch:py-3'>
            Stop all Robots
          </div>
        </div>
      </div>
    </div>
  );
}

// export default withRouter(UserDashboard);
export default UserDashboard;